export const style = document.createElement("style");
style.textContent = `
  .webScrapperWrapper{
    z-index:10000000000;
    position: absolute !important;
    top: 10px !important;
    left:50% !important;
    transform: translate(-50%) !important;
    width: fit-content !important;
  }
  .webScrapperExtensionButton{
    padding: 3px !important;
    margin: 5px !important;
    border-radius: 5px !important;
    background-color: rgb(214,235,252) !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    cursor:pointer;
    background-color: rgb(204,38,83) !important;
  }
  .webScrapperExtensionButton:hover{
    transform: scale(1.1) !important;
    background-color: rgb(82,217,234) !important;
    box-shadow: 4px 4px 6px rgba(125,164,192,0.5); /* Horizontal offset, vertical offset, blur radius, color */
  }
  #webScrapperSlider{
    background-color: rgb(214,235,252);
    display:flex;
    flex-direction:row;
    flex-wrap: nowrap;
  }
  .webScrapperAiData{
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
  #webScrapperResponseText{
    color: white !important;
    display: inline-block !important;
  }
  .webScrapperAiData h1{
    font-size: 30px !important;
    color: white !important;
    font-family: "Lucida Console", "Courier New", monospace !important;
    text-align: center;
  }
  .webScrapperAiData::-webkit-scrollbar {
    display: none !important;
  }

  #webScrapperClose{
    cursor: pointer;
  }


  #webScrapperAnimationContainer{
    color: white !important;

    border: 3px solid black !important;
    border-radius: 5px !important;
    overflow: hidden !important;
    width: 100% !important;
    position: absolute !important;
    top: 90% !important;
    left:50% !important;
    transform: translate(-50%,-50%) !important;
  }

  #webScrapperAnimation{
    color: white !important;
    width: fit-content;
    /* animation properties */
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    
    -moz-animation: my-animation 10s linear infinite;
    -webkit-animation: my-animation 10s linear infinite;
    animation: my-animation 10s linear infinite;
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
#webScrapperAnimation p{
  white-space: nowrap;
}

#webScrapperImage-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding:3px;
  color: white;
  justify-content:space-around;
  // margin-top: 20px;
}

.webScrapperImage-wrapper:nth-child(even) {
  background-color: rgb(60,62,66,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}
.webScrapperImage-wrapper:nth-child(odd) {
  background-color: rgb(104,104,104,0.5);
  margin-top: 10px;
  width:100%;
  height:fit-content;
}

.webScrapperImgDiv{
  height: 250px;
  width: 250px;
  margin: auto;
}
.webScrapperImage{
  height: 100%;
  width: 100%;
}
.webScrappermgHeading{
  color:white;
  text-align:center;
  margin:0;
  padding:0;
}
#webScrapperClose{
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
#webScrapperCopy{
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

#webScrapperActionButtons{
  position: relative;
  // bottom: 5px;
  left:50%;
  transform:translate(-50%);
  display:flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: center;
}

.webScrapperProgress{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  height: 10px;
  width: 70%;
  border: 2px solid #f4a261;
  border-radius: 15px;
  margin:auto;
  background-color: #696b6a;

}
.webScrapperProgress .webScrapperColor{
  position: relative;
  background-color: #d45d77;
  width: 0px;
  height: 10px;
  border-radius: 15px;
  transition: width linear;
}
`