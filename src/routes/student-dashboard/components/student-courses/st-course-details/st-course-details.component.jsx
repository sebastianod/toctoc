import { useState, useEffect, useContext } from "react";
import { CourseContext } from "../../../../../contexts/course/course.context";
import {
  subscribeToTests,
  getMainGradeForSingleStudent,
} from "../../../../../utils/firebase/firebase-utils";
import TestName from "./test-name/test-name.component";
import { UserContext } from "../../../../../contexts/user/user.context";

export default function StudentCourseDetails() {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse && currentCourse.courseId; //wait for currentCourse to be set before getting courseId
  const [grades, setGrades] = useState({}); // use an object to store the grades for each test
  const { currentUser } = useContext(UserContext);
  const studentId = currentUser?.uid;

  //get a student's grade
  const getGrade = async (courseId, testId, studentId) => {
    const studentGrade = await getMainGradeForSingleStudent(
      courseId,
      testId,
      studentId
    );
    setGrades((prevGrades) => ({ ...prevGrades, [testId]: studentGrade })); // update the grades object with the new grade for the test
    console.log("student's grade: ", studentGrade);
  };

  useEffect(() => {
    if (!courseId) return; // wait for courseId to be set before subscribing to tests
    const unsubscribe = subscribeToTests(courseId, setTests); //whenever a document is added, removed, or changed, this will be called
    return () => unsubscribe(); //cleans up after the component is unmounted
  }, [courseId]); //useEffect re-runs upon courseId changing

  useEffect(() => {
    if (!tests.length) return; // wait for tests array to be populated before getting grades
    tests.forEach((test) => {
      const { testId } = test;
      getGrade(courseId, testId, studentId); // call getGrade for each test in the array
    });
  }, [tests, courseId, studentId]); //useEffect re-runs upon tests array changing

  const showTests = tests.map((test, index) => {
    const { name, testId, isAvailable } = test;
    const grade = grades[testId] || "No grade"; // get the grade for the test from the grades object or use a default value

    return (
      <TestName
        name={name}
        testId={testId}
        isAvailable={isAvailable}
        grade={grade}
        key={index}
      />
    );
  });

  return (
    <div className="student-tests-container">
      <h4 className="Tests-header">Tests</h4>
      {showTests}
    </div>
  );
}
