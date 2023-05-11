import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import { getQuestions } from "../../../../utils/firebase/firebase-utils";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { useContext, useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/utilities";
import { AudioBlobContext } from "../../../../contexts/audioBlob/audioBlob.context";
import { TriesContext } from "../../../../contexts/tries/tries.context";

export default function TestUi() {
  //fetch courseId and testId from context
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse.courseId;
  const { currentTest } = useContext(TestContext);
  const { testId, name } = currentTest;

  // Question list and state for cycling through questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    fetchQuestions().catch((err) => console.log(err));
  }, [courseId, testId]);

  // send audio to whisper
  const sendAudioToWhisper = async (audioFile) => {
    // convert the blob to a file object
    const audioFileObject = new File([audioFile], "file", {
      type: "audio/mpeg",
    });
    // create a form data object
    const formData = new FormData();
    // append the file object as a blob
    formData.append("file", audioFileObject, "file");
    // create a headers object
    const headers = new Headers();
    // delete or assign the content-type property
    delete headers["Content-Type"];
    // or
    headers["Content-Type"] = "multipart/form-data";
    // send the request with fetch
    const result = await fetch(
      "https://us-central1-speech-grading.cloudfunctions.net/whisper",
      {
        method: "POST",
        // use the headers object
        headers: headers,
        body: formData,
      }
    );
    const data = await result.json();
    console.log(data);
  };

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

  if (audioBlob) console.log(audioBlob);

  return (
    <div className="test-ui-container">
      <header className="header">
        <span>
          {currentQuestion + 1} of {questions.length}
        </span>
        <h3 className="test-title">
          {capitalizeFirstLetterOfEachWord(name)} Test
        </h3>
        <span>Quit</span>
      </header>
      <div className="question-area">
        <strong>{questions[currentQuestion]}</strong>
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
  );
}
