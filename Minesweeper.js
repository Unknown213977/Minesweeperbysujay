let boardArr = [];
let rows = 10;
let columns = 10;
let mines = 15;
let gameOver = false;
resetBtn.disabled = true;

rowsInput.addEventListener("change", (e) => {
  rows = parseInt(e.target.value);
  document.documentElement.style.setProperty("--rows", rows);
  console.log("rows:", rows);
  createBoard();
});

colsInput.addEventListener("change", (e) => {
  columns = parseInt(e.target.value);
  document.documentElement.style.setProperty("--cols", columns);
  console.log("columns:", columns);
  createBoard();
});

minesInput.addEventListener("change", (e) => {
  mines = parseInt(e.target.value);
  console.log("mines:", mines);
  createBoard();
});

strtGameBtn.addEventListener("click", () => {
    console.log("Starting game with settings - Rows:", rows, "Columns:", columns, "Mines:", mines);
    createBoard();
    rowsInput.disabled = true;
    colsInput.disabled = true;
    minesInput.disabled = true;
    strtGameBtn.disabled = true;
    resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
    console.log("Resetting game...");
    gameOver = false;
    rowsInput.disabled = false;
    colsInput.disabled = false;
    minesInput.disabled = false;
    createBoard();
});

function createBoard() {
  gameOver = false;
  board.innerHTML = "";
  boardArr = [];
    for (let i = 0; i < rows; i++) {
    let rowArr = [];
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      cell.setAttribute("id", `cell-${i}-${j}`);
      cell.addEventListener("click", handleCellClick);
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (gameOver) return;
        const row = parseInt(cell.getAttribute("data-row"));
        const col = parseInt(cell.getAttribute("data-col"));
        if (!boardArr[row][col].revealed) {
          boardArr[row][col].flagged = !boardArr[row][col].flagged;
          cell.classList.toggle("flagged");
          cell.innerHTML = boardArr[row][col].flagged ? "🚩" : "";
        }
      });
      board.appendChild(cell);
      rowArr.push({ hasMine: false, revealed: false, flagged: false });
    }
    boardArr.push(rowArr);
  }
  setMines();
  console.log("Total cells created:", rows * columns);
}

function setMines() {
  let minesPlaced = 0;
    while (minesPlaced < mines) {
    const randRow = Math.floor(Math.random() * rows);
    const randCol = Math.floor(Math.random() * columns);
    if (!boardArr[randRow][randCol].hasMine) {
      boardArr[randRow][randCol].hasMine = true;
    //   document.getElementById(`cell-${randRow}-${randCol}`).setAttribute("data-mine", "true");
    //   console.log(`Mine placed at: (${randRow}, ${randCol})`);
      minesPlaced++;
    }
  }
//   console.log("Total mines placed:", minesPlaced);
  setMarkers();
}

function setMarkers() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
        if (!boardArr[i][j].hasMine) {
            let mineCount = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (i + x >= 0 && i + x < rows && j + y >= 0 && j + y < columns) {
                        if (boardArr[i + x][j + y].hasMine) {
                            mineCount++;
                        }
                    }
                }
            }
            boardArr[i][j].mineCount = mineCount;
            // document.getElementById(`cell-${i}-${j}`).setAttribute("data-mine-count", mineCount);
        }
    }
}
}

function handleCellClick(e) {
    if (gameOver) return;
    const cell = e.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));
    if (boardArr[row][col].revealed) return;
    boardArr[row][col].revealed = true;
    cell.classList.add("revealed");
    if (boardArr[row][col].hasMine) {
        cell.innerHTML = "💣";
        gameOver = true;
        setTimeout(() => {
            alert("Game Over! You hit a mine.");
            revealAllMines();
            cell.classList.add("mine-hit");
        }, 0);
    } else {
        const mineCount = boardArr[row][col].mineCount;
        if (mineCount === 0) {
            revealEmptyCells(row, col);
        } else {
            cell.innerHTML = mineCount > 0 ? mineCount : "";
        }
        if (checkWin()) {
            gameOver = true;
            alert("Congratulations! You've cleared the minefield!");
        }
    }
}

function revealEmptyCells(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (row + x >= 0 && row + x < rows && col + y >= 0 && col + y < columns) {
                if (!boardArr[row + x][col + y].revealed && !boardArr[row + x][col + y].hasMine){
                    boardArr[row + x][col + y].revealed = true;
                    const cell = document.getElementById(`cell-${row + x}-${col + y}`);
                    cell.classList.add("revealed");
                    cell.innerHTML = boardArr[row + x][col + y].mineCount > 0 ? boardArr[row + x][col + y].mineCount : "";
                    if (boardArr[row + x][col + y].mineCount === 0) {
                        revealEmptyCells(row + x, col + y);
                    }
                }
            }
        }
    }
}

function revealAllMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (boardArr[i][j].hasMine) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                cell.classList.add("revealed");
                cell.innerHTML = "💣";
            }
        }
    }
}

function checkWin() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (!boardArr[i][j].hasMine && !boardArr[i][j].revealed) {
                return false;
            }
        }
    }
    return true;
}