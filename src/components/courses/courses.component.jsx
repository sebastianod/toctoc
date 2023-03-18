import Course from "../course/course.component";
import "./courses.styles.scss";
import { getCourses } from "../../utils/firebase/firebase-utils";
import { useState, useEffect } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const coursesData = await getCourses();
      setCourses(coursesData);
    }
    fetchCourses();
  }, []);

  return (
    <div className="list-container">
      {courses.map((course, index) => {
        const { name, teacher } = course;
        return <Course key={index} name={name} teacher={teacher}/>;
      })}
    </div>
  );
};

export default Courses;