import "./mic.styles.scss";
import MicSvg from "../../../../assets/mic.svg";
import MicUnavailableSvg from "../../../../assets/mic-unavailable.svg";
import { useState } from "react";

export default function Mic() {
  const [isRecording, setIsRecording] = useState(false); //true when recording
  const [hasRecorded, setHasRecorded] = useState(false); //true when recording has been done
  //const [isNewQuestion, setIsNewQuestion] = useState(false); //To go in <TestUi />. Resets tries to 0 when next is pressed.

  const maxTries = 2;
  const [tries, setTries] = useState(0); //2 max tries

  const handleMicClick = () => {
    if (tries < maxTries) {
      if (isRecording === true ) {
        setIsRecording(!isRecording);
        setHasRecorded(true);
        setTries(tries + 1);
      }
      if (isRecording === false) {
        setIsRecording(!isRecording);
      }
    }
    if (tries === maxTries) {
      setIsRecording(false);
    }
  };

  console.log("tries: ", tries, "isRecording: ", isRecording);

  const uiLogic = () => {
    if (tries < maxTries && isRecording === false && hasRecorded === false) {
      //Not recording and hasn't saved, default state
      return (
        <div className="mic-container">
          <button className="mic available" onClick={handleMicClick}>
            <img className="mic-svg" src={MicSvg} alt="mic" />
          </button>
        </div>
      );
    }

    if (tries < maxTries && isRecording === true) {
      //Recording
      return (
        <div className="mic-container">
          <button className="mic recording" onClick={handleMicClick}>
            <div className="recording-box"></div>
          </button>
        </div>
      );
    }

    if (tries < maxTries && isRecording === false && hasRecorded === true) {
      //Show play button and allow recording again
      return (
        <div className="mic-container">
          <div className="play-container">▶️</div>
          <button className="mic available" onClick={handleMicClick}>
            <img className="mic-svg" src={MicSvg} alt="mic" />
          </button>
        </div>
      );
    }

    if (tries === maxTries && isRecording === false) {
      // disable mic but allow play of last recording
      return (
        <div className="mic-container">
          <div className="play-container">▶️</div>
          <button className="mic unavailable" onClick={handleMicClick}>
            <img className="mic-svg" src={MicUnavailableSvg} alt="mic" />
          </button>
        </div>
      );
    }
  };

  return uiLogic();
}
