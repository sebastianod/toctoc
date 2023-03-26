import "./delete-button.styles.scss";
import DeleteSvg from "../../assets/delete.svg";

export default function Delete({onClick}) {
  return (
    <button className="delete-button" onClick={onClick}>
      <img className="delete-svg" src={DeleteSvg} alt="delete" />
    </button>
  );
}