import { getImages,scrap } from "./utils";
import { style } from "./contentStyle";


const url = window.location.href;

// Contains all the images of the webpage
let uniquesImages =  {};

// heading data after apicalls
let headingMain = null;

// animation for moving text
const animationContainer = document.createElement("div");
animationContainer.setAttribute("id", "animationContainer");
const animation = document.createElement("div");
animation.setAttribute("id", "animation");
animation.innerHTML =
  "<p>Fetching your data. . . &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp till then &#9749</p>";
animationContainer.appendChild(animation);

// applying style
document.head.appendChild(style);

// paragraph for summary and major points
let p = document.createElement("p");
p.setAttribute("id", "responseText");

const divAIData = document.createElement("div");
divAIData.setAttribute("class", "aiData");

const closeCopyWrapper = document.createElement("div")
closeCopyWrapper.setAttribute("id", "actionButtons");

const close = document.createElement("button");
close.setAttribute("id","close");
close.textContent = 'close';

const copy = document.createElement("button");
copy.setAttribute("id","copy");
copy.textContent = 'copy';

closeCopyWrapper.appendChild(close);
closeCopyWrapper.appendChild(copy);

const divWrapper = document.createElement("div");
divWrapper.classList.add("wrapper");
divWrapper.innerHTML = `
    <div id="slider">
        <button class="extensionButton">Provide Summary</button>
        <button class="extensionButton">Major Points</button>
        <button class="extensionButton">Gallery</button>
    </div>
`;

// image container
const imageContainer = document.createElement('div');
imageContainer.id = 'image-container';


close.addEventListener("click",()=>{
  divAIData.remove();
})


close.addEventListener("click",()=>{
  
})

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
    divAIData.appendChild(p);
    p.innerText = "";
    divAIData.appendChild(animationContainer);
    headingMain = "Summary";
    document.body.appendChild(divAIData);
    divAIData.appendChild(closeCopyWrapper);
    scrap(url, "summary",animationContainer,headingMain);
  });

  button2.addEventListener("click", () => {
    divAIData.setAttribute("id", "points");
    divAIData.innerHTML = `<h1 id="headingScrapper">Looking for Points ... &#129300;</h1>`;
    divAIData.appendChild(p);
    p.innerText = "";
    divAIData.appendChild(animationContainer);
    headingMain = "Major Points";
    document.body.appendChild(divAIData);
    divAIData.appendChild(closeCopyWrapper);
    scrap(url, "points",animationContainer,headingMain);
  });

  button3.addEventListener("click", ()=>{
    divAIData.setAttribute("id", "images");
    divAIData.innerHTML = `<h1 id="headingScrapper">Loading Images ... &#129300;</h1>`;
    divAIData.appendChild(imageContainer);
    imageContainer.innerHTML = "";
    divAIData.appendChild(animationContainer);
    headingMain = "Gallery";
    document.body.appendChild(divAIData);
    divAIData.appendChild(closeCopyWrapper);
    getImages(url,animationContainer,uniquesImages,imageContainer);
  })
}



