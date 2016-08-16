loadScripts();

function loadScripts(){
    chrome.tabs.executeScript(null, {file: "./js/remove_buzzwords.js"});
}

/* definitions for actions run via listeners */
function click(e) {
  //alert("running: " + e.target.id);  if(e. then do this)
  if(e.target.id == "buzzkill"){
    chrome.tabs.executeScript(null, {code: "removeBuzzwords(false)"});
  } else if(e.target.id == "buzzkill_redefine"){
    chrome.tabs.executeScript(null, {code: "removeBuzzwords(true)"});
  } else {
    alert("invalid selection");
  }

  //window.close();
}

/* actions to bind to popup.html from chrome extension button */
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
