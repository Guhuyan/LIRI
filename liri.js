require("dotenv").config();

var moment = require("moment");
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Store the user's inputs from the CLI
var command = process.argv[2];
var query = process.argv[3];

// Run LIRI
askLiri(command, query);

// All of LIRI's functions in a single function
function askLiri(command, query) {
  if (command.toUpperCase() == "SPOTIFY-THIS-SONG") {
    if (query == "") {
      spotify
        .search({ type: 'track', query: '"The Sign"', limit: 1, offset: 0 })
        .then(function (response) {
          let res = response.tracks.items
          console.log(`
Artist(s): ${res[0].artists[0].name}
Song: ${res[0].name}
Preview: ${res[0].preview_url}
Album: ${res[0].album.name}
Track #: ${res[0].track_number}
Release Date: ${res[0].album.release_date}
        `);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    else {
      spotify
        .search({ type: 'track', query: `"${query}"`, limit: 1, offset: 0 })
        .then(function (response) {
          let res = response.tracks.items
          console.log(`
Artist(s): ${res[0].artists[0].name}
Song: ${res[0].name}
Preview: ${res[0].preview_url}
Album: ${res[0].album.name}
Track #: ${res[0].track_number}
Release Date: ${res[0].album.release_date}
        `);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
  else if (command.toUpperCase() == "MOVIE-THIS") {
    let omdbQuery = query.replace(" ", "+");
    axios
      .get(`https://www.omdbapi.com/?t=${omdbQuery}&apikey=trilogy`)
      .then(function (response) {
        let res = response.data;
        console.log(`
Title: ${res.Title}
Year: ${res.Year}
IMDB Rating: ${res.Ratings[0].Value}
RT Rating: ${res.Ratings[1].Value}
Produced in: ${res.Country}
Plot: ${res.Plot}
Actors: ${res.Actors}
      `);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });

  }
  else if (command.toUpperCase() == "CONCERT-THIS") {
    let bitQuery = query.replace(" ", "%20");
    axios
      .get(`https://rest.bandsintown.com/artists/${bitQuery}/events?app_id=codingbootcamp`)
      .then(function (response) {
        let res = response.data;
        for (i in res) {
          console.log(`
Venue Name: ${res[i].venue.name}
Venue Location: ${res[i].venue.city}, ${res[i].venue.region}, ${res[i].venue.country}
Date of Event: ${moment(res[i].datetime).format("MM/DD/YYYY")}
------------------------------------------------------------
        `)
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }
  else if (command.toUpperCase() == "DO-WHAT-IT-SAYS") {
    fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error);
      }
      var dataArr = data.split(",");
      if (dataArr[0].toUpperCase() == "DO-WHAT-IT-SAYS") {
        console.log(`ERROR: Can not use ${dataArr[0]} from the .txt file as a command.`)
      }
      else {
        askLiri(dataArr[0], dataArr[1]);
      }
    });
  }
  else {
    console.log("Please enter a valid command line.");
  }
}