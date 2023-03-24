import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
import "./course-details.styles.scss";

const CourseDetails = () => {
  // const [name, courseId] = useOutletContext() //when nested inside courses
  const { currentCourse } = useContext(CourseContext);
  const { name } = currentCourse; //get the name of the clicked course

  return (
    <div className="course-details-container">
      <div className="sidebar-container">
        <div className="course-title">
          <h2>{name}</h2>
        </div>
        <NavLink to={`tests`}>
          <h3>Tests</h3>
        </NavLink>
        <NavLink to={`students`}>
          <h3>Students</h3>
        </NavLink>
      </div>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
};

export default CourseDetails;
