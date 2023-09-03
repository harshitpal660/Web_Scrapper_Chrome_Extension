import { unlink } from "fs";
import { AICall } from "./OpenAI";

export function WordCount(str) {
  return str.split(" ").length;
}


export function cleanData(str) {
  
  console.log("before cleaning" + WordCount(str));
  str = str.replaceAll(",", "");
  str = str.replaceAll("+", "");
  str = str.replaceAll("-", "");
  str = str.replaceAll("_", "");
  str = str.replaceAll("/", "");
  str = str.replaceAll("*", "");
  str = str.replaceAll("&", "");
  str = str.replaceAll(";", "");
  str = str.replaceAll(":", "");
  str = str.replaceAll("$", "");
  str = str.replaceAll("|", "");
  str = str.replaceAll("/n", "");
  str = str.replace(/\b\w+\.\w+\b/g,"") // removes words which contains . in between
  str = str.replace(/\[[^\]]*\]/g, ""); // remove content within square braces with brackets as well
  str = str.replace(/[0-9]/g, ""); // to remove digits
  str = str.replace(/[^\x00-\x7F]/g, ""); // to remove other language than english
  str = str.replace(/\s+/g, " ").trim(); // remove unnecessary spaces
  str = str.replace(/\([^)]*\)/g, ""); // remove content within parentheses with brackets as well
  str = str.replace(/\{.*?\}/g, '');  // remove content within curly braces with brackets as well
  console.log("after cleaning" + WordCount(str));
  return str;
}

export function getImages(
  url,
  animationContainer,
  imageContainer,
) {
  // console.log("getImages");
  // console.log(loadingColor);
  const Loader = document.getElementsByClassName("webScrapperProgress")[0];
  const loadingColor = document.querySelector(".webScrapperProgress .webScrapperColor");
  console.log(loadingColor);
  console.log(Loader);
  // loadingColor.style.width = "80%";
  const result = fetchImages(url);

  result.then((response) => {
    console.log("getImages");
    console.log(response);
    const heading = document.getElementById("webScrapperHeading");

    if (response === "Data not found" || response === "Ërror fetching data") {
      animationContainer.remove();
      Loader.remove();

      heading.innerHTML = `Sorry :&#128532;`;
      imageContainer.innerText =
        "This data is not present in this webpage or they might have applied some additional security to this page";
      return;
    } else if (response === "Server not reachable") {
      animationContainer.remove();
      Loader.remove();
      heading.innerHTML = `Sorry :&#128532;`;
      imageContainer.innerText = "Your NodeJs Server is not running";
      return;
    }

    console.log("success");
    console.log(response);

    // Contains all the images of the webpage
    let uniquesImages = {};

    let count = 0;
    let delay = null;
    if (response.length <= 5) {
      delay = 1000;
    } else if (response.length > 5 && response.length <= 10) {
      delay = 700;
    } else if (response.length > 10 && response.length <= 20) {
      delay = 500;
    } else {
      delay = 200;
    }
    let uniqueTotal = 0; // to find pecentage as responce has multiple images
    for (let obj of response) {
      if (!uniquesImages.hasOwnProperty(obj.alt)) {
        // console.log("obj.alt");
        // console.log(obj.alt);
        uniquesImages[obj.alt] = null;
        uniqueTotal++;
      }
    }
    uniquesImages = {};
    console.log(uniqueTotal);
    let uniqueCount = 0;
    const interval = setInterval(() => {
      try {
        if (!uniquesImages.hasOwnProperty(response[count].alt)) {
          console.log(uniquesImages);
          console.log(response[count].alt);
          console.log(
            "inside Image wapper " + ((uniqueCount + 1) / uniqueTotal) * 100
          );
          loadingColor.style.width = ((uniqueCount + 1) / uniqueTotal) * 100 + "%";
          uniquesImages[response[uniqueCount].alt] = response[uniqueCount].src;
          console.log(uniqueCount+" "+uniqueTotal);
          if (uniqueCount === uniqueTotal-1) {
            console.log(uniquesImages);
            animationContainer.remove();
            Loader.remove();
            clearInterval(interval);
            // const heading = document.getElementById("webScrapperHeading");
            heading.innerHTML = `Images: &#x1F60A;`;

            for (let key in uniquesImages) {
              let imageWrapper = document.createElement("div");
              imageWrapper.setAttribute("class", "webScrapperImage-wrapper");
              let imgheading = document.createElement("h3");
              imgheading.setAttribute("class", "webScrapperImgHeading");
              imgheading.innerText = key;
              let imgDiv = document.createElement("div");
              imgDiv.setAttribute("class", "webScrapperImgDiv");
              let img = document.createElement("img");
              img.setAttribute("class", "webScrapperImage");
              img.src = uniquesImages[key];
              img.alt = key;
              imgDiv.appendChild(img);
              imageWrapper.appendChild(imgheading);
              imageWrapper.appendChild(imgDiv);
              imageContainer.appendChild(imageWrapper);
            }
          }
          uniqueCount++;
        }
        count++;
      } catch (e) {
        console.log(e);
      }
    }, delay);
  });
}


async function fetchImages(url) {
  const gallery = await fetch("http://localhost:3001/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("response ok");
        return response.json();
      } else {
        return "Error fetching data";
      }
    })
    .then((data) => {
      console.log("Images: ");
      if (data === "Data not found") {
        return data;
      }
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return "Server not reachable";
    });
  console.log("GALLERY");
  console.log(gallery);
  return gallery;
}

// contains the formated data of summary or majorpoints which ever user gets first
let textData = null;

export function scrap(
  url,
  toScrap,
  animationContainer,
  headingMain,
) {
  console.log("text data is null " + textData);
  // console.log("2" + process.env.REACT_APP_Web_scrapper);
  const Loader = document.getElementsByClassName("webScrapperProgress")[0];
  const loadingColor = document.querySelector(".webScrapperProgress .webScrapperColor");
  console.log("Helper.js");
  console.log(Loader);
  console.log(loadingColor);
  if (textData === null) {
    chrome.runtime.sendMessage(
      {
        action: "sendUrl",
        url,
        API: process.env.REACT_APP_Web_Scrapper,
        firstRender: textData,
        isSummary: toScrap,
      },
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        console.log("Response ");
        console.log(response);
        const heading = document.getElementById("webScrapperHeading");
        if (response === "Server not reachable") {
          let c = document.getElementById("webScrapperResponseText");
          animationContainer.remove();
          Loader.remove();
          c.innerText = response;
          heading.innerHTML = `Sorry:&#128532;`;
          return;
        } else if (
          response ===
          "This data is not present in this webpage or they might have applied some additional security"
        ) {
          let c = document.getElementById("webScrapperResponseText");
          animationContainer.remove();
          Loader.remove();
          c.innerText = response;
          heading.innerHTML = `Sorry:&#128532;`;
          return;
        }
        // loadingColor.style.width = "100%";
        // const gallery = response[2];
        textData = response[0];

        // console.log(gallery);
        console.log(textData);
        heading.innerHTML = `${headingMain}:&#x1F60A;`;
        let c = document.getElementById("webScrapperResponseText");
        animationContainer.remove();
        Loader.remove();
        c.innerText = textData;
        textData = response[1]; // this step will store reduced data in textdata and not the summary or major points
      }
    );
  } else {
    console.log("inside else");
    chrome.runtime.sendMessage(
      {
        action: "sendUrl",
        url,
        API: process.env.REACT_APP_Web_Scrapper,
        firstRender: textData,
        isSummary: toScrap,
      },
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        // gallery = response[1];
        console.log("Response ");
        console.log(response);
        const heading = document.getElementById("webScrapperHeading");
        if (response === "Server not reachable") {
          let c = document.getElementById("webScrapperResponseText");
          animationContainer.remove();
          Loader.remove();
          c.innerText = response;
          return;
        }

        textData = response[0];
        console.log("textdata " + textData);
        heading.innerHTML = `${headingMain}: &#x1F60A;`;
        let c = document.getElementById("webScrapperResponseText");
        animationContainer.remove();
        Loader.remove();
        c.innerText = textData;
        textData = response[1]; // this step will store reduced data in textdata and not the summary or major points
      }
    );
  }
}

