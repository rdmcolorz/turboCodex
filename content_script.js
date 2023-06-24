const gpt3ApiKey = "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";

function handleMessageFromPopup(message, sender, sendResponse) {
  console.log("got message from popup")
  if (message.type === "gpt3Request") {
    fetchGpt3Response(message.prompt, gpt3ApiKey)
      .then((response) => {
        console.log("Sending response from content_script.js:", response);
        sendResponse({ type: "gpt3Response", response });
      })
      .catch((error) => {
        console.error("Error fetching GPT-3 response:", error);
      });
  }
  return true; // Keep the channel open for async response
}