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