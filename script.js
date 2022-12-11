
var PlayerSearch = document.querySelector('#drop-box-player input').value;
var SearchButton = document.getElementById('searchbutton');
const PlayerApi = "https://www.balldontlie.io/api/v1/players";
const searchResultBox = document.getElementById("search-results");
let playerSearchResults = [];
var team;

function getPlayersApi(playerName) {
    let playerObj;
    let playerData;
    playerSearchResults = [];
    fetch(PlayerApi + "?per_page=100&search=" + playerName)
    .then((response) => response.json())
    .then((result) => {
        playerData = result.data
        console.log(result.data)

        //Hans Code to display search results
        var results = document.querySelector('#search-results');
        var output = '';

        playerData.forEach(player => {
            playerObj = {};
            playerObj.playerId = player.id;
            playerObj.playerName = player.first_name + " " + player.last_name;
            playerObj.teamName = player.team.name;
            playerObj.pos = player.position;
            console.table(playerObj)
            playerSearchResults.push(playerObj);
            // below causing issues with displaying results as not every player has a position. Maybe this was to find active players only?
            if (player.position != "") {
                team = player.team.id;
                output += "<p id = '" + player.id + "' onclick='displayStats()'"+ " team='" + playerObj.teamName + "'>" + playerObj.playerName + " " + playerObj.teamName + " </p>";
            }
        })

       //Hans Code to innerHTML display
        results.innerHTML = output;
        console.log(playerSearchResults);
        
        //display all results of the search - should go last
        searchResultBox.style.display = "block";
    })
}

SearchButton.addEventListener('click', function() {
    var PlayerSearch = document.querySelector('#drop-box-player input').value;
    getPlayersApi(PlayerSearch);
})

//Hans Code to Display Stats in player-stats box
function displayStats() {
    var id = event.target.id;
    console.log(id);
    console.log(event.target);  
    fetch('https://www.balldontlie.io/api/v1/season_averages?player_ids[]=' + id)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        var stats = document.querySelector('#player-stats');
        let output = '';
        if (!result.data) {
        //output += "<p id='team'> Team: " + team + "</p>";
        output += "<p> Points: " + result.data[0].pts + "</p>";
        output += "<p> Rebounds: " + result.data[0].reb + "</p>";
        output += "<p> Assists: " + result.data[0].ast + "</p>";
        output += "<p> Steals: " + result.data[0].stl + "</p>";
        output += "<p> Blocks: " + result.data[0].blk + "</p>";

        //getScheduleApi(team);
        } else {
            output = "<p> No stats to display for the current season </p>"
        }
        stats.innerHTML = output;
    })
    fetch('https://www.balldontlie.io/api/v1/players/' + id)
    .then((response) => response.json())
    .then((result) => {
        console.log("team");
        console.log(result.team.id);
        var stats = document.querySelector('#team');
        let output = '';
        output += " Team: " + result.team.abbreviation;
        stats.innerHTML = output;
        getTicketApi(result.team.name);
    })
}

//API Links
const ballApi = "https://www.balldontlie.io/api/v1/";
const ticketApi = "https://app.ticketmaster.com/discovery/v2/events?";
const ticketKey = "apikey=YUtofAEqmAbWVA8ezVcGnMFbUZoJeDvh";

//Get Current Date for API > Games Schedule query
const today = new Date();
const dateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');

//Array to hold all teams and their IDs from the API. This is currently being console logged
const teamArr = [];

let eventList;
const eventOutput = [];

//get all teams, and build the array of teams/ids. This creates an array of objects for reference
//just need to push this result to the dropdown menu(s)
function getTeamsApi(){
    fetch("https://www.balldontlie.io/api/v1/teams")
    .then((response) => response.json())
    .then((result) => {
        console.log(result.data);
        let teamObj = {};
        result.data.forEach(team => {
                if (!teamArr.includes(team.name)) {
                    teamObj = {};
                    teamObj.id = team.id;
                    teamObj.name = team.name;
                    teamArr.push(teamObj);
                }
        })
    })
}

//This function gets the entire upcoming schedule for a certain team, and organizes the array of objects
//by date, ascending (shortest # days to the game is first on the list)
function getScheduleApi(teamId) {
    fetch(ballApi + "games?per_page[]=100&start_date=" + dateStr + "&team_ids[]=" + teamId)
    .then((response) => response.json())
    .then((result) => 
    {
        result.data.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });
        console.log(result.data);
        displaySchedule(result.data);
    })
}

//can search by team name, in the event search api
function getTicketApi(teamName) {
    fetch(ticketApi + ticketKey + "&keyword=" + teamName + "&promoterId=695&size=10")
    .then((response) => response.json())
    .then((result) => {
        console.log(result)
        eventList = result._embedded.events;
        eventList.sort(function(a, b) {
            return new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate);
        });
        // eventList.forEach(event => {
        //     console.log(event.name, event.dates.start.localDate, event.url);
        // })
        displaySchedule(eventList);
    })
}

function displaySchedule(data) {
    var schedule = document.querySelector("#schedule");
    let output = "";
    data.forEach(game => {
        output += "<p><a href='" + game.url + "'>" + game.dates.start.localDate + " " + game.name + "</a></p>";
    })
    schedule.innerHTML = output;
}

let playerTeamId;
let playerId;