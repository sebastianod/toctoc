import { useContext, useEffect, useState } from "react";
import styles from "./grade-details.module.scss";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { getAllGradesFromTest } from "../../../../utils/firebase/firebase-utils";

const GradeDetails = () => {
  const [students, setStudents] = useState([]);
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse?.courseId;
  const { currentTest } = useContext(TestContext);
  const testId = currentTest?.testId;

  useEffect(() => {
    const getStudents = async () => {
      const gradesArray = await getAllGradesFromTest(courseId, testId);
      setStudents(gradesArray);
    };
    getStudents();
  }, [courseId, testId]);

  const showStudents = students.map((student, index) => {
    const studentId = student.gradesDocId;
    const name = student.student;
    const grade = student.grade;
    return (
      <div className={styles.studentContainer} key={index}>
        <span className={styles.studentName}>{name}</span>
        <span className={styles.grade}>{grade}%</span>
      </div>
    );
  });

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.testName}>{currentTest ? `${currentTest.name} Test` : "Test name"}</h3>
      <br />
      <div className={styles.studentsContainer}>{showStudents}</div>
    </div>
  );
};

export default GradeDetails;
