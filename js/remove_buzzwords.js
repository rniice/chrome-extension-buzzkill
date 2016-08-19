var BuzzKill = function BuzzKill(body_data){
  this.document_body_cache = body_data;
  this.buzzword_data = {};
  this.replace_selection = null;
  this.refresh_needed = false;
};

/*Gathers Buzzword List & Definitions*/
BuzzKill.prototype.loadJSON = function(path, dest){
  var xhr = new XMLHttpRequest();

  var that = this;  //getting local scope for callback function
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.readyState === XMLHttpRequest.DONE) { //only handle responses with defined text
        var data = xhr.responseText;
        var json_data = JSON.parse(data);
        that.buzzword_data[dest] = json_data;
      }
    }
  };
  xhr.open("GET", chrome.extension.getURL(path), true);
  xhr.send();
};

/*refreshes the document.body */
BuzzKill.prototype.reloadDocumentBody = function(){
  //document.body.innerHTML = document_body_cache.innerHTML;
  window.location.reload();
};

/*REMOVE OR REPLACE BUZZWORDS: replace -> redefines; !replace -> removes */
BuzzKill.prototype.removeBuzzwords = function(replace){

  //updateRefreshBodyStatus(replace);
  var count = 0;  //total removal count
  var body = document.body;
  var regexOuter = /(>.*?<)/gi;
  var regexInnerArray = this.regexArrayGenerator(this.buzzword_data.buzzwords);
  var replacementsInnerArray = this.buzzword_data.definitions;

  var matches = body.innerHTML.match(regexOuter);
  for (var i=0; i<matches.length; i++){
      if(matches[i]!=='><' ){
          var inner_matches = [];
          for (var j=0; j<regexInnerArray.length; j++){
              var inner_match_array = matches[i].match(regexInnerArray[j]);
              if(inner_match_array){
                  if(replace){
                      this.updateBody(inner_match_array,regexInnerArray[j], replacementsInnerArray[j]);
                  } else {
                      this.updateBody(inner_match_array,regexInnerArray[j], "");
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
};

//escape regex specific characters if found in string
BuzzKill.prototype.escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

//generate regex query array from array of search strings
BuzzKill.prototype.regexArrayGenerator = function(arr) {
  return arr.map(function(element){
      return new RegExp('(' + element.toString() + ')','gi');
  });
};

//generate regex query from single search string
BuzzKill.prototype.regexCaptureGroup = function(capture_string) {
    return new RegExp('(' + capture_string.toString() + ')','g');
};

/*updates DOM element by modifying matched innerHTML in array of matches, then
inserts that modified innerHTML to replace the previous innerHTML*/
BuzzKill.prototype.updateBody = function(arr_matches, regex, replacement) {
    var body_innerHTML = document.body.innerHTML;

    for (var i=0; i<arr_matches.length; i++){
        var new_body_innerHTML = arr_matches[i].replace(regex, replacement);
        document.body.innerHTML = document.body.innerHTML.replace(this.regexCaptureGroup(arr_matches[i]), new_body_innerHTML);
    }
};

//specify the replacement word based on what it really means

//create a new BuzzKill Object
var PageBuzzKillerInstance = new BuzzKill(document.body);
PageBuzzKillerInstance.loadJSON('/js/buzzwords.json', 'buzzwords');      //load buzzword array
PageBuzzKillerInstance.loadJSON('/js/definitions.json', 'definitions');  //load definitions array
