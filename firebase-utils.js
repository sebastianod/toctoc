import { initializeApp } from "firebase/app";
import {
    getFirestore,
  } from 'firebase/firestore'; //Firestore CRUD and such
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopoup,
    signInWithEmailAndPassword,
  } from 'firebase/auth'; //Authentication
import { firebaseConfig } from './firebase-config'; //Our firebase api config

//initialize app
const app = initializeApp(firebaseConfig);

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

//popup sign in
export const signInWithGooglePopup = () => {
  signInWithPopoup(auth, googleProvider);
}

//email and password sign in
export const signInAuthEmailPassword = async (email, password) => {
  //if either email or password is not set, do nothing
  if (!email || !password) return;
  //If both email and password are set, sign user in
  return await signInWithEmailAndPassword(auth, email, password);
}

