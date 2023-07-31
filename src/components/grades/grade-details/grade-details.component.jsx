import styles from "./grade-details.module.scss";
import ExcelIcon from "../../../assets/excel.svg";

const GradeDetails = (props) => {
  const { testId, name, isAvailable } = props;
  console.log(testId);
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
      />
    </div>
  );
};

export default GradeDetails;
