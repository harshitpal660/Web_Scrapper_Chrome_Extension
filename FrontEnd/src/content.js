import loading from "./Image/loader.gif";
const url = window.location.href;
const divAIData = document.createElement("div");
console.log("1"+process.env.REACT_APP_Web_scrapper);
const style = document.createElement("style");
style.textContent = `
  .wrapper{
    z-index:10000000000;
    position: absolute;
    top: 10px;
    left:50%;
    transform: translate(-50%);
    width: fit-content !important;
  }
  .aiData{
    height: 90% !important;
    width: 95% !important;
    top: 60px;
    left:50%;
    
    transform: translate(-50%);
    z-index:100000000000;
    position: absolute;
    text-align: center;
    background-color: rgb(32,33,36,0.9) !important;
    overflow:scroll;

  }
  .aiData p{
    color: white !important;
  }
  .aiData h1{
    color: white !important;
  }
  .aiData::-webkit-scrollbar {
    display: none;
  }

  .loader {
    border: 10px solid #f3f3f3;
    border-radius: 50%;
    border-top: 10px solid #3498db;
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    display:none
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
  }
  
  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .wrapper{
    height:20px;
    width:100%;
  }
`;

const gallery = null;
const textData = null;

const loader = document.createElement('img');
imageElement.src = loading;

document.head.appendChild(style);
// paragraph for summary and major points
let p = document.createElement("p");
p.setAttribute("id","responseText")
divAIData.setAttribute("class", "aiData");
const divWrapper = document.createElement("div");
divWrapper.classList.add("wrapper");
divWrapper.innerHTML = `
    <span id="slider">
        <button class="extensionButton">Provide Summary</button>
        <button class="extensionButton">Major Points</button>
    </span>
`;
// let loader = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "open") {
    console.log("opened");
    
    displayButtons();
  } else {
    console.log("closed");
    hideButtons();
  }
});

function displayButtons() {
  document.body.appendChild(divWrapper);
  // const slider = document.getElementById("slider");
  // loader = document.getElementsByClassName(loader)[0];
  const button1 = document.getElementsByClassName("extensionButton")[0];
  const button2 = document.getElementsByClassName("extensionButton")[1];
  button1.addEventListener("click", () => {
    // loader.style.display = "block";
    divAIData.setAttribute("id", "summary");
    
    // console.log(divAIData);
    divAIData.innerHTML = `<h1>Summary</h1>`;
    divAIData.appendChild(p);
    divAIData.appendChild(loader);
    displayDiv("summary");
    scrap(url,"summary");
  });

  button2.addEventListener("click", () => {
    // loader.style.display = "block";
    divAIData.setAttribute("id", "points");
    
    // console.log(divAIData);
    divAIData.innerHTML = `<h1>Points</h1>`;
    divAIData.appendChild(p);
    divAIData.appendChild(loader);
    displayDiv("points");
    scrap(url,"points");
  });
}

function hideButtons() {
  divWrapper.remove();
}

function scrap(url,toScrap) {
  console.log("text data is null "+textData === null);
  console.log("2"+process.env.REACT_APP_Web_scrapper);
  if(textData===null){
    chrome.runtime.sendMessage(
      (data = {  task:"sendUrl",url: url,API:process.env.REACT_APP_Web_scrapper,firstRender:textData,isSummary:toScrap}),
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        const gallery = response[1];
        const textData = response[0];
        console.log(gallery);
        console.log(textData);
        c = document.getElementById("responseText");
        c.innerText = textData;
      }
    );
  }else{
    chrome.runtime.sendMessage(
      (data = { task:"sendUrl", url: url,API:process.env.REACT_APP_Web_scrapper,firstRender:textData,isSummary:toScrap}),
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        // gallery = response[1];
        textData = response;
        console.log("Response "+ response);
        console.log("gallery "+gallery);
        console.log("textdata "+textData);
        c = document.getElementById("responseText");
        c.innerText = textData;
      
      }
    );
  }
  
}

function displayDiv(toScrap) {
  if (toScrap === "summary") {
    document.body.appendChild(divAIData);
    // loader.style.display="none";
  } else {
    document.body.appendChild(divAIData);
    // loader.style.display="none";
  }
  console.log("added reading section");
}
