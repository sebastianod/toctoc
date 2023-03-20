import "./plus-button.styles.scss";

const PlusButton = (props) => {
    const { name } = props; //create (thing)

  return (
    <div className="add-container">
      <button className="create-button">
        <span className="plus">+</span>
      </button>
      <h3 className="create-label">Create {name}</h3>
    </div>
  );
};

export default PlusButton;
