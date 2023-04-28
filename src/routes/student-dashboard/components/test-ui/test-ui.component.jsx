import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import { getQuestions } from "../../../../utils/firebase/firebase-utils";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { useContext, useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/utilities";

export default function TestUi() {
  //fetch courseId and testId from context
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse.courseId;
  const { currentTest } = useContext(TestContext);
  const { testId, name } = currentTest;

  // Question list and state for cycling through questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // fetch Questions set by teacher
  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getQuestions(courseId, testId);
      const questionsList = questions[0].questionsList;
      setQuestions(questionsList);
    };
    fetchQuestions().catch((err) => console.log(err));
  }, [courseId, testId]);

  // handle next question
  const handleNextButton = () => {

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    else if (currentQuestion === questions.length - 1) {
      
    }
  }

  return (
    <div className="test-ui-container">
      <header className="header">
        <span>{currentQuestion + 1} of {questions.length}</span>
        <h3 className="test-title">{capitalizeFirstLetterOfEachWord(name)} Test</h3>
        <span>Quit</span>
      </header>
      <div className="question-area">
        <strong>{questions[currentQuestion]}</strong>
      </div>
      <div className="response-area">
        <Mic />
      </div>
      <div className="footer">
        <button className="next-skip" onClick={handleNextButton} >Next</button>
      </div>
    </div>
  );
}