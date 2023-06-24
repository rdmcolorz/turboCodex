const gpt3ApiKey = "<apiKey>";

function sendResponse(messageData) {
  console.log('sending response from openai')
  browser.runtime.sendMessage(messageData).catch((error) => {
    console.error("Error sending message to background script:", error);
  });
}

browser.runtime.onMessage.addListener((message) => {
  console.log('start listening to injects')
  if (message.action === "injectCode") {
      console.log(message.code)
      browser.tabs.executeScript({ code: message.code })
      // .catch(error => {
      //   // Access the result array of elements here
      //   console.log(error);
      // })
  }
});


browser.runtime.onMessage.addListener((message) => {
  console.log('started listen')
  if (message.type === "gpt3Request") {
    fetchGpt3Response(message.prompt).then(response => {
      console.log(response)
      console.log(sendResponse({ type: "gpt3Response", response }));
    }).catch((error) => {
      console.error("Error fetching GPT-3 response:", error);
    });
    return true;
  }
});

async function fetchGpt3Response(prompt) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${gpt3ApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content":prompt}],
      temperature: 0
    })
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
  const data = await response.json();
  return data.choices[0]['message']['content'];
}