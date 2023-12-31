import { getImages, scrap } from "./utils/helper";
import { style } from "./assets/Styles/contentStyle";

// import { Loader } from "./utils/Loader";
// import React from 'react';
// import ReactDOM from 'react-dom/client';

const url = window.location.href;


// heading data after apicalls
let headingMain = null;

// animation for moving text
const animationContainer = document.createElement("div");
animationContainer.setAttribute("id", "webScrapperAnimationContainer");
const animation = document.createElement("div");
animation.setAttribute("id", "webScrapperAnimation");
animation.innerHTML =
  "<p>Fetching your data. . . &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp till then &#9749 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Loading time depends on Data sometimes it may take around 10 min</p>";
animationContainer.appendChild(animation);

// applying style
document.head.appendChild(style);

// paragraph for summary and major points
let p = document.createElement("p");
p.setAttribute("id", "webScrapperResponseText");

const divAIData = document.createElement("div");
divAIData.setAttribute("class", "webScrapperAiData");

const closeCopyWrapper = document.createElement("div");
closeCopyWrapper.setAttribute("id", "webScrapperActionButtons");

const close = document.createElement("button");
close.setAttribute("id", "webScrapperClose");
close.textContent = "close";

const copy = document.createElement("button");
copy.setAttribute("id", "webScrapperCopy");
copy.textContent = "copy";

const divWrapper = document.createElement("div");
divWrapper.classList.add("webScrapperWrapper");
divWrapper.innerHTML = `
    <div id="webScrapperSlider">
        <button class="webScrapperExtensionButton">Provide Summary</button>
        <button class="webScrapperExtensionButton">Major Points</button>
        <button class="webScrapperExtensionButton">Gallery</button>
    </div>
`;

// loader
const Loader = document.createElement("div")
Loader.setAttribute("class","webScrapperProgress")
Loader.innerHTML = `
  <div class="webScrapperColor"></div>
`
// image container
const imageContainer = document.createElement("div");
imageContainer.id = "webScrapperImage-container";


close.addEventListener("click", () => {
  divAIData.remove();
});

copy.addEventListener("click", async () => {
  const responsetext = document.getElementById("webScrapperResponseText");
  const textToCopy = responsetext.textContent;
  await navigator.clipboard.writeText(textToCopy);
  copy.textContent = "copied!";
  setTimeout(() => {
    copy.textContent = "copy";
  }, 2000);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if(message.action === "open") {
    console.log("opened");
    displayButtons();
  }else if(message.action === "updateProgress") {
    console.log("insideUpdateProgress "+message.percentage);
    const { percentage } = message;
    updateProgressBar(percentage);
  }
   else if(message.action == "close"){
    console.log("closed");
    divWrapper.remove();
  }
});
function displayButtons() {
  document.body.appendChild(divWrapper);
  // const slider = document.getElementById("slider");
  // loader = document.getElementsByClassName(loader)[0];
  const button1 = document.getElementsByClassName("webScrapperExtensionButton")[0];
  const button2 = document.getElementsByClassName("webScrapperExtensionButton")[1];
  const button3 = document.getElementsByClassName("webScrapperExtensionButton")[2];

  button1.addEventListener("click", () => {
    divAIData.setAttribute("id", "webScrapperSummary");
    divAIData.innerHTML = `<h1 id="webScrapperHeading">Summary takes time ... &#129300;</h1>`;
    closeCopyWrapper.appendChild(close);
    closeCopyWrapper.appendChild(copy);
    divAIData.appendChild(closeCopyWrapper);
    divAIData.appendChild(p);
    p.innerText = "";
    console.log("Loader");
    console.log(Loader);
    divAIData.appendChild(Loader);
    divAIData.appendChild(animationContainer);
    headingMain = "Summary";
    document.body.appendChild(divAIData);
    updateProgressBar(0);
    scrap(url, "summary", animationContainer, headingMain);
  });

  button2.addEventListener("click", () => {
    divAIData.setAttribute("id", "webScrapperPoints");
    divAIData.innerHTML = `<h1 id="webScrapperHeading">Looking for Points ... &#129300;</h1>`;
    closeCopyWrapper.appendChild(close);
    closeCopyWrapper.appendChild(copy);
    divAIData.appendChild(closeCopyWrapper);
    divAIData.appendChild(p);
    p.innerText = "";
    console.log("Loader");
    console.log(Loader);
    divAIData.appendChild(Loader)
    divAIData.appendChild(animationContainer);
    headingMain = "Major Points";
    document.body.appendChild(divAIData);
    updateProgressBar(0);
    scrap(url, "points", animationContainer, headingMain);
  });

  button3.addEventListener("click", () => {
    divAIData.setAttribute("id", "webScrapperImages");
    divAIData.innerHTML = `<h1 id="webScrapperHeading">Loading Images ... &#129300;</h1>`;
    closeCopyWrapper.appendChild(close);
    divAIData.appendChild(closeCopyWrapper);
    imageContainer.innerHTML = "";
    console.log("Loader");
    console.log(Loader);
    divAIData.appendChild(Loader);
    divAIData.appendChild(animationContainer);
    headingMain = "Gallery";
    document.body.appendChild(divAIData);
    updateProgressBar(0);
    divAIData.appendChild(imageContainer);
    getImages(url, animationContainer, imageContainer);
  });
}

// Function to update the progress bar
function updateProgressBar(percentage) {
  const progressBar = document.querySelector(".webScrapperProgress .webScrapperColor");
  progressBar.style.width = percentage + "%";
}
