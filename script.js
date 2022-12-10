
var PlayerSearch = document.querySelector('#drop-box-player input').value;
var SearchButton = document.getElementById('searchbutton');
const PlayerApi = "https://www.balldontlie.io/api/v1/players";
const searchResultBox = document.getElementById("search-results");
let playerSearchResults = [];
var team;

function getPlayersApi(playerName) {
    let playerObj;
    let playerData;
    let newResult;
    playerSearchResults = [];
    fetch(PlayerApi + "?search=" + playerName)
    .then((response) => response.json())
    .then((result) => {
        playerData = result.data
        console.log(result.data)
        for (var i = 0; i < result.data.length; i++) {
            //Playersearch should be updated to the search results box
            PlayerSearch = result.data[i].last_name;
        }

        //Hans Code to display search results
        var results = document.querySelector('#search-results');
        var output = '';

        playerData.forEach(player => {
            playerObj = {};
            playerObj.playerId = player.id;
            playerObj.playerName = player.first_name + " " + player.last_name;
            playerObj.teamName = player.team.name;
            playerSearchResults.push(playerObj);
            if (player.position != "") {
                team = player.team.id;
                output +="<p id = '" + player.id + "' onclick='displayStats()'"+ " team='" + playerObj.teamName + "'>" + playerObj.playerName + " " + playerObj.teamName + " </p>";
            }
            


            //build and display serach results
            // newResult = document.createElement("div");
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
        var output = '';
        //output += "<p id='team'> Team: " + team + "</p>";
        output += "<p> Points: " + result.data[0].pts + "</p>";
        output += "<p> Rebounds: " + result.data[0].reb + "</p>";
        output += "<p> Assists: " + result.data[0].ast + "</p>";
        output += "<p> Steals: " + result.data[0].stl + "</p>";
        output += "<p> Blocks: " + result.data[0].blk + "</p>";
        stats.innerHTML = output;
        //getScheduleApi(team);
    })
    fetch('https://www.balldontlie.io/api/v1/players/' + id)
    .then((response) => response.json())
    .then((result) => {
        console.log("team");
        console.log(result.team.id);
        var stats = document.querySelector('#team');
        var output = '';
        output += " Team: " + result.team.abbreviation;
        stats.innerHTML = output;
        getScheduleApi(result.team.id);
    })
}



function DropButton() {
    fetch('https://www.balldontlie.io/api/v1/teams')
    .then((response) => response.json())
    .then((result) => {
        result.data.forEach(team => {
            for (let name in team) {
                if (team.name =="Jazz"){
                    console.log(team.id, team.name)
                }
            }
            
        });
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
        eventList = result._embedded.events;
        eventList.sort(function(a, b) {
            return new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate);
        });
        eventList.forEach(event => {
            console.log(event.name, event.dates.start.localDate, event.url);
        })
    })
}

function displaySchedule(data) {
    var schedule = document.querySelector("#schedule");
    var output = "";
    for (var i=0; i < 10; i++) {
        output += "<p>" + data[i].date + " " + data[i].visitor_team.abbreviation + " VS." + data[i].home_team.abbreviation + "</p>";
    }
    schedule.innerHTML = output;
}

let playerTeamId;
let playerId;

searchResultBox.addEventListener('click', event => {
    selectedPlayerTeam = event.target.teamName;
    selectedPlayerId = event.target.playerId;
    //getTicketApi(selectedPlayerTeam);
    // get player stats API with selectedPlayerId
})

//testing - these console log the results
getTeamsApi();
//getScheduleApi(14);
// getPlayersApi(playerName, 0);
//getTicketApi("Jazz");

console.log(teamArr);