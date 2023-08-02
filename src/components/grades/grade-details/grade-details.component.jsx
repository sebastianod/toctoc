import styles from "./grade-details.module.scss";
import ExcelIcon from "../../../assets/excel.svg";
import { getAllGradesFromTest } from "../../../utils/firebase/firebase-utils";
import { useContext } from "react";
import { CourseContext } from "../../../contexts/course/course.context";

const GradeDetails = (props) => {
  const { testId, name, isAvailable } = props;
  const { currentCourse } = useContext(CourseContext);
  const { courseId } = currentCourse;

  const handleExcelClick = async () => {
    const gradesArray = await getAllGradesFromTest(courseId, testId);
    console.log("course and test: ", courseId, testId);
    console.log(gradesArray);
  };

  return (
    <div className={styles.gradeContainer}>
      <div className={styles.testNameContainer}>
        <h3 className={styles.testName}>{name}</h3>
      </div>
      <div className={styles.availabilityIcon}>{isAvailable ? "🟢" : "🔴"}</div>
      <input
        type="image"
        alt="download grades"
        className={styles.excelIcon}
        src={ExcelIcon}
        onClick={handleExcelClick}
      />
    </div>
  );
};

export default GradeDetails;
