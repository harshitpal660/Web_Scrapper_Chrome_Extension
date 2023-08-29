import { getImages,scrap } from "./utils";

const url = window.location.href;
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
    background-color: rgb(214,235,252) !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    cursor:pointer;
    background-color: rgb(204,38,83) !important;
  }
  #slider{
    background-color: rgb(214,235,252);
    display:flex;
    flex-direction:row;
    flex-wrap: nowrap;
  }
  .aiData{
    height: 90% !important;
    width: 95% !important;
    top: 100px !important;
    left:50% !important;
    border-radius: 10px;
    transform: translate(-50%) !important;
    z-index:100000000000;
    position: absolute !important;
    text-align: justify !important;
    background-color: rgb(32,33,36,0.9) !important;
    overflow:scroll !important;
    padding: 10px;
    font-family: "Lucida Console", "Courier New", monospace !important;

  }
  .aiData p{
    color: white !important;
  }
  .aiData h1{
    font-size: 30px !important;
    color: white !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    text-align: center;
  }
  .aiData::-webkit-scrollbar {
    display: none !important;
  }

  #close{
    cursor: pointer;
  }

  p{
    display: inline-block !important;
    white-space: nowrap !important;
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
    width: 500px;
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

#image-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding:3px;
  color: white;
  justify-content:space-around;
}

.image-wrapper:nth-child(even) {
  background-color: rgb(60,62,66,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}
.image-wrapper:nth-child(odd) {
  background-color: rgb(104,104,104,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}

.imgDiv{
  height: 250px;
  width: 250px;
  margin: auto;
}
.image{
  height: 100%;
  width: 100%;
}
.imgHeading{
  color:white;
  text-align:center;
  margin:0;
  padding:0;
}
#close{
  width: 50px; /* Set a width and height to make it round */
  height: 50px;
  border-radius: 50%; /* This creates the round shape */
  background-color: #3498db; /* Background color of the button */
  color: red; /* Text color */
  border: none; /* No border */
  cursor: pointer; /* Show pointer cursor on hover */
}

  
`;



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
const close = document.createElement("button");
close.setAttribute("id","close");
divAIData.appendChild(close);
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


// let loader = null;

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
    scrap(url, "points",animationContainer,headingMain);
  });

  button3.addEventListener("click", ()=>{
    divAIData.setAttribute("id", "images");
    divAIData.innerHTML = `<h1 id="headingScrapper">Loading Images ... &#129300;</h1>`;
    divAIData.appendChild(imageContainer);
    p.remove();
    divAIData.appendChild(animationContainer);
    headingMain = "Gallery";
    document.body.appendChild(divAIData);
    getImages(url,animationContainer,uniquesImages,imageContainer);
  })
}



