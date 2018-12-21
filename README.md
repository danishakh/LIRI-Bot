# LIRI-Bot
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and returns data.

# npm packages used:
- twitter
- request
- node-spotify-api
- weatherjs

# usage:
After downloading the project, you can run various commands to get data returned to you.You can pull information about a specific movie
using the OMDB API, or about a specific audio track via Spotify API, and more. 

LIRI currently accepts the following commands: (how-to)

1. `node liri my-tweets` - returns the last 10 tweets from the configured user's twitter account
2. `node liri spotify nothing else matters` - will use the spotify.search method in node-spotify-api and return track details. (Note: Not specifying a track will get you to details on 'The Sign by Ace of Base')
3. `node liri movie tropic thunder` - will use the omdb api to pull movie details. (Note: Not specifying a movie will default to returning details about 'Mr. Nobody')
4. `node liri weather toronto canada` - will return the weather details of Toronto, Canada via the weather-js api
5. `node liri do-what-it-says` - will read the text file *random.txt* and execute the commands in there. The text file should have the *command, "arguments" format. See default values...
