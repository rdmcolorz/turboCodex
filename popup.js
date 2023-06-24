document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("inputBox");
  const displayBox = document.getElementById("displayBox");
  const submitButton = document.getElementById("submitButton");
  const pushCodeButton = document.getElementById("pushCodeButton");
  const clearCodeButton = document.getElementById("clearCodeButton");

  submitButton.addEventListener("click", () => {
    const prompt = inputBox.value;
    sendMessageToContentScript({ type: "gpt3Request", prompt });
  });

  // pushCodeButton.addEventListener("click", () => {
  //   console.log('setting code to fiddle')
  //   browser.tabs.query({ active: true, currentWindow: true })
  //   .then(tabs => {
  //     const activeTab = tabs[0];
  //     browser.runtime.sendMessage(activeTab.id, {
  //       action: "injectCode",
  //       code: "window.onload = function() {document.querySelectorAll('.CodeMirror')[0].CodeMirror.setValue('Your new code here yeez')};"
  //     }).catch(error => {
  //       console.log(error)
  //     });
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // });

  // @todo This is throwing errors when clicked in the extension
  // Pushes code from extension to CodeMirror
  pushCodeButton.addEventListener("click", () => {
    console.log('pushing code')
      result = browser.tabs.executeScript({
        code: "document.querySelectorAll('.CodeMirror')[0].CodeMirror.setValue('Your new code here yeez')"
      })
      console.log(result)
  });

  // @todo Not working...
  // Clears code in CodeMirror
  clearCodeButton.addEventListener("click", () => {
    console.log("clearing code")
    browser.tabs.executeScript({ code: "document.querySelectorAll('.CodeMirror')" })
      .then(result => {
        // Access the result array of elements here
        console.log(result);
      })
  });

  browser.runtime.onMessage.addListener((message) => {
    console.log("Message received in popup.js:", message);
    if (message.type === "gpt3Response") {
      console.log("got message in response")
      processGpt3Response(message.response);
    }
  });

  function sendMessageToContentScript(messageData) {
    browser.runtime.sendMessage(messageData).catch((error) => {
      console.error("Error sending message to background script:", error);
    });
  }

function processGpt3Response(response) {
  console.log("getting to displaybox")
  browser.storage.local.set({"response": response}).then(() => {
    displayBox.textContent = response;
  });
}
})

// Add an event listener to the browserAction onClicked event
browser.browserAction.onClicked.addListener(() => {
  // Retrieve the stored data
  browser.storage.local.get().then((result) => {
    // Access the stored data from the result object
    const storedData = result.response; // Replace "keyName" with the actual key used for storing the data

    // Process the retrieved data
    displayBox.textContent = response;
  }).catch((error) => {
    // Handle any errors that occur during retrieval
    console.error(error);
  });
});
