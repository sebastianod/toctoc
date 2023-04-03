import { useState } from "react";
import { read, utils } from "xlsx";
import Button from "../button/button.component";
import ExcelLogo from "../../assets/excel.png";
import "./excel-input.styles.scss";

export default function ExcelInput() {
  const [jsonForm, setJsonForm] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(sheet, {
        header: ["name", "course", "email", "password"],
        range: 1, //start from the second row
      });
      setJsonForm(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(jsonForm);
    console.log("Type of jsonForm: " , typeof(jsonForm));
  };

  return (
    <div className="excel-input-container">
      <h3 className="excel-input-label">Upload your excel file</h3>
      <label htmlFor="file-input">
        <img className="logo" src={ExcelLogo} alt="excel icon" />
      </label>
      <form className="form-container" onSubmit={handleSubmit}>
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
    </div>
  );
}
