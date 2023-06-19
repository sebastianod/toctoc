export default async function sendAudioToWhisper(audioFile) {
  // convert the blob to a file object
  const audioFileObject = new File([audioFile], "file", {
    type: "audio/mpeg",
  });
  // create a form data object
  const formData = new FormData();
  // append the file object as a blob
  formData.append("file", audioFileObject, "file");
  // create a headers object
  const headers = new Headers();
  // delete or assign the content-type property
  delete headers["Content-Type"];
  // or
  headers["Content-Type"] = "multipart/form-data";
  // send the request with fetch
  const result = await fetch(
    "https://us-central1-speech-grading.cloudfunctions.net/whisper",
    {
      method: "POST",
      // use the headers object
      headers: headers,
      body: formData,
    }
  );
    // try catch block. Send audio and receive transcript
    try {
      const data = await result.json();
      return data; // return the transcript.
    } catch (error) {
        console.log(error);
    }
}
