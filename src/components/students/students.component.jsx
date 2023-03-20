// import { getCourses } from "../../utils/firebase/firebase-utils"; //replace with get Student
// import { useState, useEffect } from "react";
import "./students.styles.sass";

const Students = () => {
    //   const [students, setStudents] = useState([]);
    
    //   useEffect(() => {
    //     async function fetchStudents() {
    //       const studentsData = await getStudents();
    //       setStudents(testsData); //Set it only once the promise is resolved
    //     }
    //     fetchStudents();
    //   }, []);
    
      return (
        <div className="list-container">
          <div className="content-container">
            <h3> Student 1 </h3>
            <h3> Student 2 </h3>
            <h3> Student 3 </h3>
            {/* {courses.map((course, index) => {
              const { name, teacher } = course;
              return <Course key={index} name={name} teacher={teacher} />;
            })} */}
            <div className="add-student-container">
              <button className="create-button">
                <span className="plus">+</span>
              </button>
              <h3 className="create-student-label">Create Student</h3>
            </div>
          </div>
        </div>
      );
    };
    
    export default Students;