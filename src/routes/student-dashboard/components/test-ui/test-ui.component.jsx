import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import {
  createStudentAnswersDoc,
  getAnswersDocCurrentQuestion,
  getQuestions,
  updateCurrentQuestionFunction,
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
  const { currentTest, setCurrentTest } = useContext(TestContext);
  const { testId, name, isBegun } = currentTest || {}; // wait for currentTest to be set before getting testId and name
  const { currentUser } = useContext(UserContext);

  // Begin or Continue test button
  const [isLoadingAudio, setIsLoadingAudio] = useState(null);

  //error state
  const [isError, setIsError] = useState(false);

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

      console.log("fetched currentQuestion index from DB: ", currentQuestionDB);
    };

    if (courseId && testId) {
      //only call fetchQuestions if both courseId and testId are truthy
      fetchQuestions().catch((err) => console.log(err));
    }

    if (courseId && testId && currentUser) {
      fetchCurrentQuestion().catch((err) => console.log(err));
    }
  }, [courseId, testId, currentUser, setCurrentQuestion]);

  const nextbuttonLogic = async (e) => {
    if (currentQuestion < questions.length) {
      //if not the last question, allow next
      setIsLoadingAudio(true);
      if (audioBlob) {
        // if the question is answered
        const transcript = await sendAudioToWhisper(audioBlob);
        const updateValues = await updateCurrentQuestionFunction({
          //status 200 or 500
          courseId: courseId,
          studentId: currentUser.uid,
          testId: testId,
          transcript: transcript.text,
        });
        // if updateValues fails, don't move on to the next question
        if (!updateValues.data.status === 200) {
          e.preventDefault();
          setAudioBlob(null); // reset audio blob
          setTries(0); // reset tries
          setHasRecorded(false); // reset hasRecorded
          setIsLoadingAudio(false);
          setIsError(true);
        }

        console.log(updateValues.data.status);
        setCurrentQuestion(currentQuestion + 1);
        setAudioBlob(null); // reset audio blob
        setTries(0); // reset tries
        setHasRecorded(false); // reset hasRecorded
        setIsLoadingAudio(false);
      } else if (audioBlob === null) {
        // if the question is skipped
        const skip = window.confirm(
          "Are you sure you want to skip this question?"
        );
        if (skip) {
          const updateValues = await updateCurrentQuestionFunction({
            courseId: courseId,
            studentId: currentUser.uid,
            testId: testId,
            transcript: "", //sends an empty string if skipped
          });
          if (!updateValues.data.status === 200) {
            e.preventDefault();
            setAudioBlob(null);
            setTries(0);
            setHasRecorded(false);
            setIsLoadingAudio(false);
            setIsError(true);
          }
          console.log(updateValues.data.status);
          setCurrentQuestion(currentQuestion + 1);
          setAudioBlob(null);
          setTries(0);
          setHasRecorded(false);
          setIsLoadingAudio(false);
        }
      }
    } else if (currentQuestion === questions.length) {
      // do nothing when last question is reached
    }
  };

  // handle next question
  const handleNextButton = (event) => {
    nextbuttonLogic(event);
  };

  const handleBeginClick = async () => {
    try {
      await createStudentAnswersDoc(courseId, currentUser.uid, testId); //creates the answer doc if it doesn't exist already.
      setCurrentTest((prevTest) => ({
        ...prevTest, // spread the previous state to keep the other properties
        isBegun: true,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const nameExists = name?.length > 0;

  console.log("currentQ: ", currentQuestion);
  console.log("Current test: ", currentTest);

  const uiLogic = () => {
    return isBegun ? (
      <div className="test-ui-container">
        <header className="header">
          <span>
            {currentQuestion < questions.length
              ? `${currentQuestion + 1} of ${questions.length}`
              : "Finished"}
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
          <span className="loading-state">
            {isLoadingAudio ? "Loading..." : null}
          </span>
          <strong>
            {isError ? "There was an error, please try again." : null}
          </strong>
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

  return <>{nameExists ? uiLogic() : <span>Loading...</span>}</>;
}
