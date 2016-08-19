loadScripts();

function loadScripts(){
    chrome.tabs.executeScript(null, {file: "./js/remove_buzzwords.js"});
}

/* definitions for actions run via listeners */
function click(e) {
  //alert("running: " + e.target.id);  if(e. then do this)
  if(e.target.id == "buzzkill"){
    chrome.tabs.executeScript(null, {code: "PageBuzzKillerInstance.removeBuzzwords(false)"});
  } else if(e.target.id == "buzzkill_redefine"){
    chrome.tabs.executeScript(null, {code: "PageBuzzKillerInstance.removeBuzzwords(true)"});
  } else if(e.target.id == "buzzkill_highlight"){
    chrome.tabs.executeScript(null, {code: "PageBuzzKillerInstance.highlightBuzzwords(true)"});
  } else {
    alert("invalid selection");
  }

  //wait for message to display percent complete before closing
  window.close();
}

/* actions to bind to popup.html from chrome extension button */
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
