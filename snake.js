//Original code for snake game from Chris DeLeon of HomeTeam GameDev.
//I just added color and stlying and put some buttons (^-^)
window.onload=function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	document.addEventListener("keydown",keyPush);
	setInterval(game,1000/15);
}

var red = 0;
var green = 255;
var blue = 255;
var colorState = 0;

score=0;
px=py=5;
gs=tc=20;
ax=ay=15;
xv=yv=0;
trail=[];
tail = 1;

var colorSwipe = function() {
	switch(colorState) {
		case 0:
			red++; green--;
			if(red == 255){ colorState = 1; } break;
		case 1:
			green++; blue--;
			if(green == 255){ colorState = 2; } break;
		case 2:
			red--; blue++;
			if(blue == 255){ colorState = 0; } break;
		default: return;
	}
}

function game() {
	

	colorSwipe();
	
	px+=xv;
	py+=yv;
	if(px<0) {
		px= tc-1;
	}
	if(px>tc-1) {
		px= 0;
	}
	if(py<0) {
		py= tc-1;
	}
	if(py>tc-1) {
		py= 0;
	}
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canv.width,canv.height);
	ctx.fillStyle = 'rgba('+red+','+green+','+blue+', 1)';
	for(var i=0;i<trail.length;i++) {
		ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
		if(trail[i].x==px && trail[i].y==py) {
			tail = 1;
			score = 0;
			document.getElementById("sc").innerHTML = score;
		}
	}
	trail.push({x:px,y:py});
	while(trail.length>tail) {
	trail.shift();
	}
	if(ax==px && ay==py) {
		tail++;
		score++;
		document.getElementById("sc").innerHTML = score;
		ax=Math.floor(Math.random()*tc);
		ay=Math.floor(Math.random()*tc);
	}
	ctx.fillStyle="red";
	ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}
function keyPush(evt) {
	switch(evt.keyCode) {
		case 37:
			xv=-1;yv=0;
			break;
		case 38:
			xv=0;yv=-1;
			break;
		case 39:
			xv=1;yv=0;
			break;
		case 40:
			xv=0;yv=1;
			break;
	}
}

function up(){
	xv=0;yv=-1;
}
function left(){
	xv=-1;yv=0;
}
function right(){
	xv=1;yv=0;
}
function down(){
	xv=0;yv=1;
}
