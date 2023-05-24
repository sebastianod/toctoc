import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import { getQuestions } from "../../../../utils/firebase/firebase-utils";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { useContext, useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/utilities";
import { AudioBlobContext } from "../../../../contexts/audioBlob/audioBlob.context";
import { TriesContext } from "../../../../contexts/tries/tries.context";
import Button from "../../../../components/button/button.component";
import sendAudioToWhisper from "../../../../api/client-utilities";

export default function TestUi() {
  //fetch courseId and testId from context
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse ? currentCourse.courseId : "";
  const { currentTest } = useContext(TestContext);
  const { testId, name } = currentTest || {}; // wait for currentTest to be set before getting testId and name

  // Begin/Continue test button
  const [isBegun, setIsBegun] = useState(false); //False DB value. DB is true; answers doc would have been created.

  // Question list and state for cycling through questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0); //default comes from DB

  // Get audio recording from mic component
  // audioBlob is the audio recording obtained in <Mic />. In mpeg format
  const { audioBlob, setAudioBlob } = useContext(AudioBlobContext);
  const { setTries, setHasRecorded } = useContext(TriesContext);

  // fetch Questions set by teacher
  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getQuestions(courseId, testId);
      const questionsList = questions[0].questionsList;
      setQuestions(questionsList);
    };
    console.log("before if statement", courseId, testId); //log the values before the if statement
    if (courseId && testId) {
      //only call fetchQuestions if both courseId and testId are truthy
      fetchQuestions().catch((err) => console.log(err));
      console.log("after if statement", courseId, testId); //log the values after the if statement
      console.log("fetchQuestions called");
    }
  }, [courseId, testId]);

  // handle next question
  const handleNextButton = () => {
    if (currentQuestion < questions.length - 1) {
      //if not the last question, allow next
      if (audioBlob) {
        // if the question is answered
        sendAudioToWhisper(audioBlob);
        setCurrentQuestion(currentQuestion + 1);
        setAudioBlob(null); // reset audio blob
        setTries(0); // reset tries
        setHasRecorded(false); // reset hasRecorded
      } else if (audioBlob === null) {
        // if the question is skipped
        const skip = window.confirm(
          "Are you sure you want to skip this question?"
        );
        if (skip) {
          setCurrentQuestion(currentQuestion + 1);
          setAudioBlob(null); // reset audio blob
          setTries(0); // reset tries
          setHasRecorded(false); // reset hasRecorded
        }
      }
    } else if (currentQuestion === questions.length - 1) {
      // do nothing when last question is reached
    }
  };

  const handleBeginClick = () => {
    setIsBegun(true);
  }

  if (audioBlob) console.log(audioBlob);

  const uiLogic = () => {
    return isBegun ? (
      <div className="test-ui-container">
        <header className="header">
          <span>
            {currentQuestion + 1} of {questions.length}
          </span>
          <h3 className="test-title">
            {name ? capitalizeFirstLetterOfEachWord(name) : ""} Test
          </h3>
          <span>Quit</span>
        </header>
        <div className="question-area">
          <strong>{questions ? questions[currentQuestion] : ""}</strong>
        </div>
        <div className="response-area">
          <Mic />
        </div>
        <div className="footer">
          <button className="next-skip" onClick={handleNextButton}>
            Next
          </button>
        </div>
      </div>
    ) : (
      <div className="welcome-test">
        <h3 className="test-title">
          {name ? capitalizeFirstLetterOfEachWord(name) : ""} Test
        </h3>
        <Button onClick={handleBeginClick}>Begin Test</Button>
      </div>
    );
  };

  return <>{uiLogic()}</>;
}
