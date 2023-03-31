//Handles creation of  courses and tests
import { useState } from "react";
import Plus from "../plus-button/plus-alone.component";
import PlusButton from "../plus-button/plus-button.component";
import TextInput from "../text-input/text-input.component";
import XButton from "../x-button/x-button.component";
import { createCourse, createStudentUnderCourse, createTest } from "../../utils/firebase/firebase-utils";
import "./create-area.styles.scss";

export default function CreateArea({ type, courseId }) {
  //courseId is only passed if type is course
  const [thingName, setThingName] = useState(""); //course or test name
  const [isClicked, setIsClicked] = useState(false); //is the create button clicked?
  const [isOut, setIsOut] = useState(false); //is the X button clicked? Return to create course or test

  const handleChange = (event) => {
    const { value } = event.target;
    setThingName(value); //set course name for ui
  };

  const handleClick = () => {
    setIsClicked(!isClicked); //toggles the create area
  };

  const handleOut = () => {
    setIsOut(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //create course
    if (type === "Course") createCourse(thingName);
    if (type === "Test") createTest(courseId, thingName); //If called from <Tests />, courseId is passed in order to create the test in the correct course
    if (type === "Student") createStudentUnderCourse(courseId, thingName); //If called from <Students />, courseId is passed and thingName is the student's email this time
    setThingName(""); //reset the thing name field
  };

  const uiLogic = () => {
    if (isClicked === false)
      return <PlusButton add={type} onClick={handleClick} />;
    if (isClicked === true && isOut === false)
      return (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-container">
            <TextInput
              label={ type === "Student" ? "Student's email" : `${type} name`}
              type="text"
              required
              onChange={handleChange}
              value={thingName}
              name="name"
            />
          </div>
          <div className="delete-container">
            <XButton onClick={handleOut} type="button" />
          </div>
          <div className="submit-container">
            <Plus type="submit" />
          </div>
        </form>
      );
    if (isOut) {
      setIsClicked(false);
      setIsOut(false);
      setThingName("");
      return <PlusButton add={type} onClick={handleClick} />;
    }
  };

  return <div className="create-area-container">{uiLogic()}</div>;
}