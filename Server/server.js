const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const cors = require('cors'); // Import the cors package

app.use(cors());

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
      const divArray = [];
      // Loop through each <p> element and extract its text content
      
      allpTags.forEach((pTag) => {
        textArray.push(pTag.innerText);
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
     
      const data = [extractedTextp,extractedTextd];
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

app.post("/gallery", async (req, res) => {
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
      const allimgTags = document.querySelectorAll("img");
      const imgArray = []; // Array to store the extracted images

      

      allimgTags.forEach((imgTag) => {
        let newImg = {alt:imgTag.alt, src:imgTag.src};
        imgArray.push(newImg)
      });
     
      return imgArray.length>0 ? imgArray : 'Data not found';
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
