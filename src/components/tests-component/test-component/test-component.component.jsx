import { Fragment, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { TestContext } from "../../../contexts/test-context/test.context";
import Delete from "../../delete-button/delete-button.component";
import Edit from "../../edit-button/edit-button.component";
import "./test-component.styles.scss";

const Test = ({ testName, testId }) => {
  const { setCurrentTest } = useContext(TestContext);

  const handleTestClick = () => {
    setCurrentTest({ name: testName, testId: testId });
  };

  return (
    <Fragment>
      <div className="test-container">
        <NavLink to={`${testId}`} onClick={handleTestClick}>
          <h3 className="test-name">{testName}</h3>
        </NavLink>
        <Edit className="edit-container" />
        <Delete className="delete-container" />
      </div>

      <div className="outlet-container">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Test;
