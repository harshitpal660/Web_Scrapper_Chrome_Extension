import "./App.css"
// import { useEffect } from "react";

// declare namespace chrome {
//   namespace runtime {
//       function sendMessage(message: any, responseCallback?: (response: any) => void): void;
//       // Add other methods you intend to use from the runtime namespace
//   }
//   // Add other namespaces and methods as needed
// }
declare const chrome: any; 
function App() {


//   useEffect(() => {
//     chrome.runtime.onMessage.addListener((message:any, sender: any, sendResponse: any)=> {
//         if (message.action === 'sendUrl') {
//             console.log('Received message in popup:', message.data);
//         }
//     });
// }, []);
  function handleOpen(){
    chrome.runtime.sendMessage({ action: 'openContent' });
  }
  function handleClose() {
    chrome.runtime.sendMessage({ action: 'closeContent' });
  }
  
  
  return (
    <div className="App">
      <button className="buttons" onClick={handleOpen}>open</button>
      <button className="buttons" onClick={handleClose}>close</button>
    </div>
  );
}

export default App;
