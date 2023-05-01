import { createContext, useState } from "react";

export const triesContext = createContext({
    tries: null,
    setTries: () => null,
})

export const TriesProvider = ({ children }) => {
    const [tries, setTries] = useState(null);
    const value = { tries, setTries };

    return (
        <triesContext.Provider value={value}>
            {children}
        </triesContext.Provider>
    );
}