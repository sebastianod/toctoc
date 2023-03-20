// import { getCourses } from "../../utils/firebase/firebase-utils"; //replace with get tests
// import { useState, useEffect } from "react";
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
        <h2> Test 1 </h2>
        <h2> Test 2 </h2>
        <h2> Test 3 </h2>
        {/* {courses.map((course, index) => {
          const { name, teacher } = course;
          return <Course key={index} name={name} teacher={teacher} />;
        })} */}
        <div className="add-test-container">
          <button className="create-button">
            <span className="plus">+</span>
          </button>
          <h3 className="create-test-label">Create Test</h3>
        </div>
      </div>
    </div>
  );
};

export default Tests;
