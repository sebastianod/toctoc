import { useState } from "react";
import { read, utils } from "xlsx";
import Button from "../button/button.component";
import ExcelLogo from "../../assets/excel.png";
import "./excel-input.styles.scss";
import { addUsersFunction } from "../../utils/firebase/firebase-utils";
import { createStudentUnderCourse } from "../../utils/firebase/firebase-utils";

export default function ExcelInput(props) {
  const [jsonForm, setJsonForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { type, courseId } = props;

  const handleFileUpload = (e) => {
    //convert excel file to json
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(sheet, {
        header: ["name", "course", "email", "password"],
        range: 1, //ignore first row
      });
      setJsonForm(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (type === "enrollment") {
      //enroll students under the course with courseId
      jsonForm.forEach(async (student) => {
        try {
          const email = student.email;
          createStudentUnderCourse(courseId, email);
          alert("Success creating users.");
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.log(error.message);
          setIsLoading(false);
          alert("Error creating users.");
        }
      });
    } else if (type === undefined) {
      //create student user accounts
      addUsersFunction(jsonForm)
        .then((result) => {
          console.log("Server Message: ", result);
          alert("Success creating users.");
          setIsLoading(true);
        })
        .catch((error) => {
          console.error(error);
          alert("Error creating users.");
          setIsLoading(false);
        });
    }
  };

  return (
    <div
      className={
        type === "enrollment"
          ? "enrollment-excel-input-container"
          : "excel-input-container"
      }
    >
      <h3 className="excel-input-label">Upload your excel file</h3>
      <label htmlFor="file-input" className="excel-img-label">
        <img className="excel-logo" src={ExcelLogo} alt="excel icon" />
      </label>
      <form className="excel-form-container" onSubmit={handleSubmit}>
        <input
          id="file-input"
          className="input"
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }} // hide the input element
        />
        <Button className="submit-button" buttonType="submit" type="submit">
          Submit
        </Button>
      </form>
      {isLoading ? <span className="loading">...Loading</span> : ""}
    </div>
  );
}
