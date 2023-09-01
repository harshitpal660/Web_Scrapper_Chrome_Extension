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
  str = str.replace(/\?/g, '');
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
  loadingColor
) {
  // console.log("getImages");
  // console.log(loadingColor);
  const Loader = document.getElementsByClassName("progress")[0];
  // loadingColor.style.width = "80%";
  const result = fetchImages(url);

  result.then((response) => {
    console.log("getImages");
    console.log(response);
    if (response === "Data not found" || response === "Ërror fetching data") {
      animationContainer.remove();
      Loader.remove();
      const heading = document.getElementById("headingScrapper");

      heading.innerHTML = `Sorry :&#128532;`;
      imageContainer.innerText =
        "This data is not present in this webpage or they might have applied some additional security to this page";
      return;
    } else if (response === "Server not reachable") {
      animationContainer.remove();
      Loader.remove();
      const heading = document.getElementById("headingScrapper");

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
        console.log("obj.alt");
        console.log(obj.alt);
        uniquesImages[obj.alt] = null;
        uniqueTotal++;
      }
    }
    uniquesImages = {};
    console.log(uniqueTotal);
    const interval = setInterval(() => {
      try {
        if (!uniquesImages.hasOwnProperty(response[count].alt)) {
          console.log(uniquesImages);
          console.log(response[count].alt);
          console.log(
            "inside Image wapper " + ((count + 1) / uniqueTotal) * 100
          );
          loadingColor.style.width = ((count + 1) / uniqueTotal) * 100 + "%";
          uniquesImages[response[count].alt] = response[count].src;
          count++;
          if (count === uniqueTotal) {
            console.log(uniquesImages);
            animationContainer.remove();
            Loader.remove();
            clearInterval(interval);
            const heading = document.getElementById("headingScrapper");
            heading.innerHTML = `Images: &#x1F60A;`;

            for (let key in uniquesImages) {
              let imageWrapper = document.createElement("div");
              imageWrapper.setAttribute("class", "image-wrapper");
              let imgheading = document.createElement("h3");
              imgheading.setAttribute("class", "imgHeading");
              imgheading.innerText = key;
              let imgDiv = document.createElement("div");
              imgDiv.setAttribute("class", "imgDiv");
              let img = document.createElement("img");
              img.setAttribute("class", "image");
              img.src = uniquesImages[key];
              img.alt = key;
              imgDiv.appendChild(img);
              imageWrapper.appendChild(imgheading);
              imageWrapper.appendChild(imgDiv);
              imageContainer.appendChild(imageWrapper);
            }
          }
        }
      } catch (e) {
        console.log(e);
        // console.log(uniquesImages);
      }
    }, delay);
  });
}
// );
// }

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
  console.log("2" + process.env.REACT_APP_Web_scrapper);
  const Loader = document.getElementsByClassName("progress")[0];
  const loadingColor = document.querySelector(".progress .color");
  console.log("Helper.js");
  console.log(Loader);
  console.log(loadingColor);
  if (textData === null) {
    chrome.runtime.sendMessage(
      {
        action: "sendUrl",
        url: url,
        API: process.env.REACT_APP_Web_scrapper,
        firstRender: textData,
        isSummary: toScrap,
      },
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        console.log("Response ");
        console.log(response);
        const heading = document.getElementById("headingScrapper");
        if (response === "Server not reachable") {
          let c = document.getElementById("responseText");
          animationContainer.remove();
          Loader.remove();
          c.innerText = response;
          heading.innerHTML = `Sorry:&#128532;`;
          return;
        } else if (
          response ===
          "This data is not present in this webpage or they might have applied some additional security"
        ) {
          let c = document.getElementById("responseText");
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
        let c = document.getElementById("responseText");
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
        url: url,
        API: process.env.REACT_APP_Web_scrapper,
        firstRender: textData,
        isSummary: toScrap,
        loadingColor: loadingColor,
        Loader:Loader
      },
      (response) => {
        // textdata = response
        // console.log("object" + typeof response);
        // gallery = response[1];
        console.log("Response ");
        console.log(response);
        const heading = document.getElementById("headingScrapper");
        if (response === "Server not reachable") {
          let c = document.getElementById("responseText");
          animationContainer.remove();
          Loader.remove();
          c.innerText = response;
          return;
        }

        textData = response[0];
        console.log("textdata " + textData);
        heading.innerHTML = `${headingMain}: &#x1F60A;`;
        let c = document.getElementById("responseText");
        animationContainer.remove();
        Loader.remove();
        c.innerText = textData;
        textData = response[1]; // this step will store reduced data in textdata and not the summary or major points
      }
    );
  }
}

// if we are fetching data for the first time in that case we need to scrapp the data from the webpage
export async function fetchScrappedDataFirstTime(
  url,
  API,
  isSummary,
) {
  // console.log(Loader);
  const AIResponse = await fetch("http://localhost:3001/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response.json();
      } else {
        throw new Error("Error fetching data");
      }
    })
    .then((data) => {
      // Do something with the scraped data
      if (data === "Data not found") {
        return "This data is not present in this webpage or they might have applied some additional security";
      }
      console.log("Scraped Data:", data);
      let rawData = data[0] + data[1];
      // console.log("3"+message.API);

      return AICall(rawData, API, isSummary);
    })
    .then((result) => {
      // const gallery = {};

      const res = [result.gptAnswer, result.dataMain];
      console.log("result where data is null ");
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error);
      return "Server not reachable";
    });
  // console.log("test");
  // console.log(AIResponse);
  return AIResponse;
}

// console.log(process.env.REACT_APP_Web_scrapper2);
