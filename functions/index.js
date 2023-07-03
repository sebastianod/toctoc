/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

//===============Whisper related functions==================//
// import busboy to handle multipart/form-data
const Busboy = require("busboy");

// for api calls
const express = require("express");
const cors = require("cors"); // to allow cross origin requests
const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// import axios to make HTTP requests
const axios = require("axios");

// import FormData to create multipart/form-data request body
const FormData = require("form-data");
const { FieldValue } = require("firebase-admin/firestore");

app.post("/", async (req, res) => {
  const busboy = Busboy({ headers: req.headers }); // create a new busboy instance with the request headers
  let fileData; // to store the file data
  let fileStatus; // to store the file upload status
  let fileInfo; // to store the file information

  busboy.on("file", (fieldname, file, info) => {
    // listen for the file event, that is triggered when a file is uploaded
    const { filename: fileName, encoding, mimeType } = info;

    // get the file data as a buffer
    file.on("data", (data) => {
      // read a file, multiple files can be read
      fileData = data;
    });

    // check the file upload status
    file.on("end", () => {
      // finished reading a file
      if (fileData) {
        fileStatus = "success";
      } else {
        fileStatus = "failure";
      }
      fileInfo = { fileName, encoding, mimeType };
    });
  });

  // import axios-retry to add retry functionality to axios
  const axiosRetry = require("axios-retry");

  // create an axios instance with retry options
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance, {
    // number of retries
    retries: 3,
    // retry condition based on error code
    retryCondition: (error) => {
      // check if the error is retryable
      if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
        // get the status code from the error config
        const { status } = error.config;
        // retry only if the status code is 429
        return status === 429;
      }
      // otherwise, do not retry
      return false;
    },
    // retry delay based on retry count
    retryDelay: (retryCount) => {
      return retryCount * 1000; // wait for 1s, 2s, 3s before retries
    },
  });

  busboy.on("finish", async () => {
    //  finished parsing the entire request, not just one file
    // send the file to the openai API
    try {
      // create a FormData object with the file data and the model name
      const formData = new FormData();
      formData.append("file", fileData, "file.mpeg");
      formData.append("model", "whisper-1");
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

      // get the API URL and options
      const apiURL = "https://api.openai.com/v1/audio/transcriptions";

      // send the POST request with axios instance
      const apiResponse = await axiosInstance.post(apiURL, formData, {
        headers: {
          authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      });
      // handle the API response
      console.log(apiResponse.data);
      // send a JSON response to the client with the transcription result
      res.json(apiResponse.data);
    } catch (error) {
      // handle the API error
      console.error(error);
      // check if there is a response object in the error
      if (error.response) {
        // get the status code and data from the error response
        const { status, data } = error.response;
        // send a JSON response with the status code and data
        res.status(status).json(data);
      } else {
        // send a JSON response with a generic error message
        res.status(500).json({ error: "Something went wrong" });
      }
    }

    // send a JSON response to the client with the status and the file information
    res.json({ status: fileStatus, file: fileInfo });
  });

  busboy.end(req.rawBody);
});

exports.whisper = functions.https.onRequest(app);
//=================================================//

// get user and add custom claim (teacher)
// addTeacherRole will be accessible from client. onCall does that.
// onCall( <callback> ), callback will fire when addTeacherRole is called
// <callback> has two inputs, data and context. Data is what will get passed
// to the function addTeacherRole. Context has context regarding the user
exports.addTeacherRole = functions.https.onCall((data, context) => {
  // context has info on the user that is triggering the function
  // Check if user is a teacher, only they can set other teachers
  if (context.auth.token.teacher !== true) {
    return "Error: Only teachers can create teacher roles!";
  }

  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        teacher: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made a teacher`,
      };
    })
    .catch((err) => {
      return err;
    });
});

// give custom claim of teacher to sebastianochoad@gmail.com
const userEmail = "sebastianochoad@gmail.com";
admin
  .auth()
  .getUserByEmail(userEmail)
  .then((user) => {
    //when promise is resolved you get the user

    const teacherClaim = {
      teacher: true,
    };

    admin
      .auth()
      .setCustomUserClaims(user.uid, teacherClaim)
      .then(() => {
        //response to user in front end
        console.log("Custom claim added to user");
      })
      .catch((error) => {
        console.log("Error adding custom claim:", error);
      });
  })
  .catch((error) => {
    console.log("Error fetching user data:", error);
  });

// write users to firestore if user is a teacher.
// First authenticate to get uid, then create a user document in users collection in firestore
// Check if user is already authenticated before authenticating.
// Check if user is already created in users collection before creating. If already created, update.
exports.addUsers = functions.https.onCall(async (data, context) => {
  if (context.auth.token.teacher === true) {
    try {
      const users = data; // The array of user objects

      // Authenticate each user and get their UID, or get UID if user already exists
      const authPromises = users.map(async (user) => {
        const { email, password, name } = user;
        let uid = null;
        try {
          const userRecord = await admin.auth().getUserByEmail(email); // check if user already exists
          uid = userRecord.uid;
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            // if user doesn't exist, create user authentication
            const newUserRecord = await admin.auth().createUser({
              email,
              password,
              displayName: name,
            });
            uid = newUserRecord.uid;
          } else {
            throw error;
          }
        }
        return { uid, email, name }; // return user info whether user existed or was created
      });

      // Wait for all the authentication promises to resolve
      const authResults = await Promise.all(authPromises);

      // Create a Firestore document for each user
      const firestorePromises = authResults.map(async (authResult) => {
        const { uid, email, name } = authResult;
        const userDocRef = admin.firestore().collection("users").doc(uid);

        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          // User already exists, update their details
          await userDocRef.update({ email, name });
        } else {
          // User doesn't exist, create a new document
          const createdAt = new Date();
          await userDocRef.set({ email, displayName: name, createdAt });
        }
      });

      // Wait for all the Firestore promises to resolve
      await Promise.all(firestorePromises);

      return { success: true };
    } catch (error) {
      console.error("Error creating users:", error);
      throw new functions.https.HttpsError("internal", "Error creating users");
    }
  } else {
    return "Error: Only teachers can add users!";
  }
});

exports.updateCurrentQuestion = functions.https.onCall(
  async (data, context) => {
    //Check user's authentication
    if (!context.auth) {
      return "Error: You must be authenticated.";
    }
    //User is authenticated
    const { courseId, studentId, testId, transcript } = data; //path to answersDoc

    // with the path data above update currentQuestion field from the answers doc
    // path to answers collection:
    // courses/${courseId}/students/${studentId}/tests/${testId}/answers

    try {
      const answersRef = admin //answers collection ref
        .firestore()
        .collection(
          `courses/${courseId}/students/${studentId}/tests/${testId}/answers`
        );
      //answers collection only has one document
      const answersSnapshot = await answersRef.get();
      const answersDocId = answersSnapshot.docs[0].id;
      const answersArray = answersSnapshot.docs[0].data().answersList; //array
      answersArray.push(transcript);
      //add 1 to currentQuestion field
      try {
        await answersRef
          .doc(answersDocId)
          .update({ currentQuestion: FieldValue.increment(1) });
        await answersRef
          .doc(answersDocId)
          .set({ answersList: answersArray }, { merge: true });
        return { status: 200, data: "Success" };
      } catch (error) {
        return { status: 500, data: error };
      }
    } catch (error) {
      return error;
    }
    //return { dbCourseId: courseId, dbStudentId: studentId, dbTestId: testId };
  }
);

//===============Trigger functions==================//

// trigger function when a student is created under a course
// create a new document in a middle man collection called enrollments
// enrollments will have a document for each student that has been enrolled in a course
// each document's id is the student's uid. The document will have a field called courses. It's an array of course ids.
// when a student is enrolled in a course, add the course id to the courses array

exports.logEnrollment = functions.firestore
  .document("/courses/{courseId}/students/{studentId}")
  .onCreate(async (snapshot, context) => {
    const courseId = context.params.courseId;
    const studentId = context.params.studentId;

    //enrollment document reference
    const enrollmentsRef = admin
      .firestore()
      .collection("enrollments")
      .doc(studentId);

    // check if the enrollment document already exists
    const enrollmentsDoc = await enrollmentsRef.get();
    if (enrollmentsDoc.exists) {
      // the enrollment document already exists, update the courses array
      try {
        //query a course document to get the course name
        const courseDoc = await admin
          .firestore()
          .collection("courses")
          .doc(courseId)
          .get();
        const courseName = courseDoc.data().name;

        const enrollmentData = {
          courseId: courseId,
          name: courseName,
        };

        await enrollmentsRef.update({
          courses: admin.firestore.FieldValue.arrayUnion(enrollmentData),
        });
      } catch (error) {
        console.log("Error updating enrollment document:", error);
      }
    } else {
      // the enrollment document doesn't exist, create a new one
      try {
        //query a course document to get the course name
        const courseDoc = await admin
          .firestore()
          .collection("courses")
          .doc(courseId)
          .get();
        const courseName = courseDoc.data().name;

        const enrollmentData = {
          courseId: courseId,
          name: courseName,
        };

        await enrollmentsRef.set(
          { courses: [enrollmentData] } // add first course id to courses array
        );
      } catch (error) {
        console.log("Error creating enrollment document:", error);
      }
    }
    return null;
  });

// trigger function when a student is deleted from a course
// delete the course id from the courses array in the enrollment document
exports.logUnenrollment = functions.firestore
  .document("/courses/{courseId}/students/{studentId}")
  .onDelete(async (snapshot, context) => {
    const courseId = context.params.courseId;
    const studentId = context.params.studentId;

    //enrollment document reference
    const enrollmentsRef = admin
      .firestore()
      .collection("enrollments")
      .doc(studentId);

    //delete course from courses array. The data structure is an array of maps. Each map has a courseId and a name.
    try {
      //get the enrollment document data
      const enrollmentData = (await enrollmentsRef.get()).data();

      //find the index of the course with the given courseId
      const courseIndex = enrollmentData.courses.findIndex(
        (course) => course.courseId === courseId
      );

      //remove the course at the specified index
      enrollmentData.courses.splice(courseIndex, 1);

      //update the enrollment document with the modified courses array
      await enrollmentsRef.set(
        { courses: enrollmentData.courses },
        { merge: true }
      );
    } catch (error) {
      console.log("Error deleting enrollment document:", error);
    }

    return null;
  });

const dljs = require("damerau-levenshtein-js");

exports.gradeTest = functions.firestore
  .document(
    `courses/{courseId}/students/{studentId}/tests/{testId}/answers/{answersId}`
  )
  .onUpdate(async (snapshot, context) => {
    const courseId = context.params.courseId;
    const studentId = context.params.studentId;
    const testId = context.params.testId;
    const answersId = context.params.answersId;

    // References-----------------------------------------

    // teacher questions collection ref: in order to get the doc
    const questionsCollectionRef = admin
      .firestore()
      .collection(`courses/${courseId}/tests/${testId}/questions`);

    // student answers doc ref
    const answersDocRef = admin
      .firestore()
      .doc(
        `courses/${courseId}/students/${studentId}/tests/${testId}/answers/${answersId}`
      );

    try {
      //list from teacher questions
      const questionsCollectionSnapshot = await questionsCollectionRef.get();
      const questionsArray =
        questionsCollectionSnapshot.docs[0].data().questionsList;

      //list from student answers
      const answersSnapshot = await answersDocRef.get();
      const answersArray = await answersSnapshot.data().answersList;

      const currentQuestionInAnswers = await answersSnapshot.data()
        .currentQuestion;
      const currentQuestionIndex = currentQuestionInAnswers - 1;

      // grade currentQuestion-------------------------------------------------------

      //sanitization
      const rawQuestion = questionsArray[currentQuestionIndex];
      const rawAnswer = answersArray[currentQuestionIndex];
      const punctuationlessQuestion = rawQuestion.replace(
        /[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,
        ""
      );
      const punctuationlessAnswer = rawAnswer.replace(
        /[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,
        ""
      );

      const question = punctuationlessQuestion
        .replace(/\s{2,}/g, " ")
        .toLowerCase();
      const answer = punctuationlessAnswer
        .replace(/\s{2,}/g, " ")
        .toLowerCase();

      const distance = dljs.distance(question, answer); // damerau-levenshtein distance

      const gradeSentence = () => {
        if (distance > question.length) {
          return 0;
        }
        if (distance <= question.length) {
          let errorsToQuestion = question.length - distance;
          return errorsToQuestion / question.length;
        }
      };

      const sentenceGrade = gradeSentence().toFixed(2)*100; // 2 decimals in %
      const gradesIndex = [];
      gradesIndex.push(sentenceGrade);

      //try to create gradesIndex field in student's answersDoc
      try {
        await answersDocRef.set({ gradesIndex: gradesIndex }, { merge: true });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  });
