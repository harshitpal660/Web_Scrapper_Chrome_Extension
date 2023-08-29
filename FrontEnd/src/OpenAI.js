import OpenAI from 'openai';
// import { openAIapiSchema } from "./apiSchemaAi";


export async function AICall(dataMain,APIkey,isSummary) {
  // const { Configuration, OpenAIApi } = require("openai");
  // for summary
  const option1 = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",

        content:
          "I will give you the scrap data of websites you need to provide the formatted summary with Title, description, objectives, Conclusion. Summary should be around 500 words of the original text",
      },
    ],
    temperature: 1,
    max_tokens: 2048,
  }  

  // for large data
  const option2 = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:"I will provide you the scrapped data of any web site your task is to reduce the data by 50% and remove unnenecessay details and keywods from that such that the acctual meaning of the data won't change",

      },
      {
        role: "user",
        content:"",
        
      },
    ],
    temperature: 1,
    max_tokens: 2048,
  }  
  
// for major points
  const option3 = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "From the provided text generate the major points in a structured and formated way numberin is necessary, it should be around 400 words",
      },
    ],
    temperature: 1,
    max_tokens: 2048,
  } 


  const openai = new OpenAI({
    apiKey: APIkey // This is also the default, can be omitted
  });
 
  // as theres a limit of 2048 tokens we must convert long data into chunks 2048 tokens has a limit of (1248,1568)
  let final_array = [];
  console.log("Main "+WordCount(dataMain));
  try{
    console.log("final Array count"+ WordCount(final_array.join(" ")));
    while(WordCount(final_array.join(" "))>1200 || final_array.length===0){
    // console.log("okkk");
    let data = final_array.join(" ");
    // console.log("data "+data);
    console.log("type of data "+typeof data);
    if(final_array.length===0){
      console.log("l===0");
      data = cleanData(dataMain)
    }
    let final_array_inside = [];
    while(WordCount(data)>1200){
        console.log("before");
        console.log(data);
        let words = data.split(" ");
        console.log("after");
        let newAray = words.slice(0, 1200); // Get the first 1500 words
        let chunk = newAray.join(" ");
        // newAray = cleanData(newAray);
        // let userData = {role:"user",content:newAray.join(" ")};
        console.log("chunk "+WordCount(chunk));
        option2.messages[1].content = chunk;
        console.log(chunk);
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
    console.log("error "+e);
    dataMain = final_array.slice(0, 1000).join(" ");
    return LastCall(openai,dataMain,isSummary,option1,option3);
  }
  
  // try{
    dataMain = final_array.join(" ");
    
    return LastCall(openai,dataMain,isSummary,option1,option3);
  
    
  // }catch(e){
  //   console.error("error "+e);
  // }
  
  
}


async function LastCall(openai,dataMain,isSummary,option1,option3){
  console.log("datamain "+dataMain);
  console.log("issummary "+isSummary);
  console.log(option1);
  console.log(option3);
  if(isSummary==="summary"){
    option1.messages.push({"role":"user","content":dataMain});
    let chatCompletion = await openai.chat.completions.create(option1);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Summary"+WordCount(dataMain));
    console.log("gptAnswer of Summary"+WordCount(gptAnswer));
    return {gptAnswer,dataMain};
  }else{
    option3.messages.push({"role":"user","content":dataMain});
    let chatCompletion = await openai.chat.completions.create(option3);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    console.log("Main of Points"+WordCount(dataMain));
    console.log("gptAnswer of Points"+WordCount(gptAnswer));
    return {gptAnswer,dataMain};
  }
}

function WordCount(str) { 
  return str.split(" ").length;
}

function cleanData(str){
  console.log("before cleaning"+WordCount(str));
  str = str.replaceAll(",","")
  str = str.replaceAll("+","")
  str = str.replaceAll("-","")
  str = str.replaceAll("_","")
  str = str.replaceAll("/","")
  str = str.replaceAll("*","")
  str = str.replaceAll("&","")
  str = str.replaceAll(";","")
  str = str.replaceAll(":","")
  str = str.replaceAll("$","")
  str = str.replaceAll("|","")
  str = str.replaceAll("/n","")
  str = str.replace(/[0-9]/g, ''); // to remove digits
  str = str.replace(/[^\x00-\x7F]/g, ''); // to remove other language than english
  str = str.replace(/\s+/g, " ").trim(); // remove unnecessary spaces
  str = str.replace(/\([^)]*\)/g, ''); // remove content within parentheses
  console.log("before cleaning"+WordCount(str));
  return str;
}