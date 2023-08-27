const url = window.location.href;
const divAIData = document.createElement("div");
console.log("1"+process.env.REACT_APP_Web_scrapper);
const style = document.createElement("style");
style.textContent = `
  .wrapper{
    z-index:10000000000;
    position: absolute !important;
    
    top: 10px !important;
    left:50% !important;
    transform: translate(-50%) !important;
    width: fit-content !important;
  }
  .extensionButton{
    padding: 3px !important;
    margin: 5px !important;
    border-radius: 5px !important;
  }
  .slider{
    background-color: rgb(214,235,252);
  }
  .aiData{
    height: fit-content !important;
    min-height: 80% !important;
    width: 95% !important;
    top: 60px !important;
    left:50% !important;
    border-radius: 10px;
    transform: translate(-50%) !important;
    z-index:100000000000;
    position: absolute !important;
    text-align: center !important;
    background-color: rgb(32,33,36,0.9) !important;
    overflow:scroll !important;

  }
  .aiData p{
    color: white !important;
  }
  .aiData h1{
    color: white !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
  }
  .aiData::-webkit-scrollbar {
    display: none !important;
  }

  p{
    display: inline-block !important;
  }

  #animationContainer{
    border: 3px solid black !important;
    border-radius: 5px !important;
    overflow: hidden !important;
    width: 100% !important;
    position: absolute !important;
    top: 50% !important;
    left:50% !important;
    transform: translate(-50%,-50%) !important;
  }

  #animation{
    color: white !important;
    /* animation properties */
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    
    -moz-animation: my-animation 15s linear infinite;
    -webkit-animation: my-animation 15s linear infinite;
    animation: my-animation 15s linear infinite;
  }
  /* for Firefox */
@-moz-keyframes my-animation {
  from { -moz-transform: translateX(100%); }
  to { -moz-transform: translateX(-100%); }
}

/* for Chrome */
@-webkit-keyframes my-animation {
  from { -webkit-transform: translateX(100%); }
  to { -webkit-transform: translateX(-100%); }
}

@keyframes my-animation {
  from {
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
  to {
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}
  
`;

// Contains all the images of the webpage
let gallery = null;

// contains the formated data of summary or majorpoints which ever user gets first
let textData = null;

// heading data after apicalls 
let headingMain = null;
// animation for moving text
const animationContainer =document.createElement("div");
animationContainer.setAttribute("id","animationContainer");
const animation =document.createElement("div");
animation.setAttribute("id","animation");
animation.innerHTML = "Fetching your data. . . &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp till then <p>&#9749</p>"
animationContainer.appendChild(animation);

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
    divAIData.innerHTML =  `<h1 id="headingScraper">Generating ...</h1>`;
    divAIData.appendChild(p);
    p.innerText = ""
    divAIData.appendChild(animationContainer);
    headingMain = "Summary";
    displayDiv("summary");
    scrap(url,"summary");
  });

  button2.addEventListener("click", () => {
    // loader.style.display = "block";
    divAIData.setAttribute("id", "points");
    
    // console.log(divAIData);
    divAIData.innerHTML = `<h1 id="headingScrapper">Generating ...</h1>`;
    divAIData.appendChild(p);
    p.innerText = ""
    divAIData.appendChild(animationContainer);
    headingMain = "Major Points";
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
      ({  task:"sendUrl",url: url,API:process.env.REACT_APP_Web_scrapper,firstRender:textData,isSummary:toScrap}),
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        const heading = document.getElementById("headingScrapper");
        const gallery = response[1];
        const textData = response[0];
        console.log(gallery);
        console.log(textData);
        heading.innerHTML = `<p>${headingMain}:&#x1F60A;</p>`;
        let c = document.getElementById("responseText");
        animationContainer.remove();
        c.innerText = textData;

      }
    );
  }else{
    chrome.runtime.sendMessage(
      ({ task:"sendUrl", url: url,API:process.env.REACT_APP_Web_scrapper,firstRender:textData,isSummary:toScrap}),
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        // gallery = response[1];
        textData = response;
        console.log("Response "+ response);
        console.log("gallery "+gallery);
        console.log("textdata "+textData);
        heading.innerHTML = `<p>${headingMain}: &#x1F60A;</p>`;
        let c = document.getElementById("responseText");
        animationContainer.remove();
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
