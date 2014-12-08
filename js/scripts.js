var stage = new Kinetic.Stage({
	container: 'board',
	width: 1000,
	height: 1000,
	stroke: 'black',
	strokeWidth: 1
});

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

//roll dice on click
diceCircle.on('click', function() {
	random = Math.floor(Math.random() * 6) + 1;
	diceText.setText(random);
	//need to redraw to update number
	dice.draw();
	console.log("click");
});