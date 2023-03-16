import { createContext, useState } from "react";
//user is set by sign in or sign up. Used dashboards.

//actual user data to export
export const UserContext = createContext({
    setCurrentUser: () => null,
    currentUser: null,
})

//Set up the provider of user context
export const UserProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null) //there's no user object by default
    const value = { currentUser, setCurrentUser }; //calling the values we want to give out
    return <UserContext.Provider value={value}>{ children }</UserContext.Provider>
}