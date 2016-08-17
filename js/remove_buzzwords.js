var document_body_cache = document.body;
var buzzword_data = {};

var replace_selection = null;
var refresh_needed = false;

loadJSON('/js/buzzwords.json', 'buzzwords');      //load buzzword array
loadJSON('/js/definitions.json', 'definitions');  //load definitions array


/*Gathers Buzzword List & Definitions*/
function loadJSON(path, dest){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.readyState === XMLHttpRequest.DONE) { //only handle responses with defined text
        var data = xhr.responseText;
        var json_data = JSON.parse(data);
        buzzword_data[dest] = json_data;
      }
    }
  };
  xhr.open("GET", chrome.extension.getURL(path), true);
  xhr.send();
}


/*refreshes the document.body */
function reloadDocumentBody(){
  //document.body.innerHTML = document_body_cache.innerHTML;
  window.location.reload();
}

/*REMOVE OR REPLACE BUZZWORDS: replace -> redefines; !replace -> removes */
function removeBuzzwords(replace){
  //console.log("replace is: " + replace);
  //console.log("buzzwords are: "               + buzzword_data.buzzwords);
  //console.log("buzzwords definitions are: "   + buzzword_data.definitions);

  //updateRefreshBodyStatus(replace);

  var count = 0;  //total removal count
  var body = document.body;
  var regexOuter = /(>.*?<)/gi;
  var regexInnerArray = regexArrayGenerator(buzzword_data.buzzwords);
  var replacementsInnerArray = buzzword_data.definitions;

  var matches = body.innerHTML.match(regexOuter);
  for (var i=0; i<matches.length; i++){
      if(matches[i]!=='><' ){
          var inner_matches = [];
          for (var j=0; j<regexInnerArray.length; j++){
              var inner_match_array = matches[i].match(regexInnerArray[j]);
              if(inner_match_array){
                  if(replace){
                      updateBody(inner_match_array,regexInnerArray[j], replacementsInnerArray[j]);
                  } else {
                      updateBody(inner_match_array,regexInnerArray[j], "");
                  }
                  count+=inner_match_array.length;
              }
          }
      }
  }

  //update the contents of the counter div
  var counter_element = document.body.getElementsByTagName("count");
  //ounter_element.innerHTML = "Buzzwords: " + count;
  alert("buzzwords squashed: " + count );
}

//escape regex specific characters if found in string
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

//generate regex query array from array of search strings
function regexArrayGenerator(arr) {
  return arr.map(function(element){
      return new RegExp('(' + element.toString() + ')','gi');
  });
}

//generate regex query from single search string
function regexCaptureGroup(capture_string) {
    return new RegExp('(' + capture_string.toString() + ')','g');
}

/*updates DOM element by modifying matched innerHTML in array of matches, then
inserts that modified innerHTML to replace the previous innerHTML*/
function updateBody(arr_matches, regex, replacement){
    var body_innerHTML = document.body.innerHTML;

    for (var i=0; i<arr_matches.length; i++){
        var new_body_innerHTML = arr_matches[i].replace(regex, replacement);
        document.body.innerHTML = document.body.innerHTML.replace(regexCaptureGroup(arr_matches[i]), new_body_innerHTML);
    }
}

//specify the replacement word based on what it really means
