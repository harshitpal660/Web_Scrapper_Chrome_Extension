export const option1 = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",

        content:
          "I will give you the scrap data of websites you need to provide the formatted summary with Title, description, objectives, Conclusion. Summary should be around 500 words of the original text and give pading between two sections",
      },
    ],
    temperature: 1,
    max_tokens: 2048,
  }  

  // for large data
  export const option2 = {
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
  export const option3 = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "From the provided text generate the major points in a structured and formated way numbering is necessary give some pading between two lines, it should be around 400 words",
      },
    ],
    temperature: 1,
    max_tokens: 2048,
  } 