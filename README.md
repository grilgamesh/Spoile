# Taggl
Can you guess the movie based on the plot keywords? A wordle-like film guessing game.  The latest playable build of the game is playable live at https://grilgamesh.github.io/Taggle/

## Technology used
- Python to import data and proof of concept
- Beautiful for webscraping to import
- HTML and CSS for presentation to the internet
- D3 for handling the JSon 

## Files included
In the root folder are the Python files Taggle and Taggle_webscraper. The Taggle_webscraper file was used to build a JSon file from the IMDB website and does not need to be run in order to use the game. It saves Json files of various sizes into the Data folder, so that a the game's difficulty can be adjusted by choosing smaller or larger datasets. The Taggle file itself is fully functional and can be run off-line if the user chooses.  
![image](https://user-images.githubusercontent.com/98031776/189631827-52c811a7-32e9-4494-9c72-a192ad9bdec7.png)  

![image](https://user-images.githubusercontent.com/98031776/189631652-e2e5ae3a-fd85-40c7-9281-999c04fd0c43.png)  


In order to make the game user-friendly, I have implemented it as the index.HTML file also in the root folder. This makes use of the static folder to store CSS and Javascript files. The online version is currently a work-in-progress


## Rationale
Since the success of Wordle, there have been a rash of imitators, however many of them missed what I consider to be a central feature of wordle; that a guess will reveal particular information about the answer. Many of these games reward an unsuccesful guess with a fixed clue, regardless of how close the guess was.  
I conceived of this game then, based on the IMDB's user-submitted keywords. Every film has hundreds of identified features that individuals have tagged them with, with no mention of any of the technical features of the film such as crew or actors. Frequently these keywords overlap, such as how both Pinocchio (1940) and The Shining (1980) are tagged with 'deal with the devil'. This overlapping aspect of the film tags means that when a user guesses a film, I can display the tags belonging to their guess that also belong to the solution; therefore a better guess will provide better information.  
Exploring the internet, I found Noah Veltman's IMDB game at https://noahveltman.com/imdb/ which does use tags but in a very different way; the user in this game is presented with the tags that grow regardless of guesses and timed to see how quickly they can guess the film. The code therefore needed to be implemented in an entirely different way, and despite being based on the same resource, the game has a very different feel and approach.


## Running the application
The game can be run online using the above link.
To run Taggl in Python from your home computer, simply run all of the code in the Taggle.ipynb file, and interaction takes place on the command line. 
