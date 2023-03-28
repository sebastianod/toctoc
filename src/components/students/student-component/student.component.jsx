import { Fragment, useContext, useState } from "react";
import { deleteStudent } from "../../../utils/firebase/firebase-utils";
import Delete from "../../delete-button/delete-button.component";
import EditArea from "../../edit-area/edit-area.component";
import "./student.styles.scss";
//students only get created or deleted because they can only be made if a user already exists with that email

export default function Student(props) {
  const { studentName, courseId, studentId } = props;

  const handleDeleteClick = () => {
    const deleteConfirmation = prompt(
      `Are you sure you want to delete ${studentName} student? Type "${studentName}" to confirm.`
    );
    if (deleteConfirmation === studentName) {
      deleteStudent(courseId, studentId); //needs the path, courseId and studentId
    }
  };

  return (
    <Fragment>
      <div className="student-container">
        <h3 className="student-name">{studentName}</h3>
        <Delete className="delete-container" onClick={handleDeleteClick} />
      </div>
    </Fragment>
  );
}
