import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import "./excel-input.styles.scss";

export default function ExcelInput() {
  const [jsonData, setJsonData] = useState(null);

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
      setJsonData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    console.log(jsonData);
  }, [jsonData]);

  return (
    <div className="excel-input-container">
      <h3 className="excel-input-label">Upload your excel file</h3>
      <input className="excel-input" type="file" onChange={handleFileUpload} />
    </div>
  );
}
