var DropButton = document.getElementById('drop-box');
var requestUrl = 'https://www.balldontlie.io/api/v1/teams';

function getApi() {
fetch(requestUrl)
.then(function (response) {
    return response.json();
})
.then(function (data){
    console.log(data)
})
}

DropButton.addEventLisener('click', getApi);


