// import { measureMemory } from "vm";
import { AICall } from "./utils/OpenAI";
// import { fetchScrappedDataFirstTime } from "./utils/helper";
// console.log("backgroundReact");

// fetching message command from App.tsxjs for opening and closing of buttons
chrome.runtime.onMessage.addListener(function a(message, sender, sendResponse) {
  if (message.action === "openContent") {
    // Send a message to the active tab's content script
    console.log("insideOpenContent");
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
  else if(message.action ==="sendUrl"){
    if (message.firstRender === null && message.action === "sendUrl") {
      const url = message.url;
      console.log("backgroundReact");
      const data = fetchScrappedDataFirstTime(url, message.API, message.isSummary,message.tabID)
      data.then((result) => {
        console.log("Scrapped data first time");
        sendResponse(result);
      })
  
    } else if (message.firstRender !== null && message.action === "sendUrl") {
      const screenData = AICall(message.firstRender, message.API, message.isSummary,message.tabID);
  
      screenData.then((result) => {
        const res = [result.gptAnswer, result.dataMain];
        console.log("result where data is not null ");
        console.log(res);
        sendResponse(res);
      })
  
    }
  }
 
  return true;
});


// if we are fetching data for the first time in that case we need to scrapp the data from the webpage
async function fetchScrappedDataFirstTime(
  url,
  API,
  isSummary,
  tabID
) {
  // console.log(Loader);
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
      if (data === "Data not found") {
        return "This data is not present in this webpage or they might have applied some additional security";
      }
      console.log("Scraped Data:", data);
      let rawData = data[0] + data[1];
      // console.log("3"+message.API);

      return AICall(rawData, API, isSummary,tabID);
    })
    .then((result) => {
      // const gallery = {};

      const res = [result.gptAnswer, result.dataMain];
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

