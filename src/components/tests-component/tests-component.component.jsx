import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../contexts/course/course.context";
import { processListOfSentences } from "../../utils/utilities";
import { subscribeToTests } from "../../utils/firebase/firebase-utils";
import CreateArea from "../create-area/create-area.component";
import Test from "./test-component/test-component.component";
import "./tests-component.styles.scss";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const { currentCourse } = useContext(CourseContext); //to get the current courseId, for the path to the tests to this course
  const courseId = currentCourse.courseId;

  useEffect(() => {
    console.log("just fetched tests");
    const unsubscribe = subscribeToTests(courseId, setTests); //whenever a document is added, removed, or changed, this will be called
    return () => unsubscribe(); //cleans up after the component is unmounted
  }, [courseId]); //useEffect re-runs upon courseId changing

  const showTests = tests.map((test, index) => {
    const { name, testId } = test;
    const processedName = processListOfSentences(name).toString();
    return <Test key={index} testName={processedName} testId={testId} />;
  });

  return (
    <div className="tests-container">
        <CreateArea type="Test" courseId={courseId} />
      {showTests}
    </div>
  );
};

export default Tests;
