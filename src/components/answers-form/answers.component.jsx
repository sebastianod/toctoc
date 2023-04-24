import Button from "../button/button.component";    
import "./answers.styles.scss";

export default function Answers({value: answersList, onChange: handleAnswerInput, onSubmit: handleSubmit}) {
    return <form className="answers-form" onSubmit={handleSubmit}>
    <h4>Create or update answers: </h4>
    <textarea
      type="textarea"
      name="textValue"
      value={answersList}
      onChange={handleAnswerInput}
      className="answers-text-area"
      rows="6"
      cols="100"
    />
    <div className="submit-button-area">
      <Button buttonType="submit">Submit answers</Button>
    </div>
  </form>
}