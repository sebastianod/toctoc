import Plus from "./plus-alone.component";
import "./plus-button.styles.scss";

const PlusButton = (props) => {
    const { add } = props; //create (word)

  return (
    <div className="add-container">
      <Plus />
      <h3 className="create-label">Create {add}</h3>
    </div>
  );
};

export default PlusButton;
