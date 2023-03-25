import { useContext, useState } from "react";
import { TestContext } from "../../../contexts/test-context/test.context";
import {
  processListOfSentences,
  hasEmptynessBetweenStars,
} from "../../../utils/utilities";
import "./test-details.styles.scss";
import Answers from "../../answers-form/answers.component";

export default function TestDetails() {
  const { currentTest } = useContext(TestContext);
  const { name } = currentTest;
  const [answersList, setAnswersList] = useState(
    //setting the answers text area
    "Write* answers* here* separated* by* a* star*"
  );
  const [submittedAnswers, setSubmittedAnswers] = useState([]); //submmitting answers

  const handleAnswerInput = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setAnswersList(value);
  };
  console.log(answersList);

  function handleSubmit(e) {
    e.preventDefault(); //prevent page refresh, without this, the url changes to the action url and the page breaks

    if (hasEmptynessBetweenStars(answersList)) {
      //prevents submission of empty spaces between stars
      return alert("Please remove empty spaces between stars");
    }

    const processedAnswers = processListOfSentences(answersList); //process the raw answersList to an array of sentences delimitted by a star
    return setSubmittedAnswers(processedAnswers);
  }
  console.log(`Submitted ${name} test answers: `, submittedAnswers);

  return (
    <div className="test-details-container">
      <h3 className="test-name">{name} </h3>

      <Answers
        value={answersList}
        onChange={handleAnswerInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
