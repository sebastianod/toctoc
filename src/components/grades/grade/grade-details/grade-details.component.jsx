import { useContext, useEffect, useState } from "react";
import styles from "./grade-details.module.scss";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { getAllGradesFromTest } from "../../../../utils/firebase/firebase-utils";
import StudentName from "../../student-name/student-name.component";

const GradeDetails = () => {
  const [students, setStudents] = useState([]);
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse?.courseId;
  const { currentTest } = useContext(TestContext);
  const testId = currentTest?.testId;
  const isAvailable = currentTest?.isAvailable;

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
        <StudentName name={name} grade={grade} studentId={studentId} />
      </div>
    );
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.testNameContainer}>
        <h3 className={styles.testName}>
          {currentTest ? `${currentTest.name} Test` : "Test name"}
        </h3>
        <div className={styles.isAvailableIcon}>{isAvailable ? "🟢" : "🔴"}</div>
      </div>

      <br />
      <div className={styles.studentsContainer}>{showStudents}</div>
    </div>
  );
};

export default GradeDetails;
