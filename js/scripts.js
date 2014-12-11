// #### Game Settings

Settings = {
	pegs : {
		red : {
			order: 1,
			start : 2,
			end : 5,
			fill : "red"
		},
		blue : {
			order: 2,
			start : 9,
			end : 12,
			fill : "blue"
		},
		green : {
			order: 3,
			start : 16,
			end : 19,
			fill : "green"
		},
		yellow : {
			order: 4,
			start : 23,
			end : 26,
			fill : "yellow"
		}
	},
	pegZoneNum: 28
}

// ### Global Functions

// Returns the property of an obj based on child prop and value pair
var objValMatch = function(obj,prop,value){
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if(obj[key][prop] === value){
				return key;
			}
		}
	}
}

var getObjByKeyVal = function(obj,prop,val){
  // array to hold matches
  var matches = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if(obj[key][prop] === val){
        // push match to array
				matches.push(obj[key]);
			}
		}
	}
  return matches;
}

var initNextTurn = function(){
	//change player turn based on player color order in Settings obj
	var turn = Session.turn;
	if(turn === objValMatch(Settings.pegs,"order",4)){
		Session.turn = objValMatch(Settings.pegs,"order",1);
	}else{
		newTurn = Settings.pegs[turn].order+1;
		Session.turn = objValMatch(Settings.pegs,"order",newTurn);
	}

	//need to change color of turn text
	diceTurn.setText(Session.turn);
	diceTurn.setFill(Session.turn);

  stage.draw();
}

var checkCollision = function(peg,newPos){
  var pegCol = getObjByKeyVal(pegs.children,"pos",newPos);

  // use first object in returned array. There should only be one collision since only one peg can occupy a spot at a time
	if(pegCol.length && newPos === pegCol[0].pos){
		return pegCol[0];
	}else{
    // no collision so return false
		return false;
	}
}

var movePos = function(peg,newPos){
	//if the peg new position exceeds the number of peg spots, start back at the first peg zone
	if(newPos >= Settings.pegZoneNum){
		//account for additional steps if the new position is greater than the number of peg zones
		var add = newPos - Settings.pegZoneNum;
		peg.x(pegSpots[0+add].getX());
		peg.y(pegSpots[0+add].getY());
		peg.newPos = 0+add;
	}else{
		peg.x(pegSpots[newPos].getX());
		peg.y(pegSpots[newPos].getY());
		//make sure to update peg position
		peg.pos = newPos;
	}
}

var updatePos = function(peg,newPos){
	// test for collisions with other pegs
	var pegCol = checkCollision(peg,newPos);
	if(pegCol && peg.color === pegCol.color){
		//collision with same color peg
		console.log("Collision with another one of your pegs. Go again.");
		
	}else if(pegCol && peg.color !== pegCol.color){
		// collision with another colored peg, so bump peg back to zone
		console.log("You bumped a "+pegCol.color+" peg");
		pegCol.x(pegCol.orgX);
		pegCol.y(pegCol.orgY);
		//change position to 0 since returning peg to zone
		pegCol.pos = 0;
		movePos(peg,newPos);
		initNextTurn();
	}else{
		// no collisions, so move peg normally and start next turn
		movePos(peg,newPos);
		initNextTurn();
	}

}

var checkPegsOn = function(color){
  var pegObj = getObjByKeyVal(pegs.children,"color",color),
      pegsOn = getObjByKeyVal(pegObj,"pos",0);
  return pegsOn;
}

// #### Game Session Info

Session = {
	turn : objValMatch(Settings.pegs,"order",1),
}

// #### Canvas Stage

var stage = new Kinetic.Stage({
	container: 'board',
	width: 1000,
	height: 1000,
	stroke: 'black',
	strokeWidth: 1
});


// ##### DICE
var dice = new Kinetic.Layer({
	x: stage.width()/2,
    y: stage.height()/2,
    width:80,
    height:80
});

var diceCircle = new Kinetic.Circle({
	radius: dice.width(),
	fill: 'transparent',
	stroke: 'black',
	strokeWidth: 1
});

var diceText = new Kinetic.Text({
	x : diceCircle.getX(),
    y : diceCircle.getY(),
  	text: 'Go',
  	fontSize: 30,
  	width:dice.width(),
  	fontFamily: 'Calibri',
  	fill: 'black',
  	align:'center'
});

var diceTurn = new Kinetic.Text({
	x : 0,
    y : diceCircle.getY()+150,
  	text: Session.turn,
  	fontSize: 30,
  	fontFamily: 'Calibri',
  	fill: Session.turn,
  	align:'center',
  	width:dice.width()
});

//center dice text within dice circle
diceText.setOffset({
    x : diceText.width()/2,
    y : diceText.height()/2
});
diceTurn.setOffset({
    x : diceTurn.width()/2,
    y : diceTurn.height()/2
});


// dice layer order
dice.add(diceTurn);
dice.add(diceText);
dice.add(diceCircle);

// add the layer to the stage
stage.add(dice);

// #### board

var board = new Kinetic.Layer({
    width:stage.width(),
    height:stage.height()
});

//create array for pegSpots. NOTE: maybe may pegSpots array temp and just reference kineticjs object
var pegSpots = [],
	pegNum = Settings.pegZoneNum;

for (i = 0; i < pegNum; i++) {
	pegSpots[i] = new Kinetic.Circle({
		x: (diceCircle.getX() + (stage.width()/2.5) * Math.cos(2 * Math.PI * i / pegNum))+stage.width()/2,
		y: (diceCircle.getY() + (stage.height()/2.5) * Math.sin(2 * Math.PI * i / pegNum))+stage.height()/2,
		radius: 25,
		fill: 'transparent',
		stroke: 'black',
		strokeWidth: 1
	});

	//add pegSpots to board layer
	board.add(pegSpots[i]);
}

// add the board to the stage
stage.add(board);


// #### Pegs &
var pegs = new Kinetic.Layer();
var zones = new Kinetic.Layer();

var createPegs = function(color,x,y){

	//temp array to hold pegs and create dynamic variable pegArray[i]
	var pegArray = [];

	pegArray[i] = new Kinetic.Circle({
		x: x,
		y: y,
		radius: 25,
		fill: color,
		stroke: 'black',
		strokeWidth: 3
	});

	// set position to 0. Once a peg is in play, it's position will be set
	pegArray[i].pos = 0;
	// add color to peg obj
	pegArray[i].color = color;
	// Status that says whether the peg is on the board or off (in it's zone)
	pegArray[i].status = "off";
	// save orginal coordinates
	pegArray[i].orgX = pegArray[i].x();
	pegArray[i].orgY = pegArray[i].y();

	pegs.add(pegArray[i]);
}

var createZones = function(color){
	var pegZones = [],
		start = Settings.pegs[color].start,
		end = Settings.pegs[color].end,
		pegNum = Settings.pegZoneNum;
	// NOTE: this loop could probably be joined with the pegSpots loop
	for (i = 0; i < pegNum; i++) {
		if(i >= start && i <= end){
			pegZones[i] = new Kinetic.Circle({
				x: (diceCircle.getX() + (stage.width()/2) * Math.cos(2 * Math.PI * i / pegNum))+stage.width()/2,
				y: (diceCircle.getY() + (stage.height()/2) * Math.sin(2 * Math.PI * i / pegNum))+stage.height()/2,
				radius: 25,
				fill: color,
				opacity: .5,
				stroke: 'black',
				strokeWidth: 1
			});
			//need to makr peg color
			pegZones[i].color = color;
			//add pegSpots to board layer
			zones.add(pegZones[i]);
			//create peg based of zone color and x and y position (peg will initially be placed in a zone position)
			createPegs(color,pegZones[i].getX(),pegZones[i].getY());
		}
		// no reason to continue loop if end has been reached
		if (i === end){
			break;
			
		}
	}
}

var gameInit = function(){
	var obj = Settings.pegs;
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			createZones(key);
		}
	}
}

// Start game, build pegs
gameInit();

//add zones first so pegs will be on top of zone spots
stage.add(zones);
stage.add(pegs);

//### Events

//roll dice on click
diceCircle.on('click', function() {
	random = Math.floor(Math.random() * 6) + 1;
	diceText.setText(random);
	//need to redraw to update number
	dice.draw();

	console.log("Click");
	console.log(diceText.text());

  // if all player's pegs are in their zone and a 6 wasn't rolled, move to next turn
  var currentPegs = checkPegsOn("red");
  if(diceText.text() !== 6 && currentPegs.length === 4){
    console.log("No moves");
    initNextTurn();
  }
	
});

//move peg to number of the dice roll when clicked
pegs.on('click', function(e){

	//check to see if a 6 was rolled, if the peg clicked on is off the board and if it's the correct color's turn
	if(e.target.status === "off" && e.target.color === Session.turn){
    // if a 6 was rolled, move a peg on to the board
    if(diceText.text() === "6"){
      var newPos = Settings.pegs[Session.turn].start;
      updatePos(e.target,newPos);
      // since a six was rolled, piece can be in play and status must be changed to on
      e.target.status = "on";
    }else{
      console.log("Can't move on to board without rolling a six");
    }
	}
	//if the piece is in play and it's the color of the turn
	else if(e.target.status === "on" && e.target.color === Session.turn){
		var newPos = parseInt(diceText.text()) + e.target.pos;
		updatePos(e.target,newPos);
	}

	//redraw entire stage to clear board of old peg positions
	stage.draw();
});

//Debugging 

var redPeg = pegs.children[0];
	redPeg2 = pegs.children[2],
	bluePeg = pegs.children[4],
	greenPeg = pegs.children[8],
	yellowPeg = pegs.children[12];

