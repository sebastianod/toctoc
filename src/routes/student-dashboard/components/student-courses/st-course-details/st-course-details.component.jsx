import "./st-course-details.styles.scss";
import { useState, useEffect, useContext } from "react";
import { CourseContext } from "../../../../../contexts/course/course.context";
import { subscribeToTests } from "../../../../../utils/firebase/firebase-utils";
import TestName from "./test-name/test-name.component";

export default function StudentCourseDetails() {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse && currentCourse.courseId; //wait for currentCourse to be set before getting courseId

  useEffect(() => {
    if (!courseId) return; // wait for courseId to be set before subscribing to tests
    const unsubscribe = subscribeToTests(courseId, setTests); //whenever a document is added, removed, or changed, this will be called
    return () => unsubscribe(); //cleans up after the component is unmounted
  }, [courseId]); //useEffect re-runs upon courseId changing

  const showTests = tests.map((test, index) => {
    const { name, testId, isAvailable } = test;
    return <TestName name={name} testId={testId} isAvailable={isAvailable} key={index} />;
  });

  return (
    <div className="student-tests-container">
      <h4 className="Tests-header">Tests</h4>
      {showTests}
    </div>
  );
}
