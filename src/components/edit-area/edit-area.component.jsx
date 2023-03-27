import { useState } from "react";
import { updateCourse, updateTest } from "../../utils/firebase/firebase-utils";
import Plus from "../plus-button/plus-alone.component";
import TextInput from "../text-input/text-input.component";
import XButton from "../x-button/x-button.component";
import "./edit-area.styles.scss";

export default function EditArea({ type, courseId, setEditClick, ...otherProps }) {
  //courseId is only passed if type is course
  const [thingName, setThingName] = useState(""); //course or test name
  const [isOut, setIsOut] = useState(false); //is the X button clicked? Return to create course or test
  const [isSubmitted, setIsSubmitted] = useState(false); //is the form submitted?

  const handleChange = (event) => {
    const { value } = event.target;
    setThingName(value); //set course name for ui
  };

  const handleOut = () => {
    setIsOut(true);
    console.log("isOut: " + isOut);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const { testId } = otherProps; //testId is only passed if type is test

    //edit course
    if (type === "Course") updateCourse(courseId, thingName);
    if (type === "Test") updateTest(courseId, testId, thingName); //If called from <Tests />, courseId is passed in order to update the test in the correct course
    setThingName(""); //reset the thing name field
  };

  const uiLogic = () => {
    if (isOut === false && isSubmitted === false)
      return (
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="input-container">
            <TextInput
              label={`${type} name`}
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
    if (isOut === true || isSubmitted === true) {
      setEditClick(false); //reset the edit click that comes from the <Course /> component
    }
  };

  return uiLogic();
}
