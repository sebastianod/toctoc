import { Fragment, useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CourseContext } from "../../../contexts/course/course.context";
import { deleteCourse } from "../../../utils/firebase/firebase-utils";
import Delete from "../../delete-button/delete-button.component";
import EditArea from "../../edit-area/edit-area.component";
import Edit from "../../edit-button/edit-button.component";
import "./course.styles.scss";

//We use the courseId to set that as the link to each course

const Course = ({ name, courseId, ...otherProps }) => {
  const { setCurrentCourse } = useContext(CourseContext);
  const [ editClick, setEditClick ] = useState(false); //is the edit button clicked?

  const handleCourseClick = () => {
    setCurrentCourse({ name: name, courseId: courseId });
  };

  const handleEditClick = () => {
    console.log("Edit button clicked");
    setEditClick(!editClick); //toggles the edit area
    //here at the course level, we want to edit the course name. Thus, type is "Course" and isEdit is true. 
    //<CreateArea will handle the edit logic, thus we pass the courseId. 
    //So that it can call on updateCourse(courseId, courseName) in firebase-utils. Where courseName is set there.
  };

  const handleDeleteClick = () => {
    const deleteConfirmation = prompt(`Are you sure you want to delete ${name} course? Type "${name}" to confirm.`)
    
    if (deleteConfirmation === name) {
      deleteCourse(courseId);
    }
    return ; //if the user cancels the deletion
  };

  function uiLogic() {
    if (editClick === true) {
      return (
        <EditArea
          type="Course"
          courseId={courseId}
          name={name}
          setEditClick={setEditClick}
          {...otherProps}
        />
      );
    }
    if (editClick === false) {
      return (
        <Fragment>
          <div className="course-container">
            <NavLink to={`/dasht/courses/${courseId}`} onClick={handleCourseClick}>
              <h3 className="course">{name}</h3>
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

export default Course;