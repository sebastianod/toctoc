import "./mic.styles.scss";
import MicSvg from "../../../../assets/mic.svg";

export default function Mic() {

  const handleClick = () => {
    console.log("Mic clicked");
  };

  return (
    <div className="mic-container">
      <button className="mic" onClick={handleClick}>
        <img className="mic-svg" src={MicSvg} alt="mic" />
      </button>
    </div>
  );
}
