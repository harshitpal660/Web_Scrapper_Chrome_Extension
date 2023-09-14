
# Hi, I'm Harshit Pal! 👋


# Web Scrapper

The Chrome Extension for Web Scraping and Summarization is a powerful tool designed to streamline the process of extracting valuable information from web pages and generating concise summaries. Built using a combination of React, Node.js, Puppeteer, and OpenAI API, this extension empowers users to effortlessly gather essential content and create informative summaries and key points.


## Run Locally

#### Fork the project
![fork](https://static.javatpoint.com/tutorial/git/images/git-fork.png)

#### Clone the project
run this command in your project parent directory
```bash
  git clone https://github.com/harshitpal660/Web_Scrapper_Chrome_Extension.git
```

#### Go to the project directory

```bash
  cd .\Web_Scrapper_Chrome_Extension\FrontEnd\
```
```bash
  cd .\Web_Scrapper_Chrome_Extension\Server\
```

#### Install dependencies
Run this command in both Frontend and Server Directory
```bash
  npm install
```

#### Start the server
this will make your nodejs server gets running on localhost port 3001
```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_Web_Scrapper`="Your_API_KEY"

#### Create your own API_KEY
 step 1. navgate to https://openai.com/blog/openai-api and create your account
![Homepage](https://uploads-ssl.webflow.com/5f88a8a806465b832e2951aa/6469d570e56849aa8a67c25c_openai-api-key-screen-2.png)

 
step 2. After logging in, in the top right corner of your screen you'll see an icon with your account name. Click it to open the dropdown menu then click "View API keys".
![view API](https://uploads-ssl.webflow.com/5f88a8a806465b832e2951aa/6469d59ef01604a84f634939_openai-api-key-screen-3.png)


step 3. ‍Now you're in the API keys section, you should see a button "Create new secret key". Click on that button to generate a new API key.
![Create API](https://uploads-ssl.webflow.com/5f88a8a806465b832e2951aa/6469d5c5f01604a84f6364ad_openai-api-key-screen-4.png)


step 4. ‍Enter a name for your key, click the "Create secret key" button.
![Create API](https://uploads-ssl.webflow.com/5f88a8a806465b832e2951aa/6469d828492ea69c34c91379_openai-api-key-screen-5.png)

step 5. It's very important that you copy this key and save it somewhere secure, as you won't be able to retrieve it again for security reasons. You'll need this key to authenticate your applications with OpenAI's services.
![Create API](https://uploads-ssl.webflow.com/5f88a8a806465b832e2951aa/6469d87c4014ad9e8d9ab855_openai-api-key-screen-6.png)

#### 🔖 Note

Environment variable should always starts with **REACT_APP_Web_Scrapper** 

store your key and value in .env file which is located in root directory of the project 

```
`REACT_APP_Web_Scrapper`="Your_API_KEY"
```


## Bundle all files

Inside Frontend directory run command. It will generate a dist folder inside your Frontend directory load that in your chrome browser and enjoy scrapping
```bash
  npm run build
```
after bundling all files you'll get a bundled folder named **'dist'** inside **'FrontEnd'** folder

## Load dist in Chrome Extensions
step 1. Goto Chrome Settings using three dots on the top right corner.
![chrome](https://cdnblog.webkul.com/blog/wp-content/uploads/2019/07/15065417/1-2.png)

step 2. Then Select Extensions.
![chrome](https://cdnblog.webkul.com/blog/wp-content/uploads/2019/07/15065541/2-3.png)
You may directly open extensions using chrome://extensions

step 3. Now, Enable developer mode
![chrome](https://cdnblog.webkul.com/blog/wp-content/uploads/2019/07/15065714/3-2.png)

step 4. Click on Load Unpacked and select your ***dist*** folder.
![chrome](https://cdnblog.webkul.com/blog/wp-content/uploads/2019/07/15065849/4-3.png)

step 5. The extension will be installed now.


## Demo

link to demo

https://drive.google.com/file/d/1StCfqHVF4kwYXWCXNWS7b6UBdDmhvg2w/view?usp=sharing
