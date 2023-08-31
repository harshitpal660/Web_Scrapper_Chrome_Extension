import "./assets/Styles/App.css"
declare const chrome: any; 
function App() {

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
