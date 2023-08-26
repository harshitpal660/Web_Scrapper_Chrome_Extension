import { AICall } from "./OpenAI";
export let textData = "";
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
    
    if (message.action == "sendUrl") {
        const url = message.url;
        console.log("url set");
        // console.log(message.API);
        fetch('http://localhost:3001/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          })
            .then((response) => {
              if (response.ok) {
                console.log(response);
                return response.json();
              } else {
                throw new Error('Error fetching data');
              }
            })
            .then((data) => {
              // Do something with the scraped data
              
              
              console.log('Scraped Data:', data);
              let rawData = data[0]+data[1]; 
              rawData = rawData.replace(/\s+/g,' ').trim();
              let summary = AICall(rawData,message.API);
              console.log('summary:', summary);
              summary.then((result)=>{
                // const gallery = {};
                console.log("result"+ result);
                const res = [result,{...data[2]}]
                console.log("result"+ res);
                sendResponse(res);
              })
              
            })
            .catch((error) => {
              console.error(error);
            });
          
            
    }
    
    return true;
})


// export default url;