import "./mic.styles.scss";
import MicSvg from "../../../../assets/mic.svg";

export default function Mic() {
  return (
    <div className="mic-container">
      <button className="mic">
        <img className="mic-svg" src={MicSvg} alt="mic" />
      </button>
    </div>
  );
}
