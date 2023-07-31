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
      <div className={styles.iconContainer}>
        <img className={styles.excelIcon} alt="download excel file" src={ExcelIcon} />
      </div>
    </div>
  );
};

export default GradeDetails;
