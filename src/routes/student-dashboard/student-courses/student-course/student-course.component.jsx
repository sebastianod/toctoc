import { NavLink, Outlet } from "react-router-dom";
import "./student-course.styles.scss";

export default function StudentCourse(props) {
  const { courseId, name, studentId } = props;
  console.log(courseId, name, studentId);
  return (
    <div className="student-course-container">
      <div className="student-course">
        <NavLink to={`${courseId}`}>
          <h3 className="student-course-title">{name}</h3>
        </NavLink>
      </div>
      <div className="st-course-details-container">
        <Outlet />
      </div>
    </div>
  );
}
