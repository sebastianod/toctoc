import "./mic.styles.scss";
import MicSvg from "../../../../assets/mic.svg";
import MicUnavailableSvg from "../../../../assets/mic-unavailable.svg";
import { useState, useRef } from "react";
import { AudioBlobContext } from "../../../../contexts/audioBlob/audioBlob.context";
import { useContext } from "react";
import { TriesContext } from "../../../../contexts/tries/tries.context";

export default function Mic() {
  const [isRecording, setIsRecording] = useState(false); //true when recording
  //const [isNewQuestion, setIsNewQuestion] = useState(false); //To go in <TestUi />. Resets tries to 0 when next is pressed.

  const maxTries = 2;
  const { tries, setTries, hasRecorded, setHasRecorded } = useContext(TriesContext); //calling the setTries function from the triesContext

  //useRef is a React Hook that lets you reference a value that’s not needed for rendering.
  //The recorded audio data is stored in an array of audio chunks. We'll only have one.

  const mediaRecorder = useRef(null); //reference to the MediaRecorder object
  const audioChunks = useRef([]); //array to store the audio data chunks
  const audioBlobRecording = useRef(null); //blob to store the final audio data
  const { audioBlob, setAudioBlob } = useContext(AudioBlobContext); //calling the setAudioBlob function from the AudioBlobContext

  const handleMicClick = () => {
    if (tries < maxTries) {
      if (isRecording === true) {
        setIsRecording(!isRecording);
        setHasRecorded(true);
        setTries(tries + 1);
        mediaRecorder.current.stop(); //stop recording and trigger the dataavailable event
      }
      if (isRecording === false) {
        setIsRecording(!isRecording);
        startRecording(); //start recording and create a new MediaRecorder object
      }
    }
    if (tries === maxTries) {
      setIsRecording(false);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true }) //request permission to access the microphone
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream); //create a new MediaRecorder object with the stream
        mediaRecorder.current.start(); //start recording
        mediaRecorder.current.ondataavailable = (e) => {
          //when data is available, push it to the audioChunks array
          audioChunks.current.push(e.data);
          if (mediaRecorder.current.state === "inactive") {
            //when recording is stopped, create a blob from the audioChunks array
            audioBlobRecording.current = new Blob(audioChunks.current, {
              type: "audio/mpeg",
            });
            audioChunks.current = []; //reset the audioChunks array
            setAudioBlob(audioBlobRecording.current); //set the audioBlob value in the AudioBlobContext
          }
        };
      })
      .catch((err) => {
        console.error(err); //handle any errors
      });
  };

  const playAudio = () => {
    if (audioBlob) {
      //if there is an audioBlob available, check if it is a Blob object
      if (audioBlob instanceof Blob) {
        //if it is a Blob object, create a URL from it and play it using an audio element
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        //if it is not a Blob object, log an error message
        console.error("Invalid argument for URL.createObjectURL()");
      }
    }
  };

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
          <div className="play-container" onClick={playAudio}>
            ▶️
          </div>
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
          <div className="play-container" onClick={playAudio}>
            ▶️
          </div>
          <button className="mic unavailable" onClick={handleMicClick}>
            <img className="mic-svg" src={MicUnavailableSvg} alt="mic" />
          </button>
        </div>
      );
    }
  };

  return uiLogic();
}
