import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../contexts/course/course.context";
import { getTests } from "../../utils/firebase/firebase-utils";
import { processListOfSentences } from "../../utils/utilities";
import PlusButton from "../plus-button/plus-button.component";
import Test from "./test-component/test-component.component";
import "./tests-component.styles.scss";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse.courseId;

  useEffect(() => {
    async function fetchTests() {
      const testsData = await getTests(courseId);
      setTests(testsData); //sets tests once getTests's promise is resolved
    }
    fetchTests();
  }, [courseId]); //useEffect re-runs upon courseId changing

  const showTests = tests.map((test, index) => {
    const { name, testId } = test;
    const processedName = processListOfSentences(name).toString();
    return <Test key={index} testName={processedName} testId={testId} />;
  });

  return (
    <div className="list-container">
      <div className="content-container">
        {showTests}
        <PlusButton add="test" />
      </div>
    </div>
  );
};

export default Tests;
