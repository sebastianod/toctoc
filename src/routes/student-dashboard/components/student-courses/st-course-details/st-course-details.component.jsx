import "./st-course-details.styles.scss";
import { useState, useEffect, useContext } from "react";
import { CourseContext } from "../../../../../contexts/course/course.context";
import { TestContext } from "../../../../../contexts/test-context/test.context";
import { processListOfSentences } from "../../../../../utils/utilities";
import { subscribeToTests } from "../../../../../utils/firebase/firebase-utils";
import { NavLink } from "react-router-dom";

export default function StudentCourseDetails() {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse.courseId;

  const { setCurrentTest } = useContext(TestContext);


  useEffect(() => {
    const unsubscribe = subscribeToTests(courseId, setTests); //whenever a document is added, removed, or changed, this will be called
    return () => unsubscribe(); //cleans up after the component is unmounted
  }, [courseId]); //useEffect re-runs upon courseId changing

  const handleClick = (testId) => {
    setCurrentTest(testId); //set the current test with the testId
  }

  const showTests = tests.map((test, index) => {
    const { name, testId } = test;
    console.log(test);
    const processedName = processListOfSentences(name).toString();
    return (
      <NavLink key={index} className="test-name" to={`${testId}`} onClick={handleClick(testId)}>
          {processedName} and Id: {testId}
      </NavLink>
    );
  });

  return (
    <div className="student-tests-container">
      <h4>Tests</h4>
      {showTests}
    </div>
  );
}
