import styles from "./student-grades.module.scss";
import { useContext } from "react";
import { CourseContext } from "../../../contexts/course/course.context";
import { TestContext } from "../../../contexts/test-context/test.context";

const StudentGrades = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.testNameContainer}>
        <h3 className={styles.testName}>{testName}</h3>
        <span className={styles.availabilityIcon}>
          {isAvailable ? "🟢" : "🔴"}
        </span>
      </div>
      <div className={styles.studentNameContainer}>
        <h3 className={styles.studentName}>{studentName}</h3>
        <span className={styles.studentGrade}>{grade}</span>
      </div>
      <div className={styles.testGrades}>Test's grades go here</div>
    </div>
  );
};

export default StudentGrades;
