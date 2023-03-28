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

export const checkUserExistsByEmail = async (email) => {
  const usersRef = collection(db, "users");
  usersRef
    .where("email", "==", email)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        return false;
      } else {
        return true;
      }
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

export const subscribeToTests = (courseId, onUpdate) => {
  //requieres the courseId to get the tests from the right course
  const testsRef = collection(db, `courses/${courseId}/tests`);
  const unsubscribe = onSnapshot(testsRef, (querySnapshot) => {
    const testsData = querySnapshot.docs.map((test) => ({
      testId: test.id,
      ...test.data(),
    }));
    onUpdate(testsData);
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

//Teacher assigns a student to a course with this function. The student must already exist in Users collection
export const createStudent = async (courseId, studentEmail) => {
  //student is created by email in a course

  //check if student exists in Users collection by email
  if (checkUserExistsByEmail(studentEmail) === false) {
    console.log(
      "Student doesn't exist. Student must exist as a user before enrolling him to a course"
    );
    return;
  } 
  if (checkUserExistsByEmail(studentEmail) === true ) {
    const studentsRef = collection(db, `courses/${courseId}/students`);

    try {
      await addDoc(studentsRef, { email: studentEmail });
    } catch (error) {
      console.log("Error creating student", error.message);
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
