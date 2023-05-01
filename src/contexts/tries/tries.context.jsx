import { createContext, useState } from "react";

export const TriesContext = createContext({
    tries: null,
    setTries: () => null,
    hasRecorded: null,
    setHasRecorded: () => null,
})

export const TriesProvider = ({ children }) => {
    const [tries, setTries] = useState(0);
    const [hasRecorded, setHasRecorded] = useState(false);
    const value = { tries, setTries, hasRecorded, setHasRecorded };

    return (
        <TriesContext.Provider value={value}>
            {children}
        </TriesContext.Provider>
    );
}