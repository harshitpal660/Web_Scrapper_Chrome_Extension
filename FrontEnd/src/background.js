// import { measureMemory } from "vm";
import { AICall } from "./OpenAI";
console.log("backgroundReact");
chrome.runtime.onMessage.addListener(function a(message, sender, sendResponse) {
  if (message.action === "openContent") {
    // Send a message to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { action: "open" });
    });
  } else if (message.action === "closeContent") {
    // Send a message to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { action: "close" });
    });
  }
});

chrome.runtime.onMessage.addListener(function b(message, sender, sendResponse) {
  console.log("text data is null " + message.firstRender === null);
  if(message.task=="getImages"){
    const url = message.url;
    console.log("url set");
    let gallery = fetchImages(url);
    gallery.then((result)=>{
      console.log("gallery");
      console.log(result);
      sendResponse(result);
    })
    
  }
  else if(message.firstRender === null && message.task==="sendUrl"){
    const url = message.url;
    console.log("url set");
    // console.log(message.API);
    fetch("http://localhost:3001/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        } else {
          throw new Error("Error fetching data");
        }
      })
      .then((data) => {
        // Do something with the scraped data

        console.log("Scraped Data:", data);
        let rawData = data[0] + data[1];
        // console.log("3"+message.API);
        let screenData = AICall(rawData, message.API,message.isSummary);
        // console.log("summary:", summary);
        screenData.then((result) => {
          // const gallery = {};

          const res = [result.gptAnswer,result.dataMain];
          console.log("result where data is null ");
          console.log(result);
          sendResponse(res);
        });
    
      })
      .catch((error) => {
        console.log(error);
        sendResponse("Server not reachable")
      });
  }else if (message.firstRender !== null  && message.task==="sendUrl") {
    console.log("3"+message.API);
      const screenData = AICall(message.firstRender, message.API, message.isSummary);
      screenData.then((result) => {
        // const gallery = {};
        
        const res = [result.gptAnswer,result.dataMain];
        console.log("result where data is not null " + res);
        sendResponse(res);
      }).catch((e)=>{
        console.log(error);
        sendResponse("Server not reachable")
      });

  }

  return true;
});

async function fetchImages(url){
  const gallery = await fetch("http://localhost:3001/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }).then((response) => {
      if (response.ok) {
        // console.log(response);
        return response.json();
      } else {
        throw new Error("Error fetching data");
      }
    })
    .then((data) => {
      // console.log("Images: ", data);
      return data
    })
    .catch((error) => {
      console.log(error);
      sendResponse("Server not reachable")
    });
    return gallery;
}

