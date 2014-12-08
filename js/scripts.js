// #### Game Settings

Settings = {
	red : {
		start : 2
	},
	blue : {
		start : 9
	},
	green : {
		start : 16
	},
	yellow : {
		start : 24
	}
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
    width:50,
    height:50
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
  	text: '1',
  	fontSize: 30,
  	fontFamily: 'Calibri',
  	fill: 'black',
  	align:'center'
});
//center dice text within dice circle
diceText.setOffset({
    x : diceText.width()/2,
    y : diceText.height()/2
});


// dice layer order
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

//function that colors peg spots based on peg spot position
var colorBoard = function(first,last,color){
	if(pos >= first && pos <= last){
		pegSpots[i].fill(color);
		pegSpots[i].team = color;
	}
}

for (i = 0; i < pegNum; i++) {
	var pos = i+1;
	pegSpots[i] = new Kinetic.Circle({
		x: (diceCircle.getX() + (stage.width()/2.5) * Math.cos(2 * Math.PI * i / pegNum))+stage.width()/2,
		y: (diceCircle.getY() + (stage.height()/2.5) * Math.sin(2 * Math.PI * i / pegNum))+stage.height()/2,
		radius: 25,
		fill: 'transparent',
		stroke: 'black',
		strokeWidth: 1
	});

	/*colorBoard(3,6,"red");
	colorBoard(10,13,"blue");
	colorBoard(17,20,"green");
	colorBoard(24,27,"yellow");*/

	// Add position number to each peg spot
	pegSpots[i].position = pos;

	//add pegSpots to board layer
	board.add(pegSpots[i]);
}

// add the board to the stage
stage.add(board);

// #### Pegs

var pegs = new Kinetic.Layer();

redStart = Settings.red.start;

var peg = new Kinetic.Circle({
	x: pegSpots[redStart].getX(),
	y: pegSpots[redStart].getY(),
	radius: pegSpots[redStart].radius(),
	fill: 'red',
	stroke: 'black',
	strokeWidth: 2
});

//add current position to peg obj
peg.pos = redStart;

pegs.add(peg);

stage.add(pegs);


//### Events

//roll dice on click
diceCircle.on('click', function() {
	random = Math.floor(Math.random() * 6) + 1;
	diceText.setText(random);
	//need to redraw to update number
	dice.draw();
	console.log("click");
	
});


//move peg to number of the dice roll when clicked
peg.on('click', function(){
	var newPos = parseInt(diceText.text()) + peg.pos;
	peg.x(pegSpots[newPos].getX());
	peg.y(pegSpots[newPos].getY());
	//make sure to update peg position
	peg.pos = newPos;
	//redraw entire stage to clear board of old peg positions
	stage.draw();
});



