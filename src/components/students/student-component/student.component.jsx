import { deleteStudent } from "../../../utils/firebase/firebase-utils";
import Delete from "../../delete-button/delete-button.component";
import { capitalizeFirstLetterOfEachWord } from "../../../utils/utilities";
import "./student.styles.scss";
//students only get created or deleted because they can only be made if a user already exists with that email

export default function Student(props) {
  const { studentEmail, studentName , courseId, studentId } = props;

  const handleDeleteClick = () => {
    const deleteConfirmation = prompt(
      `Are you sure you want to delete ${studentEmail} student? Type "${studentEmail}" to confirm.`
    );
    if (deleteConfirmation === studentEmail) {
      deleteStudent(courseId, studentId); //needs the path, courseId and studentId
    }
  };

  return (
      <div className="student-container">
        <span className="student-name">{capitalizeFirstLetterOfEachWord(studentName)}. </span>
        <span className="student-email">{studentEmail}</span>
        <Delete className="delete-container" onClick={handleDeleteClick} />
      </div>
  );
}
