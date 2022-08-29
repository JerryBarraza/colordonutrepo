//Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 350; //Same as CSS
canvas.height = 500; //Same as CSS
let gameFrame = 0;

//------------------------------------- MODEL
/*
.........1
........2.3
......4..5..6
... 7..8..9..10
11..12..13..14..15
*/
//-------------------------------------

const moves = [                         //[dest, pathpeg]
	[[4,2], [6,3]],                     //1 -> source
	[[7,4], [9,5]],                     //2
	[[8,5], [10,6]],                    //3
	[[1,2], [6,5], [11,7], [13,8]],     //4
	[[12,8], [14,9]],                   //5
	[[1,3], [4,5], [13,9], [15,10]],    //6
	[[2,4], [9,8]],                     //7
	[[3,5], [10,9]],                    //8
	[[2,5], [7,8]],                     //9
	[[3,6], [8,9]],                     //10
	[[4,7], [13,12]],                   //11
    [[5,8], [14,13]],                   //12
    [[4,8], [6,9], [11,12], [15,14]],   //13
    [[5,9], [12,13]],                   //14
    [[6,10], [13,14]]                   //15
];

const board = [
    0, //1
    1, //2
    1, //3
    1, //4
    1, //5
    1, //6
    1, //7
    1, //8
    1, //9
    1, //10
    1, //11
    1, //12
    1, //13
    1, //14
    1  //15
];

function showBoard(){
    console.log('..........' + board[0]);
    console.log('........' + board[1] + '.' + board[2]);
    console.log('......' + board[3] + '..' + board[4] + '..' + board[5]);
    console.log('...' + board[6] + '..' + board[7] + '..' + board[8] + '..' + board[9]);
    console.log('.' + board[10] + '..' + board[11] + '..' + board[12] + '..' + board[13] + '..' + board[14]);
}

function isInputValid(){
    if((sourcePeg >= 1 && sourcePeg <= 15) && (destPeg >= 1 && destPeg <= 15)){
        return true;
    }
    return false;
}

function isPathValid(){
    for(let i = 0; i < moves[sourcePeg-1].length; i++){
        if(destPeg == moves[sourcePeg-1][i][0]){
            pathpeg = moves[sourcePeg-1][i][1];
            return true;
        }
    }
    return false;
}

function isMoveValid(){
    if(board[sourcePeg-1] == 1 && board[destPeg-1] == 0 && board[pathpeg-1] == 1){
        return true;
    }
    return false;
}

function updateBoard(){
    board[sourcePeg-1] = 0;
    board[destPeg-1] = 1;
    board[pathpeg-1] = 0;
    pegtotal -= 1;
}

function checkWin(){
    console.log("peg total:" + pegtotal);
    let stillHasMovesLeftState = stillHasMovesLeft();
    if(!stillHasMovesLeftState && pegtotal == 1){
        gameMessage = "you win! yay! :)";
    }
    else if(!stillHasMovesLeftState && pegtotal > 1){
        gameMessage = "you lost, loser! :(";
    }
    else if(stillHasMovesLeftState && pegtotal > 1){
        gameMessage = "no win...yet";
    }
    else{
        gameMessage = "test test test unsure..";
    }
}

/*Python code has implementation of getAllAvailMovesLeft (for board or per peg?) for self-solver*/
function stillHasMovesLeft(){
    let allPathsForPeg = [];
    for(let i = 0; i < board.length; i++){
        if(board[i] == 1){ //dont need i-1 here, since index is 0-based, and just doing iteration
            allPathsForPeg = moves[i]; //dont need i-1 here, since index is 0-based, and just doing iteration
            console.log(allPathsForPeg);
            for(let j = 0; j < allPathsForPeg.length; j++){
                if(board[allPathsForPeg[j][0]-1] == 0 && board[allPathsForPeg[j][1]-1] == 1){
                    return true;
                }
            }
        }
    }
    return false;
}

function resetGame(){ // stub

}

// ------------------------ CONTROL
/*  State Model
    0 - idle: new game, waiting for first input
    0 -> 1: "select empty peg" button pressed
            change state to 1: waiting for empty peg selection
    1 -> 2: click detected
            check if area click is valid
            check which peg clicked, return peg number
            if peg is valid as empty started peg (its labled 1)
            set board with empty starter peg - new value is 0, previous empty peg is now 1
            change state to 2: waiting for first move
    2 -> 3: click detected
            check if area clicked is valid
            check which peg clicked, return peg number
            if peg is valid first peg (label 1)
            soucepeg is set
            set board, change sourcepeg state to selected (label 2)
            change state to 3: waiting for second move
            *if peg not valid (its empty - label 0)
            *stay in state 2
    3 -> 4: click detected
            check if area clicked is valid
            check which peg clicked, return peg
            if peg is valid as second peg (empty, label 0)
            dest peg is set
            check if path is valid
            change state to 4: update board
            *if peg not valid (not empty, label 1, or path is not valid)
            *back to state 2, and clear soucepeg and sourcepeg on board.
    4 -> 5: update board with new values
            check win
            if no win -> go to state 2
            if lose -> go to state Lose
            if win -> go to state Win
    Lose:   display lose message, freeze moves, show restart button
    Win:    display win message, freeze moves, show restart button
    
    *if restart button is pressed during any state, go to state 0.
*/

//------------------------- Mouse position and interaction
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: 0,
    y: 0,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

    switch(gameState){
        case 0:
            sourcePeg = whichPegClicked(mouse.x, mouse.y);
            gameState = 1;
            break;
        case 1:
            destPeg = whichPegClicked(mouse.x, mouse.y);
            gameState = 2;
            break;
        default:
            break;
    }
    if(gameState == 2){
        getInputValue();
        gameState = 0;
    }
})

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})

function getInputValue(){
    if(sourcePeg > 0 && destPeg > 0){
        inputEntered = true;
    }
    if(inputEntered && isInputValid() && isPathValid()){
        if(isMoveValid()){
            updateBoard();
        }
        checkWin();
    }
}

//---------------------------------------- VIEW

function drawTriangle(TipX, TipY, TriH, state){
    let growX = 0;
    ctx.beginPath();
    if(state == 1){
        ctx.strokeStyle = 'red';
    }
    else if(state == 2){
        ctx.strokeStyle = 'blue'
    }
    else {
        ctx.strokeStyle = 'green';
    }
    for(let i = 0; i < TriH; i++){
        if(i % 2 == 0){ // if this changes, need to change treeBranchH and Hh since they relly its a 1:2 ratio.
            growX ++;
        }
        ctx.moveTo(TipX-growX, TipY+i);
        ctx.lineTo(TipX+growX, TipY+i);
        ctx.stroke();
    }
    ctx.closePath();
}

function drawTreeBackground(){
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 100, 0)';
    ctx.moveTo(treeTipX, treeTipY);
    ctx.lineTo(treeLeftEdge, treeBase);
    ctx.lineTo(treeRightEdge, treeBase);
    ctx.fill();
    ctx.closePath();
}

function drawTreeForeground(){ //stub

}

function drawBoard(tipx, tipy, trih){
    drawTreeBackground();

    let x = tipx;
    let y = tipy;
    drawTriangle(x, y, trih, board[0]);
    x = x - (trih/2);
    y = y + trih;
    for(let i = 0; i < 2; i++){
        drawTriangle(x, y, trih, board[1 + i]);
        x = x + trih;
    }
    x = x - trih - ((trih/2)*3);
    y = y + trih;
    for(let i = 0; i < 3; i++){
        drawTriangle(x, y, trih, board[3 + i]);
        x = x + trih;
    }
    x = x - trih - ((trih/2)*5);
    y = y + trih;
    for(let i = 0; i < 4; i++){
        drawTriangle(x, y, trih, board[6 + i]);
        x = x + trih;
    }
    x = x - trih - ((trih/2)*7);
    y = y + trih;
    for(let i = 0; i < 5; i++){
        drawTriangle(x, y, trih, board[10 + i]);
        x = x + trih;
    } 
}

function whichPegClicked(x, y){
    let ynormal = y - treeTipY;
    let yrow = Math.floor(ynormal / treeBranchH) + 1;

    //let treeBase = (treeTipY + (treeBranchH * 5)); // 5 is number of treeBranch levels
    let xleft = (treeTipX - (yrow * treeBranchHh));
    let xright = (treeTipX + (yrow * treeBranchHh));

    if((y >= treeTipY && y <= treeBase) &&
    (x >= xleft && x <= xright)){
        console.log("valid");
        let xnormal = x - treeTipX;
        let xcol = Math.floor(xnormal /  treeBranchHh) + 1;
        let peg = Math.ceil(((yrow*yrow) + xcol) / 2);
        console.log("peg: " + peg);
        return peg;
    }
    else{
        console.log("not valid");
        return -1;
    }
}

function showMessage(){
    ctx.fillStyle = 'cyan';
    ctx.fillText(gameMessage, 10, 30);
}

//------------------------ Snow Flakes
let snowFlakes = [];

function addSF(){
    let yCor = 0;
    let xCor = Math.floor(Math.random() * canW);
    let sfSize = Math.floor(Math.random() * 5) + 5;
    let sfSpeed = Math.floor(Math.random() * 2) + 3;
    snowFlakes.push([xCor, yCor, sfSize, sfSpeed]);
}

function checkSnowFall(){
    if(snowFlakes.length < 20){
        addSF();
    }
}

function drawSnowFall(){
    ctx.fillStyle = 'white';
    ctx.beginPath();
    for(let i = 0; i < snowFlakes.length; i++){
        if(snowFlakes[i][1] >= canH){
            snowFlakes.splice(i, 1);
        }
        ctx.rect(snowFlakes[i][0], snowFlakes[i][1], snowFlakes[i][2], snowFlakes[i][2]);
        ctx.fill();
        snowFlakes[i][1] += snowFlakes[i][3];
        
    }
    ctx.closePath();
}

//----------------------------------------------
//----------------------------------------------

//---------------------------------- Animation Loop
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    gameFrame ++;
    requestAnimationFrame(animate);
}
//--------------------------------- Function Start

//--------------------------------- Set up parameters
let canW = canvas.width;
let canWh = canvas.width / 2;
let canH = canvas.height;
let treeTipX = canWh;
let treeTipY = 100;
let treeBranchH = 60;
let treeBranchHh = treeBranchH / 2;
let treeLeftEdge = treeTipX - (treeBranchHh * 5);
let treeRightEdge = treeTipX + (treeBranchHh * 5);
let treeBase = treeTipY + (treeBranchH * 5);
let sourcePeg = -1;
let destPeg = -1;
let inputEntered = false;
let pathpeg = -1;
let pegtotal = 14; // starting number of pegs
let gameState = 0;

let gameFont = ctx.font = "20px Arial";
let gameMessage = "welcome!";

//--------------------------------- Set up new game
ctx.clearRect(0,0,canW, canH);
//showBoard();
//drawBoard(treeTipX, treeTipY, treeBranchH);


var canvasInterval;

function startDrawCanvas(){
  canvasInterval = setInterval(drawSequence, 50);
}

function drawSequence(){
    gameFrame++;
    ctx.clearRect(0, 0, canW, canH);
    if(gameFrame % 10 == 0){
        checkSnowFall();
    }
    showMessage();
    drawBoard(treeTipX, treeTipY, treeBranchH);
    drawSnowFall();

    if(gameFrame >= 10000){
        gameFrame = 0;
    }
}

startDrawCanvas();
