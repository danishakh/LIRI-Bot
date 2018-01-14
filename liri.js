var path = require('path');
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var fs = require('fs');

// Get my twitter keys from keys.js
var myKeys = require('./keys.js');

// Save Twitter Keys to environment variables
process.env.TWITTER_CONSUMER_KEY = myKeys.twitterKeys.consumer_key;
process.env.TWITTER_CONSUMER_SECRET = myKeys.twitterKeys.consumer_secret;
process.env.TWITTER_ACCESS_TOKEN_KEY = myKeys.twitterKeys.access_token_key;
process.env.TWITTER_ACCESS_TOKEN_SECRET = myKeys.twitterKeys.access_token_secret;

// Save Spotify Keys to environmental variables
process.env.SPOTIFY_CLIENT_ID = myKeys.spotifyKeys.client_id;
process.env.SPOTIFY_CLIENT_SECRET = myKeys.spotifyKeys.client_secret;

// Initialize new twitter instance for user-based authentication
var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Initialize new spotify instance for user based authentication
var spotify = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET
});

// Allowed commands
var commands = ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

// Store all of the arguments in an array
var nodeArgs = process.argv;

// Function to get user's latest 10 tweets
function getLatestTweets() {
	//GET https://api.twitter.com/1.1/statuses/home_timeline.json
	client.get('statuses/user_timeline', {count: 10} ,(error, tweets, response) => {
		if(error) {
			console.log(error);
			//throw error;
		}
		for(var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].created_at);
			console.log(tweets[i].text);
		}
		//console.log(tweets[0].text);
	});
}

// Function to get Spotify track
function getSpotifyTrack() {
	// Set the trackName to the 1st argument after 'spotify-this-song'
	var trackName = nodeArgs[3];

	// If no arguments, then search 'the sign by ace of base'
	if (nodeArgs.length === 3) {
		trackName = 'the sign';

		spotify.search({ type: 'track', query: trackName }, (err, data) => {
		
			if (err) {
		    	return console.log('Error occurred: ' + err);
		  	}
		 	
		 	// for (var i = 0; i < data.tracks.items.length; i++){
		 	// 	console.log(data.tracks.items[i].name); 
		 	// }

		 	console.log('* Artist: ' + data.tracks.items[7].artists[0].name);
		 	console.log('* Track: ' + data.tracks.items[7].name); 	
		 	console.log('* Preview URL: ' + data.tracks.items[7].preview_url);
		 	console.log('* Album: ' + data.tracks.items[7].album.name);
		});
	}
	else {
		for(var i = 4; i < nodeArgs.length; i++) {
			trackName = trackName + ' ' + nodeArgs[i];
		}

		spotify.search({ type: 'track', query: trackName }, (err, data) => {
		
			if (err) {
		    	return console.log('Error occurred: ' + err);
		  	}

		 	console.log('* Artist: ' + data.tracks.items[0].artists[0].name);
		 	console.log('* Track: ' + data.tracks.items[0].name); 	
		 	console.log('* Preview URL: ' + data.tracks.items[0].preview_url);
		 	console.log('* Album: ' + data.tracks.items[0].album.name);
		});
	}

}

// Function to get movie info from OMDB API
function getMovie() {

	var movieName = nodeArgs[3];

	// If no arguments present to search for movie, then search for Mr. Nobody
	if(nodeArgs.length === 3) {
		movieName = 'Mr.+Nobody';

		// Then run a request to the OMDB API with the movie specified
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

		request(queryUrl, (error, response, body) => {
			// If the request is successful
			if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the required info
			    console.log('* Title: ' + JSON.parse(body).Title);
			    console.log('* Year: ' + JSON.parse(body).Year);
			    console.log('* IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
			    console.log('* Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[0].Value);
			    console.log('* Country: ' + JSON.parse(body).Country);
			    console.log('* Language: ' + JSON.parse(body).Language);
			    console.log('* Short Plot: ' + JSON.parse(body).Plot);
			    console.log('* Actors: ' + JSON.parse(body).Actors);
		  	}
		  	else {
		  		console.log(error);
		  	}
		});
	}
	else {
		// Loop through the arguments after the command argument, and put them together into 'movieName'
		for(var i = 4; i < nodeArgs.length; i++) {
			movieName = movieName + '+' + nodeArgs[i];
		}

		// Then run a request to the OMDB API with the movie specified
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

		request(queryUrl, (error, response, body) => {
			// If the request is successful
			if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the required info
			    console.log('* Title: ' + JSON.parse(body).Title);
			    console.log('* Year: ' + JSON.parse(body).Year);
			    console.log('* IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
			    console.log('* Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[0].Value);
			    console.log('* Country: ' + JSON.parse(body).Country);
			    console.log('* Language: ' + JSON.parse(body).Language);
			    console.log('* Short Plot: ' + JSON.parse(body).Plot);
			    console.log('* Actors: ' + JSON.parse(body).Actors);
		  	}
		  	else {
		  		console.log(error);
		  	}
		});
		
	}
}

// Function to read 'random.txt' and execute the commands
function runFileCommands() {
	fs.readFile('random.txt', 'utf8', (err, data) => {
		if (err) {
			console.log(err);
		}

		// Split the command into an array
		var strArray = data.split(',');

		// Set the 1st value of the array to the command argument		
		nodeArgs[2] = strArray[0];

		// If the array has more than 1 element, then remove the "" surrounding the 2nd element
		if (strArray.length > 1) {
			myArgument = strArray[1].replace(/["]+/g, '');
		}

		// Split my argument into an array of words
		myArgumentArr = myArgument.split(' ');

		// Loop through my argument array
		for(var i = 0; i < myArgumentArr.length; i++) {
			// Push each argument array into nodeArgs array
			nodeArgs.push(myArgumentArr[i]);
		}

		// Call appropriate function
		if(nodeArgs[2] === 'my-tweets') {
			getLatestTweets();
		}
		else if(nodeArgs[2] === 'spotify-this-song') {
			getSpotifyTrack();
		}
		else if(nodeArgs[2] === 'movie-this') {
			getMovie();
		}
	});
}

if(nodeArgs[2] === 'my-tweets') {
	getLatestTweets();
}
else if(nodeArgs[2] === 'spotify-this-song') {
	getSpotifyTrack();
}
else if(nodeArgs[2] === 'movie-this') {
	getMovie();
}
else if(nodeArgs[2] === 'do-what-it-says') {
	runFileCommands();
}
else {
	console.log('Please only use one of the following commands:');
	for(var i = 0; i < commands.length; i++) {
		console.log(commands[i]);
	}
}