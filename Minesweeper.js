let boardArr = [];
let rows = 10;
let columns = 10;
let mines = 15;
let gameOver = false;
let latestRevealedCell = { row: -1, col: -1 };
let selectionHintActive = false;
resetBtn.disabled = true;

rowsInput.addEventListener("change", (e) => {
    if(e.target.value < 2){
        e.target.value = 2;
        alert("Thats very small.")
    }
    if(e.target.value > 30){
        e.target.value = 30;
        alert("Thats very big. Stay with 30.")
    }
    rows = parseInt(e.target.value);
    if(minesInput.value > rows*columns){
        minesInput.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50% and the mines aren't fitting in the board.")
        return;
    } else if (minesInput.value > Math.floor(rows*columns*50/100)){
        minesInput.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50%")
    }
    if(minesInput.value < 1){
        minesInput.value = 1;
        alert("Why do you want to play with no mines?")
    }
    if(minesInput.value < Math.floor(rows*columns*10/100)){
        Math.floor(rows*columns*10/100) < 1 ? minesInput.value = 1 : minesInput.value = Math.floor(rows*columns*10/100);
        alert("Seems easy but minimum mine count is 10%")
    }
    mines = parseInt(e.target.value);
    console.log("mines:", mines);
    document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
    document.documentElement.style.setProperty("--rows", rows);
    console.log("rows:", rows);
    createBoard();
});

colsInput.addEventListener("change", (e) => {
    if(e.target.value < 2){
        e.target.value = 2;
        alert("Thats very small.")
    }
    if(e.target.value > 30){
        e.target.value = 30;
        alert("Thats very big. Stay with 30.")
    }
    columns = parseInt(e.target.value);
    if(minesInput.value > rows*columns){
        minesInput.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50% and the mines aren't fitting in the board.")
        return;
    } else if (minesInput.value > Math.floor(rows*columns*50/100)){
        minesInput.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50%")
    }
    if(minesInput.value < 1){
        minesInput.value = 1;
        alert("Why do you want to play with no mines?")
    }
    if(minesInput.value < Math.floor(rows*columns*10/100)){
        Math.floor(rows*columns*10/100) < 1 ? minesInput.value = 1 : minesInput.value = Math.floor(rows*columns*10/100);
        alert("Seems easy but minimum mine count is 10%")
    }
    mines = parseInt(e.target.value);
    console.log("mines:", mines);
    document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
    document.documentElement.style.setProperty("--cols", columns);
    console.log("columns:", columns);
    createBoard();
});

minesInput.addEventListener("change", (e) => {
    if(e.target.value > rows*columns){
        e.target.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50% and the mines aren't fitting in the board.")
        return;
    } else if (e.target.value > Math.floor(rows*columns*50/100)){
        e.target.value = Math.floor(rows*columns*50/100);
        alert("Maximum mine count is 50%")
    }
    if(e.target.value < 1){
        e.target.value = 1;
        alert("Why do you want to play with no mines?")
    }
    if(e.target.value < Math.floor(rows*columns*10/100)){
        Math.floor(rows*columns*10/100) < 1 ? e.target.value = 1 : e.target.value = Math.floor(rows*columns*10/100);
        alert("Seems easy but minimum mine count is 10%")
    }
    mines = parseInt(e.target.value);
    console.log("mines:", mines);
    createBoard();
    document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
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
    statusFace.textContent = "🙂";
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
            if(mines - document.querySelectorAll(".flagged").length == 0){
                alert("Are you sure you want to place more flags? You have already flagged all the mines.");
            }
            boardArr[row][col].flagged = !boardArr[row][col].flagged;
            cell.classList.toggle("flagged");
            cell.innerHTML = boardArr[row][col].flagged ? "🚩" : "";
            document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
        }
      });
      board.appendChild(cell);
      rowArr.push({ hasMine: false, revealed: false, flagged: false });
    }
    boardArr.push(rowArr);
  }
  setMines();
  console.log("Total cells created:", rows * columns);
  document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
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
    document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
    const cell = e.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));
    let selectionHintUsed = selectionHintActive;
    if (selectionHintUsed) {
        if (boardArr[row][col].revealed || boardArr[row][col].flagged) {
            alert("Please select an unrevealed, unflagged cell for the hint.");
            return;
        }
        selectionHintActive = false;
        statusFace.textContent = "💡";
        setTimeout(() => {
            if (!gameOver) statusFace.textContent = "🙂";
        }, 500);
    }

    if (boardArr[row][col].revealed) return;
    boardArr[row][col].revealed = true;
    cell.classList.add("revealed");
    if (boardArr[row][col].hasMine) {
        if (!selectionHintUsed) {
            cell.innerHTML = "💣";
            gameOver = true;
            cell.classList.add("mine-hit");
            board.classList.add("shake");
            statusFace.textContent = "😵";
            setTimeout(() => {
                revealAllMines();
                minesFound = document.querySelectorAll(".flagged").length;
                alert("Game Over! You hit a mine. Mines found: " + minesFound + "/" + mines);
                cell.innerHTML = "💥";
                board.classList.remove("shake");
            }, 300);
        } else {
            cell.innerHTML = "💣";
        }
    } else {
        latestRevealedCell = { row: row, col: col };
        const mineCount = boardArr[row][col].mineCount;
        statusFace.textContent = "😮";
        setTimeout(() => {
            statusFace.textContent = "🙂";
        }, 500);
        if (mineCount === 0) {
            if(boardArr[row][col].flagged){
                cell.innerHTML = "";
                cell.classList.remove("flagged");
                boardArr[row][col].flagged = false;
            }
            revealEmptyCells(row, col);
        } else {
            cell.innerHTML = mineCount > 0 ? mineCount : "";
        }
        if (checkWin()) {
            gameOver = true;
            revealAllMines();
            setTimeout(() => {
                alert("Congratulations! You've cleared the minefield!");
            }, 0);
        }
    }
}

function revealEmptyCells(row, col) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (row + x >= 0 && row + x < rows && col + y >= 0 && col + y < columns) {
                if (!boardArr[row + x][col + y].revealed && !boardArr[row + x][col + y].hasMine){
                    boardArr[row + x][col + y].revealed = true;
                    latestRevealedCell = { row: row + x, col: col + y };
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
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (!cell) continue;
            cell.classList.add("revealed");
            boardArr[i][j].revealed = true;

            if (boardArr[i][j].hasMine) {
                if (cell.classList.contains("mine-hit")) {
                    cell.innerHTML = "💥";
                } else if (boardArr[i][j].flagged) {
                    cell.innerHTML = "🚩";
                } else {
                    cell.innerHTML = "💣";
                }
            } else {
                if (boardArr[i][j].flagged) {
                    cell.innerHTML = "❌";
                } else {
                    cell.innerHTML = boardArr[i][j].mineCount > 0 ? boardArr[i][j].mineCount : "";
                }
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
    statusFace.textContent = "😎";
    return true;
}

function giveHint(){
    if (gameOver) {
        alert("Game is over!");
        return;
    }
    
    if (latestRevealedCell.row === -1 || latestRevealedCell.col === -1) {
        alert("Please reveal at least one cell first!");
        return;
    }
    
    const confirmed = confirm("Do you really want a hint? This will flag all adjacent mines.");
    
    if (!confirmed) return;
    
    const { row, col } = latestRevealedCell;
    let hintsMarked = 0;
    
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const newRow = row + x;
            const newCol = col + y;
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
                const hintCell = document.getElementById(`cell-${newRow}-${newCol}`);
                
                if (boardArr[newRow][newCol].hasMine && !boardArr[newRow][newCol].revealed && !boardArr[newRow][newCol].flagged) {
                    boardArr[newRow][newCol].flagged = true;
                    hintCell.classList.add("flagged");
                    hintCell.innerHTML = "🚩";
                    hintsMarked++;
                    document.getElementById("minesCount").textContent = mines - document.querySelectorAll(".flagged").length;
                }
            }
        }
    }
    
    if (hintsMarked === 0) {
        alert("No unflagged mines adjacent to the latest revealed cell!");
    } else {
        alert(`Found ${hintsMarked} mine(s) adjacent to your last click!`);
    }
}

function giveSelectionHint(){
    if(boardArr.length == 0){
        alert("Please start the game first.");
        return;
    }
    if (gameOver) {
        alert("Game is over!");
        return;
    }

    if (selectionHintActive) {
        alert("A selection hint is already active. Please click an unrevealed cell.");
        return;
    }

    const confirmed = confirm("Do you want a selection hint? Select an unrevealed cell and it will be revealed safely.");
    if (!confirmed) return;

    selectionHintActive = true;
    alert("Select an unrevealed cell on the board to reveal it.");
}

// document.addEventListener("mousedown", (e) => {
//     if (e.button === 0) {
//         statusFace.textContent = "😮";
//     }
// });

// document.addEventListener("mouseup", (e) => {
//     if (e.button === 0) {
//         statusFace.textContent = "🙂";
//     }
// });
