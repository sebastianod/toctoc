import { Fragment, useContext } from "react";
import styles from "./student-name.module.scss";
import { TestContext } from "../../../contexts/test-context/test.context";
import { NavLink } from "react-router-dom";

const StudentName = ({ name, grade, studentId }) => {
  const { currentTest ,setCurrentTest } = useContext(TestContext);

  //set studentId in currentTest context upon clicking

  const handleOnClick = () => {
    setCurrentTest(prevTest => {
        return { ...prevTest, studentId: studentId, studentName: name, studentGrade:grade };
      });
  }
//the NavLink goes to the StudentGrades component

console.log(currentTest);
  return (
    <Fragment>
      <NavLink onClick={handleOnClick} className={styles.navLink}>
        <span className={styles.studentName}>{name}</span>
      </NavLink>
      <span className={styles.grade}>{grade}%</span>
    </Fragment>
  );
};

export default StudentName;
