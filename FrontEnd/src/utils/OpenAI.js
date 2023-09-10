import OpenAI from "openai";
// import { openAIapiSchema } from "./apiSchemaAi";
import { option1, option2, option3 } from "./option";
import { cleanData, WordCount } from "./helper";

// limitations of free tier
// - Max 2048 tokens can be sent in one request or 2048 tokens can stay in context memory of model
// - Max 40000 tokens/min is allowed to send
//  -Max 3 req/min is allowed
//  -Max 200 req/day is allowed


export async function AICall(dataMain, APIkey, isSummary, tabID) {
  console.log("inside AICall"+APIkey);
  const openai = new OpenAI({
    apiKey: APIkey,
  });
  dataMain = cleanData(dataMain);
  // as theres a limit of 2048 tokens we must convert long data into chunks 2048 tokens has a limit of (1248,1568)
  let final_array = [];
  const TOTAL_DATA = WordCount(dataMain);
  let maxCalls = Math.ceil(TOTAL_DATA / 1200); // we will go max 10 api calls
  let callsTillnow = 0;
  console.log("Main " + TOTAL_DATA);
  let percentage = 0;
  let chunkSize = 1200;

  while (
    (WordCount(final_array.join(" ")) > chunkSize ||
      final_array.length === 0) && (callsTillnow <= maxCalls)
  ) {
    // console.log("okkk");
    let final_array_inside = [];
    try {
      let data = final_array.join(" ");
      // console.log("data "+data);
      console.log("type of data " + typeof data);
      if (final_array.length === 0) {
        console.log("l===0");
        data = dataMain;
      }
      
      while (WordCount(data) > chunkSize) {
        callsTillnow++;
        percentage = (callsTillnow / maxCalls) * 100;
        // console.log("before");
        // console.log(data);
        let words = data.split(" ");
        // console.log("after");
        let newAray = words.slice(0, chunkSize); // Get the first 1500 words
        let chunk = newAray.join(" ");
        // newAray = cleanData(newAray);
        // let userData = {role:"user",content:newAray.join(" ")};
        // console.log("chunk " + WordCount(chunk));
        option2.messages[1].content = chunk;
        // console.log(chunk);

        // i am using setTimeout so that it won't give rate limit 3req/min error
        const chatCompletion = await openai.chat.completions.create(option2);
        updateLoader(percentage, tabID);
        console.log("percentage " + percentage);

        let gptAnswer = chatCompletion.choices[0].message.content;
        final_array_inside.push(gptAnswer);
        // console.log("reply " + WordCount(gptAnswer));
        // Update 'data' to remove the processed chunk
        data = words.slice(chunkSize).join(" ");
        // console.log("remaining " + WordCount(data));
      }
      if (WordCount(data) > 0) {
        console.log("okk");
        final_array_inside.push(data); // Add any remaining text if it's less than 1500 words
        console.log(
          "final array inside " + WordCount(final_array_inside.join(" "))
        );
      }

      final_array = [...final_array_inside];
      console.log("final array " + WordCount(final_array.join(" ")));
    }catch (e) {
      console.log("error " + e);
      await new Promise(resolve => setTimeout(resolve, 30000));  
      // final_array = [...final_array_inside];
      chunkSize = WordCount(dataMain) - WordCount(dataMain)*0.1

      dataMain = final_array_inside.slice(0, chunkSize).join(" "); 
    }
  } 

  dataMain = final_array.join(" ");

    return LastCall(openai, dataMain, isSummary, tabID);

}

async function LastCall(openai, dataMain, isSummary, tabID) {
  console.log("datamain " + dataMain);
  console.log("issummary " + isSummary);
  console.log(option1);
  console.log(option3);
  // console.log("loadingColor");
  // console.log(loadingColor);
  const percentage = 100;
  updateLoader(percentage, tabID);
  let status = "pending" //for error handling
  while(status ==="pending"){
    try{
      if (isSummary === "summary") {
      option1.messages[1].content = dataMain;
      let chatCompletion = await openai.chat.completions.create(option1);
      let gptAnswer = chatCompletion.choices[0].message.content;
  
      // const Total_chunks = final_array.length;
      console.log("Main of Summary" + WordCount(dataMain));
      console.log("gptAnswer of Summary" + WordCount(gptAnswer));

      status = "success"

      return { gptAnswer, dataMain };
    } else {
      option3.messages[1].content = dataMain;
      let chatCompletion = await openai.chat.completions.create(option3);
      let gptAnswer = chatCompletion.choices[0].message.content;
  
      // const Total_chunks = final_array.length;
      console.log("Main of Points" + WordCount(dataMain));
      console.log("gptAnswer of Points" + WordCount(gptAnswer));

      status = "success"
      return { gptAnswer, dataMain };
    }}catch(e){
      let chunkSize = WordCount(dataMain) - WordCount(dataMain)*0.1
      dataMain = dataMain.split(/\s+/).slice(0, chunkSize);
      dataMain = dataMain.join(' ')
      console.log("error"+e);
      await new Promise(resolve => setTimeout(resolve, 30000));  
    }
  }

  
}


function updateLoader(percentage, tabID) {
  console.log("tabId " + tabID);
  chrome.tabs.sendMessage(tabID, { action: "updateProgress", percentage: percentage });
}