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
          let heading = document.createElement("h3");
          heading.setAttribute("class", "imgHeading");
          heading.innerText = key;
          let imgDiv = document.createElement("div");
          imgDiv.setAttribute("class", "imgDiv");
          let img = document.createElement("img");
          img.setAttribute("class", "image");
          img.src = uniquesImages[key];
          img.alt = key;
          imgDiv.appendChild(img);
          imageWrapper.appendChild(heading);
          imageWrapper.appendChild(imgDiv);
          imageContainer.appendChild(imageWrapper);
        }
      }
    }
  );
}

// contains the formated data of summary or majorpoints which ever user gets first
let textData = null;

export function scrap(url, toScrap,animationContainer,headingMain) {
  console.log("text data is null " + textData);
  console.log("2" + process.env.REACT_APP_Web_scrapper);
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
        if (response === "Server not reachable") {
          let c = document.getElementById("responseText");
          animationContainer.remove();
          c.innerText = response;
          return;
        }
        const heading = document.getElementById("headingScrapper");
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
        if (response === "Server not reachable") {
          let c = document.getElementById("responseText");
          animationContainer.remove();
          c.innerText = response;
          return;
        }
        
        const heading = document.getElementById("headingScrapper");
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
