import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../contexts/course/course.context";
import CreateArea from "../create-area/create-area.component";
import "./students.styles.sass";

const Students = () => {
  const [students, setStudents] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the students of this course
  const courseId = currentCourse.courseId;

  // useEffect(()=>{
  //   const unsubscribe = subscribeToStudents(setStudents, courseId);
  //   return () => unsubscribe();
  // },[]);
    
      return (
        <div className="list-container">
          <div className="content-container">
            <CreateArea type="Student" courseId={courseId}/>
            <h3> Student 1 </h3>
            <h3> Student 2 </h3>
            <h3> Student 3 </h3>
            {/* {courses.map((course, index) => {
              const { name, teacher } = course;
              return <Course key={index} name={name} teacher={teacher} />;
            })} */}
          </div>
        </div>
      );
    };
    
    export default Students;