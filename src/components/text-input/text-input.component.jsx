import "./text-input.styles.scss";

const TextInput = (props) => {
  const { label, ...otherSettings } = props; //otherSettings contains type, required, etc

  //If there's a label input, show a label tag.
  //If there's a value length on the textInput, set another 
  //className called shrink. Otherwise do not add a className.
  return (
    <div className="input-container">
      <input className="text-input" {...otherSettings} />
      {label && (
        <label
          className={`form-input-label ${
            otherSettings.value.length ? "shrink" : ""
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default TextInput;
