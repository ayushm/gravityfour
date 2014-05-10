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
	console.log("done");
}

//redrawTable();


var table = document.getElementById('grid-table');
table.onclick = function (e) {
    e = e || window.event;
    var target = e.srcElement || e.target;
    var targetID = target.id;

    var x = parseInt(targetID.substring(0,1));
    var y = parseInt(targetID.substring(1));

    if(x<7 && grid[x+1][y]<1) { //make sure is placed at bottom of column
    	alert("You can not place it there!");
    }
    else {
    	if(grid[x][y]===0) {
	    	grid[x][y] = currentPlayer;
	    }

	    redrawTable();

	    currentPlayer = (currentPlayer%2)+1;
	    document.getElementById('player').innerHTML = "Player "+currentPlayer+"'s turn!";
	    rotate();
    }

    
};



function rotate() {
	var rand = Math.floor(Math.random() * 3) + 1;
	if(rand>1) {

		var tempGrid = new Array(8);

		for (var i = 0; i < 8; i++) {
			tempGrid[i] = new Array(8);
		}

		if(rand===2) { //clockwise
			for(var x=0; x<8; x++) {
				for(var y=0; y<8; y++) {
					tempGrid[x][y] = grid[7-y][x];
				}
			}
			document.getElementById('rotation').innerHTML = "Just rotated clockwise";
		} 
		else { //counter-clockwise
			for(var x=0; x<8; x++) {
				for(var y=0; y<8; y++) {
					tempGrid[x][y] = grid[y][7-x];
				}
			}
			document.getElementById('rotation').innerHTML = "Just rotated counter-clockwise";
		}

		grid = tempGrid;
		gravity();
		redrawTable();

	}
	else {
		document.getElementById('rotation').innerHTML = "Did not rotate";
	}
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



