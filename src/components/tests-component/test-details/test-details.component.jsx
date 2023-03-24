import { useContext, useState } from "react";
import { TestContext } from "../../../contexts/test-context/test.context";
import Button from "../../button/button.component";
import "./test-details.styles.scss";

export default function TestDetails() {
  const { currentTest } = useContext(TestContext);
  const { name } = currentTest;

  //setting the answers text area
  const [answersList, setAnswersList] = useState(
    "Write* answers* here* separated* by* a* star*"
  );
  //submmitting answers
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const handleAnswerInput = (e) => {
    e.preventDefault();
    const value = e.target.value
    setAnswersList(value);
  };
console.log(answersList);

  function handleSubmit (e) {
    e.preventDefault(); //prevent page refresh, without this, the url changes to the action url and the page breaks
    return setSubmittedAnswers(answersList);
  }
  console.log(`Submitted ${name} test answers: `, submittedAnswers);

  return (
    <div className="test-details-container">
      <h3 className="test-name">{name} </h3>

      <form className="answers-form" onSubmit={handleSubmit}>
        <h4>Answers: </h4>
        <textarea
          type="textarea"
          name="textValue"
          value={answersList}
          onChange={handleAnswerInput}
          className="answers-text-area"
          rows="4"
          cols="50"
        />
        <div className="submit-button-area">
          <Button buttonType="submit">Submit answers</Button>
        </div>
      </form>
    </div>
  );
}
