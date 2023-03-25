import "./plus-alone.style.scss";

export default function Plus({onClick, type}) {
  return (
    <button className="create-button" onClick={onClick} type={type}>
      <span className="plus">+</span>
    </button>
  );
}
