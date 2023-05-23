import "./test-name.styles.scss";
import { processListOfSentences } from "../../../../../../utils/utilities";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { TestContext } from "../../../../../../contexts/test-context/test.context";

export default function TestName(props) {
  const { name, testId, isAvailable } = props;
  const { setCurrentTest } = useContext(TestContext);
  const processedName = processListOfSentences(name).toString() || "";

  const handleTestClick = () => {
    setCurrentTest({ name: name, testId: testId, isAvailable: isAvailable });
  };

  // isAvailable is a boolean, true or false, students need a readable status for their tests.
  const readableAvailability = () => {
    if (isAvailable === true) {
      return "👍";
    }
    if (isAvailable === false) {
      return "⛔";
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
