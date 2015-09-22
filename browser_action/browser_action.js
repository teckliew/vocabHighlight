var port = chrome.runtime.connect({name:"popup-port"});
port.postMessage({
  status: "popup open!"
});
//handle event click and sends status to background.js
function offHandler() {
    port.postMessage({status: false}, function(response) {
        //this.close(); // close the popup when the background finishes processing request
    });
    document.getElementById('toggleExt-off').checked = true;
}
function onHandler() {
  port.postMessage({status: true});
  document.getElementById('toggleExt-on').checked = true;
}
function categorySelect() {
  var categoryS = this.innerHTML;
  port.postMessage({category: categoryS});
}
function colorSelect() {
  var colorS = this.innerHTML;
  port.postMessage({color: colorS});
}
//popup onload
window.onload = function() {
  var categoryList = document.getElementById('category-select').getElementsByTagName('li');
  var colorList = document.getElementById('color-select').getElementsByTagName('li');
  for(var i = 0; i < categoryList.length; i ++){
    categoryList[i].addEventListener('click', categorySelect);
  }
  for(var j = 0; j < colorList.length; j ++){
    colorList[j].addEventListener('click', colorSelect);
  }
  
  document.getElementById('toggleExt-on').checked = true;
  port.postMessage({status: true});
  document.getElementById('category-select').addEventListener('click', divtest);
};

//event listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggleExt-off').addEventListener('click', offHandler);
    document.getElementById('toggleExt-on').addEventListener('click', onHandler);
});
