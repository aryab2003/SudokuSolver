// Sudoku.js

let board = [];
let startTime = null;
let timerInterval = null;
let score = 0;

function createEmptyBoard() {
  for (let i = 0; i < 9; i++) {
    board.push(new Array(9).fill(0));
  }
  displayBoard();
}

function displayBoard() {
  const table = document.getElementById("sudokuBoard");
  table.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      cell.textContent = board[i][j] || "";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function getSudoku() {
  fetch("https://sugoku.onrender.com/board?difficulty=easy")
    .then((response) => response.json())
    .then((data) => {
      board = data.board;
      displayBoard();
      startTimer();
    })
    .catch((error) => {
      console.error("Error fetching Sudoku:", error);
    });
}

function solveSudoku() {
  if (SudokuSolver(board, 0, 0, 9)) {
    displayBoard();
    stopTimer();
    calculateScore();
    alert("Sudoku solved successfully! Your score is: " + score);
  } else {
    alert("No solution found!");
  }
}

function resetBoard() {
  board = [];
  createEmptyBoard();
  stopTimer();
  score = 0;
  document.getElementById("timer").textContent = "Time: 00:00";
  document.getElementById("score").textContent = "Score: 0";
}

function isValid(board, i, j, num, n) {
  // Check for row and column
  for (let x = 0; x < 9; x++) {
    if (board[i][x] === num || board[x][j] === num) {
      return false;
    }
  }

  // Check for subgrids
  let rootN = Math.sqrt(n);

  let startx = Math.floor(i / rootN) * rootN;
  let starty = Math.floor(j / rootN) * rootN;

  for (let x = startx; x < startx + rootN; x++) {
    for (let y = starty; y < starty + rootN; y++) {
      if (board[x][y] === num) {
        return false;
      }
    }
  }

  return true;
}

function SudokuSolver(board, i, j, n) {
  // Base case
  if (i === n) {
    return true; // If we've reached the end of the board, the puzzle is solved
  }

  // Move to the next row if the current row is complete
  if (j === n) {
    return SudokuSolver(board, i + 1, 0, n);
  }

  // Skip already filled cells
  if (board[i][j] !== 0) {
    return SudokuSolver(board, i, j + 1, n);
  }

  // Filling the cell
  for (let num = 1; num <= n; num++) {
    // Check for valid place
    if (isValid(board, i, j, num, n)) {
      board[i][j] = num;
      // Recur for the next cell
      if (SudokuSolver(board, i, j + 1, n)) {
        return true;
      }
      // If placing num at board[i][j] doesn't lead to a solution, backtrack
      board[i][j] = 0;
    }
  }

  return false; // If no number can be placed at board[i][j], return false
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;
  document.getElementById("timer").textContent = "Time: " + formattedTime;
}

function calculateScore() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Time in seconds
  // Example scoring logic: Score = 1000 - (Time taken in seconds)
  score = 1000 - elapsedTime;
  if (score < 0) score = 0; // Score cannot be negative
  document.getElementById("score").textContent =
    "Score: " + score + "Out of 1000";
}

function shareScore() {
  const tweetMessage = encodeURIComponent(
    "I solved the Sudoku puzzle with a score of " + score + "!"
  );
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetMessage}`;

  // Open Twitter sharing window
  window.open(twitterShareUrl, "_blank");
}

// Call createEmptyBoard to initialize the board
createEmptyBoard();
