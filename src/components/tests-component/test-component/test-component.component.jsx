import { Fragment, useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
import { TestContext } from "../../../contexts/test-context/test.context";
import { deleteTest } from "../../../utils/firebase/firebase-utils";
import Delete from "../../delete-button/delete-button.component";
import EditArea from "../../edit-area/edit-area.component";
import Edit from "../../edit-button/edit-button.component";
import "./test-component.styles.scss";

const Test = ({ testName, testId }) => {
  const { setCurrentTest } = useContext(TestContext);
  const [editClick, setEditClick] = useState(false); //is the edit button clicked? Based on this, we rende <EditArea /> or the basic <Course /> component
  const { currentCourse } = useContext(CourseContext); //we need the current course's Id in order to get the path to update or delete the test
  const { courseId } = currentCourse; //needed for the test's path

  const handleTestClick = () => {
    setCurrentTest({ name: testName, testId: testId });
  };

  const handleEditClick = () => {
    setEditClick(!editClick); //toggles the edit area
  };

  const handleDeleteClick = () => {
    const deleteConfirmation = prompt(
      `Are you sure you want to delete ${testName} test? Type "${testName}" to confirm.`
    );
    if (deleteConfirmation === testName) {
      deleteTest(courseId, testId); //needs the path, courseId and testId
    }
  };

  function uiLogic() {
    if (editClick === true) {
      return (
        <EditArea
          type="Test"
          courseId={courseId}
          testId={testId}
          name={testName}
          setEditClick={setEditClick}
        />
      );
    }
    if (editClick === false) {
      return (
        <Fragment>
          <div className="test-container">
            <NavLink to={`${testId}`} onClick={handleTestClick}>
              <h3 className="test-name">{testName}</h3>
            </NavLink>
            <Edit className="edit-container" onClick={handleEditClick} />
            <Delete className="delete-container" onClick={handleDeleteClick} />
          </div>
          <Outlet />
        </Fragment>
      );
    }
  }

  return uiLogic();
};

export default Test;
