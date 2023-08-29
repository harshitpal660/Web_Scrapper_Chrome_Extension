import OpenAI from "openai";
import { option1, option2, option3 } from "./option";
import { cleanData, WordCount } from "./utils";

export async function AICall2(dataMain, APIkey, isSummary) {
  const openai = new OpenAI({
    apiKey: APIkey,
  });

  // as theres a limit of 2048 tokens we must convert long data into chunks 2048 tokens has a limit of (1000,1568)
  let final_array = [];
  console.log("Main " + WordCount(dataMain));

  const maxRequestsPerMinute = 3;
  const apiCallDelay = 60000; // Delay in milliseconds between API calls
  let requestsThisMinute = 0; // Counter for tracking requests
  let totalTokensUsed = 0; // Counter for tracking tokens used

  try {
    while (
      WordCount(final_array.join(" ")) > 1000 ||
      final_array.length === 0
    ) {
      let data = final_array.join(" ");
      if (final_array.length === 0) {
        data = cleanData(dataMain);
      }
      let final_array_inside = [];

      // Create an array to hold API call promises
      const apiCallPromises = [];

      while (WordCount(data) > 1000) {
        let words = data.split(" ");
        let newAray = words.slice(0, 1000);
        let chunk = newAray.join(" ");
        option2.messages[1].content = chunk;

        // Check if making this API call will exceed the rate limit

        console.log(
          totalTokensUsed + WordCount(chunk) <= 10000 &&
            requestsThisMinute < maxRequestsPerMinute
        );
        if (totalTokensUsed + WordCount(chunk) <= 5000) {
          totalTokensUsed += WordCount(chunk);
          requestsThisMinute++;

          // Push the API call promise to the array
          apiCallPromises.push(
            openai.chat.completions
              .create(option2)
              .then(
                (chatCompletion) => chatCompletion.choices[0].message.content
              )
              .catch((error) => {
                console.error("API call error:", error);
                throw error;
              })
          );
        } else {
          // Delay before making the next API call
          await new Promise((resolve) => setTimeout(resolve, apiCallDelay));
          totalTokensUsed = 0; // Reset tokens used after the delay
          requestsThisMinute = 0; // Reset the requests counter after the delay
        }

        data = words.slice(1000).join(" ");
      }

      if (WordCount(data) > 0) {
        final_array_inside.push(data);
      }

      // Wait for all API calls to finish concurrently
      const apiCallResults = await Promise.all(apiCallPromises);

      final_array_inside.push(...apiCallResults);
      final_array = [...final_array_inside];
    }
  } catch (e) {
    console.log("error " + e);
    dataMain = final_array.slice(0, 1000).join(" ");
    return LastCall(openai, dataMain, isSummary, option1, option3);
  }

  dataMain = final_array.join(" ");
  return LastCall(openai, dataMain, isSummary, option1, option3);
}

async function LastCall(openai, dataMain, isSummary, option1, option3) {
  // console.log("datamain "+dataMain);
  // console.log("issummary "+isSummary);
  // console.log(option1);
  // console.log(option3);
  if (isSummary === "summary") {
    option1.messages.push({ role: "user", content: dataMain });
    let chatCompletion = await openai.chat.completions.create(option1);
    let gptAnswer = chatCompletion.choices[0].message.content;

    // const Total_chunks = final_array.length;
    //   console.log("Main of Summary"+WordCount(dataMain));
    //   console.log("gptAnswer of Summary"+WordCount(gptAnswer));
    return { gptAnswer, dataMain };
  } else {
    option3.messages.push({ role: "user", content: dataMain });
    let chatCompletion = await openai.chat.completions.create(option3);
    let gptAnswer = chatCompletion.choices[0].message.content;

    //   // const Total_chunks = final_array.length;
    //   console.log("Main of Points"+WordCount(dataMain));
    //   console.log("gptAnswer of Points"+WordCount(gptAnswer));
    return { gptAnswer, dataMain };
  }
}
