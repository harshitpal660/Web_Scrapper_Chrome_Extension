import OpenAI from "openai";
// import { openAIapiSchema } from "./apiSchemaAi";
import { option1, option2, option3 } from "./option";
import { cleanData, WordCount } from "./helper";

// limitations of free tier
// - Max 2048 tokens can be sent in one request or 2048 tokens can stay in context memory of model
// - Max 40000 tokens/min is allowed to send
//  -Max 3 req/min is allowed
//  -Max 200 req/day is allowed

let maxCalls = null; // we will go max 10 api calls
export async function AICall(dataMain, APIkey, isSummary) {
  const openai = new OpenAI({
    apiKey: APIkey, // This is also the default, can be omitted
  });
  dataMain = cleanData(dataMain);
  // as theres a limit of 2048 tokens we must convert long data into chunks 2048 tokens has a limit of (1248,1568)
  let final_array = [];
  const TOTAL_DATA = WordCount(dataMain);

 
  maxCalls = Math.ceil(TOTAL_DATA / 1200);
  let callsTillnow = 0;
  console.log("Main " + TOTAL_DATA + " maxCalls " + maxCalls);
  let percentage = 0;
  try {
    while (
      (WordCount(final_array.join(" ")) > 1200 ||
      final_array.length === 0) && (callsTillnow <= maxCalls)
    ) {
      // console.log("okkk");
      let data = final_array.join(" ");
      // console.log("data "+data);
      // console.log("type of data " + typeof data);
      if (final_array.length === 0) {
        // console.log("l===0");
        data = dataMain;
      }
      let final_array_inside = [];
      while (WordCount(data) > 1200  && callsTillnow <= maxCalls) {
        callsTillnow++;
        percentage = (callsTillnow / maxCalls) * 100;
        // setTimeout(()=>{
          
        // },500);
        console.log(callsTillnow + "/" + maxCalls);
        console.log("percentage = " + percentage);
        // console.log("before");
        // console.log(data);
        let words = data.split(" ");
        // console.log("after");
        let newAray = words.slice(0, 1200); // Get the first 1500 words
        let chunk = newAray.join(" ");
        // newAray = cleanData(newAray);
        // let userData = {role:"user",content:newAray.join(" ")};
        console.log("chunk " + WordCount(chunk));
        option2.messages[1].content = chunk;
        // console.log(chunk);
        updateLoader(percentage);
        let chatCompletion = await openai.chat.completions.create(option2);
        
        let gptAnswer = chatCompletion.choices[0].message.content;
        final_array_inside.push(gptAnswer);
        console.log("reply " + WordCount(gptAnswer));
        // Update 'data' to remove the processed chunk
        data = words.slice(1200).join(" ");
        console.log("remaining " + WordCount(data));
        // maxCalls--; // incrementing calls
        // console.log(newAray);
      }
      if (WordCount(data) > 0) {
        console.log("okk");
        final_array_inside.push(data); // Add any remaining text if it's less than 1500 words
        // console.log(
        //   "final array inside " + WordCount(final_array_inside.join(" "))
        // );
      }

      final_array = [...final_array_inside];
      // final_array = [...final_array_inside];
      console.log("final array " + WordCount(final_array.join(" ")));
    }
  } catch (e) {
    console.log("error " + e);
    percentage = 90;
    updateLoader(percentage)
    final_array = [...final_array_inside];
    dataMain = final_array.slice(0, 1000).join(" ");

    return LastCall(openai, dataMain, isSummary);
  }

  dataMain = final_array.join(" ");

  return LastCall(openai, dataMain, isSummary);
}

async function LastCall(openai, dataMain, isSummary) {
  console.log("datamain " + dataMain);
  console.log("issummary " + isSummary);
  console.log(option1);
  console.log(option3);
  const percentage = 100;
  // console.log("loadingColor");
  // console.log(loadingColor);
  if (isSummary === "summary") {
    option1.messages.push({ role: "user", content: dataMain });
    let chatCompletion = await openai.chat.completions.create(option1);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Summary" + WordCount(dataMain));
    console.log("gptAnswer of Summary" + WordCount(gptAnswer));
    updateLoader(percentage);
    return { gptAnswer, dataMain };
  } else {
    option3.messages.push({ role: "user", content: dataMain });
    let chatCompletion = await openai.chat.completions.create(option3);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Points" + WordCount(dataMain));
    console.log("gptAnswer of Points" + WordCount(gptAnswer));

    updateLoader(percentage);
    return { gptAnswer, dataMain };
  }
}


function updateLoader(percentage){
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId,{
        action: "updateProgress",
        percentage,
    });
    }
  });
}
