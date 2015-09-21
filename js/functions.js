var currentPlayer = 1;
var grid = new Array(8);

for (var i = 0; i < 8; i++) {
	grid[i] = new Array(8);
}

for(var x=0; x<8; x++) {
	for(var y=0; y<8; y++) {
		grid[x][y] = 0;
	}
}

var xmlhttp = new XMLHttpRequest();
var gameID = "";
var playerName = "";
var opponent = "";
var processing = false;
var waiting = false;
var processingCover = document.getElementById('processing-cover');
var table = document.getElementById('grid-table');

function redrawTable() {
	for(var x=0; x<8; x++) {
		for(var y=0; y<8; y++) {
			var id = x.toString()+y.toString();
			var content;
			if(grid[x][y]===0) {
				content = "";
			}
			else if(grid[x][y]===1) {
				content = "<img src='resources/red_marker.png'/>";
			}
			else {
				content = "<img src='resources/blue_marker.png'/>";
			}
			document.getElementById(id).innerHTML = content;
		}
	}
}

function rotate(rand) {
	//var rand = Math.floor(Math.random() * 3) + 1;
	console.log(processing);
	if(rand>1) {

		var tempGrid = new Array(8);

		for (var i = 0; i < 8; i++) {
			tempGrid[i] = new Array(8);
		}

		if(rand===2) { //clockwise
			document.getElementById('grid').classList.remove('spin-clock');
			for(var x=0; x<8; x++) {
				for(var y=0; y<8; y++) {
					tempGrid[x][y] = grid[7-y][x];
				}
			}
			
		} 
		else { //counter-clockwise
			document.getElementById('grid').classList.remove('spin-counter');
			for(var x=0; x<8; x++) {
				for(var y=0; y<8; y++) {
					tempGrid[x][y] = grid[y][7-x];
				}
			}
			
		}

		grid = tempGrid;
		gravityAnimated();
		setTimeout(function(){checkForWinner();}, 1000);
		redrawTable();		
	}

}

function rotateAnimation(random) {

	var rand = Math.floor(Math.random() * 3) + 1;
	if(random) {
		rand = random;
	}

	var isGroundedTimer = setInterval(function() {
		console.log('running interval');
		if(isFullyGrounded()) {
			console.log('grounded');
			if(rand>1) {
				if(rand===2) {
					rotateStars(true);
					document.getElementById('grid').classList.add('spin-clock');
					document.getElementById('rotation').innerHTML = "Just rotated<img src='resources/rotate_clock.png' />";
				}
				else {
					rotateStars(false);
					document.getElementById('grid').classList.add('spin-counter');
					document.getElementById('rotation').innerHTML = "Just rotated<img src='resources/rotate_counter.png'/>";
				}

				setTimeout(function(){rotate(rand);}, 1500);
			}
			else {
				checkForWinner();
				document.getElementById('rotation').innerHTML = "Did not rotate<img src='resources/rotate_none.png' />";
			}

			clearInterval(isGroundedTimer);			
		}
	}, 250);
	
}

function instantGravity(gravGrid) {
	var _grid = gravGrid.map(function(arr) {
		return arr.slice();
	});
	var numEmpty = 0;

	for(var y=0; y<8; y++) {
		for(var x=7; x>=0; x--) {

			if(_grid[x][y]===0)
				numEmpty++;
			else {
				_grid[x+numEmpty][y] = _grid[x][y];
				if(numEmpty)
					_grid[x][y]=0;
			}
		}
		numEmpty = 0;
	}
	return _grid;
}

function gravityAnimated() {

	var gravityAnimationTimer = setInterval(function() {droppingAnimation();}, 125);
	setTimeout(function() {clearInterval(gravityAnimationTimer);}, 1000);
	
}

function droppingAnimation() {

	var numEmpty = 0;

	for(var y=0; y<8; y++) {
		for(var x=7; x>=0; x--) {
			if(grid[x][y]===0) {
				numEmpty++;
			}
			else if(numEmpty>0) {
				grid[x+1][y] = grid[x][y];
				grid[x][y] = 0;
			}
		}
		numEmpty = 0;
	}
	redrawTable();
}

function isFullyGrounded() {
	var numEmpty = 0;
	for(var y=0; y<8; y++) {
		for(var x=7; x>=0; x--) {
			if(grid[x][y]===0) {
				numEmpty++;
			}
			else if(numEmpty>0) {
				return false;
			}
		}
		numEmpty = 0;	
	}
	return true;
}

function checkForWinner() {
	var winner = 0;
	//horizontal check
	var count = 1;
	for(var x=7; x>=0; x--) {
		for(var y=0; y<7; y++) {
			if(grid[x][y]!==0 && grid[x][y]===grid[x][y+1]) {
				count++;							
				if(count>3) {
					winner = grid[x][y];

					for(var a=y-2; a<=y+1; a++) {
						var id = x.toString()+a.toString();
						document.getElementById(id).classList.add('winning');
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					processingCover.style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
			//if(count> 1) {console.log(count);}
		}
		count = 0;
	}

	//vertical check
	for(var y=0; y<8; y++) {
		for(var x=7; x>0; x--) {
			if(grid[x][y]!==0 && grid[x][y]===grid[x-1][y]) {
				count++;				
				if(count>3) {
					winner = grid[x][y];	

					for(var a=x+2; a>=x-1; a--) {
						var id = a.toString()+y.toString();
						document.getElementById(id).classList.add('winning');
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
			//if(horizontal> 1) {console.log(horizontal);}
		}
		count = 1;
	}

	//left diagonal check (left half including center diagonal) direction = \
	var i, j;
	for(var x=4; x>=0; x--) {
		j = 0;
		i = x;
		while(i<7) {
			if(grid[i][j]===grid[++i][++j] && grid[i][j]!==0) {
				count++;
				if(count>3) {
					winner = grid[i][j];
					var b = j-3;
					for(var a=i-3; a<=i; a++) {
						var id = a.toString()+b.toString();
						document.getElementById(id).classList.add('winning');
						b++;
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
		}
		count = 1;
	}

	//right diagonal check (right half) direction = /
	for(var x=4; x>=0; x--) {
		j = 7;
		i = x;
		while(i<7) {
			if(grid[i][j]===grid[++i][--j] && grid[i][j]!==0) {
				count++;
				if(count>3) {
					winner = grid[i][j];

					var b = j;
					for(var a=i; a>=i-3; a--) {
						var id = a.toString()+b.toString();
						document.getElementById(id).classList.add('winning');
						b++;
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
		}
		count = 1;
	}

	//left diagonal check (right half) direction = \
	for(var y = 1; y<8; y++) {
		i = 0;
		j = y;
		while(j<7) {
			if(grid[i][j]===grid[++i][++j] && grid[i][j]!==0) {
				count++;
				if(count>3) {
					winner = grid[i][j];

					var b = j;
					for(var a=i; a>=i-3; a--) {
						var id = a.toString()+b.toString();
						document.getElementById(id).classList.add('winning');
						b--;
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
		}
		count = 1;
	}

	//right diagonal check (left half) direction = /
	for(var y = 6; y>=0; y--) {
		i = 0;
		j = y;
		while(j>0) {
			if(grid[i][j]===grid[++i][--j] && grid[i][j]!==0) {
				count++;
				if(count>3) {
					winner = grid[i][j];

					var b = j;
					for(var a=i; a>=i-3; a--) {
						var id = a.toString()+b.toString();
						document.getElementById(id).classList.add('winning');
						b++;
					}

					//alert("Player " + winner + " wins!");
					displayWinner(winner);
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
					return;
				}
			} else {
				count = 1;
			}
		}
		count = 1;
	}

	processing = false;
	if(!waiting) {
		document.getElementById('processing-cover').style.display = 'none';
	}
}

function gridToString() {
	var _grid = instantGravity(grid);
	var gridString = "";
	for(var x=0; x<8; x++) {
		for(var y=0; y<8; y++) {
			gridString += _grid[x][y];
		}
	}
	return gridString;
}

function stringToGrid(gridString) {
	var _gridString = gridString.split("");
	var x=0, y=0;
	for(var i=1; i<=64; i++) {		
		grid[x][y] = parseInt(_gridString[i-1]);
		y++;
		if(i%8===0) {
			y=0;
			x++;
		}
	}
}

function displayWinner(winner) {
	$('td').animate({
		width: "4vmin",
		height: "4vmin"
	}, 1000, "swing");

	$("#grid-table").animate({
		marginTop: "40vmin"
	}, 1000, "swing");

	var winnerContainer = document.getElementById("winner");
	var winnerNameSpan = document.getElementById("winnerName");

	if(playerName!=="" || opponent!=="") { //is networked game
		if(winner==playerNumber) {
			winnerNameSpan.innerHTML = "You win!";
		} else {
			winnerNameSpan.innerHTML = opponent+" wins!";
		}
	} else {
		winnerNameSpan.innerHTML = "Player "+winner+" wins!";
	}

	document.getElementById('player-div').style.display = "none";
	document.getElementById('rotation-div').style.display = "none";

	winnerContainer.style.display = "block";
	$('#winner').animate({
		opacity: 1
	}, 1000, "swing");

	var f = new Fireworks();

}

function loadExistingGame(existingGameID, playerNum) {

	xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            //callback(xmlhttp.responseText);
            //console.log(xmlhttp.responseText);            

            if(xmlhttp.responseText==="No such game" || xmlhttp.responseText==="No second player") {            	
            	document.getElementById("load-message").innerHTML = "Hmmm, couldn't find this game<br><br>Redirecting to you the home page";
            	setTimeout(function(){
            		window.location = "index.html";
            	}, 3000);
            	var creatingContainer = document.getElementById('creating-container');
            	if(creatingContainer) {
            		creatingContainer.style.display = "none";
            	}
            } else {

            	var acceptingContainer = document.getElementById('accepting-container');
            	if(acceptingContainer) {
            		acceptingContainer.style.display = "none";
            	}
            	var creatingContainer = document.getElementById('creating-container');
            	if(creatingContainer) {
            		creatingContainer.style.display = "none";
            	}

            	var response = xmlhttp.responseText.substring(1,xmlhttp.responseText.length-1);
				var obj = JSON.parse(response);
				gameID = existingGameID;
            	currentPlayer = parseInt(obj.turn);
				opponent = (playerNum===1) ? obj.player2 : obj.player1;
				document.getElementById("load-message").innerHTML = "Loading your game with <span style='color: #00D0F0;'>"+opponent+"</span>";

				if(obj.grid){stringToGrid(obj.grid); redrawTable(); console.log(obj.grid);}
				rotate(parseInt(obj.rotation));
				var markerColor = (parseInt(obj.turn)===1 || (playerNum===1 && parseInt(obj.turn)<1)) ? "red" : "blue";
			    var marker = "<img src='resources/"+markerColor+"_marker.png'/>";  			    				

				if(parseInt(obj.rotation)===3) {
					document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_counter.png'/>";
				} else if(parseInt(obj.rotation)===2) {
					document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_clock.png' />";
				} else  if(parseInt(obj.rotation)===1) {					
					document.getElementById('rotation').innerHTML = "Did not rotate<br><img src='resources/rotate_none.png' />";
				}

				if(parseInt(obj.turn)===playerNum || (playerNum===1 && parseInt(obj.turn)<1)) {
					document.getElementById('player').innerHTML = "Your turn!<br>"+marker;
				} else {
					document.getElementById('player').innerHTML = opponent+"'s turn!<br>"+marker;
					console.log("hello");
					waitForOpponent();
				}

				setTimeout(function() {
					document.getElementById('load-existing-game').style.display = "none";
					document.getElementById('grid-container').style.display = "block";
					var createGameDiv=document.getElementById('create-game');
					if(createGameDiv){createGameDiv.style.display = "none";}
					var acceptGameDiv=document.getElementById('accept-game');
					if(acceptGameDiv){acceptGameDiv.style.display = "none";}
					if(parseInt(obj.turn)!==playerNum && !(playerNum===1 && parseInt(obj.turn)<1)) {
						document.getElementById('processing-cover').style.display = "block";
					}
				},3000);
            }
        }
    }

    var queryString = "gameID=" + existingGameID;
	xmlhttp.open("POST", "http://ayushmehra.com/gravityfour/backend/getgameupdate.php", true);  // Open the request
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send(queryString);
}

window.onfocus = function() {
	if(!isFullyGrounded()) {
		var returnFromBackgroundGravityTimer = setInterval(function() {droppingAnimation(); if(isFullyGrounded()){clearInterval(returnFromBackgroundGravityTimer);}}, 125);
	}
}

