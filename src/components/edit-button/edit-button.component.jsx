import "./edit-button.styles.scss"
import EditSvg from "../../assets/edit.svg";

export default function Edit({onClick}) {
  return (
    <button className="edit-button" onClick={onClick}>
      <img className="edit-svg" src={EditSvg} alt="edit" />
    </button>
  );
}