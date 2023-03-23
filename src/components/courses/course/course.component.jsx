import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
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
          <div className="course">{name}</div>
        </NavLink>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Course;