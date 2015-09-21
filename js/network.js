var playerNumber = 1;
var opponentNumber = 2;

window.onload = function() {
	if(window.location.hash) {
		console.log("lmao2");
		document.getElementById('load-existing-game').style.display = "block";
		loadExistingGame(window.location.hash.substring(1),1);
	} else {
		console.log("lmao");
	}
}

function createGameLink() {
	var nameInput = document.getElementById('playerName');
	var creatingContainer = document.getElementById('creating-container');
	var waitingContainer = document.getElementById('waiting-container');

	if(nameInput.value) {
		//console.log(nameInput.value);
		nameInput.style.border = "3px solid #EBD4A0;";
		playerName = nameInput.value;

		creatingContainer.style.display = "none";
		waitingContainer.style.display = "block";

		gameID = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});

		console.log(gameID);
		window.location.hash = gameID;

	    xmlhttp.onreadystatechange = function(){
	        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
	            //callback(xmlhttp.responseText);
	            document.getElementById('link').innerHTML = "http://ayushmehra.com/gravityfour/game.html?id="+xmlhttp.responseText+"&n="+btoa(nameInput.value);
	            waitForAccept();
	        }
	    }

	    var queryString = "playerName=" + nameInput.value + "&gameID=" + gameID;       // A query string that will be sent to the php script, which will then send the values to the db
		xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/creategame.php", true);  // Open the request
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(queryString); 


		document.getElementById('player').innerHTML = "Your turn!<br><img src='resources/red_marker.png'/>";

	} else {
		nameInput.style.border = "3px solid red";
	}
}

function waitForAccept() {

	xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            //callback(xmlhttp.responseText);
            var response = xmlhttp.responseText.substring(1,xmlhttp.responseText.length-1);
			var obj = JSON.parse(response);

			if(obj.player2.length>0) {
				opponent = obj.player2;
				clearInterval(waitForAcceptInterval);
				document.getElementById('waiting-container').innerHTML = "<br><br><h1><span style='color: #00D0F0;'>"+ opponent + "</span> accepted your invite<br><br>Loading game...</h1>";
				setTimeout(function() {
					document.getElementById('create-game').style.display = "none";
					document.getElementById('grid-container').style.display = "block";
				}, 2000);
			}
        }
    }

    var queryString = "gameID=" + gameID;       // A query string that will be sent to the php script, which will then send the values to the db

	var waitForAcceptInterval = setInterval(function() {
		xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/getgameupdate.php", true);  // Open the request
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(queryString);
	}, 3000);
}


