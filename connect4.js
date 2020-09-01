/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let GAMEOVER = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = new Array(WIDTH)
  for(let x=0; x<WIDTH; x++){
    board[x]= []
  for (let y=0; y<HEIGHT; y++) {
      board[x][y]= null
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.querySelector("#board");
  // add comment for this code
  //creates clickable table top row, then tds to game board
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // add comment for this code
  //fils in rows and columns for game
  for (let y = HEIGHT-1; y >= 0; y--) {
    const row = document.createElement("tr");
    for (let x = WIDTH-1; x >= 0; x--) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${x}-${y}`);
      row.prepend(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //write the real version of this, rather than always returning 0
  if(board[x][HEIGHT-1]!== null){
      return y = null
    }
  for(y=0; y<HEIGHT; y++){
   if (board[x][y] === null){
     return y
   };
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  let gamePiece = document.createElement("div");
  gamePiece.classList.add("p"+currPlayer,"piece")
  let position = document.querySelector("#"+CSS.escape(x)+"-"+CSS.escape(y));

  position.append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  GAMEOVER = true;
  let announce = document.createElement("div");
  let resetbtn = document.createElement("button");
  resetbtn.textContent = "Play again?";
  announce.id = "announcement";
  document.querySelector("#game").classList.add("greyscale")
  resetbtn.addEventListener("click", (e)=>{
    e.preventDefault();
    document.querySelector("#board").innerHTML = "";
    document.querySelector("#announcement").parentElement.removeChild(document.querySelector("#announcement"));
    document.querySelector("#game").classList.remove("greyscale");
    makeBoard();
    makeHtmlBoard();
    GAMEOVER = false
  })
  announce.textContent = msg;
  announce.append(resetbtn)
  document.querySelector("#game").prepend(announce);

}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  //prevent clicking if game is finished
  if (GAMEOVER){ return }
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
 //update in-memory board
  board[x][y] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every((column)=>{
    return column.every((slot)=>{
      return slot !== null
    })
  })){
    endGame()
  };


  // switch styles
  if (currPlayer===1){
    document.querySelector("#game").style.backgroundColor = "blue"
  } else {
    document.querySelector("#game").style.backgroundColor = "red"
  }
  // switch currPlayer 1 <-> 2
  currPlayer === 1? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([x, y]) =>
        x >= 0 &&
        y < HEIGHT &&
        y >= 0 &&
        x < WIDTH &&
        board[x][y] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      let horiz = [[x,y], [x + 1,y], [x + 2,y], [x+3,y]];
      let vert = [[x, y], [x, y + 1], [x, y + 2], [x, y + 3]];
      let diagDR = [[x,y], [x + 1, y + 1], [x + 2, y + 2], [x + 3, y + 3]];
      let diagDL = [[x, y], [x + 1, y - 1], [x + 2, y - 2], [x + 3, y - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
