function guessed(guessRaw) {
    //replace display with selected value
    console.log("checkpoint: guess made: " + guessRaw);
    // guess = SPAG_remover(guessRaw);

    if (guessRaw == answerKey){
        guess_counter++;
        let link = "https://www.imdb.com/title/" + answerDict['id'];
        if (megahint_revealed == false){
            congrats = "<p>You're right! Well done, and it only took you "+ guess_counter + " goes.</p><p><a href= "+ link + " target=”_blank” > Click here to find out more about "+ answerDict['punc_name'] + "</a></p>";
        }
        else{
            congrats = "<p>You're right! Well done. It only took you "+ guess_counter + " goes, and a free look at all the tags.</p><p><a href= "+ link + " target=”_blank” > Click here to find out more about "+ answerDict['punc_name'] + "</a></p>";
        }
        console.log("checkpoint:  " + guessRaw);
        // replace the contents of the proximity panel with the congrats string
        d3.select('#proximity').html(congrats);

        // replace the contents of the main panel with the COMPLETE tags list
        d3.select('#keywords').html(format_keywords(answerDict['tags']));

        // replace the contents of the side panel with the correct solution
        list_of_guesses = `<p>${guess_counter}: ${answerDict['punc_name']} 100% similarity</p>${list_of_guesses}`;
        d3.select('#guesses').html(list_of_guesses);
        
        //reveal the replay button
        console.log("play again?");
        
        var x = document.getElementById("replay");
        x.style.visibility = "visible";
        //hide the guess and hint functions
        x = document.getElementById("guess");
        x.style.visibility = "hidden";
        x = document.getElementById("hint");
        x.style.visibility = "hidden";
        x = document.getElementById("spoil");
        x.style.visibility = "hidden";
        x = document.getElementById("quit");
        x.style.visibility = "hidden";
    }    
    else{
        for (i=0; i<autocompleter.length; i++){
            if (guessRaw == autocompleter[i]){
                var guess_Dict = film_dict[films[i]];
                var guess_tags = guess_Dict['tags'];
                if (guess_list.includes(guess_Dict['punc_name'])){
                    // replace the contents of the filmNotFound panel with the alert
                    d3.select('#filmNotFound').html("<p>Duplicate guess</p>");
                    break
                }
                console.log("checkpoint: guess found: " + guess_Dict['punc_name']);
                var common_tags = answer_tags.filter(value => guess_tags.includes(value));

                if (megahint_revealed == false){
                    // only update the tag list if the user hasn't already used the megahint
                    tag_display(guess_tags);

                    guess_counter++;

                    // old code:

                    tag_list = common_tags.concat(tag_list.filter((item) => common_tags.indexOf(item) < 0));
                    // replace the contents of the main panel with the new tags list
                    var tag_list_html = format_keywords(tag_list);
                    //old code: 
                    // d3.select('#keywords').html(tag_list_html);

                    var progress = Math.round(tag_list.length*100/(answer_tags.length));
                    // replace the contents of the proximity panel with the new proximity
                    d3.select('#proximity').html("<p>" + progress + "% of tags revealed</p>");
                }
                
                
                var similarity = Math.round(common_tags.length*100/(answer_tags.length));
                // Calculate the similarity for bar chart as the % of tags in common (compared to the answer tags), processed as a log base 10, and then multiplied by 50.
                // This converts the log - which will have been between 0 and 2, to a new percentage that is less cramped in single digits.
                // I do this because the tags do seem to be on a log scale, with even closely related films only scoring about 33% tags in common.
                var logSimilarity = Math.round(Math.log10(common_tags.length*100/(answer_tags.length))*50);
                // replace the contents of the side panel with the new guess list
                list_of_guesses = `<p>${guess_counter}: ${guess_Dict['punc_name']} ${similarity}% similarity</p>${list_of_guesses}`;
                d3.select('#guesses').html(list_of_guesses);
                d3.select('#filmNotFound').html("<p>good guess</p>");

                // add the proper name to the guess list
                guess_list.push(guess_Dict['punc_name']);
                break;
            }
            else{
                // replace the contents of the filmNotFound panel with the alert
                d3.select('#filmNotFound').html("<p>Unknown film; spelling mistake or out of database</p>");
            }
        }
    }

//     //find the new selection in the data
//     GPid = national_gp_dict.gp.findIndex((element) => element == calledGP);
//     console.log(GPid);
//     let currentGP = national_gp_dict.metadata[GPid];
//     globalGP = currentGP;
    

//     //instantiate the metadata
//     console.log("checkpoint infopanel");
//     let keys = Object.keys(currentGP);
//     console.log(keys);
//     console.log(currentGP);

//     //reduce keys to just air quality measures
//     const airKeys = ["aqi", "co", "nh3", "no", "no2", "o3", "pm10", "pm2_5", "so2"];
//     console.log(airKeys);

//     // start building the metadata html to display in the infobox
//     let metaText = "Location: " + calledGP + "<hr>";
//     //loop through the keys and insert the relevant text into the metadata
//     for (i = 0; i < airKeys.length; i++) {
//         // console.log(currentGP[airKeys[i]]);
//         metaText = metaText + airKeys[i] + ": " + currentGP[airKeys[i]] + "<br>";
//     }
//     // replace the contents of the infobox with the new metadata html string
//     d3.select('#sample-metadata').html(metaText);
    

//     // get the air quality data
//     let timestamps = national_air_pollution_data.date_time;
//     console.log(timestamps);
//     let dateStrings = []
//     //copy the data into javascript format by multiplying by 1000
//     for (let i = 0; i < timestamps.length; i++){
//         dateStrings[i] = (timestamps[i] * 1000);
//     }
//     console.log(dateStrings);

    

//     //instantiate a wrapper for the different measures of air quality
//     let yvalues = [];
//     for (i = 0; i< airKeys.length; i++){
//         yvalues[i] = [];
//     };
//     console.log(yvalues);


//     // loop through ALL of the metadata
//     for (let i = 0; i < national_air_pollution_data.metadata.length; i++) {
//         //identify the data for the correct GP
//         if (national_air_pollution_data.metadata[i].gp == calledGP){
//             // write in the different data measures into the yvalues array, using the defined array airKeys
//             for( j=0; j<airKeys.length; j++){
//                 yvalues[j].push(national_air_pollution_data.metadata[i][airKeys[j]]);
//             }
//         }
//     };

//     //loop to create all the data traces
//     let traceData = []
//     for (i = 0; i < yvalues.length; i++){
//         traceData[i] = {
//             x: dateStrings,
//             y: yvalues[i],
//             type: "scatter",  
//             mode: "lines",
//             name: airKeys[i],
//             line: {color: i}
//         }
//     };

//     // Apply layout settings
//     let layout = {
//         title: calledGP,
//         height: 450,
//         width: 700,
//         xaxis: {
//             autorange: true,
//             type: 'linear',
//             rangeselector: {buttons: [
//                 {    
//                   count: 7,        
//                   label: '1 week',        
//                   step: 'day',        
//                   stepmode: 'backward'        
//                 },        
//                 {        
//                   count: 1,        
//                   label: '1 Month',        
//                   step: 'month',        
//                   stepmode: 'backward'        
//                 },
        
//                 {step: 'all'}
        
//               ]},
//             rangeslider: {range: [dateStrings[0], dateStrings[dateStrings.length - 1]]},
//             type: 'date'
//         },
//         yaxis: {
//             autorange: true,
//             type: 'linear',
//             title: {
//                 text: "micrograms/cubic metre"
//             }
//         }
//     };

//     // Render the plot to the div tag with id "time-graph"
//     Plotly.newPlot("time-graph", traceData, layout);

//     newScat(airKeys[0]);


}

// Standard autocomplete code
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  } 


function format_keywords(tags){
    var width = 4;
    var html = "";
    for (i = 0; i< tags.length; i++){
        if(i%width == 0 ){
            html = html + '<div class="row">'
        }
        let tag = tags[i].replace(/ /g, "-")
        html = html + '<div class="col-md-3 keyword" id='+i+'><a href = "https://www.imdb.com/search/keyword/?keywords=' + tag + '" target="blank"> ' + tags[i] + '</div>';
        if (i%width == (width-1)){
            html = html + '</div>';
        }
    }
    return html;
}

function hint(){
    console.log("hint activated")
    // guess a random film
    randHint = getAnswer();
    // remove confusing punctuation and forgettable words from the hint
    // randHint = year_remover(randHint);
    // hintKey = SPAG_remover(randHint);
    // make sure the hint is not the solution
    while (randHint == answerKey){
        randHint = getAnswer();
        // randHint = year_remover(randHint);
        // hintKey = SPAG_remover(randHint);
    }

    // guess the hint
    guessed(film_dict[randHint]['punc_name']);
    hint_counter++;

    // reveal the megahint function once this has been used three times
    if (hint_counter == 3){
        x = document.getElementById("spoil");
        x.style.visibility = "visible";
    }
}

function megahint(){
    // replace the contents of the main panel with the COMPLETE list
    
    d3.select('#keywords').html(format_keywords(answerDict['tags']));
    d3.select('#proximity').html("<p>100% of tags revealed!</p>");
    // replace the contents of the side panel with the new guess list
    list_of_guesses = `<p>All tags revealed</p>${list_of_guesses}`;
    d3.select('#guesses').html(list_of_guesses);

    console.log("megahint")
    //reveal the quit function
    var x = document.getElementById("quit");
    x.style.visibility = "visible";
    //hide the hint function
    x = document.getElementById("hint");
    x.style.visibility = "hidden";
    //hide this function
    x = document.getElementById("spoil");
    x.style.visibility = "hidden";

    megahint_revealed = true;


}

function quit(){
    // replace the contents of the main panel with the COMPLETE list
        d3.select('#keywords').html(format_keywords(answerDict['tags']));
        // replace the contents of the side panel with the new guess list
        list_of_guesses = `<p>Nevermind, there's always next time.</p>${list_of_guesses}`;
        d3.select('#guesses').html(list_of_guesses);
        let link = "https://www.imdb.com/title/" + answerDict['id'];
        // replace the contents of the proximity panel with the congrats string
        quitString = `<p>oh, that's a shame, it was ${answerDict['punc_name']}</p><p><a href= ${link} target=”_blank” > Click here to find out more about ${answerDict['punc_name']}</a></p>`
        d3.select('#proximity').html(quitString);
        d3.select('#filmNotFound').html("<p>Don't torture yourself, Gomez. That's my job.</p>");

        //reveal the replay button
    var x = document.getElementById("replay");
    x.style.visibility = "visible";
    //hide this function
    x = document.getElementById("quit");
    x.style.visibility = "hidden";
    //hide the guess function
    x = document.getElementById("guess");
    x.style.visibility = "hidden";
    

}

function getAnswer(){
    // currently, solution will be randomly selected during development.
    // eventually this will be a date-related function like wordle.

    // Generate random index based on number of keys
    const randIndex = Math.floor(Math.random() * films.length);

    // weight the randomiser to the early end by using natural log (experimental)
    // const base = 50
    // const randIndex = Math.ceil(base**(Math.random() * Math.log(films.length)/Math.log(base)));

    // Select a key from the array of keys using the random index
    let randKey = films[randIndex];
    // if this film has fewer than 100 tags, reroll. This will filter out some unguessable solutions.
    if (film_dict[randKey]['tags'].length < 100){
        randKey = getAnswer();
    }

    return randKey;
}


function SPAG_remover(word){
    // method to remove punctuation from text, in order to make the game less annoyingly precise, e.g. user might type 'spiderman' instead of 'spider-man'
    // also removes common words 'the' and 'and'.
    // also removes spaces, so that e.g. 'bat man' and 'batman' are identical.
    cleanWord = word.toLowerCase().replace(/the /gi, '').replace(/ and /gi, '').replace(/[.,\/#!¡$%\·^&\*;:{}=\-_`'~()]/g,"").replace(/\s/g,"").replace(/¢/gi, 'c');    
    console.log(cleanWord);
    return cleanWord;
}

function year_remover(title){
    // removes any bracketed elements e.g. (1977)
    //this will also remove the e.g. (I) that IMDB appends to the names of duplicated films.
    return title.replace(/ *\([^)]*\) */g, "");
}

function tag_display(tag_list){
    for (i=0; i<tag_list.length; i++){
        for (j=0; j<answer_tags.length; j++){
            if (tag_list[i] == answer_tags[j]){
                var x = document.getElementById(j);
                x.style.visibility = "visible";
                break
            }
        }
    }
}

function init(){
    //re-initate variables as necessary
    list_of_guesses = '';
    hint_counter = 0;
    guess_counter = 0;
    megahint_revealed = false;
    guess_list = [];
    tag_list = [];
    
    // instantiate answer
    randKey = getAnswer();
    console.log(randKey);
    // remove year from the answerKey
    // answerKey = year_remover(randKey);
    // Use the key to get the corresponding name from the "names" object
    answerDict = film_dict[randKey];
    console.log(answerDict);
    answer_tags = answerDict['tags'];
    answerKey = answerDict['punc_name'];
    console.log(answerKey);

    // set up blank spaces
    d3.select('#filmNotFound').html("<p>film_dict loaded. there are " + films.length + " entries in solution set. Type a film and hit enter or click guess...</p>");
    d3.select('#guesses').html("<p>Guesses will appear here</p>");
    d3.select('#proximity').html("<p> Tags will appear here</p> ");
    d3.select('#keywords').html(format_keywords(answer_tags));

    for (i=0; i<answer_tags.length; i++){
        var x = document.getElementById(i);
        x.style.visibility = "hidden";    
    }

    // show or hide buttons as necessary
    var x = document.getElementById("guess");
    x.style.visibility = "visible";    
    x = document.getElementById("hint");
    x.style.visibility = "visible";
    x = document.getElementById("spoil");
    x.style.visibility = "hidden";
    x = document.getElementById("quit");
    x.style.visibility = "hidden";
    x = document.getElementById("replay");
    x.style.visibility = "hidden";
}

let film_dict = {};

let guessRaw = "";
let guess = "";
let guess_counter = 0;
let tag_list = [];
let guess_list = [];

let randKey = '';
let answerKey = '';
let answerDict = {};
var answer_tags = [];

let list_of_guesses = '';
let hint_counter = 0;
let megahint_revealed = false;

var autocompleter = [];


var url_json = "https://grilgamesh.github.io/Taggle/data/imdb_tag_game_100.json";
console.log("please wait while data loads");
d3.select('#filmNotFound').html("<p>please wait while data loads</p>");

d3.json(url_json).then(function(response) {
    film_dict = response;
    films = Object.keys(film_dict)
    console.log("film_dict loaded. there are " + films.length + " entries in solution set");
    console.log(films);

    for (i = 0; i<films.length; i++){
        autocompleter.push(film_dict[films[i]]['punc_name']);
    }
    autocomplete(document.getElementById("guessInput"), autocompleter);
    console.log(autocompleter);

    init();
})