// import { measureMemory } from "vm";
import { AICall } from "./utils/OpenAI";
import { fetchScrappedDataFirstTime } from "./utils/helper";
// console.log("backgroundReact");

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
  // else if(message.action === "updateProgress"){
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const activeTab = tabs[0];
  //     chrome.tabs.sendMessage(activeTab.id, { task: "updateProgress", percentage:message.percentage });
  //   });
  // }
});

// fetching message command from content.js for fetching Summary, major points and Images 
chrome.runtime.onMessage.addListener(function b(message, sender, sendResponse) {
  console.log("text data is null " + message.firstRender === null);
  const url = message.url;
  console.log("url set");

  // condition for getting Summary/Major Points from NodeJs server and open AI Server
  if(message.firstRender === null && message.task==="sendUrl"){
    console.log("backgroundReact");
    // console.log(message.Loader);
    // console.log(message.loadingColor);
    const data = fetchScrappedDataFirstTime(url,message.API,message.isSummary)
    data.then((result)=>{
      console.log("Scrapped data first time");
      sendResponse(result);
    })
    
  }
  
// here i will not do scrapping as it was the not the first time, and we have previously scrapped data stored in message.firstRender
// we will directly send it to open ai
  else if (message.firstRender !== null  && message.task==="sendUrl") {
    console.log("backgroundReact");
    // console.log(message.Loader);
    // console.log(message.loadingColor);
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
      })

  }

  return true;
});

