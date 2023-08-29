// export const openAIapiSchema = [
//   {
//     id: "summary",
    
//   },
//   {
//     id: "summary",
//   },
//   {
//     id: "points",
//   }
// ];
// const { encode, decode } = require('gpt-3-encoder');

// const str = 'This is an example sentence to try encoding out on!'
// const encoded = encode(str)
// console.log('Encoded this string looks like: ', encoded)

// console.log('We can look at each token and what it represents')
// for(let token of encoded){
//   console.log({token, string: decode([token])})
// }

// const decoded = decode(encoded)
// console.log('We can decode it back into:\n', decoded)
//  let str = "+(বাংলাদেশ)ghjgjh_g653645jhbjhb'h56435jbjkn----hj/nhnjjjj634jjjjjj"
//  console.log("before cleaning"+str);
//  str = str.replaceAll(",","")
//  str = str.replaceAll("+","")
//  str = str.replaceAll("-","")
//  str = str.replaceAll("_","")
//  str = str.replaceAll("/","")
//  str = str.replaceAll("*","")
//  str = str.replaceAll("&","")
//  str = str.replaceAll(";","")
//  str = str.replaceAll(":","")
//  str = str.replaceAll("$","")
//  str = str.replaceAll("|","")
//  str = str.replaceAll("/n","")
//  str = str.replace(/[0-9]/g, ''); // to remove digits
//  str = str.replace(/[^\x00-\x7F]/g, ''); // to remove other language than english
//  str = str.replace(/\s+/g, " ").trim(); // remove unnecessary spaces
//  str = str.replace(/\([^)]*\)/g, ''); // remove content within parentheses
//  console.log("after cleaning"+str);

let myObject = {
    name: "Alice",
    age: 25,
    city: "Wonderland"
  };

  for (let key in myObject) {
    if (myObject.hasOwnProperty(key)) {
      console.log(key, myObject[key]);
    }
  }