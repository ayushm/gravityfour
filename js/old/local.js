var currentPlayer = 1;
var grid = new Array(8);

var processing = false;

for (var i = 0; i < 8; i++) {
	grid[i] = new Array(8);
}

for(var x=0; x<8; x++) {
	for(var y=0; y<8; y++) {
		grid[x][y] = 0;
	}
}

function redrawTable() {
	for(var x=0; x<8; x++) {
		for(var y=0; y<8; y++) {
			var id = x.toString()+y.toString();
			var content;
			if(grid[x][y]===0) {
				content = "";
			}
			else if(grid[x][y]===1) {
				content = "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_red.png'/>";
			}
			else {
				content = "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_blue.png'/>";
			}
			document.getElementById(id).innerHTML = content;
		}
	}
	//console.log("done");
}

//redrawTable();


var table = document.getElementById('grid-table');
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
		    setTimeout(function() {rotateAnimation();}, 1000);

		    currentPlayer = (currentPlayer%2)+1;

		    var marker = (currentPlayer<2) ? "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_red.png'/>" : "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_blue.png'/>";

		    
		    document.getElementById('player').innerHTML = "Player "+currentPlayer+"'s turn!<br>"+marker;
	    }
	    else {
	    	alert("Sorry, the column is full");
	    }

	    
/*

    }
    else {
    	if(grid[x][y]===0) {
	    	grid[x][y] = currentPlayer;
	    }

	    redrawTable();

	    rotateAnimation();

	    currentPlayer = (currentPlayer%2)+1;

	    var marker = (currentPlayer<2) ? "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_red.png'/>" : "<img src='https://cdn1.iconfinder.com/data/icons/function_icon_set/circle_blue.png'/>";

	    
	    document.getElementById('player').innerHTML = "Player "+currentPlayer+"'s turn!<br>"+marker;
	    
    }
*/
    
};



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

function rotateAnimation() {

	var isGroundedTimer = setInterval(function() {
		console.log('running interval');
		if(isFullyGrounded()) {
			console.log('grounded');

			var rand = Math.floor(Math.random() * 3) + 1;
			if(rand>1) {
				if(rand===2) {
					document.getElementById('grid').classList.add('spin-clock');
					document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_clock.png' />";
				}
				else {
					document.getElementById('grid').classList.add('spin-counter');
					document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_counter.png'/>";
				}

				setTimeout(function(){rotate(rand);}, 1500);
			}
			else {
				checkForWinner();
				document.getElementById('rotation').innerHTML = "Did not rotate<br><img src='resources/rotate_none.png' />";
			}

			clearInterval(isGroundedTimer);			
		}
	}, 500);

	/*

	var rand = Math.floor(Math.random() * 3) + 1;
	if(rand>1) {
		if(rand===2) {
			document.getElementById('grid').classList.add('spin-clock');
			document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_clock.png' />";
		}
		else {
			document.getElementById('grid').classList.add('spin-counter');
			document.getElementById('rotation').innerHTML = "Just rotated<br><img src='resources/rotate_counter.png'/>";
		}

		setTimeout(function(){rotate(rand);}, 1500);
	}
	else {
		checkForWinner();
		document.getElementById('rotation').innerHTML = "Did not rotate<br><img src='resources/rotate_none.png' />";
	}
*/
	
}



function gravity() {

	var numEmpty = 0;

	for(var y=0; y<8; y++) {
		for(var x=7; x>=0; x--) {

			if(grid[x][y]===0)
				numEmpty++;
			else {
				grid[x+numEmpty][y] = grid[x][y];
				if(numEmpty)
					grid[x][y]=0;
			}
		}
		numEmpty = 0;
	}

}


function gravityAnimated() {

	//var numEmpty = 0;
/*
	setInterval(function() {
		console.log('running interval');
		if(isFullyGrounded()) {
			console.log('grounded');
			
			clearInterval(this);			
		}
	}, 500);	
	*/

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
	for(var y=0; y<8; y++) {
		var numEmpty = 0;
		for(var x=7; x>=0; x--) {
			if(grid[x][y]===0) {
				numEmpty++;
			}
			else if(numEmpty>0) {
				return false;
			}
		}	
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

					alert("Player " + winner + " wins!");
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';
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

					alert("Player " + winner + " wins!");
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

					alert("Player " + winner + " wins!");
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

					alert("Player " + winner + " wins!");
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

					alert("Player " + winner + " wins!");
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

					alert("Player " + winner + " wins!");
					processing = false;
					document.getElementById('processing-cover').style.display = 'none';r
					return;
				}
			} else {
				count = 1;
			}
		}
		count = 1;
	}

	processing = false;
	document.getElementById('processing-cover').style.display = 'none';


}

window.onfocus = function() {
	if(!isFullyGrounded()) {
		var returnFromBackgroundGravityTimer = setInterval(function() {droppingAnimation(); if(isFullyGrounded()){clearInterval(returnFromBackgroundGravityTimer);}}, 125);
	}
}

