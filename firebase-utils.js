import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    setDoc,
    collection,
    writeBatch,
    query,
  } from 'firebase/firestore'; //Firestore CRUD and such
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth'; //Authentication

  export const db = getFirestore(); //get the database  from the config file