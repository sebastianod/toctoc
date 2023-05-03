const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.whisper = require("./whisper"); // group functions related to whisper Api in whisper.js

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
