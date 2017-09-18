//var expert="24X24, 99mines, .scale(1.06, 1.28)";
//var intermediate = "16X16, 40mines , .scale(1.55, 1.8)";
//var beginner = "8X8, 10mines, .scale(2.85, 3)";
const CUBE_SIZE=15;
const START_POS = {x:5, y:35};
var boardType;
var boardMatrix; 
var canvas;
var context ;
var boardSize;
var timePassed;
var minCounter;
var isPaused=true;
const colors = ['red', 'lightgray','blue','green', 'red', 'darkblue', 'magenta', 'cyan', 'black' ,'gray'];

var difficultyButtonB = {x:5, y:35, w:10, h:10};
var difficultyButtonI = {x:5, y:35, w:10, h:10};
var difficultyButtonE = {x:5, y:35, w:10, h:10};

function Cube(X=0, Y=0, VALUE=0, STATUS=0){
	return {pos: {x: X, y: Y},
	matrixPos: {x:0, y:0},
	value: VALUE,
	status: STATUS,
	mineflag:0}; //0= close, 1=open
}

window.onload = function () {
		canvas=document.getElementById('canvas');
		context = canvas.getContext('2d');
		
		canvas.addEventListener('contextmenu', function(e){
			e.preventDefault();
			return false;
		}); 
		
		boardType = "B";
		loadGame();
		
		drawEverything();
		setInterval(function(){
			if(isPaused == false)timePassed++;
			drawScoreboard();
			}, 1000);
}

function loadGame(){
		boardSize=getBoardSize(boardType);
		timePassed=0;
		isPaused=true;
		minCounter=getMines(boardType);
		canvas.width=(boardSize*(CUBE_SIZE+1))+15;
		canvas.height=(boardSize*(CUBE_SIZE+1))+15+30;
		boardMatrix = createBoard(boardType);
}

function drawEverything() {
	context.fillStyle='gray';
	context.fillRect(0,0,canvas.width,canvas.height )
	drawScoreboard();
	drawBoard();
	drawDifficultyButtons();
}

function drawScoreboard(){
	var linewidth= 5+(boardSize*(CUBE_SIZE+1))-1;
	drawBox(5,5, linewidth, 25, 'darkgray', 'white', 'white', 'darkgray', 2,1,1,2);
	drawTimer();
	drawMineCounter();
}

function drawTimer(){
	var linewidth= 5+(boardSize*(CUBE_SIZE+1))-1;
	context.fillStyle='black';
	context.fillRect(linewidth-30,11,30,15);
	context.fillStyle='red';
	context.font="16px Sans-Serif";
	context.textAlign="center";
	context.textBaseline = 'middle';
	var pad="000"+timePassed;
	context.fillText(pad.substring(pad.length-3,pad.length) ,linewidth-15,19);
}

function drawMineCounter(){
	context.fillStyle='black';
	context.fillRect(11,11,30,15);
	context.fillStyle='red';
	context.font="16px Sans-Serif";
	context.textAlign="center";
	context.textBaseline = 'middle';
	var pad="000"+minCounter;
	context.fillText(pad.substring(pad.length-3,pad.length) ,26,19);
}

function drawDifficultyButtons(){
	var linewidth= 5+(boardSize*(CUBE_SIZE+1))-1;
	context.font="16px Sans-Serif";
	context.textAlign="center";
	context.textBaseline = 'middle';

	
	context.fillStyle='black';
	context.fillRect((linewidth/2)-10,11,12,15);
	context.fillStyle='yellow';
	context.fillText("B" ,(linewidth/2)-4,19);
	difficultyButtonB.x=(linewidth/2)-10;
	difficultyButtonB.y=11;
	difficultyButtonB.w=12;
	difficultyButtonB.h=15;
	

	context.fillStyle='black';
	context.fillRect(3+(linewidth/2),11,6,15);
	context.fillStyle='green';
	context.fillText("I" ,6+(linewidth/2),19);
	difficultyButtonI.x=3+(linewidth/2);
	difficultyButtonI.y=11;
	difficultyButtonI.w=6;
	difficultyButtonI.h=15;


	context.fillStyle='black';
	context.fillRect((linewidth/2)+10,11,12,15);
	context.fillStyle='orange';
	context.fillText("X" ,(linewidth/2)+16,19);
	difficultyButtonE.x=(linewidth/2)+10;
	difficultyButtonE.y=11;
	difficultyButtonE.w=12;
	difficultyButtonE.h=15;

	/*
var difficultyButtonI = {x:5, y:35};
var difficultyButtonE = {x:5, y:35};*/
	
	
}

function canvas_onclick(c, event) {
	var cb = getClickedCube(c, event);
	if(event.button === 0) {
		if(cb.pos.x>=0) {
			isPaused=false;
		//clicked inside of the board
			if(cb.value===-1){
				//Opened the mine
				drawMine(cb);
				alert("Game over!");
				loadGame();
			}else {
				openEmptyCubes(cb);
				cb.status=1;
			}
		}else {
			//check for difficulty button click
			if(isDifficultyButtonClicked(difficultyButtonE,c, event )){
				boardType = "E";
				loadGame();
			}else if(isDifficultyButtonClicked(difficultyButtonI,c, event )){
				boardType = "I";
				loadGame();
			}else if(isDifficultyButtonClicked(difficultyButtonB,c, event )){
				boardType = "B";
				loadGame();
			}
		}	
	}
	if(event.button === 2) {
		event.preventDefault();
		if(cb.pos.x>=0) {
		//clicked inside of the board
			if(cb.status===0){
				if(cb.mineflag==0){
					minCounter--;
					cb.mineflag=1;
				}else {
					minCounter++;
					cb.mineflag=0;
				}
			}
		}
	}
	if(checkIfAllBoxesOpened()){
		alert("You win!");
		loadGame();
	}
	drawEverything();
}

function openEmptyCubes(cube){
	if(cube.value!=-1 && cube.status != 1){
		cube.status=1;
		if(cube.value===0){
			if(cube.matrixPos.x-1>=0 && cube.matrixPos.x-1<boardSize && cube.matrixPos.y-1>=0  && cube.matrixPos.y-1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x-1][cube.matrixPos.y-1]);
			}
			if(cube.matrixPos.x-1>=0 && cube.matrixPos.x-1<boardSize && cube.matrixPos.y>=0  && cube.matrixPos.y<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x-1][cube.matrixPos.y]);
			}
			if(cube.matrixPos.x-1>=0 && cube.matrixPos.x-1<boardSize && cube.matrixPos.y+1>=0  && cube.matrixPos.y+1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x-1][cube.matrixPos.y+1]);
			}
			if(cube.matrixPos.x>=0 && cube.matrixPos.x<boardSize && cube.matrixPos.y-1>=0  && cube.matrixPos.y-1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x][cube.matrixPos.y-1]);
			}
			if(cube.matrixPos.x>=0 && cube.matrixPos.x<boardSize && cube.matrixPos.y+1>=0  && cube.matrixPos.y+1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x][cube.matrixPos.y+1]);
			}
			if(cube.matrixPos.x+1>=0 && cube.matrixPos.x+1<boardSize && cube.matrixPos.y-1>=0  && cube.matrixPos.y-1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x+1][cube.matrixPos.y-1]);
			}
			if(cube.matrixPos.x+1>=0 && cube.matrixPos.x+1<boardSize && cube.matrixPos.y>=0  && cube.matrixPos.y<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x+1][cube.matrixPos.y]);
			}
			if(cube.matrixPos.x+1>=0 && cube.matrixPos.x+1<boardSize && cube.matrixPos.y+1>=0  && cube.matrixPos.y+1<boardSize){
				openEmptyCubes(boardMatrix[cube.matrixPos.x+1][cube.matrixPos.y+1]);
			}
		}
	}
}

function isDifficultyButtonClicked(difficultyButton, c, event) {
	var rect = c.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;    
    var scaleY = canvas.height / rect.height;  
    var mpos ={
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
	if(difficultyButton.x <=mpos.x && mpos.x <= difficultyButton.x+difficultyButton.w && difficultyButton.y <=mpos.y && mpos.y <= difficultyButton.y+difficultyButton.h ){
		//console.log("X= " + mpos.x + "; Y= " + mpos.y + "; cube (" + i + ", " +o+")");
		return true;
	}
	return false;
}

function getClickedCube(c, event){
	var rect = c.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;    
    var scaleY = canvas.height / rect.height;  
    var mpos ={
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
	for(i=0;i<boardSize;i++){
		for(o=0;o<boardSize;o++){
			var c=boardMatrix[i][o];
			if(c.pos.x <=mpos.x && mpos.x <= c.pos.x+CUBE_SIZE && c.pos.y <=mpos.y && mpos.y <= c.pos.y+CUBE_SIZE ){
				//console.log("X= " + mpos.x + "; Y= " + mpos.y + "; cube (" + i + ", " +o+")");
				return c;
			}
		}
	}
	//console.log("X= " + mpos.x + "; Y= " + mpos.y + "; outside of the board");
	return (new  Cube(-1,-1,0,0));
}

function checkIfAllBoxesOpened(){
	for(var x=0;x<boardSize;x++){
		for(var y=0;y<boardSize;y++){
			var c=boardMatrix[x][y];
			if(c.value>=0 && c.status==0){
				return false;
			}
		}
	}
	return true;
}

function getBoardSize(type) {
	if(type == "B"){
		return 8;
	}else if(type == "I") {
		return 16;
	}else if(type=="E"){
		return 24;
	}
	return 0;
}

function getMines(type) {
	if(type == "B"){
		return 10;
	}else if(type == "I") {
		return 40;
	}else if(type=="E"){
		return 99;
	}
	return 0;
}

function createBoard(type){
	var mat =[];
	for(i=0;i<boardSize;i++){
		var r =[];
		for(o=0;o<boardSize;o++){
			var c=new Cube();
			c.matrixPos.x=i;
			c.matrixPos.y=o;
			r.push(c);
		}
		mat.push(r);
	}
	return fillBoard(mat);
}

function fillBoard(matrix) {
	var cubesize= 5+(boardSize*(CUBE_SIZE+1))-1;
	var PosX= START_POS.x+ 3;
	var PosY= START_POS.y +3;
	var startPosX=PosX-CUBE_SIZE-1;
	for(var x=0;x<boardSize;x++){
		startPosX = startPosX+(CUBE_SIZE+1);
		var startPosY=PosY-CUBE_SIZE-1;
		for(var y=0;y<boardSize;y++){
			startPosY = startPosY+(CUBE_SIZE+1);
			var c=matrix[x][y];
			c.pos.x=startPosX;
			c.pos.y=startPosY;
			matrix[x][y]=c;
		}
	}
	
	return fillMines(matrix);
}

function fillMines(matrix){
	var minecount=getMines(boardType);
	var mineProbability = (boardSize*boardSize)/minecount;
	var rand = [];
	while(rand.length<minecount) {
		var r=Math.floor(Math.random() * (boardSize*boardSize)) +1;
		if(rand.indexOf(r)<0){
			rand.push(r);
		}
	}
	rand.sort();
	//console.log(rand);
	var r=0;
	for(x=0;x<boardSize;x++){
		for(y=0;y<boardSize;y++){
			r++;
			if(rand.indexOf(r)>=0){
				var c=matrix[x][y];
				c.value=-1;
				matrix[x][y]=c;
			}
		}
	}
	return fillNeighbourMineCount(matrix);
}

function fillNeighbourMineCount(matrix){
	for(x=0;x<boardSize;x++){
		for(y=0;y<boardSize;y++){
			var c=matrix[x][y];
			if(c.value !=-1){
				c.value= HasMine(matrix, x-1,y-1) + HasMine(matrix, x-1,y) + HasMine(matrix, x-1,y+1)
						+ HasMine(matrix, x,y-1)+ HasMine(matrix, x,y+1)
						+ HasMine(matrix, x+1,y-1)+ HasMine(matrix, x+1,y)+ HasMine(matrix, x+1,y+1);
			}
		}
	}
	return matrix;
}
function HasMine(matrix, x,y){
		if(x<0 || x>=boardSize || y<0 || y>=boardSize) return 0;
		var c=matrix[x][y];
		if(c.value==-1){
			return 1;
		} else {
			return 0;
		}
}

function drawBoard() {
	var cubesize= 5+(boardSize*(CUBE_SIZE+1))-1;
	drawBox(START_POS.x,START_POS.y, cubesize, cubesize, 'darkgray', 'white', 'white', 'darkgray', 3,2,2,3);
	for(var x=0;x<boardSize;x++){
		for(var y=0;y<boardSize;y++){
			drawCube(boardMatrix[x][y]);
		}
	}
}

function drawCube(cube) {
	if(cube.status===0){
		drawBox(cube.pos.x, cube.pos.y, CUBE_SIZE, CUBE_SIZE, 'white', 'darkgray', 'darkgray', 'white',1,2,2,1);
		if(cube.mineflag==1){
			context.fillStyle='red';
			context.textAlign="center";
			context.textBaseline = 'middle';
			context.fillText("1",cube.pos.x+(CUBE_SIZE/2), cube.pos.y+(CUBE_SIZE/2) );
		}
	} else {
		drawBox(cube.pos.x, cube.pos.y, CUBE_SIZE, CUBE_SIZE, 'darkgray', 'gray', 'gray', 'darkgray',1,2,2,1);
		context.fillStyle='lightgray';
		context.fillRect(cube.pos.x+1, cube.pos.y+1, CUBE_SIZE,CUBE_SIZE);
		context.fillStyle=colors[cube.value+1];
		context.textAlign="center";
		context.textBaseline = 'middle';
		context.fillText(cube.value,cube.pos.x+(CUBE_SIZE/2), cube.pos.y+(CUBE_SIZE/2) );
	}
}

function drawMine(cube) {
		drawBox(cube.pos.x, cube.pos.y, CUBE_SIZE, CUBE_SIZE, 'darkgray', 'gray', 'gray', 'darkgray',1,2,2,1);
		context.fillStyle='black';
		context.fillRect(cube.pos.x+1, cube.pos.y+1, CUBE_SIZE,CUBE_SIZE);
		context.fillStyle='red';
		context.textAlign="center";
		context.textBaseline = 'middle';
		context.fillText("X",cube.pos.x+(CUBE_SIZE/2), cube.pos.y+(CUBE_SIZE/2) );
}

function drawBox(topX, leftY, boxWidth, boxHeight, topColor, rightColor, bottomColor, leftColor, topBorder, rightBorder, bottomBorder, leftBorder) {
	var linesize=boxWidth;
	
	context.fillStyle=topColor;
	for(var i=0;i<topBorder;i++) {
		context.fillRect(topX+i, leftY+i, linesize,1);
		linesize -=2;
	}

	linesize=boxHeight;
	context.fillStyle=rightColor;
	for(var i=0;i<rightBorder;i++) {
		context.fillRect(topX+boxWidth-i, leftY+i, 1, linesize);
		linesize -=2;
	}

	linesize=boxWidth;
	context.fillStyle=bottomColor;
	for(var i=0;i<bottomBorder;i++) {
		context.fillRect(topX+i+1, leftY+boxHeight-i, linesize,1);
		linesize -=2;
	}

	linesize=boxHeight;
	context.fillStyle=leftColor;
	for(var i=0;i<leftBorder;i++) {
		context.fillRect(topX+i, leftY+i, 1, linesize+1);
		linesize -=2;
	}
}


