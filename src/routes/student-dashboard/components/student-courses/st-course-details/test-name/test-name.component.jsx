import "./test-name.styles.scss";
import { processListOfSentences } from "../../../../../../utils/utilities";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { TestContext } from "../../../../../../contexts/test-context/test.context";
import { UserContext } from "../../../../../../contexts/user/user.context";
import { CourseContext } from "../../../../../../contexts/course/course.context";
import { answersDocExists } from "../../../../../../utils/firebase/firebase-utils";

export default function TestName(props) {
  const { name, testId, isAvailable } = props;
  const { setCurrentTest } = useContext(TestContext);
  const { currentUser } = useContext(UserContext); //needed to check if student has begun the test
  const { currentCourse } = useContext(CourseContext);
  const processedName = processListOfSentences(name).toString() || "";

  const { beginOrContinue, setBeginOrContinue } = useState("Begin"); //Show "begin" or "continue" test


  const handleTestClick = async (e) => { // Can take test only if available. Only a frontend check.
    isAvailable
      ? setCurrentTest({ name: name, testId: testId, isAvailable: isAvailable })
      : e.preventDefault();

    // check if test has been started by student: 
   const testBeginStatus = await answersDocExists(currentCourse.courseId, currentUser.uid, testId);
   if (testBeginStatus === true) {
    //
   }
  };

  // isAvailable is a boolean, true or false, students need a readable status for their tests.
  const readableAvailability = () => {
    if (isAvailable === true) {
      return "🟢";
    }
    if (isAvailable === false) {
      return "🔴";
    } else {
      return "Unknown";
    }
  };
  //Availability: <strong>{readableAvailability()}</strong>
  return (
    <div className="test-name-container">
      <NavLink
        className="test-name-link"
        to={`${testId}`}
        onClick={handleTestClick}
      >
        <span className="test-name">{processedName}</span>
        <strong className="test-availability">{readableAvailability()}</strong>
      </NavLink>
    </div>
  );
}
