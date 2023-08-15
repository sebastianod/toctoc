import styles from "./student-grades.module.scss";
import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../../contexts/course/course.context";
import { TestContext } from "../../../contexts/test-context/test.context";
import { getStudentTestGrades } from "../../../utils/firebase/firebase-utils";

const StudentGrades = () => {
  const { currentTest } = useContext(TestContext);
  const {
    name: testName,
    isAvailable,
    studentName,
    studentGrade: grade,
    testId,
    studentId,
  } = currentTest || {};

  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse?.courseId;

  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const getGrades = async (courseId, testId, studentId) => {
      const studentTestGrades = await getStudentTestGrades(
        courseId,
        testId,
        studentId
      );
      setGrades(studentTestGrades);
    };
    getGrades(courseId, testId, studentId);
  }, [courseId, testId, studentId]);

  // const handleColor = (value) => {
  //   if (value >= 90) {
  //     return { color: 'blue' };
  //   } else if (value >= 75) {
  //     return { color: 'orange' }; 
  //   } else if (value <= 60) {
  //     return { color: 'red' }; 
  //   } else {
  //     return {};
  //   }
  // };

  const showGrades = grades?.map((grade, index) => {
    const gradeEntries = Object.entries(grade); // Convert the object to an array of [key, value] pairs

    const gradeElements = gradeEntries.map(([key, value]) => (
      <div className={styles.singleGradeContainer} key={key}>
        <strong className={styles.questionIndex}>{index+1}.</strong>
        <span className={styles.question}>{`${key}`}</span>
        <span className={styles.grade}>{`${value}%`}</span>
      </div>
    ));

    return (
      <div className={styles.gradeContainer} key={index}>
        {gradeElements}
      </div>
    );
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.testNameContainer}>
        <h3 className={styles.testName}>{testName} Test</h3>
        <span className={styles.availabilityIcon}>
          {isAvailable ? "🟢" : "🔴"}
        </span>
      </div>
      <div className={styles.studentNameContainer}>
        <h3 className={styles.studentName}>{studentName}</h3>
        <span className={styles.studentGrade}>{grade}%</span>
      </div>
      <div className={styles.testGradesContainer}>
        <div className={styles.gradesHeader}>
          <strong className={styles.questionsHeaders}>Questions</strong>
          <strong className={styles.gradesHeaders}>Grades</strong>
        </div>
        {grades?.length > 0 ? showGrades : <div>Loading...</div>}
      </div>
    </div>
  );
};
export default StudentGrades;
