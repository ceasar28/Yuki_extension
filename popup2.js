import { io } from "/socket.js";
const socket = io("http://212.28.187.85:3112");

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

socket.on("onMessage", (message) => {
  console.log("Received message:", message);
});

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioContext, analyser, source, stream;
const silenceThreshold = 4; // 4 seconds of silence
const volumeThreshold = 0.02; // Minimum volume to consider as sound

document.getElementById("startRecord").addEventListener("click", async () => {
  try {
    chrome.tabs.query({ url: "http://localhost:5173/" }, function (tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        tabs.forEach((tab) => {
          console.log("Tab ID:", tab.id);
          const transcriptionDiv = document.getElementById("tabId");
          transcriptionDiv.innerHTML += `<p>Tab ID: ${tab.id}</p>`;
        });
      }
    });

    stream = await captureTabAudio();
    if (!stream) {
      console.error("Error: No stream received");
      return;
    }

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    source.connect(audioContext.destination); // Ensure audio is played back
    analyser.fftSize = 2048;

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 128000,
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      if (audioChunks.length > 0) {
        await processAudio();
      }
      audioChunks = [];
    };

    mediaRecorder.start();
    isRecording = true;

    document.getElementById("startRecord").disabled = true;
    document.getElementById("stopRecord").disabled = false;

    monitorAudio();
  } catch (err) {
    console.error("Error capturing tab audio:", err);
  }
});

document.getElementById("stopRecord").addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    isRecording = false;
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
  }
});

async function captureTabAudio() {
  return new Promise((resolve, reject) => {
    chrome.tabCapture.capture(
      {
        audio: true,
        video: false,
        audioConstraints: {
          mandatory: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        },
      },
      (stream) => {
        if (stream) {
          resolve(stream);
        } else {
          reject(new Error("No audio stream available from the tab"));
        }
      }
    );
  });
}

function monitorAudio() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let silenceStartTime = null;

  const checkVolume = () => {
    if (!isRecording) return;

    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.abs(dataArray[i] - 128); // Calculate volume
    }
    const averageVolume = sum / bufferLength;

    if (averageVolume > volumeThreshold) {
      // Sound detected
      if (silenceStartTime !== null) {
        console.log("Sound detected, resuming recording");
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: 128000,
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioChunks.length > 0) {
            await processAudio();
          }
          audioChunks = [];
        };

        mediaRecorder.start();
        silenceStartTime = null;
      }
    } else {
      // Silence detected
      if (silenceStartTime === null) {
        silenceStartTime = Date.now();
      } else if (Date.now() - silenceStartTime > silenceThreshold * 1000) {
        console.log("Silence detected, stopping recording");
        mediaRecorder.stop();
        silenceStartTime = null;
      }
    }

    requestAnimationFrame(checkVolume);
  };

  checkVolume();
}

async function processAudio() {
  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

  try {
    console.log("Transcribing...");
    const text = await transcribeAudio(audioBlob);
    console.log("Transcription received:", text);

    chrome.tabs.query({ url: "http://localhost:5173/" }, function (tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        tabs.forEach((tab) => {
          console.log("Tab ID:", tab.id);
          const payload = { tabId: tab.id, text };
          socket.emit("sendTranscription", payload);
        });
      }
    });

    // Send the text to the background script
    chrome.runtime.sendMessage(
      { type: "TEXT_EXTRACTED", text: text },
      (response) => {
        console.log("Background script response:", response);
      }
    );
  } catch (error) {
    console.error("Transcription failed:", error);
  }
}

async function transcribeAudio(audioBlob) {
  try {
    const apiKey = await getApiKey();
    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("file", audioBlob, "audio.webm");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to transcribe audio");
    }

    const data = await response.json();
    return data.text || "No transcription found.";
  } catch (error) {
    console.error("❌ Transcription failed:", error);
    return "";
  }
}

async function getApiKey() {
  const response = await fetch(chrome.runtime.getURL("config.json"));
  const config = await response.json();
  return config.OPENAI_API_KEY;
}
