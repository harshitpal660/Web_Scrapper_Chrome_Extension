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
animationContainer.setAttribute("id", "animationContainer");
const animation = document.createElement("div");
animation.setAttribute("id", "animation");
animation.innerHTML =
  "<p>Fetching your data. . . &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp till then &#9749 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Loading time depends on Data sometimes it may take around 10 min</p>";
animationContainer.appendChild(animation);

// applying style
document.head.appendChild(style);

// paragraph for summary and major points
let p = document.createElement("p");
p.setAttribute("id", "responseText");

const divAIData = document.createElement("div");
divAIData.setAttribute("class", "aiData");

const closeCopyWrapper = document.createElement("div");
closeCopyWrapper.setAttribute("id", "actionButtons");

const close = document.createElement("button");
close.setAttribute("id", "close");
close.textContent = "close";

const copy = document.createElement("button");
copy.setAttribute("id", "copy");
copy.textContent = "copy";

const divWrapper = document.createElement("div");
divWrapper.classList.add("wrapper");
divWrapper.innerHTML = `
    <div id="slider">
        <button class="extensionButton">Provide Summary</button>
        <button class="extensionButton">Major Points</button>
        <button class="extensionButton">Gallery</button>
    </div>
`;

// loader
const Loader = document.createElement("div")
Loader.setAttribute("class","progress")
Loader.innerHTML = `
  <div class="color"></div>
`
// image container
const imageContainer = document.createElement("div");
imageContainer.id = "image-container";


close.addEventListener("click", () => {
  divAIData.remove();
});

copy.addEventListener("click", async () => {
  const responsetext = document.getElementById("responseText");
  const textToCopy = responsetext.textContent;
  await navigator.clipboard.writeText(textToCopy);
  copy.textContent = "copied!";
  setTimeout(() => {
    copy.textContent = "copy";
  }, 2000);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "open") {
    console.log("opened");
    displayButtons();
  } else {
    console.log("closed");
    divWrapper.remove();
  }
});

function displayButtons() {
  document.body.appendChild(divWrapper);
  // const slider = document.getElementById("slider");
  // loader = document.getElementsByClassName(loader)[0];
  const button1 = document.getElementsByClassName("extensionButton")[0];
  const button2 = document.getElementsByClassName("extensionButton")[1];
  const button3 = document.getElementsByClassName("extensionButton")[2];
  button1.addEventListener("click", () => {
    divAIData.setAttribute("id", "summary");
    divAIData.innerHTML = `<h1 id="headingScrapper">Summary takes time ... &#129300;</h1>`;
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
    const loadingColor = document.querySelector(".progress .color");
    scrap(url, "summary", animationContainer, headingMain,loadingColor);
  });

  button2.addEventListener("click", () => {
    divAIData.setAttribute("id", "points");
    divAIData.innerHTML = `<h1 id="headingScrapper">Looking for Points ... &#129300;</h1>`;
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
    const loadingColor = document.querySelector(".progress .color");
    scrap(url, "points", animationContainer, headingMain,loadingColor);
  });

  button3.addEventListener("click", () => {
    divAIData.setAttribute("id", "images");
    divAIData.innerHTML = `<h1 id="headingScrapper">Loading Images ... &#129300;</h1>`;
    closeCopyWrapper.appendChild(close);
    divAIData.appendChild(closeCopyWrapper);
    imageContainer.innerHTML = "";
    console.log("Loader");
    console.log(Loader);
    divAIData.appendChild(Loader);
    divAIData.appendChild(animationContainer);
    headingMain = "Gallery";
    document.body.appendChild(divAIData);
    const loadingColor = document.querySelector(".progress .color");
    loadingColor.style.width = "0%";
    divAIData.appendChild(imageContainer);
    getImages(url, animationContainer, imageContainer,loadingColor);
  });
}
