import "./test-name.styles.scss";
import { processListOfSentences } from "../../../../../../utils/utilities";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { TestContext } from "../../../../../../contexts/test-context/test.context";

export default function TestName(props) {
    const { name, testId } = props;
    const { setCurrentTest } = useContext(TestContext);
    const processedName = processListOfSentences(name).toString();

    const handleTestClick = () => { 
        setCurrentTest({ name: name, testId: testId })
    }

  return (
    <div className="test-name-container">
      <NavLink className="test-name-link" to={`${testId}`} onClick={handleTestClick}>
          {processedName}
      </NavLink>
    </div>
  );
}
