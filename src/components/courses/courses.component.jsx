import Course from "./course/course.component";
import "./courses.styles.scss";
import { getCourses } from "../../utils/firebase/firebase-utils";
import { useState, useEffect } from "react";
import PlusButton from "../plus-button/plus-button.component";
import { processListOfSentences } from "../../utils/utilities";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const coursesData = await getCourses();
      setCourses(coursesData); //Set it only once the promise is resolved
    }
    fetchCourses();
  }, []);

  function showCourses(coursesArray) {
    return coursesArray.map((course, index) => {
      const { name, courseId } = course;
      const processedName = processListOfSentences(name).toString(); //converts the array of processed sentences into a string
      return <Course key={index} name={processedName} courseId={courseId} />;
    });
  }

  return (
    <div className="list-container">
      <div className="content-container">
        {showCourses(courses)}
        <PlusButton add="course" />
      </div>
    </div>
  );
};

export default Courses;
