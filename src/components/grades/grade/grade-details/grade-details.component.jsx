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

  console.log("course and test ids: ", courseId, " ", testId);

  useEffect(() => {
    const getStudents = async () => {
      const gradesArray = await getAllGradesFromTest(courseId, testId);
      setStudents(gradesArray);
    };
    getStudents();
  }, [courseId, testId]);

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.testName}>Test Name</h3>
      <br />
      <div className={styles.studentsContainer}>
        <div className={styles.studentContainer}>
          <span className={styles.studentName}>Student name,</span>
          <span className={styles.grade}> Grade %</span>
        </div>
        <br />
        <div className={styles.studentContainer}>
          <span className={styles.studentName}>Student name,</span>
          <span className={styles.grade}> Grade %</span>
        </div>
        <br />
        <div className={styles.studentContainer}>
          <span className={styles.studentName}>Student name,</span>
          <span className={styles.grade}> Grade %</span>
        </div>
        <br />
      </div>
    </div>
  );
};

export default GradeDetails;
