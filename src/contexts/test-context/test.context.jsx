import { createContext, useState } from "react";
//Keep track of the clicked test, its id and name

export const TestContext = createContext({
  currentTest: null, //will be an object
  setCurrentTest: () => null,
  currentQuestion: null, 
  setCurrentQuestion: () => null,
});

export const TestProvider = ({ children }) => {
  const [currentTest, setCurrentTest] = useState(null); //no test by default
  const [currentQuestion, setCurrentQuestion] = useState(0); //0 is the nonDB default 
  const value = { currentTest, setCurrentTest, currentQuestion, setCurrentQuestion }; //to be provided

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
