import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { TestContext } from "../../../contexts/test-context/test.context";

export default function Test(props) {
  const { testName, testId } = props;
  const { setCurrentTest } = useContext(TestContext);

  const handleTestClick = () => {
  // setCurrentTest({ //set the currently chosen test in TestContext
  //   name: testName, //to be passed down to TestDetails
  //   testId: testId,
  // })
  }

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
}
