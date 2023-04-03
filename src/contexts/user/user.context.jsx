import { createContext, useEffect, useState } from "react";
//user is set by sign in or sign up. Used dashboards.
import {
  onAuthStateChangedListener,
} from "../../utils/firebase/firebase-utils"; //All user object changes can be kept track of here

//actual user data to export
export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

//Set up the provider of user context
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); //there's no user object by default
  const value = { currentUser, setCurrentUser }; //calling the values we want to give out

  //upon this component mounting, begin to listen for user object changes
  //firebase still persists a user based in sign in or out. Despite refreshes.
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) { //get user's custom claims

        user.getIdTokenResult().then((idTokenResult) => {
         if ( idTokenResult.claims.teacher ) {
           console.log('User is a teacher');
           user.teacher = true; //add teacher property to user object

         } else {
            console.log('User is not a teacher');
         }
        });
      }
      setCurrentUser(user); //This is the callback function. It receives a user or null. So this handles sign in and out.
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
