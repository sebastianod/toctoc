import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc, //gets doc reference
  getDocs,
  collection,
  getFirestore,
  setDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore"; //Firestore CRUD and such
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"; //Authentication
import { getFunctions, httpsCallable } from "firebase/functions"; // Import getFunctions and httpsCallable from the Firebase Functions SDK
import firebaseConfig from "./firebase-config"; //Our firebase api config

//initialize app
initializeApp(firebaseConfig);

//-------------Authentication-------------//

//initialize the google provider
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

//Get the active user's authentication
export const auth = getAuth();

//get the database
export const db = getFirestore();

//------------Sign in methods--------------//
//These methods only authenticate, they don't add a user to
//the firestore database. For that, use firebase/firestore methods

//popup sign in
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, googleProvider); //able to return results
  //returns a userCredentials object containing the authenticated user's data,
  // including a User object representing the user and a Credential object
  // containing the authentication tokens.
};

//email and password sign in
export const signInAuthEmailPassword = async (email, password) => {
  //if either email or password is not set, do nothing
  if (!email || !password) return;
  //If both email and password are set, sign user in
  return await signInWithEmailAndPassword(auth, email, password);
};

//--------------Sign up methods-------------//
//middle man function to shield our app from firebase changes
export const createAuthUserEmailPassword = async (email, password) => {
  if (!email || !password) return;

  //Creates a new user account associated with the specified email
  //address and password.
  return await createUserWithEmailAndPassword(auth, email, password);
  //the method returns a UserCredential object that contains the new user's
  //account information, such as their uid, email, and emailVerified status.
};

//-----------------Sign out----------------//
export const signOutUser = async () => await signOut(auth);

//--------- User creation in Firestore DB from Auth ---------- //

export const createUserDocumentFromAuth = async (
  userAuth, //auth instance provided by google sign in
  additionalUserInfo = {} //Display name, etc.
) => {
  if (!userAuth) return; //return nothing if there's no auth

  //doc() gets or creates the user document reference.
  //userAuth.uid gets the authenticated user unique id and
  //sets this uid as the document id of said user doc
  const userDocRef = doc(db, "users", userAuth.uid);

  //get a "picture" of the user at this moment
  const userSnapshot = await getDoc(userDocRef);

  //the user may or may not exist.
  if (!userSnapshot.exists()) {
    //if user doesn't exist create it
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalUserInfo,
      });
    } catch (error) {
      console.log("Error creating the user", error.message);
    }
  }
  //if user exists, just return the user's document reference
  return userDocRef;
};

export const checkUserExists = async (userAuth) => {
  const userDocRef = doc(db, "users", userAuth.uid);

  //get a "picture" of the user at this moment
  const userSnapshot = await getDoc(userDocRef);

  //the user may or may not exist. If it doesn't exist, create it
  return userSnapshot.exists(); //exists: true or false
};

//----------------User Observer---------------------//
//Allows us to fire a callback function anytime we see the user object changes
//Sign ins and sign outs are observed and kept track of in a single place.
//Instead of having to use useContext everywhere in our app, set the observer
//in userContext itself, and it will be kept track of only there.

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback); //to be used in UserContexts
};

//=============== Get and Create data ==============//

//---------------Getting data Once-----------------//

export const getCourses = async () => {
  const coursesRef = collection(db, "courses"); //reference for courses collection
  const querySnapshot = await getDocs(coursesRef); //Returns a promise that resolves to querysnapshot object
  return querySnapshot.docs.map((course) => ({
    courseId: course.id, //return the courseId to set the url later
    ...course.data(), //name etc...
  }));
};

export const getTests = async (courseId) => {
  //get the reference for the tests subcollection
  const testsRef = collection(db, `courses/${courseId}/tests`);
  //get a snapshot of all docs in the tests collection
  const testsSnapshot = await getDocs(testsRef); // QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query. A DocumentSnapshot contains data read from a document in your Firestore database.
  return testsSnapshot.docs.map((test) => ({
    testId: test.id, //return the testId to set url for <testDetails />
    ...test.data(), //the data inside the test, name etc.
  })); // The documents can be accessed as an array via the docs property or enumerated using the forEach method.
};

export const getQuestions = async (courseId, testId) => {
  //get the reference for the questions subcollection
  const questionsRef = collection(
    db,
    `courses/${courseId}/tests/${testId}/questions`
  );
  //get a snapshot of all docs in the questions collection
  const questionsSnapshot = await getDocs(questionsRef);
  return questionsSnapshot.docs.map((questionsDoc) => {
    return {
      questionsId: questionsDoc.id, //return the questionId
      ...questionsDoc.data(), //the data inside the question, should be an array of questions
    };
  });
};

//-------Data listeners (realtime updates)-------//

export const subscribeToCourses = (setterFunction) => {
  //setterFunction is setCourses in <Courses />, for example
  const coursesRef = collection(db, "courses"); //collection to be listened to
  const unsubscribe = onSnapshot(coursesRef, (querySnapshot) => {
    const coursesData = querySnapshot.docs.map((course) => ({
      courseId: course.id,
      ...course.data(),
    }));
    setterFunction(coursesData); //sets the courses state in <Courses />
  });
  return unsubscribe;
};

export const subscribeToTests = (courseId, setterFunction) => {
  //requieres the courseId to get the tests from the right course
  const testsRef = collection(db, `courses/${courseId}/tests`);
  const unsubscribe = onSnapshot(testsRef, (querySnapshot) => {
    const testsData = querySnapshot.docs.map((test) => ({
      testId: test.id,
      ...test.data(),
    }));
    setterFunction(testsData);
  });
  return unsubscribe;
};

export const subscribeToStudents = (courseId, setterFunction) => {
  //requieres the courseId to get the students from the right course
  const studentsRef = collection(db, `courses/${courseId}/students`);
  const unsubscribe = onSnapshot(studentsRef, (querySnapshot) => {
    const studentsData = querySnapshot.docs.map((student) => ({
      studentId: student.id,
      ...student.data(),
    }));
    setterFunction(studentsData);
  });
  return unsubscribe;
};

export const subscribeStudentToEnrollments = (studentId, setterFunction) => {
  // studentId is the enrollment docs's id
  const enrollmentsRef = doc(db, `enrollments/${studentId}`);

  const unsubscribe = onSnapshot(enrollmentsRef, (docSnapshot) => {
    // the structure of the enrollment doc is courses(array) which is an array of maps with strings, courseId and name.
    const enrollmentsData = docSnapshot.data();
    //destructuring the courses array from the enrollment doc
    const { courses } = enrollmentsData;
    //mapping the courses array to get the courseId and name
    const coursesList = courses.map((course) => ({
      courseId: course.courseId,
      name: course.name,
    }));
    setterFunction(coursesList);
  });
  return unsubscribe;
};

//================================================//

//=================Creating data=================//

export const createCourse = async (courseName) => {
  const coursesRef = collection(db, "courses"); //reference for courses collection

  try {
    await addDoc(coursesRef, { name: courseName.toLowerCase() }); //addDoc method sets doc id automatically
  } catch (error) {
    console.log("Error creating course", error.message);
  }
};

export const createTest = async (courseId, testName) => {
  //needs courseId to create the test in the right course
  const testsRef = collection(db, `courses/${courseId}/tests`);

  try {
    await addDoc(testsRef, { name: testName.toLowerCase() });
  } catch (error) {
    console.log("Error creating test", error.message);
  }
};

//Teacher assigns a student to a course with this function. The student must already exist in Users collection.
//The studentId is the same as the one in the users collection.
//therefore we use setDoc instead of addDoc, because it allows us to set the docId, while addDoc sets it automatically.
export const createStudentUnderCourse = async (courseId, studentEmail) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", studentEmail));
  const studentSnapshot = await getDocs(q);

  if (!studentSnapshot.empty) {
    //If the student exists in users collection, create the student under the course

    try {
      const studentData = studentSnapshot.docs.map((student) => ({
        //get the student data from the users collection
        studentId: student.id,
        ...student.data(),
      }));

      const { studentId, displayName, email } = studentData[0];
      const studentRef = doc(db, `courses/${courseId}/students`, studentId); //duplicated studentId, it's the same as in the users collection

      const enrolledAt = new Date();

      await setDoc(studentRef, {
        //setDoc only creates the doc if it doesn't exist, otherwise it updates it
        displayName,
        email,
        enrolledAt,
      });
    } catch (error) {
      console.log("Error creating student", error.message);
    }
  } else {
    //if student is not signed up already
    return alert("Student must be signed up before enrollment");
  }
};

// calling a cloud function that creates many users at once
// Get the Functions instance
export const functions = getFunctions();
export const addUsersFunction = httpsCallable(functions, "addUsers");

//Test questions
export const createOrUpdateTestQuestions = async (
  courseId,
  testId,
  questionsList
) => {
  const questionsRef = collection(
    db,
    `courses/${courseId}/tests/${testId}/questions`
  ); //reference for the questions collection

  //check if a document already exists within the questions collection. The idea is to only have one document inside the questions collection, which is an array of questions.
  const q = query(questionsRef);
  const questionsSnapshot = await getDocs(q);

  if (!questionsSnapshot.empty) {
    // if the questions collection has a document already, update it instead of creating a new one
    const questionsDoc = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));

    const questionsDocId = questionsDoc[0].id;
    const questionsDocRef = doc(
      db,
      `courses/${courseId}/tests/${testId}/questions`,
      questionsDocId
    ); //reference for the questions document

    try {
      //update the questions document with the current array of questions
      await updateDoc(questionsDocRef, { questionsList });
    } catch (error) {
      console.log("Error updating questions", error.message);
    }
  } else {
    //if the questions collection doesn't have a document, create one
    try {
      await addDoc(questionsRef, { questionsList }); //addDoc method sets doc id automatically
    } catch (error) {
      console.log("Error creating questions", error.message);
    }
  }
};
//=================Updating data=================//

export const updateCourse = async (courseId, courseName) => {
  const courseRef = doc(db, "courses", courseId); //reference for the course to be updated

  try {
    await updateDoc(courseRef, { name: courseName.toLowerCase() });
  } catch (error) {
    console.log("Error updating course", error.message);
  }
};

export const updateTest = async (courseId, testId, testName) => {
  const testRef = doc(db, `courses/${courseId}/tests`, testId); //reference for the test to be updated

  try {
    await updateDoc(testRef, { name: testName.toLowerCase() });
  } catch (error) {
    console.log("Error updating test", error.message);
  }
};

export const updateTestAvailability = async (courseId, testId, isAvailable) => {
  const testRef = doc(db, `courses/${courseId}/tests`, testId);

  try {
    await updateDoc(testRef, { isAvailable: isAvailable }); // if the field isAvailable doesn't exist, it will be created
  } catch (error) {
    console.log("Error updating test availability", error.message);
  }
}
//=================Deleting data=================//

export const deleteCourse = async (courseId) => {
  const courseRef = doc(db, "courses", courseId); //reference for the course to be deleted

  try {
    await deleteDoc(courseRef);
  } catch (error) {
    console.log("Error deleting course", error.message);
  }
};

export const deleteTest = async (courseId, testId) => {
  const testRef = doc(db, `courses/${courseId}/tests`, testId); //reference for the test to be deleted

  try {
    await deleteDoc(testRef);
  } catch (error) {
    console.log("Error deleting test", error.message);
  }
};

export const deleteStudent = async (courseId, studentId) => {
  const studentRef = doc(db, `courses/${courseId}/students`, studentId);
  try {
    await deleteDoc(studentRef);
  } catch (error) {
    console.log("Error deleting student", error.message);
  }
};
