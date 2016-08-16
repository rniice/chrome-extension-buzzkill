var buzzwords = null;
loadBuzzwords();

/*Gathers Buzzword List and Definitions*/
function loadBuzzwords(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.readyState === XMLHttpRequest.DONE) { //only handle responses with defined text
        var data = xhr.responseText;
        var json_data = JSON.parse(data);
        buzzwords = json_data;
      }
    }
  };
  xhr.open("GET", chrome.extension.getURL('/js/buzzwords.json'), true);
  xhr.send();
}

/*REMOVE OR REPLACE BUZZWORDS:
  --if replace == false, removes buzzwords from the DOM
  --if replace == true, redefines buzzwords from the DOM
*/
function removeBuzzwords(replace){
  console.log("replace is: " + replace);
  //console.log("removing buzzwords: " + buzzwords);
  var count = 0;  //total removal count

  var body = document.body;
  var regexOuter = /(>.*?<)/gi;
  var regexInnerArray = regexArrayGenerator(buzzwords);

  var matches = body.innerHTML.match(regexOuter);
  for (var i=0; i<matches.length; i++){
      if(matches[i]!=='><' ){
          var inner_matches = [];
          for (var j=0; j<regexInnerArray.length; j++){
              var inner_match_array = matches[i].match(regexInnerArray[j]);
              if(inner_match_array){
                  updateBody(inner_match_array,regexInnerArray[j], "");
                  count+=inner_match_array.length;
              }
          }
      }
  }

  //update the contents of the counter div
  var counter_element = document.body.getElementsByTagName("count");
  //ounter_element.innerHTML = "Buzzwords: " + count;
  alert("squashed: " + count );
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
