import "./plus-button.styles.scss";

const PlusButton = (props) => {
    const { add } = props; //create (thing)

  return (
    <div className="add-container">
      <button className="create-button">
        <span className="plus">+</span>
      </button>
      <h3 className="create-label">Create {add}</h3>
    </div>
  );
};

export default PlusButton;
