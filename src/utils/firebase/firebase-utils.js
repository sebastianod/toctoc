import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc, //gets doc reference
  getDocs,
  collection,
  getFirestore,
  setDoc,
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
const app = initializeApp(firebaseConfig);

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

//---------------- Get and Create data -------------//

//  Helper: Reads an array of IDs from a collection concurrently
const readIds = async (collection, ids) => {
  //say from the tags collection, read their ids.
  const reads = ids.map((id) => collection.doc(id).get());
  const result = await Promise.all(reads);
  return result.map((v) => v.data()); //gets the actual data from each doc
};

export const getCourses = async () => {
  const coursesRef = collection(db, "courses"); //reference for courses collection
  const querySnapshot = await getDocs(coursesRef); //Returns a promise that resolves to querysnapshot object
  return querySnapshot.docs.map((course) => course.data()); //returns a courses array
};
