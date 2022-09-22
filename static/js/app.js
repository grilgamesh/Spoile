function guessed(guessRaw) {
    //replace display with selected value
    console.log("checkpoint: guess made: " + guessRaw);
    guess = SPAG_remover(guessRaw);

    if (guess == answerKey){
        guess_counter++;
        let link = "https://www.imdb.com/title/" + answerDict['id'];
        congrats = "<p>You're right! Well done. And it only took you "+ guess_counter + " goes.</p><p><a href= "+ link + " target=”_blank” > Click here to find out more about "+ answerDict['punc_name'] + "</a></p>";
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
    }    
    else{
        for (i=0; i<films.length; i++){
            if (guess == year_remover(films[i])){
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

function format_keywords(tags){
    var width = 4;
    var html = "";
    for (i = 0; i< tags.length; i++){
        if(i%width == 0 ){
            html = html + '<div class="row">'
        }
        html = html + '<div class="col-md-3 keyword" id='+i+'>' + tags[i] + '</div>';
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
    randHint = year_remover(randHint);
    hintKey = SPAG_remover(randHint);
    // make sure the hint is not the solution
    while (hintKey == answerKey){
        randHint = getAnswer();
        randHint = year_remover(randHint);
        hintKey = SPAG_remover(randHint);
    }

    // guess the hint
    guessed(hintKey);
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
        // replace the contents of the proximity panel with the congrats string
        quitString = `<p>oh, that's a shame, it was ${answerDict['punc_name']}</p>`
        d3.select('#proximity').html(quitString);

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
    answerKey = year_remover(randKey);
    console.log(answerKey);
    // Use the key to get the corresponding name from the "names" object
    answerDict = film_dict[randKey];
    console.log(answerDict);
    answer_tags = answerDict['tags'];

    // set up blank spaces
    d3.select('#filmNotFound').html("<p>film_dict loaded. there are " + films.length + " entries in solution set. Type a film and hit enter or click guess to get tags</p>");
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


var url20 = "https://grilgamesh.github.io/Taggle/data/imdb_tag_game_100.json";
console.log("please wait while data loads");
d3.select('#filmNotFound').html("<p>please wait while data loads</p>");

d3.json(url20).then(function(response) {
    film_dict = response;
    films = Object.keys(film_dict)
    console.log("film_dict loaded. there are " + films.length + " entries in solution set");
    console.log(films);

    init();
})