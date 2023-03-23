import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { TestContext } from "../../../contexts/test-context/test.context";
import "./test-component.styles.scss";



const Test = ({ testName, testId }) => {
  const { setCurrentTest } = useContext(TestContext);

  const handleTestClick = () => {
    setCurrentTest({ name: testName, testId: testId });
    console.log('currentTest set to: ', { name: testName, testId: testId });
  };

  return (
    <Fragment>
      <div className="test-container">
        <NavLink to={`${testId}`} onClick={handleTestClick}>
          <h3>{testName}</h3>
        </NavLink>
      </div>
      <div className="outlet-container">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Test;