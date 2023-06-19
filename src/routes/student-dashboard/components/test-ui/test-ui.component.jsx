import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import {
  createStudentAnswersDoc,
  getAnswersDocCurrentQuestion,
  getQuestions,
  increaseCurrentQuestionFunction,
} from "../../../../utils/firebase/firebase-utils";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { useContext, useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/utilities";
import { AudioBlobContext } from "../../../../contexts/audioBlob/audioBlob.context";
import { TriesContext } from "../../../../contexts/tries/tries.context";
import Button from "../../../../components/button/button.component";
import sendAudioToWhisper from "../../../../api/client-utilities";
import { UserContext } from "../../../../contexts/user/user.context";

export default function TestUi() {
  //fetch courseId, testId and userId from context
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse ? currentCourse.courseId : "";
  const { currentTest } = useContext(TestContext);
  const { testId, name, isBegun } = currentTest || {}; // wait for currentTest to be set before getting testId and name
  const { currentUser } = useContext(UserContext);

  // Begin or Continue test button
  const [testBegun, setTestBegun] = useState(isBegun); //isBegun is gotten upon clicking <TestName/>

  // Question list and state for cycling through questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0); //default comes from DB

  // Get audio recording from mic component
  // audioBlob is the audio recording obtained in <Mic />. In mpeg format
  const { audioBlob, setAudioBlob } = useContext(AudioBlobContext);
  const { setTries, setHasRecorded } = useContext(TriesContext);

  // fetch Questions set by teacher
  useEffect(() => {
    //Function to fetch the test's questions
    const fetchQuestions = async () => {
      const questions = await getQuestions(courseId, testId);
      const questionsList = questions[0].questionsList;
      setQuestions(questionsList);
    };
    //Function to fetch the currentQuestion from DB
    const fetchCurrentQuestion = async () => {
      const currentQuestionDB = await getAnswersDocCurrentQuestion(
        courseId,
        currentUser.uid,
        testId
      );
      setCurrentQuestion(currentQuestionDB);
      //console.log("fetched currentQuestion index from DB: ", currentQuestionDB);
    };

    if (courseId && testId) {
      //only call fetchQuestions if both courseId and testId are truthy
      fetchQuestions().catch((err) => console.log(err));
    }

    if (courseId && testId && currentUser) {
      fetchCurrentQuestion().catch((err) => console.log(err));
    }
  }, [courseId, testId, currentUser]);

  const nextbuttonLogic = async () => {
    if (currentQuestion < questions.length - 1) {
        //if not the last question, allow next
        if (audioBlob) {
          // if the question is answered
          sendAudioToWhisper(audioBlob); // whisper endpoint
          await increaseCurrentQuestionFunction({
            courseId: courseId,
            studentId: currentUser.uid,
            testId: testId,
          });
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
            setCurrentQuestion(currentQuestion + 1); //local +1
            await increaseCurrentQuestionFunction({ //server +1
              courseId: courseId,
              studentId: currentUser.uid,
              testId: testId,
            });
            setAudioBlob(null); // reset audio blob
            setTries(0); // reset tries
            setHasRecorded(false); // reset hasRecorded
          }
        }
      } else if (currentQuestion === questions.length - 1) {
        // do nothing when last question is reached
      }
}

  // handle next question
  const handleNextButton = () => {
    nextbuttonLogic();
  };

  const handleBeginClick = async () => {
    setTestBegun(true);
    await createStudentAnswersDoc(courseId, currentUser.uid, testId); //creates the answer doc if it doesn't exist already.
  };

  if (audioBlob) console.log(audioBlob);

  const uiLogic = () => {
    return testBegun ? (
      <div className="test-ui-container">
        <header className="header">
          <span>
            {currentQuestion ? currentQuestion + 1 : "1"} of {questions.length}
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
        <Button onClick={handleBeginClick}>
          {isBegun ? "Continue Test" : "Begin Test"}
        </Button>
      </div>
    );
  };

  return <>{uiLogic()}</>;
}
