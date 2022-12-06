
var DropButton = document.getElementById('drop-box');

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

//DropButton.addEventListener('click')

//API Link
const ballApi = "https://www.balldontlie.io/api/v1/";

//Get Current Date for API > Games Schedule query
const today = new Date();
const dateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');

//Array to hold all teams and their IDs from the API. This is currently being console logged
const teamArr = [];

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
    })
}

//Get players, issue below
//can't get players per team? Will need to find a way to display all players on a certain team without querying the entire db
function getPlayersApi(playerName, teamId) {
    fetch(ballApi + "players?search=" + playerName)
    .then((response) => response.json())
    .then((result) => 
    {
        console.log(result);
        for (let player in result.data) {
            if (result.data.teamId)

    }

        }

    })
}

//testing - these console log the results
getTeamsApi();
getScheduleApi(29);
getPlayersApi(playerName, 0);

console.log(teamArr);

console.log(teamArr);


