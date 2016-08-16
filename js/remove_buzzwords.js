var buzzwords = null;
loadBuzzwords();

setTimeout(function(){
  //alert(buzzwords);
  removeBuzzwords();
},1000);

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

//removes buzzwords from the DOM
function removeBuzzwords(){
  var items = document.body.getElementsByTagName("*");
  console.log("removing buzzwords: " + buzzwords);

  var counter = 0;
  for (var i = 0; i < items.length; i++) {
      var element = items[i];
      var element_innerHTML = element.innerHTML;     //get the element innerHTML

      var regexOuter = /(>.*?<)/gi;
      var regexInnerArray = regexArray(buzzwords);
      var regexInner = /(dynamic)/gi;                 //array of all regexes to test for

      var matched_regions = null;

      for (var j=0; j<regexInnerArray.length; j++){
          console.log(regexInnerArray[j]);
      }


      while ((matched_regions = regexOuter.exec(element_innerHTML)) !== null) {
          var local_counter = counter;
          var possible_update = escapeRegExp(matched_regions[0]); //need to sanitize for characters not allowed in regex
          var possible_update_regex = new RegExp(possible_update.toString(),'g');

          var new_text = possible_update.replace(regexInner, 'DELETED');

          element.innerHTML = element_innerHTML.replace( possible_update ,
            function(){
              local_counter++;
              //console.log(local_counter);
              return new_text;
            }
          );

          //counter+=matches_found;
      }
  }

  //update the contents of the counter div
  var counter_element = document.body.getElementsByTagName("count_value");
  //counter_element.innerHTML = counter;
  //alert("squashed buzzwords: " + counter);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function regexArray(arr) {
  var result = arr.map(function(element){
      return new RegExp('(' + element.toString() + ')','gi');
  });

  return result;
}
