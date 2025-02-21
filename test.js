let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let silenceTimer = null;
let lastSpeechTime = Date.now();
const silenceThreshold = 3000; // 3 seconds of silence

document.getElementById("startRecord").addEventListener("click", async () => {
  try {
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
        if (!stream) {
          console.error("Error: No stream received");
          return;
        }

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const destination = audioContext.createMediaStreamDestination();

        source.connect(destination);
        source.connect(audioContext.destination);

        mediaRecorder = new MediaRecorder(destination.stream, {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: 128000,
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
            lastSpeechTime = Date.now();
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioChunks.length > 0) {
            await processAudio();
          }

          audioChunks = [];
          stream.getTracks().forEach((track) => track.stop());
          audioContext.close();
        };

        mediaRecorder.start(1000); // Capture every second
        isRecording = true;

        document.getElementById("startRecord").disabled = true;
        document.getElementById("stopRecord").disabled = false;

        monitorSilence();
      }
    );
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

function monitorSilence() {
  silenceTimer = setInterval(async () => {
    if (!isRecording) return;

    const now = Date.now();
    if (now - lastSpeechTime > silenceThreshold) {
      mediaRecorder.stop(); // Stop recording on silence
      await processAudio();
      mediaRecorder.start(1000); // Restart recording
    }
  }, 1000);
}

async function processAudio() {
  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

  try {
    console.log("Transcribing...");
    const text = await transcribeAudio(audioBlob);
    console.log("Transcription received:", text);

    // Display the transcription dynamically
    const transcriptionDiv = document.getElementById("transcription");
    transcriptionDiv.innerHTML += `<p>${text}</p>`;
  } catch (error) {
    console.error("Transcription failed:", error);
  }
}

async function getApiKey() {
  const response = await fetch(chrome.runtime.getURL("config.json"));
  const config = await response.json();
  return config.OPENAI_API_KEY;
}

// async function transcribeAudio(audioBlob) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(audioBlob);
//     reader.onloadend = async () => {
//       try {
//         const apiKey = await getApiKey();

//         const response = await fetch(
//           "https://api.openai.com/v1/audio/transcriptions",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               model: "whisper-1",
//               file: reader.result?.split(",")[1],
//               language: "en",
//             }),
//           }
//         );

//         if (!response.ok) {
//           console.log(response);
//           throw new Error("Failed to transcribe audio");
//         }

//         const data = await response.json();
//         resolve(data.text || "No transcription found.");
//       } catch (error) {
//         reject(error);
//       }
//     };
//   });
// }

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
          Authorization: `Bearer ${apiKey}`, // ✅ Correct Auth Header
        },
        body: formData, // ✅ Properly sending multipart/form-data
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
