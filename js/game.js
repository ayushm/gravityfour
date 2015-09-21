waiting = true;

var playerNumber = 2;
var opponentNumber = 1;

window.onload = function() {

    var regex = new RegExp("[\\?&]" + "id" + "=([^&#]*)"),
        results = regex.exec(location.search);
    gameID = (results === null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    console.log(gameID);

    checkForExistingGame(gameID);

    regex = new RegExp("[\\?&]" + "n" + "=([^&#]*)"),
        results = regex.exec(location.search);
    opponent = atob((results === null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")));
    if(!opponent) {
    	window.location = "/index.html";
    }
    console.log(opponent);

    if(!gameID || !opponent) {
    	window.location = "index.html";
    } else if(window.location.hash) {
    	document.getElementById('load-existing-game').style.display = "block";
    	loadExistingGame(gameID,2);
    } else {
    	document.getElementById('inviter').innerHTML = opponent;
    }
}

function acceptGameInvite() {
	var nameInput = document.getElementById('playerName');
	var acceptingContainer = document.getElementById('accepting-container');
	var loadingContainer = document.getElementById('loading-container');

	if(nameInput.value) {
		//console.log(nameInput.value);
		nameInput.style.border = "3px solid #EBD4A0;";
		acceptingContainer.style.display = "none";
		loadingContainer.style.display = "block";
		document.getElementById('player').innerHTML = opponent +"'s turn!<br><img src='resources/red_marker.png'/>";
		window.location.hash = gameID;

		xmlhttp.onreadystatechange = function(){
	        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
	            document.getElementById('accept-game').style.display = "none";
	            document.getElementById('grid-container').style.display = "block";
	            processingCover.style.display = "block";
	            waitForOpponent();
	        }
	    };	    

	    var queryString = "playerName=" + nameInput.value + "&gameID=" + gameID +"&accept=true";       // A query string that will be sent to the php script, which will then send the values to the db
		xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/creategame.php", true);  // Open the request
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(queryString); 

	} else {
		nameInput.style.border = "3px solid red";
	}
}

function checkForExistingGame(existingGameID) {

	xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        	var response = xmlhttp.responseText.substring(1,xmlhttp.responseText.length-1);
			var obj = JSON.parse(response);
			if(obj.player2.length>0) {
				document.getElementById('load-existing-game').style.display = "block";
				loadExistingGame(existingGameID,2);
			}
        }
    };

	var queryString = "gameID=" + existingGameID;
	xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/getgameupdate.php", true);  // Open the request
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send(queryString);
}
