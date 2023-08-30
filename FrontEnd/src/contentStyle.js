export const style = document.createElement("style");
style.textContent = `
  .wrapper{
    z-index:10000000000;
    position: absolute !important;
    top: 10px !important;
    left:50% !important;
    transform: translate(-50%) !important;
    width: fit-content !important;
  }
  .extensionButton{
    padding: 3px !important;
    margin: 5px !important;
    border-radius: 5px !important;
    background-color: rgb(214,235,252) !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    cursor:pointer;
    background-color: rgb(204,38,83) !important;
  }
  #slider{
    background-color: rgb(214,235,252);
    display:flex;
    flex-direction:row;
    flex-wrap: nowrap;
  }
  .aiData{
    height: 70% !important;
    width: 95% !important;
    top: 100px !important;
    left:50% !important;
    border-radius: 10px;
    transform: translate(-50%) !important;
    z-index:100000000000;
    position: absolute !important;
    text-align: justify !important;
    background-color: rgb(32,33,36,0.9) !important;
    overflow-y:scroll !important;
    overflow-x:wrap !imprtant;
    padding: 10px;
    font-family: "Lucida Console", "Courier New", monospace !important;

  }
  .aiData p{
    color: white !important;
    display: inline-block !important;
    white-space: nowrap !important;
  }
  .aiData h1{
    font-size: 30px !important;
    color: white !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    text-align: center;
  }
  .aiData::-webkit-scrollbar {
    display: none !important;
  }

  #close{
    cursor: pointer;
  }


  #animationContainer{
    border: 3px solid black !important;
    border-radius: 5px !important;
    overflow: hidden !important;
    width: 100% !important;
    position: absolute !important;
    top: 50% !important;
    left:50% !important;
    transform: translate(-50%,-50%) !important;
  }

  #animation{
    color: white !important;
    width: 500px;
    /* animation properties */
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    
    -moz-animation: my-animation 15s linear infinite;
    -webkit-animation: my-animation 15s linear infinite;
    animation: my-animation 15s linear infinite;
  }
  /* for Firefox */
@-moz-keyframes my-animation {
  from { -moz-transform: translateX(100%); }
  to { -moz-transform: translateX(-100%); }
}

/* for Chrome */
@-webkit-keyframes my-animation {
  from { -webkit-transform: translateX(100%); }
  to { -webkit-transform: translateX(-100%); }
}

@keyframes my-animation {
  from {
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
  to {
    -moz-transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}

#image-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding:3px;
  color: white;
  justify-content:space-around;
}

.image-wrapper:nth-child(even) {
  background-color: rgb(60,62,66,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}
.image-wrapper:nth-child(odd) {
  background-color: rgb(104,104,104,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}

.imgDiv{
  height: 250px;
  width: 250px;
  margin: auto;
}
.image{
  height: 100%;
  width: 100%;
}
.imgHeading{
  color:white;
  text-align:center;
  margin:0;
  padding:0;
}
#close{
  width: fit-content; /* Set a width and height to make it round */
  height: 20px;
  border-radius: 5%; /* This creates the round shape */
  background-color: rgb(253,0,0); /* Background color of the button */
  color: rgb(32,33,36); /* Text color */
  border: none; /* No border */
  cursor: pointer; /* Show pointer cursor on hover */
  text-align: center;
  margin:10px;
}
#copy{
  width: fit-content; /* Set a width and height to make it round */
  height: 20px;
  border-radius: 5%; /* This creates the round shape */
  background-color: rgb(51,167,82); /* Background color of the button */
  color: rgb(32,33,36); /* Text color */
  border: none; /* No border */
  cursor: pointer; /* Show pointer cursor on hover */
  text-align: center;
  margin:10px;
}

#actionButtons{
  position: fixed;
  bottom: 10px;
  left:50%;
  // transform:translate(-200%);
  display:flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: center;
}

  
`;