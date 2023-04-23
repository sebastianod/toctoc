import "./test-ui.styles.scss";
import Mic from "../mic/mic.component";

export default function TestUi() {
  return (
    <div className="test-ui-container">
      <header className="header">
        <span>1 of x</span>
        <span>Quit</span>
      </header>
        <div className="question-area">
            <span>Question word</span>
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
