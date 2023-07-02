const gameBoard = document.getElementById('gameBoard');
const modal = document.getElementById('modal');
const xMarker = document.getElementById('X');
const oMarker = document.getElementById('O');
const resultModal = document.getElementById('resultModal');
const resultContent = document.querySelector('.resultModal .modal-content');
const returnToHome=document.getElementById('goBackBtn');

returnToHome.addEventListener('click', function() {
    // Redirect to the desired HTML page
    window.location.href = 'index.html';
});


// showing the indiviual states where the markers of each of the player have been placed on the board.

// an indivual matrix is alloted to each one of the players, in order to compute the result of win or draw.
let matrices = [
  [['', '', ''], ['', '', ''], ['', '', '']], //  player 1 indiviual matrix
  [['', '', ''], ['', '', ''], ['', '', '']] // player2 indiviual matrix.
];
let turnCount = 0;
// this will help in toggling between the players chances 
let currentPlayer = 0;
// storing the marker chosen by the players to play on the board 'X' or 'O'
let markers = [null, null];

// constructing the grid which is a 3*3 matrix.
const gridRow = 3;
const gridCol = 3;

// modal which takes user input of which marker to play with.
window.addEventListener('load', () => modal.style.display = 'block');

function markCell(cell) {
  // getting row no and col no so as to update the players indivual matrix alloted to him with his marker symbol.
  const row = cell.getAttribute('rowNo');
  const col = cell.getAttribute('colNo');
  if (cell.classList.contains('filled')) 
  {
    return;
  }

  matrices[currentPlayer][row][col] = markers[currentPlayer];
  cell.textContent = markers[currentPlayer];
  if(markers[currentPlayer]==='X'){
    cell.textContent.color="red";
  }else{
    cell.textContent.color="green";
  }
  // to prevent a player from placing his marker upon a cell which already has been occupied by a marker.
  cell.classList.add('filled');

  turnCount++;

  let result = checkWinCondition(matrices[currentPlayer], markers[currentPlayer]);
  if (result === 'X' || result === 'O') {
    // Show a modal where current player wins
    showResult(result);
  }
  if (result === 'draw') {
    // Show a modal where the match is a draw
    showResult('draw');
  }
  

  // toggling between players chances , 1 and 0 
  currentPlayer = 1 - currentPlayer;
}

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('rowNo', row);
  cell.setAttribute('colNo', col);
  cell.addEventListener('click', () => markCell(cell));
  
  // adding css styles to the baord dynamically.
  cell.style.width = '140px';
  cell.style.height = '140px';
  cell.style.border = '1px solid black';

  return cell;
}

function createGameBoard() {
  gameBoard.innerHTML='';// clear the game board.
  for (let i = 0; i < gridRow; i++) {
    let rowContainer = document.createElement('div');
    rowContainer.classList.add('row');

    for (let j = 0; j < gridCol; j++) {
      rowContainer.appendChild(createCell(i, j));
    }

    gameBoard.appendChild(rowContainer);
  }
}

function checkWinCondition(matrix, marker) {
    // getting the matrix of the current player which has made a move and its marker symbol to check for winning condition.
  const winningCombinations = [
    [[0, 0], [0, 1], [0, 2]], 
    [[1, 0], [1, 1], [1, 2]], 
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]], 
    [[0, 1], [1, 1], [2, 1]], 
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const combination = winningCombinations[i];
    // we are iterating over the winning combinations matrix , if an entire row of this matrix condition is satisfied the player wins.
    /**
     *   if 'X' is present in (0,0) , (0,1) , (0,2) X WINS.
     *   this code checks this .
     */
    if (combination.every(([row, col]) => matrix[row][col] === marker)) {
      return marker // Return the marker of the winning player
    }
  }

  // if the board is filled and a winner is not present then a draw state for the match.
  if (turnCount === 9) return 'draw';
  return false;
}

function startGame(firstPlayerMarker) {
  // assigning the marker chosen by the firstPlayer 
  markers[0] = firstPlayerMarker;
  markers[1] = firstPlayerMarker === 'X' ? 'O' : 'X';
  modal.style.display = 'none';
  createGameBoard();
}
function showResult(result) {
    if (result === 'draw') {
        resultContent.textContent = 'The game is a draw!';
      } else {
        const player=result===markers[0]?'player 1':'player 2';
        resultContent.textContent = `${player} (${result}) wins!`;
      }
      
      // Add reset button to modal content
      const parentContainer=document.createElement('div');
      const resetButton = document.createElement('button');
      resetButton.id = 'resetGame';
      resetButton.textContent = 'Reset Game';
      parentContainer.appendChild(resetButton);
      resultContent.appendChild(parentContainer);
      resetButton.addEventListener('click', resetGame);

      
      resultModal.style.display = 'block';
}
  
function resetGame() {
    gameBoard.innerHTML = '';
    matrices = [
      [['', '', ''], ['', '', ''], ['', '', '']],
      [['', '', ''], ['', '', ''], ['', '', '']]
    ];
    turnCount = 0;
    currentPlayer = 0;
    modal.style.display = 'block';
    resultModal.style.display = 'none';
    
    // Clear result modal content
    resultContent.textContent = '';
}
  

xMarker.addEventListener('click', () => startGame('X'));
oMarker.addEventListener('click', () => startGame('O'));
