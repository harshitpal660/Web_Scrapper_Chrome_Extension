import { AICall } from "./OpenAI";
import { AICall2 } from "./testAICall";


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
  str = str.replace(/[0-9]/g, ""); // to remove digits
  str = str.replace(/[^\x00-\x7F]/g, ""); // to remove other language than english
  str = str.replace(/\s+/g, " ").trim(); // remove unnecessary spaces
  str = str.replace(/\([^)]*\)/g, ""); // remove content within parentheses
  console.log("after cleaning" + WordCount(str));
  return str;
}


export function getImages(url,animationContainer,uniquesImages,imageContainer) {
  chrome.runtime.sendMessage(
    {
      task: "getImages",
      API: process.env.REACT_APP_Web_scrapper,
      url: url,
    },
    (response) => {
      // console.log("res"+response);
      if(response === "Data not found"){
        animationContainer.remove();
        const heading = document.getElementById("headingScrapper");

        heading.innerHTML = `Sorry :&#128532;`;
        imageContainer.innerText = "This data is not present in this webpage or they might have applied some additional security to this page";
        return;
      }else if(response=== "Server not reachable"){
        animationContainer.remove();
        const heading = document.getElementById("headingScrapper");

        heading.innerHTML = `Sorry :&#128532;`;
        imageContainer.innerText = "Your NodeJs Server is not running";
        return;
      }

      for (let obj of response) {
        if (!uniquesImages.hasOwnProperty(obj.alt)) {
          uniquesImages[obj.alt] = obj.src;
        }
      }
      animationContainer.remove();
      const heading = document.getElementById("headingScrapper");
      heading.innerHTML = `Images: &#x1F60A;`;
      for (let key in uniquesImages) {
        if (uniquesImages.hasOwnProperty(key)) {
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
  );
}

export async function fetchImages(url){
  const gallery = await fetch("http://localhost:3001/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }).then((response) => {
      if (response.ok) {
        // console.log(response);
        return response.json();
      } else {
        return "Error fetching data";
      }
    })
    .then((data) => {
      console.log("Images: ");
      if(data==="Data not found"){
        return data;
      }
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return "Server not reachable";
    });
    return gallery;
}



// contains the formated data of summary or majorpoints which ever user gets first
let textData = null;

export function scrap(url, toScrap,animationContainer,headingMain) {
  console.log("text data is null " + textData);
  // console.log("2" + process.env.REACT_APP_Web_scrapper);
  if (textData === null) {
    chrome.runtime.sendMessage(
      {
        task: "sendUrl",
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
          c.innerText = response;
          heading.innerHTML = `Sorry:&#128532;`;
          return;
        }else if(response === "This data is not present in this webpage or they might have applied some additional security"){
          let c = document.getElementById("responseText");
          animationContainer.remove();
          c.innerText = response;
          heading.innerHTML = `Sorry:&#128532;`;
          return;
        }
        
        // const gallery = response[2];
        textData = response[0];

        // console.log(gallery);
        console.log(textData);
        heading.innerHTML = `${headingMain}:&#x1F60A;`;
        let c = document.getElementById("responseText");
        animationContainer.remove();
        c.innerText = textData;
        textData = response[1]; // this step will store reduced data in textdata and not the summary or major points
      }
    );
  } else {
    console.log("inside else");
    chrome.runtime.sendMessage(
      {
        task: "sendUrl",
        url: url,
        API: process.env.REACT_APP_Web_scrapper,
        firstRender: textData,
        isSummary: toScrap,
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
          c.innerText = response;
          return;
        }
        
        textData = response[0];
        console.log("textdata " + textData);
        heading.innerHTML = `${headingMain}: &#x1F60A;`;
        let c = document.getElementById("responseText");
        animationContainer.remove();
        c.innerText = textData;
        textData = response[1]; // this step will store reduced data in textdata and not the summary or major points
      }
    );
  }
}

// if we are fetching data for the first time in that case we need to scrapp the data from the webpage
export async function fetchScrappedDataFirstTime(url,API,isSummary){
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
        if(data==="Data not found"){
          return "This data is not present in this webpage or they might have applied some additional security";
        }
        console.log("Scraped Data:", data);
        let rawData = data[0] + data[1];
        // console.log("3"+message.API);
        return AICall(rawData,API,isSummary);
  
    
      }).then((result) => {
        // const gallery = {};

        const res = [result.gptAnswer,result.dataMain];
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


