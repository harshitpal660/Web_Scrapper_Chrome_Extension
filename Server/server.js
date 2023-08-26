const express = require("express");
// const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
// const { all } = require("axios");
// const cors = require('cors');
const app = express();

// app.use(cors({
//   // origin: 'chrome-extension://fmgdfaghbeaeipamifhgmdfdakdmnnnd', // Replace with your extension's ID
//   // credentials: true,
// }));

app.use(express.json());
app.post("/scrape", async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url,{
      waitUntil: 'networkidle2',
      timeout: 60000, // Increased timeout value
    });
    // await page.waitForSelector('p', { timeout: 10000 }); 
    await page.screenshot({ path: "website.png" });
    
      // Add error handling for network requests
      page.on("requestfailed", (request) => {
        console.error("Request failed:", request.url());
      });

    // Perform scraping operations using Puppeteer
    const scrapedData = await page.evaluate(() => {
      // Example: Extract text from a specific element
      const allpTags = document.querySelectorAll("p");
      const allimgTags = document.querySelectorAll("img");
      const alldivTags = document.querySelectorAll("div");
      // console.log(allpTags);
      const textArray = []; // Array to store the extracted text
      const imgArray = []; // Array to store the extracted images
    
      const divArray = [];
      // Loop through each <p> element and extract its text content
      
      allpTags.forEach((pTag) => {
        textArray.push(pTag.innerText);
      });

      allimgTags.forEach((imgTag) => {
        imgArray.push(imgTag.src)
      });

      alldivTags.forEach((divTag) => {
        divArray.push(divTag.innerText);
      });

      // Join the extracted text into a single string
      const extractedTextp = textArray.join("\n");
      const extractedTextd = divArray.join("");
      // console.log(extractedText);
      // const imageJSON = JSON.stringify(imgArray, null, 2);
      // const extracteImages = imgArray.join("\n");
     
      const data = [extractedTextp,extractedTextd,{...imgArray}];
      return data.length>0 ? data : 'Data not found';
    });
    
    await browser.close();
    console.log(scrapedData);
    res.header("Content-Type", "application/json");
    res.json(scrapedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// app.get("/", async (req, res) => {
//   try {
//     res.json({ users: ["userOne", "userTwo", "userThree"] });
//   } catch (error) {
//     console.error("Error scraping:", error);
//     res.status(500).json({ error: "An error occurred while scraping." });
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
