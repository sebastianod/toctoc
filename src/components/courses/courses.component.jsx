import Course from "./course/course.component";
import "./courses.styles.scss";
import { getCourses } from "../../utils/firebase/firebase-utils";
import { useState, useEffect } from "react";
import PlusButton from "../plus-button/plus-button.component";

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
        <PlusButton add="course" />
      </div>
    </div>
  );
};

export default Courses;
