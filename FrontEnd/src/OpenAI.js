import OpenAI from 'openai';
import { openAIapiSchema } from "./apiSchemaAi";


export async function AICall(dataMain,APIkey,isSummary) {
  // const { Configuration, OpenAIApi } = require("openai");
  const option1 = openAIapiSchema[0].option;  // for summary
  const option2 = openAIapiSchema[1].option;  // for large data
  const option3 = openAIapiSchema[2].option;  // for major points
  const openai = new OpenAI({
    apiKey: APIkey // This is also the default, can be omitted
  });
 
  // as theres a limit of 2048 tokens we must convert long data into chunks 2048 tokens has a limit of (1248,1568)
  let final_array = [];
  console.log("Main "+WordCount(dataMain));
  try{while(WordCount(final_array.join(" "))>1200 || final_array.length===0){
    // console.log("okkk");
    let data = final_array.join(" ");
    // console.log("data "+data);
    console.log("type of data "+typeof data);
    if(final_array.length===0){
      data = dataMain;
    }
    let final_array_inside = [];
    while(WordCount(data)>1200){
        console.log("before");
        console.log(data);
        let words = data.split(" ");
        console.log("after");
        let newAray = words.slice(0, 1200); // Get the first 1500 words
        // let userData = {role:"user",content:newAray.join(" ")};
        console.log("chunk "+WordCount(newAray.join(" ")));
        option2.messages[1].content = newAray.join(" ");
        let chatCompletion = await openai.chat.completions.create(option2);
        let gptAnswer = chatCompletion.choices[0].message.content;
        final_array_inside.push(gptAnswer);
        console.log("reply "+WordCount(gptAnswer));
        // Update 'data' to remove the processed chunk
        data = words.slice(1200).join(" "); 
        console.log("remaining "+WordCount(data));
       
      // console.log(newAray);
    }
    if (WordCount(data) > 0) {
      console.log("okk");
      final_array_inside.push(data); // Add any remaining text if it's less than 1500 words
      console.log("final array inside "+WordCount(final_array_inside.join(" ")));
    }

    final_array = [...final_array_inside];
    // final_array = [...final_array_inside];
    console.log("final array "+WordCount(final_array.join(" ")));
  }}catch(e){
    console.log("error"+e);
    dataMain = final_array.join(" ");
    return LastCall(dataMain,isSummary,option1,option3);
  }
  
  // try{
    dataMain = final_array.join(" ");
    return LastCall(openai,dataMain,isSummary,option1,option3);
  
    
  // }catch(e){
  //   console.error("error "+e);
  // }
  
  
}


async function LastCall(openai,dataMain,isSummary,option1,option3){
  console.log(isSummary);
  console.log(option1);
  console.log(option3);
  if(isSummary==="summary"){
    option1.messages.push({"role":"user","content":dataMain});
    let chatCompletion = await openai.chat.completions.create(option1);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Summary"+WordCount(dataMain));
    console.log("gptAnswer of Summary"+WordCount(gptAnswer));
    return gptAnswer;
  }else{
    option3.messages.push({"role":"user","content":dataMain});
    let chatCompletion = await openai.chat.completions.create(option3);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Points"+WordCount(dataMain));
    console.log("gptAnswer of Points"+WordCount(gptAnswer));
    return gptAnswer;
  }
}

function WordCount(str) { 
  return str.split(" ").length;
}