let moyenneTime = 0;
let nbGeneration = 0;
let nbCols = 0;
let nbRows = 0;
let cellSizeInPx = 10;
let factorPopulation = 1.25;
let matricePosition = [];
let gameBoard = [];
let cellsAlives = [];
let nIntervId = null;
let ctx = null;
let canvas = null
let inputGeneration = null;

function init(){
  this.setVariables();
  this.createInitialCells();
  console.log('rows : '+nbRows);
  console.log('cols : '+nbCols);
}

function setVariables() {
    inputGeneration.value = 0
    nbCols = Math.ceil(window.innerWidth / cellSizeInPx);
    nbRows = Math.ceil(window.innerHeight / cellSizeInPx);
    matricePosition = [
      -1, // left
      +1, // right
      -nbCols, // Top
      -(nbCols + 1), // TopLeft
      -(nbCols - 1), // TopRight
      +nbCols, // bottom
      +(nbCols - 1), // BottomLeft
      +(nbCols + 1), // BottomRight
    ];
}

function createInitialCells() {
  for (let i = 0; i < nbRows; i++) {
    for (let j = 0; j < nbCols; j++) {
      this.darwCell(i, j, cellSizeInPx)
    }
  }
}

function darwCell(y, x, size){
    const cellsProperties = {
        row: y,
        col: x,
        isAlive:
          Math.floor(Math.random() * factorPopulation) != 0
            ? true
            : false,
        nbVoisins: 0,
      };
    ctx.fillStyle = cellsProperties.isAlive === true ? "#b9bec6" : "#22262b"
    ctx.fillRect(x*cellSizeInPx, y*cellSizeInPx, size, size);
    gameBoard.push(cellsProperties)
    cellsProperties.isAlive ? cellsAlives.push(cellsProperties) : ''
}

function play() {
  let ts1 = performance.now()

 cellsAlives.forEach((cell) => {
    this.getNumberNeighborsCell(cell);
  });
  cellsAlives = []
  this.checkCellules();
  this.updateFront();
  
  let ts2 = performance.now()
  moyenneTime += (ts2-ts1)
  console.log('play : '+(ts2-ts1));
}

function getNumberNeighborsCell(cellule) {
  const row = cellule.row;
  const col = cellule.col;
  const index = col + row * nbCols;
  const maxX = nbCols - 1;
  const maxY = nbRows - 1;

  if (col > 0) gameBoard[index + matricePosition[0]].nbVoisins++;
  if (col < maxX)
    gameBoard[index + matricePosition[1]].nbVoisins++;
  if (row > 0) gameBoard[index + matricePosition[2]].nbVoisins++;
  if (row > 0 && col > 0)
    gameBoard[index + matricePosition[3]].nbVoisins++;
  if (row > 0 && col < maxX)
    gameBoard[index + matricePosition[4]].nbVoisins++;
  if (row < maxY)
    gameBoard[index + matricePosition[5]].nbVoisins++;
  if (row < maxY && col > 0)
    gameBoard[index + matricePosition[6]].nbVoisins++;
  if (row < maxY && col < maxX)
    gameBoard[index + matricePosition[7]].nbVoisins++;
}

function checkCellules() {
  gameBoard.forEach(cellule => {
    let isAlive = cellule.isAlive === true;
    if ((!isAlive && cellule.nbVoisins == 3) ||(isAlive && (cellule.nbVoisins == 2 || cellule.nbVoisins == 3))) {
      cellsAlives.push(cellule);
    }
  });
}

function updateFront() {
  //remise à 0
  for (const cell of gameBoard) {
    cell.isAlive = false;
    cell.nbVoisins = 0;
    ctx.fillStyle =  "#22262b"
    ctx.fillRect(cell.col*cellSizeInPx, cell.row*cellSizeInPx, cellSizeInPx, cellSizeInPx);
  }

  for (const cell of cellsAlives) {
    gameBoard[cell.col + cell.row * nbCols].isAlive = true;
    ctx.fillStyle =  "#b9bec6"
    ctx.fillRect(cell.col*cellSizeInPx, cell.row*cellSizeInPx, cellSizeInPx, cellSizeInPx);
  }

  nbGeneration++;
  inputGeneration.value = nbGeneration;
  

}

addEventListener("DOMContentLoaded", () => {
  let ts1 = performance.now()

  canvas = document.getElementById('gameBoard');
  inputGeneration = document.getElementById('generation')
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  this.init();

  let ts2 = performance.now()
  console.log('init : '+(ts2-ts1));
});

function start(){
  if (!this.nIntervId) {
    this.nIntervId = setInterval(this.play, 250);
  }
}

function pause(){
  this.clearnIntervId();
  console.log(moyenneTime/nbGeneration);
}

function restart(){
  this.clearnIntervId();
  inputGeneration.value = 0;
  this.init();
  this.start();
}

function clearnIntervId() {
  clearInterval(this.nIntervId);
  nIntervId = null;
}

