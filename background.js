chrome.runtime.onInstalled.addListener(() => {
  console.log("Audio Recording Extension installed");
});

// You can add message listeners here to communicate between popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startRecording") {
    // Handle start recording
  } else if (message.action === "stopRecording") {
    // Handle stop recording
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TEXT_EXTRACTED") {
    console.log("Text received from content script:", request.text);
    chrome.tabs.query({ url: "http://localhost:5173/" }, function (tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        tabs.forEach((tab) => {
          console.log("Tab ID:", tab.id);
          // Send a message to the specific tab
          chrome.tabs.sendMessage(tab.id, {
            action: "fromExtension",
            data: "Hello from Chrome Extension",
          });
        });
      }
    });
    // Store it in chrome.storage for retrieval by the React app
    chrome.storage.local.set({ extractedText: request.text });

    sendResponse({ status: "Stored successfully" });
    // // In your extension's content script or background script
    // window.postMessage({ type: "FROM_EXTENSION", data: request.text }, "*");
  }
});

// chrome.runtime.onClicked.addListener(function (tab) {
//   chrome.tabs.query({}, function (tabs) {
//     console.log("opened tabs :", tabs.length);
//     // The Query {} was missing here
//     // for (var i = 0; i < tabs.length; i++) {
//     //   chrome.tabs.executeScript(tabs[i].id, { file: "jquery-2.1.0.min.js" });
//     //   chrome.tabs.executeScript(tabs[i].id, { file: "change.js" });
//     // }
//   });
// });

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.type === "TEXT_EXTRACTED") {
//     console.log("Text received from content script:", request.text);

//     sendResponse({ status: "Stored successfully" });
//     // In your extension's content script or background script
//     window.postMessage({ type: "FROM_EXTENSION", data: request.text }, "*");
//   }

//   const fromDomainA = await chrome.storage.local.get("fromDomainA");
//   console.log(fromDomainA);
// });
