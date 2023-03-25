import "./x-button.styles.scss";

export default function XButton({onClick, type}) {
    return (
      <button className="delete-button" onClick={onClick} type={type}>
        <span className="delete">x</span>
      </button>
    );
  }