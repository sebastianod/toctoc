import { NavLink } from "react-router-dom";
import { capitalizeFirstLetterOfEachWord } from "../../../../../utils/utilities";
import "./student-course.styles.scss";

export default function StudentCourse(props) {
  const { courseId, name, studentId } = props;
  console.log(courseId, name, studentId);
  return (
    <div className="student-course-container">
      <div className="student-course">
        <NavLink to={`/dashs/${courseId}`}>
          <h3 className="student-course-title">{capitalizeFirstLetterOfEachWord(name)}</h3>
        </NavLink>
      </div>
    </div>
  );
}
