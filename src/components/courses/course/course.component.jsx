import { Link } from "react-router-dom";
import "./course.styles.scss";

//We use the courseId to set that as the link to each course

const Course = ({ name, courseId }) => {

  return (
    <div className="course-container">
      <Link to={`/dasht/courses/${courseId}`}>
        <div className="course">{name}</div>
      </Link>
    </div>
  );
};

export default Course;
