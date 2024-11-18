const gridContainer = document.querySelector('.grid-container');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
let board = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

bestScoreDisplay.textContent = bestScore;

function init() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0;
    scoreDisplay.textContent = '0';
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    let emptyTiles = [];
    board.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 0) {
                emptyTiles.push({ rowIndex, colIndex });
            }
        });
    });
    if (emptyTiles.length > 0) {
        const { rowIndex, colIndex } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateScore(value) {
    score += value;
    scoreDisplay.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);
    }
}

function updateBoard() {
    gridContainer.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.classList.add('tile', `tile-${value}`);
            tile.textContent = value !== 0 ? value : '';
            gridContainer.appendChild(tile);
        });
    });
}

function move(direction) {
    let moved = false;
    const originalBoard = JSON.parse(JSON.stringify(board));

    if (direction === 'up') {
        for (let col = 0; col < 4; col++) {
            for (let row = 1; row < 4; row++) {
                if (board[row][col] !== 0) {
                    let targetRow = row;
                    while (targetRow > 0 && board[targetRow - 1][col] === 0) {
                        board[targetRow - 1][col] = board[targetRow][col];
                        board[targetRow][col] = 0;
                        targetRow--;
                        moved = true;
                    }
                    if (targetRow > 0 && board[targetRow - 1][col] === board[targetRow][col]) {
                        board[targetRow - 1][col] *= 2;
                        updateScore(board[targetRow - 1][col]);
                        board[targetRow][col] = 0;
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'down') {
        for (let col = 0; col < 4; col++) {
            for (let row = 2; row >= 0; row--) {
                if (board[row][col] !== 0) {
                    let targetRow = row;
                    while (targetRow < 3 && board[targetRow + 1][col] === 0) {
                        board[targetRow + 1][col] = board[targetRow][col];
                        board[targetRow][col] = 0;
                        targetRow++;
                        moved = true;
                    }
                    if (targetRow < 3 && board[targetRow + 1][col] === board[targetRow][col]) {
                        board[targetRow + 1][col] *= 2;
                        updateScore(board[targetRow + 1][col]);
                        board[targetRow][col] = 0;
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'left') {
        for (let row = 0; row < 4; row++) {
            for (let col = 1; col < 4; col++) {
                if (board[row][col] !== 0) {
                    let targetCol = col;
                    while (targetCol > 0 && board[row][targetCol - 1] === 0) {
                        board[row][targetCol - 1] = board[row][targetCol];
                        board[row][targetCol] = 0;
                        targetCol--;
                        moved = true;
                    }
                    if (targetCol > 0 && board[row][targetCol - 1] === board[row][targetCol]) {
                        board[row][targetCol - 1] *= 2;
                        updateScore(board[row][targetCol - 1]);
                        board[row][targetCol] = 0;
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'right') {
        for (let row = 0; row < 4; row++) {
            for (let col = 2; col >= 0; col--) {
                if (board[row][col] !== 0) {
                    let targetCol = col;
                    while (targetCol < 3 && board[row][targetCol + 1] === 0) {
                        board[row][targetCol + 1] = board[row][targetCol];
                        board[row][targetCol] = 0;
                        targetCol++;
                        moved = true;
                    }
                    if (targetCol < 3 && board[row][targetCol + 1] === board[row][targetCol]) {
                        board[row][targetCol + 1] *= 2;
                        updateScore(board[row][targetCol + 1]);
                        board[row][targetCol] = 0;
                        moved = true;
                    }
                }
            }
        }
    }

    return moved;
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (move('up')) addRandomTile();
            break;
        case 'ArrowDown':
            if (move('down')) addRandomTile();
            break;
        case 'ArrowLeft':
            if (move('left')) addRandomTile();
            break;
        case 'ArrowRight':
            if (move('right')) addRandomTile();
            break;
    }
    updateBoard();
    checkGameOver();
}

function checkGameOver() {
    // Check if the board is full
    let isFull = true;
    let has2048 = false;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                isFull = false;
            }
            if (board[row][col] === 2048) {
                has2048 = true;
            }
        }
    }

    if (has2048) {
        alert('Congratulations! You\'ve reached 2048!');
        return;
    }

    if (!isFull) return;

    // Check if any moves are possible
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                (row < 3 && board[row][col] === board[row + 1][col]) ||
                (col < 3 && board[row][col] === board[row][col + 1])
            ) {
                return; // Moves are still possible
            }
        }
    }

    // Game is over
    alert('Game Over! No more moves possible.');
}

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', init);
init();
