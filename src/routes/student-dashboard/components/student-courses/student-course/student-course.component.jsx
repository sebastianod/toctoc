import { NavLink } from "react-router-dom";
import { capitalizeFirstLetterOfEachWord } from "../../../../../utils/utilities";
import { CourseContext } from "../../../../../contexts/course/course.context";
import { useContext } from "react";
import "./student-course.styles.scss";

export default function StudentCourse(props) {
  const { courseId, name } = props;
  const { setCurrentCourse } = useContext(CourseContext);

  const handleCourseClick = () => {
    setCurrentCourse({ name: name, courseId: courseId });
  };
  
  return (
    <div className="student-course-container">
      <div className="student-course">
        <NavLink to={`/dashs/${courseId}`} onClick={handleCourseClick} >
          <h3 className="student-course-title">{capitalizeFirstLetterOfEachWord(name)}</h3>
        </NavLink>
      </div>
    </div>
  );
}
