// ### Global Functions

var objValMatch = function(obj,prop,value){
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if(obj[key][prop] === value){
				return key;
			}
		}
	}
}


// #### Game Settings

Settings = {
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
}

Session = {
	turn : objValMatch(Settings,"order",1),
}

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

//create array for pegSpots
var pegSpots = [];
pegNum = 28;

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
	var pegArray = [];
	pegArray[color] = new Kinetic.Group();
	var peg = pegArray[color];

	pegArray[color][i] = new Kinetic.Circle({
		x: x,
		y: y,
		radius: 25,
		fill: color,
		stroke: 'black',
		strokeWidth: 3
	});

	// set position to 0. Once a peg is in play, it's position will be set
	peg[i].pos = 0;
	// add color to peg obj
	peg[i].color = color;
	// Status that says whether the peg is on the board or off (in it's zone)
	peg[i].status = "off";

	peg.add(peg[i]);
	pegs.add(peg);
}

var createZones = function(color){
	var pegZones = [],
		start = Settings[color].start,
		end = Settings[color].end;
	// NOTE: this loop could probably be joined with the pegSpots loop
	for (i = 0; i < pegNum; i++) {
		if(i >= start && i <= end){
			pegZones[i] = new Kinetic.Circle({
				x: (diceCircle.getX() + (stage.width()/2) * Math.cos(2 * Math.PI * i / pegNum))+stage.width()/2,
				y: (diceCircle.getY() + (stage.height()/2) * Math.sin(2 * Math.PI * i / pegNum))+stage.height()/2,
				radius: 25,
				fill: color,
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

// NOTE: call and build these by looping through the Seetings obj
createZones("red");
createZones("blue");
createZones("green");
createZones("yellow");

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

	//change player turn based on player color order in Settings obj
	var turn = Session.turn;
	if(turn === objValMatch(Settings,"order",4)){
		Session.turn = objValMatch(Settings,"order",1);
	}else{
		newTurn = Settings[turn].order+1;
		Session.turn = objValMatch(Settings,"order",newTurn);
	}
	
});

var updatePos = function(peg,pos){
	peg.x(pegSpots[pos].getX());
	peg.y(pegSpots[pos].getY());
	//make sure to update peg position
	peg.pos = pos;
}


//move peg to number of the dice roll when clicked
pegs.on('click', function(e){
	console.log(e.target);
	if(diceText.text() === "6" && e.target.status === "off" && e.target.color === Session.turn){

		console.log("text: "+diceText.text());
		console.log("Status: "+e.target.status);
		console.log("color: "+e.target.color);

		var newPos = Settings[Session.turn].start;
		updatePos(e.target,newPos);
		// since a six was rolle, piece can be in play and status must be changed to on
		e.target.status = "on";
	}
	else if(e.target.status === "on" && e.target.color === Session.turn){
		var newPos = parseInt(diceText.text()) + e.target.pos;
		updatePos(e.target,newPos);
	}

	//need to change color of turn text
	diceTurn.setText(Session.turn);
	diceTurn.setFill(Session.turn);

	//redraw entire stage to clear board of old peg positions
	stage.draw();
});



