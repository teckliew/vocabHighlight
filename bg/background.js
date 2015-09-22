// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

var vocabList = ['wine', 'juice'];
var vocabList2 = ['beverage'];
var vocabList3 = ['grapes'];
var ports = [];
console.log('initial list:');
console.log(vocabList);

var extToggle = true;
//customize options
chrome.runtime.onConnect.addListener(function(port){
  //check if new port
  if(port.name !== "popup-port") return;
  //add new ports to ports array
  ports.push(port);

  //remove port when destroyed
  port.onDisconnect.addListener(function(port) {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
  port.onMessage.addListener(function(msg, sndr, sndRsp) {
    //passing highlight color to inject.js
    console.log(msg.color);
    notifyInject({
      color: msg.color
    });

    //changing vocab list category
    console.log(msg.category);
    var category = msg.category;
    switch(category){
  		case 'Biology':
        notifyInject({
          vocab: vocabList
        });
  			break;
  		case 'Chemistry':
        notifyInject({
          vocab: vocabList2
        });
  			break;
  		case 'Law':
        notifyInject({
          vocab: vocabList3
        });
  			break;
  	}

    //toggle extensionSwitch
    var status = msg.status;
    console.log(status);
    extToggle = status;
    if(extToggle){
      chrome.browserAction.setBadgeText({text: ""});
      extToggle = true;
      notifyInject({
        extSwitch: extToggle
      });
      console.log('ext is on');
    }
    else{
      chrome.browserAction.setBadgeText({text: "off"});
      extToggle = false;
      notifyInject({
        extSwitch: extToggle
      });
      console.log('ext is off');
    }
  });
});


console.log('extToggle is:');
console.log(extToggle);
//connect to port
chrome.runtime.onConnect.addListener(function(port){
  //check if new port
  if(port.name !== "injectjs") return;
  //add new ports to ports array
  ports.push(port);

  //remove port when destroyed
  port.onDisconnect.addListener(function(port) {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });

  //popup-port listener
  // if(port.name == "popup-port"){
  //   port.onMessage.addListener(function(msg, sndr, sndRsp) {
  //     var extensionSwitch = msg.status;
  //     console.log(extensionSwitch);
  //   });
  // }

  //receives injectjs message from port to delete and pin words
  port.onMessage.addListener(function(msg, sndr, sndRsp) {
    var messagefrominject = msg.hello;
    var wordToRemove = msg.removeWord;
    var pinWord = msg.pinWord;

    //pin word
    console.log(pinWord);
    //...... to be worked on

    //removing word from vocab
    if(typeof wordToRemove != 'undefined'){
      for (var i=0; i < vocabList.length; i++){
        if(vocabList[i] === wordToRemove){
          console.log('deleting word ' + vocabList[i] + '.');
          vocabList.splice(i, 1);
          console.log('now the list is:');
          console.log(vocabList);
        }
      }
    }

    //sends message to port
    port.postMessage({
      greeting:"This is from Background.js",
      portname: port.name,
      inject2bg2inject: messagefrominject,
      vocab: vocabList
    });
  });
});



//user to right-click to add word to vocab. Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Add '%s' to Wordiem";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context});
});
// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);
// The onClicked callback function.
function onClickHandler(info, tab) {
  var newWord = info.selectionText;
  alert('Adding "' + newWord + '"');
  vocabList.push(newWord);
  //update inject.js
  notifyInject({
    vocab: vocabList
  });
}
//sends message to inject.js
function notifyInject(msg) {
  ports.forEach(function(port) {
    port.postMessage(msg);
  });
  console.log(msg.vocab);
}
