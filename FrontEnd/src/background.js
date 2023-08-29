// import { measureMemory } from "vm";
import { AICall } from "./OpenAI";
import { AICall2 } from "./testAICall";
console.log("backgroundReact");

// fetching message command from App.tsxjs for opening and closing of buttons
chrome.runtime.onMessage.addListener(function a(message) {
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

// fetching message command from content.js for fetching Summary, major points and Images 
chrome.runtime.onMessage.addListener(function b(message, sender, sendResponse) {
  console.log("text data is null " + message.firstRender === null);
  const url = message.url;
  console.log("url set");

  // condition for getting images from NodeJs server
  if(message.task=="getImages"){
    const gallery = fetchImages(url);
    gallery.then((result)=>{
      console.log("gallery");
      console.log(result);
      sendResponse(result);
    })
    
  }

  // condition for getting Summary/Major Points from NodeJs server and open AI Server
  else if(message.firstRender === null && message.task==="sendUrl"){
    const data = fetchScrappedDataFirstTime(url,message.API,message.isSummary)
    data.then((result)=>{
      console.log("Scrapped data first time");
      sendResponse(result);
    })
    
  }
  
// here i will not do scrapping as it was the not the first time, and we have previously scrapped data stored in message.firstRender
// we will directly send it to open ai
  else if (message.firstRender !== null  && message.task==="sendUrl") {

    // Open ai api call
      const screenData = AICall(message.firstRender, message.API, message.isSummary);

      screenData.then((result) => {
        // const gallery = {};
         // 'result.data' main is the reduced data which will generate the final result whether it's summary or points
         // I am storing it for preventing srapping of data again 
        const res = [result.gptAnswer,result.dataMain];
        console.log("result where data is not null ");
        console.log(res);
        sendResponse(res);
      }).catch((e)=>{
        console.log(error);
        sendResponse("Server not reachable")
      });

  }

  return true;
});

// if we are fetching data for the first time in that case we need to scrapp the data from the webpage
async function fetchScrappedDataFirstTime(url,API,isSummary){
  const AIResponse = await fetch("http://localhost:3001/scrape", {
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
        return AICall(rawData,API,isSummary);
  
    
      }).then((result) => {
        // const gallery = {};

        const res = [result.gptAnswer,result.dataMain];
        console.log("result where data is null ");
        console.log(res);
        return res;
      })
      .catch((error) => {
        console.log(error);
       return "Server not reachable";
      });
    // console.log("test");
    // console.log(AIResponse);
    return AIResponse;
}


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

