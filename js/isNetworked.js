table.onclick = function (e) {

	if(processing) {
		return;
	}

    e = e || window.event;
    var target = e.srcElement || e.target;
    var targetID = target.id;

    var x = parseInt(targetID.substring(0,1));
    var y = parseInt(targetID.substring(1));

    //if(x<7 && grid[x+1][y]<1) { //make sure is placed at bottom of column
    	//alert("You can not place it there!");

    	if(grid[0][y]===0) {
	    	grid[0][y] = currentPlayer;
	    	processing = true;
	    	document.getElementById('processing-cover').style.display = 'block';
		    redrawTable();
		    gravityAnimated();
		    redrawTable();
		    var rand = Math.floor(Math.random() * 3) + 1;
		    setTimeout(function() {rotateAnimation(rand);}, 1000);
		    waiting = true;

		    xmlhttp.onreadystatechange = function(){
		        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
		            waitForOpponent();		    		
		        }
		    }

		    var queryString = "&gameID=" + gameID +"&turn="+opponentNumber+"&column="+y+"&rotation="+rand+"&grid="+gridToString();       // A query string that will be sent to the php script, which will then send the values to the db
			xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/updategame.php", true);  // Open the request
			xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xmlhttp.send(queryString);

		    currentPlayer = (currentPlayer%2)+1;

		    var marker = (currentPlayer<2) ? "<img src='resources/red_marker.png'/>" : "<img src='resources/blue_marker.png'/>";
		    
		    document.getElementById('player').innerHTML = opponent +"'s turn!<br>"+marker;
	    }
	    else {
	    	//alert("Sorry, the column is full");
	    }
    
};

function waitForOpponent() {

	xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            //callback(xmlhttp.responseText);
            var response = xmlhttp.responseText.substring(1,xmlhttp.responseText.length-1);
			var obj = JSON.parse(response);

			if(obj.turn===playerNumber.toString() && isFullyGrounded()) {
				clearInterval(waitForOpponentInterval);
				waiting = false;
				grid[0][obj.column] = currentPlayer;
				redrawTable();
			    gravityAnimated();
			    redrawTable();
			    setTimeout(function() {rotateAnimation(parseInt(obj.rotation));}, 1000);
			    currentPlayer = (currentPlayer%2)+1;
			    var markerColor = (currentPlayer===1) ? "red" : "blue";
			    var marker = "<img src='resources/"+markerColor+"_marker.png'/>";			    
			    document.getElementById('player').innerHTML = "Your turn!<br>"+marker;
			}
        }
    }

    var queryString = "gameID=" + gameID;

	var waitForOpponentInterval = setInterval(function() {
		xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/getgameupdate.php", true);  // Open the request
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(queryString);
	}, 3000);
}

