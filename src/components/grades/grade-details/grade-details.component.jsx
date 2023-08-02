import styles from "./grade-details.module.scss";
import ExcelIcon from "../../../assets/excel.svg";
import { getAllGradesFromTest } from "../../../utils/firebase/firebase-utils";
import { useContext, useState } from "react";
import { CourseContext } from "../../../contexts/course/course.context";
import {utils, write} from "xlsx";

const GradeDetails = (props) => {
  const { testId, name, isAvailable } = props;
  const { currentCourse } = useContext(CourseContext);
  const { courseId } = currentCourse;
  const [ gradesList , setGradesList ] = useState([]);

  const handleExcelClick = async () => {
    const gradesArray = await getAllGradesFromTest(courseId, testId);
    setGradesList(gradesArray);
    console.log(gradesList);
  
    // Call the function to create the Excel file and trigger the download
    const testName = `${name} Test`
    createExcelFile(testName);
  };
  
  const createExcelFile = (testName) => {
    // Create a new workbook and worksheet
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([[testName],["Student's Name", "Grade %"]]);
  
    // Fill the worksheet with data from the gradesList array
    gradesList.forEach((gradeData, index) => {
      const rowIndex = index + 2; // Start from the second row since the first row is for headers
      const studentName = gradeData.student;
      const grade = gradeData.grade;
  
      // Set student name and grade in each row
      utils.sheet_add_aoa(worksheet, [[studentName, grade]], { origin: `A${rowIndex + 1}` });
    });
  
    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "Grades");
  
    // Generate a buffer from the workbook
    const excelBuffer = write(workbook, { type: "buffer", bookType: "xlsx" });
  
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create an anchor element to trigger the download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name}_testGrades.xlsx`;
    anchor.click();
  
    // Release the URL resource
    URL.revokeObjectURL(url);
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
