import { createContext, useState } from "react";

export const CourseContext = createContext({
  setCurrentCourse: () => null,
  currentCourse: null,
});

export const CourseProvider = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState(null); //there's no course by default
  const value = { currentCourse, setCurrentCourse }; //calling the values we want to give out

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};
