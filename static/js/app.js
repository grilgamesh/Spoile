function optionChanged(guessRaw) {
    //replace display with selected value
    console.log("checkpoint: option changed");
    guess = SPAG_remover(guessRaw);
    guess_counter++;

    if (guess == answerKey){
        console.log("you're right! well done. \nAnd it only took you ${guess_counter} goes.");
        console.log(answer['tags']);
    }
    
    else{
        try{
            var answer_tags = answer['tags'];
            console.log(answer_tags);

            var guess_tags = film_dict[guess]['tags'];
            console.log(guess_tags);

            var common_tags = answer_tags.filter(value => guess_tags.includes(value));
            console.log(common_tags);
            
            var similarity = Math.round(common_tags.length)*100/(answer_tags.length);
            console.log(similarity);

            // print(f"{similarity}% match! they share the following tags (repitions ommitted):\n")
            // print(common_tags.difference(tag_list))
            // tag_list = set(common_tags.union(tag_list))
            // progress = round(len(tag_list)*100/(len(film_dict[answer]['tags'])))
            // print(f"\nTotal progress: you have found {progress}% of the tags")
            // guess_counter += 1
        }
        catch (err) {
            print("Unknown film; " + err + " check your SPAG and try again");
        }
    }

    //find the new selection in the data
    GPid = national_gp_dict.gp.findIndex((element) => element == calledGP);
    console.log(GPid);
    let currentGP = national_gp_dict.metadata[GPid];
    globalGP = currentGP;
    

    //instantiate the metadata
    console.log("checkpoint infopanel");
    let keys = Object.keys(currentGP);
    console.log(keys);
    console.log(currentGP);

    //reduce keys to just air quality measures
    const airKeys = ["aqi", "co", "nh3", "no", "no2", "o3", "pm10", "pm2_5", "so2"];
    console.log(airKeys);

    // start building the metadata html to display in the infobox
    let metaText = "Location: " + calledGP + "<hr>";
    //loop through the keys and insert the relevant text into the metadata
    for (i = 0; i < airKeys.length; i++) {
        // console.log(currentGP[airKeys[i]]);
        metaText = metaText + airKeys[i] + ": " + currentGP[airKeys[i]] + "<br>";
    }
    // replace the contents of the infobox with the new metadata html string
    d3.select('#sample-metadata').html(metaText);
    

    // get the air quality data
    let timestamps = national_air_pollution_data.date_time;
    console.log(timestamps);
    let dateStrings = []
    //copy the data into javascript format by multiplying by 1000
    for (let i = 0; i < timestamps.length; i++){
        dateStrings[i] = (timestamps[i] * 1000);
    }
    console.log(dateStrings);

    

    //instantiate a wrapper for the different measures of air quality
    let yvalues = [];
    for (i = 0; i< airKeys.length; i++){
        yvalues[i] = [];
    };
    console.log(yvalues);


    // loop through ALL of the metadata
    for (let i = 0; i < national_air_pollution_data.metadata.length; i++) {
        //identify the data for the correct GP
        if (national_air_pollution_data.metadata[i].gp == calledGP){
            // write in the different data measures into the yvalues array, using the defined array airKeys
            for( j=0; j<airKeys.length; j++){
                yvalues[j].push(national_air_pollution_data.metadata[i][airKeys[j]]);
            }
        }
    };

    //loop to create all the data traces
    let traceData = []
    for (i = 0; i < yvalues.length; i++){
        traceData[i] = {
            x: dateStrings,
            y: yvalues[i],
            type: "scatter",  
            mode: "lines",
            name: airKeys[i],
            line: {color: i}
        }
    };

    // Apply layout settings
    let layout = {
        title: calledGP,
        height: 450,
        width: 700,
        xaxis: {
            autorange: true,
            type: 'linear',
            rangeselector: {buttons: [
                {    
                  count: 7,        
                  label: '1 week',        
                  step: 'day',        
                  stepmode: 'backward'        
                },        
                {        
                  count: 1,        
                  label: '1 Month',        
                  step: 'month',        
                  stepmode: 'backward'        
                },
        
                {step: 'all'}
        
              ]},
            rangeslider: {range: [dateStrings[0], dateStrings[dateStrings.length - 1]]},
            type: 'date'
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            title: {
                text: "micrograms/cubic metre"
            }
        }
    };

    // Render the plot to the div tag with id "time-graph"
    Plotly.newPlot("time-graph", traceData, layout);

    newScat(airKeys[0]);


};




function getAnswer(){
    // currently, solution will be randomly selected during development.
    // eventually this will be a date-related function like wordle.

    // Create array of object keys
    const keys = Object.keys(film_dict);

    // Generate random index based on number of keys
    const randIndex = Math.floor(Math.random() * keys.length);

    // Select a key from the array of keys using the random index
    const randKey = keys[randIndex];

    return randKey;
}


function SPAG_remover(word){
    console.log(word);
    // method to remove punctuation from text, in order to make the game less annoyingly precise.
    // also removes common words 'the' and 'and'.
    cleanWord = word.toLowerCase().replace(/the /gi, '').replace(/and /gi, '').replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g,"").replace(/\s{2,}/g," ");    
    console.log(cleanWord);
    return cleanWord;
}

console.log("czechpoint 2");
let film_dict = {};

let guessRaw = "";
let guess = "";
let guess_counter = 0;
let tag_list = [];

let randKey = '';
let answerKey = '';
let answer = {};




var url20 = "https://grilgamesh.github.io/Taggle/data/imdb_tag_game_20.json";
d3.json(url20).then(function(response1) {
    film_dict = response1
    console.log("film_dict loaded. there are " + Object.keys(film_dict).length + " entries in solution set");


    // instantiate answer
    randKey = getAnswer();
    // remove confusing punctuation and forgettable words from the answer
    answerKey = SPAG_remover(randKey);
    // Use the key to get the corresponding name from the "names" object
    answer = film_dict[randKey];
    
})