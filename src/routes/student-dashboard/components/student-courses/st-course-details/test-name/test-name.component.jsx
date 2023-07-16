import "./test-name.styles.scss";
import { processListOfSentences } from "../../../../../../utils/utilities";
import { NavLink } from "react-router-dom";
import { useContext } from "react"; // import useEffect hook
import { TestContext } from "../../../../../../contexts/test-context/test.context";
import { UserContext } from "../../../../../../contexts/user/user.context";
import { CourseContext } from "../../../../../../contexts/course/course.context";
import { answersDocExists } from "../../../../../../utils/firebase/firebase-utils";

export default function TestName(props) {
  const { name, testId, isAvailable } = props;
  const { setCurrentTest } = useContext(TestContext); // get currentTest from context
  const { currentUser } = useContext(UserContext); //needed to check if student has begun the test
  const { currentCourse } = useContext(CourseContext);
  const processedName = processListOfSentences(name).toString() || "";

  const handleTestClick = (e) => {
    // check function: test has been started by student?
    const checkAnswersDocExists = async () => {
      setCurrentTest((prevTest) => ({
        ...prevTest, // spread the previous state to keep the other properties
        name: "",
        testId: "",
        isAvailable: "",
        isBegun: false,
      }));
      try {
        const testBeginStatus = await answersDocExists(
          //returns true or false if doc exists
          currentCourse.courseId,
          currentUser.uid,
          testId
        );
        setCurrentTest((prevTest) => ({
          ...prevTest, // spread the previous state to keep the other properties
          name: name,
          testId: testId,
          isAvailable: isAvailable,
          isBegun: testBeginStatus,
        }));
        //window.location.href = testId;
      } catch (error) {
        console.log(error);
      }
      //console.log("Checked if answers doc exists.");
    };

    // Can take test only if available. Only a frontend check.
    isAvailable
      ? checkAnswersDocExists() //check only if the test is available
      : e.preventDefault(); // if test is unavailable do nothing
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
