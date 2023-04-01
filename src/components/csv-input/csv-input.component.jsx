import { useState } from "react";
import "./csv-input.styles.scss";

export default function CsvInput() {
  const { csvFile, setCsvFile } = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setCsvFile(e.target.result);
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="csv-input-container">
      <h3 className="csv-input-label">Upload a .csv file</h3>
      <input className="csv-input" type="file" accept=".csv" onChange={handleFileUpload} />
      <pre className="csv-output">{csvFile}</pre>
    </div>
  );
}
