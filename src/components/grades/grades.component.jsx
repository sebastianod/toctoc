import { useContext, useEffect, useState } from "react";
import styles from "./grades.module.scss";
import { CourseContext } from "../../contexts/course/course.context";
import { subscribeToTests } from "../../utils/firebase/firebase-utils";
import { processListOfSentences } from "../../utils/utilities";
import GradeDetails from "./grade-details/grade-details.component";

const Grades = () => {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse.courseId;

  useEffect(() => {
    const unsubscribe = subscribeToTests(courseId, setTests);
    return () => unsubscribe();
  }, [courseId]);

  const showTests = tests.map((test, index) => {
    const { name, testId, isAvailable } = test;
    const processedName = processListOfSentences(name).toString();
    //Placeholder for new <TestGrades/> component.
    return (
      <GradeDetails
        key={index}
        name={processedName}
        testId={testId}
        isAvailable={isAvailable}
      />
    );
  });

  return <div className={styles.mainContainer}>{showTests}</div>;
};

export default Grades;
