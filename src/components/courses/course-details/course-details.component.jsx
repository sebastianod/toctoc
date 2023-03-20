import { useContext } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
import "./course-details.styles.scss";

const CourseDetails = () => {
    // const [name, courseId] = useOutletContext() //when nested inside courses
    const { courseId } = useParams(); //without nesting inside courses
    const { currentCourse } = useContext(CourseContext)
    const { name } = currentCourse; //get the name of the clicked course

  return (
    <div className="course-details-container">
      <div className="sidebar-container">
        <h2>{name}</h2>
        <Link to={`/dasht/courses/${courseId}/tests`}>
          <h3>Tests</h3>
        </Link>
        <Link to={`/dasht/courses/${courseId}/students`}>
          <h3>Students</h3>
        </Link>
      </div>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
};

export default CourseDetails;
