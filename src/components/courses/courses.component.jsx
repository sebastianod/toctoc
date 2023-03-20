import Course from "./course/course.component";
import "./courses.styles.scss";
import { getCourses } from "../../utils/firebase/firebase-utils";
import { useState, useEffect } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const coursesData = await getCourses();
      setCourses(coursesData); //Set it only once the promise is resolved
    }
    fetchCourses();
  }, []);

  return (
    <div className="list-container">
      <div className="content-container">
        {courses.map((course, index) => {
          const { name, courseId } = course;
          return <Course key={index} name={name} courseId={courseId} />;
        })}
        <div className="add-course-container">
          <button className="create-button">
            <span className="plus">+</span>
          </button>
          <h3 className="create-course-label">Create Course</h3>
        </div>
      </div>
    </div>
  );
};

export default Courses;
