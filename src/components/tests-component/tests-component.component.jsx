// import { getCourses } from "../../utils/firebase/firebase-utils"; //replace with get tests
// import { useState, useEffect } from "react";
import PlusButton from "../plus-button/plus-button.component";
import "./tests-component.styles.scss";

const Tests = () => {
//   const [tests, setTests] = useState([]);

//   useEffect(() => {
//     async function fetchTests() {
//       const testsData = await getTests();
//       setTests(testsData); //Set it only once the promise is resolved
//     }
//     fetchTests();
//   }, []);

  return (
    <div className="list-container">
      <div className="content-container">
        <h3> Test 1 </h3>
        <h3> Test 2 </h3>
        <h3> Test 3 </h3>
        {/* {courses.map((course, index) => {
          const { name, teacher } = course;
          return <Course key={index} name={name} teacher={teacher} />;
        })} */}
        <PlusButton add="test"/>
      </div>
    </div>
  );
};

export default Tests;
