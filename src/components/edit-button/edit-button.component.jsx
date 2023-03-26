import "./edit-button.styles.scss"
import EditSvg from "../../assets/edit.svg";

export default function Edit({onClick, type}) {
  return (
    <button className="edit-button" onClick={onClick} type={type}>
      <img className="edit-svg" src={EditSvg} alt="edit" />
    </button>
  );
}