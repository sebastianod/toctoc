import Course from "./course/course.component";
import "./courses.styles.scss";
import {
  subscribeToCourses,
} from "../../utils/firebase/firebase-utils";
import { useState, useEffect } from "react";
import { processListOfSentences } from "../../utils/utilities";
import CreateArea from "../create-area/create-area.component";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => { 
    const unsubscribe = subscribeToCourses(setCourses); //whenever a document is added, removed, or changed, this will be called. Uses setCourses to update the state of Courses
    return () => unsubscribe();
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
        <CreateArea type="Course" />
        {showCourses(courses)}
      </div>
    </div>
  );
};

export default Courses;
