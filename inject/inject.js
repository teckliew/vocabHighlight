//highlighting script.
//dependencies: jquery, "src/inject/helpers.js", "src/inject/popDefinition.js"


//Sends message to port
port.postMessage({
	hello: "Hello from inject to background back to inject"
});




//receives message from port (from background.js)
port.onMessage.addListener(function(message,sender,sendResponse){
	//toggle extension off and on
	// var extToggle = true;
	// extToggle = message.extSwitch;
	// if(extToggle){
	// 	console.log('Extension is on');
	// }else{
	// 	console.log('Extension is off');
	// }

	//color changer
	var color = message.color;
	switch(color){
		case 'Sunny':
			$('.wordiem-highlight').css('background-color', 'yellow');
			break;
		case 'Bloody':
			$('.wordiem-highlight').css('background-color', 'red');
			break;
		case 'Watery':
			$('.wordiem-highlight').css('background-color', 'blue');
			break;
		case 'Foresty':
			$('.wordiem-highlight').css('background-color', 'green');
			break;
	}

	if (typeof message.vocab !== 'undefined'){
		//highlighter reset
		var highlightReset = document.getElementsByClassName('wordiem-highlight');
		for (var i = 0; i < highlightReset.length; i++){
			var text = highlightReset[i].innerHTML;
			WDhighlighter(text, false);
		}

		console.log(message.vocab);
		//message.vocab is the array. for each value in the array, find and highlight in the DOM
	  message.vocab.forEach(function(text){
			//highlighter from helper.js
	    WDhighlighter(text, "highlight");
	  });
		//attach eventlistener for popup definition. call from "src/inject/popDefinition.js"
		WDpopDefinition();
	}
});
