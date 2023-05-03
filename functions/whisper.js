/* eslint-disable no-unused-vars */
require("dotenv").config(); // to use .env file
const { Configuration, OpenAIApi } = require("openai");
const functions = require("firebase-functions");
const fs = require("fs"); // to read files

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.whisper = functions.https.onRequest(
  // call whisper api
  async (req, res) => {
    // Get the audio file or URL from the request body
    const audioFile = req.body.file;
    const audioUrl = req.body.url;

    // Set the parameters for the request
    const params = {
      fileType: "wav", // specify the file type
      diarization: false, // optional, set to true if you want speaker diarization
      numSpeakers: 1, // optional, set the number of speakers if using diarization
      url: audioUrl, // optional, set the URL of the audio file if using a URL instead of a file
      initialPrompt: "", // optional, set an initial prompt to teach the model phrases
      language: "en", // optional, set the language of the audio file
      task: "transcribe", // optional, set the task to transcribe or translate
    };

    // Send the request to the OpenAI API
    openai.whisper1
      .transcriptions(params, audioFile)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Send back the transcription as JSON
        res.status(200).json(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
        // Send back an error message as JSON
        res.status(500).json({ error: error.message });
      });
  }
);