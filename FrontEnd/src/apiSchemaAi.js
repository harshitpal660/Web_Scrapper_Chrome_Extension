export const openAIapiSchema = [
  {
    id: "summary",
    option: {
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
    },
  },
  {
    id: "summary",
    option: {
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
    },
  },
  {
    id: "points",
    option: {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "summarize the content you are provided into major points and give in formatted order",
        },
      ],
      temperature: 1,
      max_tokens: 2048,
    },
  }
];
