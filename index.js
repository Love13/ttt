// gVars
let resetGame = document.getElementById('resetGame')
let tttCanvas = document.getElementById('ttt')
let ctx = tttCanvas.getContext('2d')
let msg = document.getElementById('text')
let cellSize = 150;
let gG = "";


// Assigning icons -> mapBoard w Binary -> winning Scenerios w Binary
OVOXO = 0, X = 1, O = -1;

mouse = {
    x: -1,
    y: -1
}
    let currPlayer = X;

let boardMap = [ 
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    ],
    winScenerio = [ //playBinMax -> .toString(2) = binary below
        // Rows
        0b111000000, 0b000111000, 0b000000111,
        // Coloumns
        0b100100100, 0b010010010, 0b001001001,
        // Diags
        0b100010001, 0b001010100,

    ]


tttCanvas.width = tttCanvas.height = 3 * cellSize;

// Event Listeners

tttCanvas.addEventListener('mout', function () {
   mouse.y = mouse.x = -1; 
});

tttCanvas.addEventListener('mousemove', function (e) {
    let x = e.pageX - tttCanvas.offsetLeft;
    let y = e.pageY - tttCanvas.offsetTop;

    mouse.x = x;
    mouse.y = y;   

    //console.log(getCellByCoords(x, y));

});

tttCanvas.addEventListener('click', function (e) {
    
    //console.log(playttt(getCellByCoords(mouse.x, mouse.y)));
    playttt(getCellByCoords(mouse.x, mouse.y));
    
});
  

// Function to play -> inverse player to switch x and O each time playttt is run "currPlayer = (currPlayer) * (-1);""
function playttt (cell) {
    if (gG) {
        return
    }
    //console.log(boardMap[cell]);
    if (boardMap[cell] != OVOXO) {
        msg.textContent = 'Please select an available space.';
        return;
    }
    
    boardMap[cell] = currPlayer;
    let wCheck = winCheq(currPlayer); 
    if (wCheck != 0) {
        gG = true;
        resetGame.classList.remove("hidden");
        msg.textContent = ((currPlayer == X)? 'X': 'O') + ' is the winner. ' 
    } else if (boardMap.indexOf(OVOXO) == -1) {
        gG = true;
        resetGame.classList.remove("hidden");
        msg.textContent = 'Cats Game!';
    }
    currPlayer = (currPlayer) *= -1;
    
};

//function to check if there is a winner and display scenerio


function winCheq (player) {
    let playBinMax = 0;
    for (let i = 0; i < boardMap.length; i++) {
        playBinMax <<= 1;
        if (boardMap[i] == player) 
            playBinMax += 1;
    }
        //console.log(playBinMax);
    for (let i = 0; i < winScenerio.length; i++) {
        if ((playBinMax & winScenerio[i]) == winScenerio[i])
        return winScenerio[i];
    }

    return 0;
}

// Function to draw board -> fillboard -> draw X and O icons

function draw () {
    ctx.clearRect(0,0, tttCanvas.width, tttCanvas.height);
    boardDraw();
    boardFill();

    function boardDraw() {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 14;
        
        // First vertical Line Draw
        ctx.beginPath();
        ctx.moveTo(cellSize,0);
        ctx.lineTo(cellSize, tttCanvas.height);
        ctx.stroke();
        // Second Vertical Line Draw
        ctx.beginPath();
        ctx.moveTo(cellSize * 2, 0);
        ctx.lineTo(cellSize * 2, tttCanvas.height);
        ctx.stroke();
        //Top Horizontal Line Draw  (ctx.moveTo(0,cellSize); & ctx.lineTo(tttCanvas.width, cellSize);)
        ctx.beginPath();
        ctx.moveTo(0,cellSize);
        ctx.lineTo(tttCanvas.width, cellSize);
        ctx.stroke();
        //Bottom Horizontal Line Draw (ctx.moveTo(0,cellSize * 2); & ctx.lineTo(tttCanvas.width, cellSize * 2); )
        ctx.beginPath();
        ctx.moveTo(0,cellSize * 2);
        ctx.lineTo(tttCanvas.width, cellSize * 2);
        ctx.stroke();
    }

    function boardFill () {
        for (let i = 0; i < boardMap.length; i++) {
            let coords = cellCoords(i);
            ctx.save();
            ctx.translate(coords.x + cellSize / 2, coords.y +  cellSize / 2);
            if (boardMap[i] == X) {
                drawingX();
            } else if (boardMap[i] == O) {
                drawingO();
            }
            ctx.restore();
        }
    }

    function drawingX (){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-cellSize / 3, -cellSize / 3);
        ctx.lineTo(cellSize / 3, cellSize / 3);
        ctx.moveTo(cellSize / 3, -cellSize / 3);
        ctx.lineTo(-cellSize / 3, cellSize / 3);
        ctx.stroke();
    }

    function drawingO() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2)
        ctx.stroke();
    }

    requestAnimationFrame(draw);
}

// returns what cell mouse is in 0-8 -> mousemove listener

function getCellByCoords (x, y) {
    return (Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3;
    return{
        'x': Math.floor(x / cellSize),
        'y': Math.floor(y / cellSize)
    }
}

function cellCoords (cell) {
    let y = Math.floor(cell / 3) * cellSize; 
    let x = (cell % 3 ) * cellSize;

    return {
        "x": x,
        "y": y,
    }
        
}


draw();