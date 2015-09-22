//popup definition handler
//dependencies: jquery, "src/inject/helpers.js"
function WDpopDefinition() {

  //create popup definition div
  WDcreateElement('div', 'definition-container', function(popup) {
    document.getElementsByTagName('body')[0].appendChild(popup);
  });

  function popupHandler() {
    //currently clicked word
    var word = this.innerHTML.toLowerCase();
    var definitionContainer = $('.definition-container')[0];
    console.log(word);

    //popup location and properties
    var x = event.clientX;
    var y = event.clientY+window.pageYOffset+10;
    definitionContainer.style.display = 'block';
    definitionContainer.style.left = x+'px';
    definitionContainer.style.top = y+'px';
    definitionContainer.innerHTML = word;
    //close definition popup
    definitionContainer.addEventListener('click', function(){
      definitionContainer.style.display = 'none';
    });

    //create remove word button
    WDcreateElement('button', 'removeWordBtn', function(removeWordBtn) {
      removeWordBtn.innerHTML = 'Remove this word';
      document.getElementsByClassName('definition-container')[0].appendChild(removeWordBtn);
      //when clicked sends word to background.js to be removed
      removeWordBtn.addEventListener('click', function() {
        port.postMessage({
        	removeWord: word
        });
        //remove highlight class from deleted word
        WDhighlighter(word, false);
      });
    });
    //create pin word button
    WDcreateElement('button', 'removeWordBtn', function(removeWordBtn) {
      removeWordBtn.innerHTML = 'Pin this word';
      document.getElementsByClassName('definition-container')[0].appendChild(removeWordBtn);
      //when clicked sends word to background.js to be pinned
      removeWordBtn.addEventListener('click', function() {
        port.postMessage({
        	pinWord: word
        });
        //add special highlight class for pinned word
        //.....to be worked on
      });
    });
  }
  //number of highlighted words
  console.log($('.wordiem-highlight').length);

  //add onclick listener for pop up definition for each highlighted words
  var highlightClass = $('.wordiem-highlight');
  for(var i=0; i<highlightClass.length; i++){
        highlightClass[i].addEventListener('click', popupHandler, false);
  }
}
