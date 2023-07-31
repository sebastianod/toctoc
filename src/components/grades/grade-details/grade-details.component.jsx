import styles from "./grade-details.module.scss";

const GradeDetails = (props) => {
  const { testId, name, isAvailable } = props;
    console.log(testId);
  return (
    <div className={styles.gradeContainer}>
      <div className={styles.testNameContainer}>
        <span className={styles.testName}>{name}</span>
      </div>
      <div className={styles.availableIcon}>{isAvailable ? "🟢" : "🔴"}</div>
      <div className={styles.excelIcon}></div>
    </div>
  );
};

export default GradeDetails;
