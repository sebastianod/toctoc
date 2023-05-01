import { createContext, useState } from "react";

export const AudioBlobContext = createContext({
  setAudioBlob: () => null,
  audioBlob: null,
});

export const AudioBlobProvider = ({ children }) => {
  const [audioBlob, setAudioBlob] = useState(null); //there's no audioBlob by default
  const value = { audioBlob, setAudioBlob }; //calling the values we want to give out

  return (
    <AudioBlobContext.Provider value={value}>
      {children}
    </AudioBlobContext.Provider>
  );
};
