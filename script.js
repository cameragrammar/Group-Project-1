const ballApi = "https://www.balldontlie.io/api/v1/"
const today = new Date();
const dateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
const teamArr = [];

console.log(dateStr)

const getTeamsApi = () => {
    fetch("https://www.balldontlie.io/api/v1/teams")
    .then((response) => response.json())
    .then((result) => {
        console.log(result.data);
        result.data.forEach(team => {
            for (let name in team) {
                if (team.name == "Jazz"){
                    console.log(team.id, team.name);
                }
            }
        })
    })
}

const getScheduleApi = (teamId) => {
    fetch(ballApi + "games?per_page[]=100&start_date=" + dateStr + "&team_ids[]=" + teamId)
    .then((response) => response.json())
    .then((result) => 
    {
        result.data.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
          });
        console.log(result.data)
    })
}

getTeamsApi();
getScheduleApi(29);