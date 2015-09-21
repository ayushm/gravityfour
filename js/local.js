table.onclick = function (e) {

	if(processing) {
		return;
	}

    e = e || window.event;
    var target = e.srcElement || e.target;
    var targetID = target.id;

    var x = parseInt(targetID.substring(0,1));
    var y = parseInt(targetID.substring(1));

	if(grid[0][y]===0) {
    	grid[0][y] = currentPlayer;
    	processing = true;
    	document.getElementById('processing-cover').style.display = 'block';
	    redrawTable();
	    gravityAnimated();
	    redrawTable();
	    setTimeout(function() {rotateAnimation();}, 1000);

	    currentPlayer = (currentPlayer%2)+1;

	    var marker = (currentPlayer<2) ? "<img src='resources/red_marker.png'/>" : "<img src='resources/blue_marker.png'/>";

	    
	    document.getElementById('player').innerHTML = "Player "+currentPlayer+"'s turn!"+marker;
    }
    else {
    	//alert("Sorry, the column is full");
    }
    
};