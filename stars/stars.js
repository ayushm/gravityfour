var lastSheet = document.styleSheets[document.styleSheets.length - 1];
var insertIndex = 0;
var currentlyClockwise = true;
var browserName = getBrowserName().toUpperCase();
console.log(browserName);
function rotateStars(clockwise) {	

	var el = document.getElementById('star1container');
	var degree = getCurrentRotation('star1container');
	var toDegree = degree-45;
	if(clockwise) {
		toDegree+=90;
	}
	//var lastSheet = document.styleSheets[document.styleSheets.length - 1];
	//lastSheet.insertRule("@keyframes " + "changeDirectionAnimation" + " { from { transform:rotate("+ degree +"deg); } to {transform:rotate(" + toDegree + "deg);} }",0);
	
	//lastSheet.insertRule("@-webkit-keyframes " + "starsboost" + " { from { -webkit-transform:rotate("+ degree +"deg); } to {-webkit-transform:rotate(" + toDegree + "deg);} }", insertIndex++);
	insertStarAnimationRule("starsboost", degree, toDegree);

	var tempStyle = window.getComputedStyle(el);
	el.className = "starContainer";
	el.style= tempStyle;
	el.className += " star1boostclass";

	setTimeout(function() {
		degree = getCurrentRotation('star1container');
		toDegree = degree-360;
		if(clockwise) {
			toDegree+=720;
		}
		//lastSheet.insertRule("@keyframes " + "fastRecoverAnimation" + " { from { transform:rotate("+ degree +"deg); } to {transform:rotate(" + toDegree + "deg);} }", insertIndex++);
		insertStarAnimationRule("fastRecoverAnimation", degree, toDegree);
		tempStyle = window.getComputedStyle(el);
		el.className = "starContainer";
		el.style= tempStyle;
		el.className += " fastRecover";
	},1500);

	// for star2 and star3 containers below

	if(clockwise == currentlyClockwise) {
		getCurrentRotation('star2container');
		console.log("same direction");
		return;
	}

	console.log("CHANGED DIRECTION");

	var star2container = document.getElementById('star2container');
	var star2degree = getCurrentRotation('star2container');
	var star2toDegree = star2degree-360;
	if(clockwise) {
		star2toDegree+=720;
	}
	
	//lastSheet.insertRule("@keyframes " + "mediumAnimation" + " { from { transform:rotate("+ star2degree +"deg); } to {transform:rotate(" + star2toDegree + "deg);} }", insertIndex++);
	insertStarAnimationRule("mediumAnimation", star2degree, star2toDegree);
	
	var star2style = window.getComputedStyle(star2container);
	star2container.className = "starContainer";
	star2container.style = star2style;
	star2style.height; //NEED TO ACCESS SOME PROPERTY OF STYLE TO UPDATE IT?
	star2container.className += " mediumNew";

	var star3container = document.getElementById('star3container');
	var star3degree = getCurrentRotation('star3container');
	var star3toDegree = star3degree-360;
	if(clockwise) {
		star3toDegree+=720;
	}
	
	//lastSheet.insertRule("@keyframes " + "slowAnimation" + " { from { transform:rotate("+ star3degree +"deg); } to {transform:rotate(" + star3toDegree + "deg);} }", insertIndex++);
	insertStarAnimationRule("slowAnimation", star3degree, star3toDegree);
	
	var star3style = window.getComputedStyle(star3container);
	star3container.className = "starContainer";
	star3container.style = star3style;
	star3style.height; //NEED TO ACCESS SOME PROPERTY OF STYLE TO UPDATE IT?
	star3container.className += " slowNew";

	currentlyClockwise = !currentlyClockwise;
}

function getCurrentRotation( elid ) {
  var el = document.getElementById(elid);
  var st = window.getComputedStyle(el, null);
  var tr = st.getPropertyValue("-webkit-transform") ||
       st.getPropertyValue("-moz-transform") ||
       st.getPropertyValue("-ms-transform") ||
       st.getPropertyValue("-o-transform") ||
       st.getPropertyValue("transform") ||
       "fail...";

  if( tr !== "none") {
    //console.log('Matrix: ' + tr);

    var values = tr.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];

    var scale = Math.sqrt(a*a + b*b);

    // arc sin, convert from radians to degrees, round
    /** /
    var sin = b/scale;
    var angle = Math.round(Math.asin(sin) * (180/Math.PI));
    /*/
    var radians = Math.atan2(b, a);
	if ( radians < 0 ) {
	  radians += (2 * Math.PI);
	}
	var angle = Math.round( radians * (180/Math.PI));
    /**/

  } else {
    var angle = 0;
  }

  // works!
  console.log('Rotate: ' + angle + 'deg');
  return angle;
}

function insertStarAnimationRule(name, degree, toDegree) {
	if(browserName=="CHROME" || browserName=="SAFARI") {
		lastSheet.insertRule("@-webkit-keyframes " + name + " { from { -webkit-transform:rotate("+ degree +"deg); } to {-webkit-transform:rotate(" + toDegree + "deg);} }", insertIndex++);
	} else if(browserName=="FIREFOX") {
		lastSheet.insertRule("@-moz-keyframes " + name + " { from { -moz-transform:rotate("+ degree +"deg); } to {-moz-transform:rotate(" + toDegree + "deg);} }", insertIndex++);
	} else if(browserName=="OPERA") {
		lastSheet.insertRule("@-o-keyframes " + name + " { from { -o-transform:rotate("+ degree +"deg); } to {-o-transform:rotate(" + toDegree + "deg);} }", insertIndex++);
	} else {
		lastSheet.insertRule("@keyframes " + name + " { from { transform:rotate("+ degree +"deg); } to {transform:rotate(" + toDegree + "deg);} }", insertIndex++);
	}
}

function getBrowserName() {
	var nAgt = navigator.userAgent;
	var browserName = "";
	if (nAgt.indexOf("OPR/")!=-1) {
	 	browserName = "Opera";
	}
	else if (nAgt.indexOf("Opera")!=-1) {
	 	browserName = "Opera";
	}
	else if (nAgt.indexOf("MSIE")!=-1) {
	 	browserName = "IE";
	}
	else if (nAgt.indexOf("Chrome")!=-1) {
	 	browserName = "Chrome";
	}
	else if (nAgt.indexOf("Safari")!=-1) {
	 	browserName = "Safari";
	}
	else if (nAgt.indexOf("Firefox")!=-1) {
	 	browserName = "Firefox";
	}
	else {
		browserName = "Unknown";
	}

	return browserName;
}
