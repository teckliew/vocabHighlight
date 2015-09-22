//Opens up a long-lived connection to background.js with port.name === 'injectjs'
var port = chrome.runtime.connect({name:"injectjs"});

//create new element helper
function WDcreateElement(tagName, className, fn) {
  var element = document.createElement(tagName);
  element.className = className;
  fn(element);
}

//Highlight vocab
function WDhighlighter(text, highlighter) {
	var wordiemBody = document.getElementsByTagName('body')[0];
	var query = new RegExp("(\\b" + text + "\\b)", "gim");
	//define highlight function
	function findAndHighlight(node) {
		var next;
		if (node.nodeType === 1) {
				// (Element node)
				if (!!(node = node.firstChild)) {
						do {
								// Recursively call findAndHighlight on each child node
								next = node.nextSibling;

								findAndHighlight(node);
						} while(!!(node = next));
				}
		} else if (node.nodeType === 3) {
			// (Text node)
			if (query.test(node.data)) {
				//matching query

        if(!highlighter){
          //console.log('unhighlight this node!');
          unhighlightNode(node, text);
        }

        //check if highlighted already
				if ($(node).parent().hasClass('wordiem-highlight')){
					//check if already highlighted. if already highlighted return false
					return false;
				}else{
					//apply highlight class unobstructively
          if(highlighter === "highlight"){
  					highlightNode(node);
  					//console.log('FOUND A MATCH!');
          }
				}

			}
		}
	}
  //highlight
	function highlightNode(textNode) {
		//place holder div
		var temp = document.createElement('div');
		//span highlight class to be added to matching query
		temp.innerHTML = textNode.data.replace(query, '<span class="wordiem-highlight">$1</span>');
		// Extract produced nodes and insert them before original textNode:
		while (temp.firstChild) {
				textNode.parentNode.insertBefore(temp.firstChild, textNode);
		}
		// Remove original text-node
		textNode.parentNode.removeChild(textNode);
	}
  //unhighlight
  function unhighlightNode(textNode, text) {
    //target the enclosing span with highlight class
    var originHighlight = textNode.parentNode;
    //place holder div
    var temp = document.createElement('div');
    //replace span with normal text
    temp.innerHTML = text;
    // Extract produced nodes and insert them before original textNode:
    while (temp.firstChild) {
				originHighlight.parentNode.insertBefore(temp.firstChild, originHighlight);
		}
    // Remove original text-node
    originHighlight.parentNode.removeChild(originHighlight);
	}

	//run highlight function on body
	findAndHighlight(wordiemBody);
}
