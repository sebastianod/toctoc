import { createContext, useState } from "react";
//Keep track of the clicked test, its id and name

export const TestContext = createContext({
  currentTest: null, //will be an object
  setCurrentTest: () => null,
});

export function TestProvider({ children }) {
  const [currentTest, setCurrentTest] = useState(null); //no test by default
  const value = { currentTest, setCurrentTest }; //to be provided

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}
