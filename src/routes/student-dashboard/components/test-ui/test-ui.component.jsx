import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";
import { getQuestions } from "../../../../utils/firebase/firebase-utils";
import { CourseContext } from "../../../../contexts/course/course.context";
import { TestContext } from "../../../../contexts/test-context/test.context";
import { useContext, useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/utilities";

export default function TestUi() {
  const { currentCourse } = useContext(CourseContext);
  const courseId = currentCourse.courseId;
  const { currentTest } = useContext(TestContext);
  const { testId, name } = currentTest;
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // fetch Questions set by teacher
  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getQuestions(courseId, testId);
      const questionsList = questions[0].questionsList;
      setCurrentQuestions(questionsList);
    };
    fetchQuestions().catch((err) => console.log(err));
  }, [courseId, testId]);

  return (
    <div className="test-ui-container">
      <header className="header">
        <span>1 of x</span>
        <h3 className="test-title">{capitalizeFirstLetterOfEachWord(name)} Test</h3>
        <span>Quit</span>
      </header>
      <div className="question-area">
        <strong>{currentQuestions[0]}</strong>
      </div>
      <div className="response-area">
        <Mic />
      </div>
      <div className="footer">
        <button className="next-skip">Next</button>
      </div>
    </div>
  );
}
