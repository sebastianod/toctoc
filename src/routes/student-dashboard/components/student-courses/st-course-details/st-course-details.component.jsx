import "./st-course-details.styles.scss";
import { useState, useEffect, useContext } from "react";
import { CourseContext } from "../../../../../contexts/course/course.context";
import { processListOfSentences } from "../../../../../utils/utilities";
import { subscribeToTests } from "../../../../../utils/firebase/firebase-utils";

export default function StudentCourseDetails() {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse.courseId;

  useEffect(() => {
    const unsubscribe = subscribeToTests(courseId, setTests); //whenever a document is added, removed, or changed, this will be called
    return () => unsubscribe(); //cleans up after the component is unmounted
  }, [courseId]); //useEffect re-runs upon courseId changing

  const showTests = tests.map((test, index) => {
    const { name, testId } = test;
    const processedName = processListOfSentences(name).toString();
    return (
      <h4 key={index}>
        Test name: {processedName}, testId: {testId}
      </h4>
    );
  });

  return <div className="student-tests-container">{showTests}</div>;
}
