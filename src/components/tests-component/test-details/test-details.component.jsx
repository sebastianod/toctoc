import { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../contexts/test-context/test.context";
import { CourseContext } from "../../../contexts/course/course.context";
import {
  processListOfSentences,
  hasEmptynessBetweenStars,
} from "../../../utils/utilities";
import "./test-details.styles.scss";
import Answers from "../../answers-form/answers.component";
import { createOrUpdateTestQuestions, getQuestions } from "../../../utils/firebase/firebase-utils";

export default function TestDetails() {
  const { currentTest } = useContext(TestContext); //getting the current test
  const { currentCourse } = useContext(CourseContext); //getting the current course

  const courseId = currentCourse && currentCourse.courseId; //needed to create the test questions, to give the db path

  //const { name, testId } = currentTest;
  const name = currentTest && currentTest.name;
  const testId = currentTest && currentTest.testId;

  const [answersList, setAnswersList] = useState(
    //setting the answers text area
    "Write* questions* here* separated* by* a* star"
  );
  const [submittedAnswers, setSubmittedAnswers] = useState([]); //submmitting answers
  const [ currentAnswers, setCurrentAnswers ] = useState([]); //current answers in the db

  const handleAnswerInput = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setAnswersList(value);
  };

  async function handleSubmit(e) {
    e.preventDefault(); //prevent page refresh, without this, the url changes to the action url and the page breaks

    if (hasEmptynessBetweenStars(answersList)) {
      //prevents submission of empty spaces between stars
      return alert("Please remove empty spaces between stars");
    }

    const processedAnswers = processListOfSentences(answersList); //process the raw answersList to an array of sentences delimitted by a star

    //create test questions
    await createOrUpdateTestQuestions(courseId, testId, processedAnswers);


    return setSubmittedAnswers(processedAnswers);
  }

  useEffect(()=>{
    const fetchQuestions = async () => {
      const questions = await getQuestions(courseId, testId);
      const questionsList = questions[0].questionsList;
      setCurrentAnswers(questionsList);
    }
    fetchQuestions()
    .catch(err => console.log(err));
  }, [courseId, testId, submittedAnswers]);


  const showCurrentAnswers = (currentAnswers) => {
    return currentAnswers.map((answer, index) => {
      return <span key={index}>{answer}* </span>;
    });
  };

  console.log("current answers in db: ", currentAnswers);

  return (
    <div className="test-details-container">
      <h3 className="test-name">{name} </h3>

      <Answers
        value={answersList}
        onChange={handleAnswerInput}
        onSubmit={handleSubmit}
      />
      <div className="current-answers-area">
        <h4>Current Questions: </h4>
        {showCurrentAnswers(currentAnswers)}
      </div>
    </div>
  );
}
