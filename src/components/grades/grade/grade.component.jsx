import styles from "./grade.module.scss";
import ExcelIcon from "../../../assets/excel.svg";
import { getAllGradesFromTest } from "../../../utils/firebase/firebase-utils";
import { useContext } from "react";
import { CourseContext } from "../../../contexts/course/course.context";
import { utils, write } from "xlsx";
import { NavLink } from "react-router-dom";

const Grade = (props) => {
  const { testId, name, isAvailable } = props;
  const { currentCourse } = useContext(CourseContext);
  const { courseId } = currentCourse;

  const handleExcelClick = async () => {
    const gradesArray = await getAllGradesFromTest(courseId, testId);
    // Call the function to create the Excel file and trigger the download
    const testName = `${name} Test`;
    createExcelFile(gradesArray, testName);
  };

  const createExcelFile = (gradesList, testName) => {
    // Create a new workbook and worksheet
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([
      [testName],
      ["Student Name", "Grade %"],
    ]);

    // Set the width of the first column (column A) to 20
    worksheet["!cols"] = [{ width: 20 }];

    // Fill the worksheet with data from the gradesList array
    gradesList.forEach((gradeData, index) => {
      const rowIndex = index + 2; // Start from the third row since the first two rows are for headers and test name
      const studentName = gradeData.student;
      const grade = gradeData.grade.toFixed(1);

      // Set student name and grade in each row
      utils.sheet_add_aoa(worksheet, [[studentName, grade]], {
        origin: `A${rowIndex + 1}`,
      });
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
        <NavLink to={`grade-details`}>
          <h3 className={styles.testName}>{name}</h3>
        </NavLink>
      </div>
      <input
        type="image"
        alt="download grades"
        className={styles.excelIcon}
        src={ExcelIcon}
        onClick={handleExcelClick}
      />
      <div className={styles.availabilityIcon}>{isAvailable ? "🟢" : "🔴"}</div>
    </div>
  );
};

export default Grade;
