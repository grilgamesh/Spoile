function guessed(guessRaw) {
    //replace display with selected value
    console.log("checkpoint: guess made: " + guessRaw);
    guess = SPAG_remover(guessRaw);

    if (guess == answerKey){
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
        list_of_guesses = `<p>${guess_counter}: ${answerDict['punc_name']} 100% similarity</p>
        <div class="progress">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${100}%" aria-valuenow="${100}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>${list_of_guesses}`
        d3.select('#guesses').html(list_of_guesses);
        
        
        //hide the guess and hint functions
        x = document.getElementById("guessInput");
        x.style.visibility = "hidden";
        x = document.getElementById("guessClick");
        x.style.visibility = "hidden";
        x = document.getElementById("hint");
        x.style.visibility = "hidden";
        x = document.getElementById("spoil");
        x.style.display = 'none';  
        x = document.getElementById("quit");
        x.style.display = 'none';  
        //reveal the replay button
        var x = document.getElementById("replay");
        x.style.display = 'inline';  
        
        cumulative_tags.push(100);
        simliarity_list.push(100);
        guess_counter_list.push(guess_counter);

        textToTweet = `${bunf}
${guess_counter}:🟢 100%!
${textToTweet}`
        console.log(textToTweet);
        if (endless==false){
            show_tweet_button();
        };

    }    
    else{  

        for (i=0; i<films.length; i++){
            if (guess == SPAG_remover(year_remover(films[i]))){
                var guess_Dict = film_dict[films[i]];
                var guess_tags = guess_Dict['tags'];
                if (guess_list.includes(guess_Dict['punc_name'])){
                    // replace the contents of the proximity panel with the alert
                    d3.select('#proximity').html("<p>Duplicate guess</p>");
                    break
                }
                console.log("checkpoint: guess found: " + guess_Dict['punc_name']);
                var common_tags = answer_tags.filter(value => guess_tags.includes(value));

                if (megahint_revealed == false){
                    // only update the tag list if the user hasn't already used the megahint
                    tag_display(guess_tags);

                    guess_counter++;

                    tag_list = common_tags.concat(tag_list.filter((item) => common_tags.indexOf(item) < 0));

                    // replace the contents of the main panel with the new tags list
                    var progress = Math.round(tag_list.length*100/(answer_tags.length));

                    // replace the contents of the proximity panel with the new proximity
                    d3.select('#proximity').html("<p>" + progress + "% of tags revealed</p>");
                    cumulative_tags.push(progress);
                    guess_counter_list.push(guess_counter);
                }
                
                
                var similarity = Math.round(common_tags.length*100/(answer_tags.length));
                // Calculate the similarity for bar chart as the % of tags in common (compared to the answer tags), processed as a log base 10, and then multiplied by 50.
                // This converts the log - which will have been between 0 and 2, to a new percentage that is less cramped in single digits.
                // I do this because the tags do seem to be on a log scale, with even closely related films only scoring about 33% tags in common.
                if (similarity==0){
                    // can't take log of 0, so quick fix to stop regression line breaking
                    var logSimilarity = 0
                }
                else{
                    var logSimilarity = Math.round(Math.log10(common_tags.length*100/(answer_tags.length))*50);
                }
                simliarity_list.push(logSimilarity);
                // replace the contents of the side panel with the new guess list
                if(logSimilarity<25){
                    colour = "danger"
                    textToTweet = `${guess_counter}:🔴 ${similarity}%
${textToTweet}`
                }
                else if(logSimilarity<50){
                    colour = "warning"
                    textToTweet = `${guess_counter}:🟡 ${similarity}%
${textToTweet}`
                }
                else{
                    colour = "";
                    textToTweet = `${guess_counter}:🔵 ${similarity}%
${textToTweet}`
                }
                list_of_guesses = `
                </br>
                ${guess_counter}: ${guess_Dict['punc_name']}: ${similarity}%
                    <div class="progress">
                        <div class="progress-bar bg-${colour}" role="progressbar" style="width: ${logSimilarity}%" aria-valuenow="${logSimilarity}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>${list_of_guesses}`;
                d3.select('#guesses').html(list_of_guesses);
                // guess_scatter();

                // add the proper name to the guess list
                guess_list.push(guess_Dict['punc_name']);
                
                // 👇️ clear input field
                document.getElementById('guessInput').value = '';
                break;
            }
            else{
                // replace the contents of the proximity panel with the alert
                d3.select('#proximity').html("<p>Unknown film; spelling mistake or out of database</p>");
            }
        }
    }
    
    tag_curve(guess_counter_list, cumulative_tags, guess_list);
    guess_scatter(guess_counter_list, simliarity_list,  guess_list);
}

function tag_curve(ex, why, labels){
    var trace = {
        x: ex,      
        y: why,      
        type: 'scatter',
        text: labels
      };
      
    // Apply layout settings
    let layout = {
        title: "cumulative tags",
        height: 186,
        width: 300,
        xaxis: {
            autorange: true,
            type: 'linear',
            title: {
                text: "guess"
            }
        },
        yaxis: {
            range: [-10, 104],
            type: 'linear',
            title: {
                text: "% tags revealed"
            }
        },
                
        margin: {
            autoexpand: false,
            l: 25,
            r: 25,
            t: 25,
            b: 25
        }
    };
      var data = [trace];
      Plotly.newPlot('tag_curve', data, layout);
};

function guess_scatter(ex, why, labels){
    // Apply layout settings
    let layout = {
        title: "success",
        height: 186,
        width: 300,
        xaxis: {
            autorange: true,
            type: 'linear',
            title: {
                text: "guess"
            }
        },
        yaxis: {
            range: [-10, 104],
            type: 'linear',
            title: {
                text: "Log(similarity)"
            }
        },
                
        margin: {
            autoexpand: false,
            l: 25,
            r: 25,
            t: 25,
            b: 25
        }
    };

        // imported from https://github.com/plotly/plotly.js/issues/4921 
    var x_data_64 = ex;
    var y_data_64 = why;
    var lr = linearRegression(x_data_64, y_data_64);
    console.log(lr);

    var trace = {x: x_data_64,
                y: y_data_64,
                // name: "Scatter",
                mode: 'markers',
                text: labels
                };  
    console.log(trace);

    var fit_from = Math.min(...x_data_64)
    var fit_to = Math.max(...x_data_64)

    var fit = {
        x: [fit_from, fit_to],
        y: [fit_from*lr.sl+lr.off, fit_to*lr.sl+lr.off],
        mode: 'lines',
        type: 'scatter',
        // name: "R2=".concat((Math.round(lr.r2 * 10000) / 10000).toString())
    };

    //console.log(fit);
    var data = [trace,fit];
    Plotly.newPlot('panel_stats', data, layout);
};

function linearRegression(x,y){
    // imported from https://github.com/plotly/plotly.js/issues/4921
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['sl'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['off'] = (sum_y - lr.sl * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
};

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
    randHint = getRandomAnswer();
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
        x.style.display = 'inline';  
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
    x.style.display = 'inline';  
    //hide the hint function
    x = document.getElementById("hint");
    x.style.visibility = "hidden";
    //hide this function
    x = document.getElementById("spoil");
    x.style.display = 'none';  

    megahint_revealed = true;

    textToTweet = `🔎 Revealed tags
${textToTweet}`


}

function quit(){
    // replace the contents of the main panel with the COMPLETE list
    d3.select('#keywords').html(format_keywords(answerDict['tags']));
    // replace the contents of the side panel with the new guess list
    list_of_guesses = `<p>Nevermind, there's always next time.</p>${list_of_guesses}`;
    d3.select('#guesses').html(list_of_guesses);
    let link = "https://www.imdb.com/title/" + answerDict['id'];
    // replace the contents of the proximity panel with the congrats string
    quitString = `<p>oh, that's a shame, it was <a href= ${link} target=”_blank” >${answerDict['punc_name']}</a></p>`
    d3.select('#proximity').html(quitString);

    //hide this function
    x = document.getElementById("quit");
    x.style.display = 'none';  
    //hide the guess function
    var x = document.getElementById("guessInput");
    x.style.visibility = "hidden";    
    var x = document.getElementById("guessClick");
    x.style.visibility = "hidden";    
    //reveal the replay button
    var x = document.getElementById("replay");
    x.style.display = 'inline';  

    
    textToTweet = `${bunf}
💀 Gave up...
${textToTweet}`
    console.log(textToTweet);

    if (endless==false){
        show_tweet_button();
    };
    

}

function show_tweet_button(){
    // update the side panel with the share button
    list_of_guesses = `<button onclick="copy_Tweet()">Copy results to clipboad!</button>
    ${list_of_guesses}`
    d3.select('#guesses').html(list_of_guesses);

}
function copy_Tweet(){
    // Copy the text to tweet
    navigator.clipboard.writeText(textToTweet);
}

function getRandomAnswer(){
    // Generate random index based on number of keys
    const randIndex = Math.floor(Math.random() * films.length);

    // Select a key from the array of keys using the random index
    let randKey = films[randIndex];
    // if this film has fewer than 100 tags, reroll. This will filter out some unguessable solutions.
    if (film_dict[randKey]['tags'].length < 100){
        randKey = getRandomAnswer();
    }

    return randKey;
}

function getAnswer(){
    console.log("getting answer");
    let todaysAnswer = answer_set[index];
    console.log(todaysAnswer);
    for (i=0; i<films.length; i++){
        if(todaysAnswer == film_dict[films[i]]['id']){
            console.log(`found ${films[i]['punc_name']}`);
            return films[i];
        }
    }
    console.log("failed to find today's film, defaulting to The Shawshank Redemption");
    return films[0];
}



function SPAG_remover(word){
    // method to remove punctuation from text, in order to make the game less annoyingly precise, e.g. user might type 'spiderman' instead of 'spider-man'
    // also removes common words 'the' and 'and'.
    // also removes spaces, so that e.g. 'bat man' and 'batman' are identical.
    // also changes letters with accents to the normal version, in case of films like Amelie.
    cleanWord = word.toLowerCase().replace(/the /gi, '').replace(/ and /gi, '').replace(/[.,\/#!¡$%\·^&\*;:{}=\-_`'~()]/g,"").replace(/\s/g,"").replace(/¢/gi, 'c').normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');    
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

function init(endless_mode){
    endless = endless_mode;
    //re-initate variables as necessary
    list_of_guesses = '';
    hint_counter = 0;
    guess_counter = 0;
    megahint_revealed = false;
    guess_list = [''];endless
    tag_list = [];
    cumulative_tags = [0];
    guess_counter_list = [0];
    simliarity_list = [0];
    colour = '';
    textToTweet = 'https://grilgamesh.github.io/Spoile/ #Spoile';
    
    // instantiate answer
    // 
    if (endless == false){
    key = getAnswer();
    d3.select('#proximity').html(`<p>${bunf}</p>`);
    }
    else{
        key = getRandomAnswer();
        d3.select('#proximity').html(`<p>Now playing in random mode, good luck!</p>`);
    }
    console.log("got answer " + key);
    // remove year and special characters from the answerKey
    answerKey = SPAG_remover(year_remover(key));
    console.log(answerKey);
    // Use the key to get the corresponding name from the "names" object
    answerDict = film_dict[key];
    console.log(answerDict);
    answer_tags = answerDict['tags'];

    d3.select('#guesses').html("<p></p>");
    d3.select('#keywords').html(format_keywords(answer_tags));

    // hide all of the answer tags; they will be revealed as guesses are made.
    for (i=0; i<answer_tags.length; i++){
        var x = document.getElementById(i);
        x.style.visibility = "hidden";    
    }

    // show or hide buttons as necessary
    var x = document.getElementById("guessInput");
    x.style.visibility = "visible";    
    var x = document.getElementById("guessClick");
    x.style.visibility = "visible";    
    x = document.getElementById("hint");
    x.style.visibility = "visible";
    x = document.getElementById("spoil");
    x.style.display = 'none';  
    x = document.getElementById("quit");
    x.style.display = 'none'; 
    x = document.getElementById("replay");
    x.style.display = 'none'; 

    
    // tag_curve(guess_counter_list, cumulative_tags, guess_list);
    // guess_scatter(guess_counter_list, simliarity_list,  guess_list);
}

//instantiate all the variables and holding arrays
let film_dict = {};
let answer_set = {};

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
let cumulative_tags = [];
let guess_counter_list = [];
let simliarity_list = [];

let textToTweet = '';

let colour = ''
let endless = false;
const d = new Date();
let bunf = `Daily Spoile for ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;

// load json fils
var data_dict = "https://grilgamesh.github.io/Spoile/data/imdb_tag_game_100.json";
var answer_dict = "https://grilgamesh.github.io/Spoile/data/2023.json";
console.log("please wait while data loads");

//code to calculate datediff
 // One day Time in ms (milliseconds)
 var one_day = 1000 * 60 * 60 * 24
      
 // To set present_dates to two variables
 var present_date = new Date();
   
 // 0-11 is Month in JavaScript
 var start_date = new Date(2023, 04, 01)

   // To Calculate the result in milliseconds and then converting into days
   var Result = Math.round(start_date.getTime() 
   - present_date.getTime()) / (one_day);

// To remove the decimals from the (Result) resulting days value
var index = Result.toFixed(0);
d3.json(data_dict).then(function(response1) {
    d3.json(answer_dict).then(function(response2) {
        film_dict = response1;
        answer_set = response2;
        films = Object.keys(film_dict)
        console.log(films);
        console.log(response2);

        init(endless);
    })
})