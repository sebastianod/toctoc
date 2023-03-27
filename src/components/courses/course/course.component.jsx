import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
import Delete from "../../delete-button/delete-button.component";
import Edit from "../../edit-button/edit-button.component";
import "./course.styles.scss";

//We use the courseId to set that as the link to each course

const Course = ({ name, courseId }) => {
  const {setCurrentCourse} = useContext(CourseContext);

  const handleCourseClick = () => {
    setCurrentCourse({name: name, courseId: courseId})
  };

  return (
    <Fragment>
      <div className="course-container">
        <NavLink to={`/dasht/courses/${courseId}`} onClick={handleCourseClick}>
          <h3 className="course">{name}</h3>
        </NavLink>
        <Edit className="edit-container"/>
        <Delete className="delete-container" />
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Course;