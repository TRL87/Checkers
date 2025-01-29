const board = document.getElementById('board');
const rows = 8;
const columns = 8;
let turn = 'red';

const createBoard = () => {
    board.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = row;
            square.dataset.col = col;
            if ((row + col) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black-piece');
                    piece.dataset.color = 'black';
                    square.appendChild(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red-piece');
                    piece.dataset.color = 'red';
                    square.appendChild(piece);
                }
            }
            board.appendChild(square);
        }
    }
};

createBoard();

let selectedPiece = null;

const selectPiece = (piece) => {
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
    }
    selectedPiece = piece;
    selectedPiece.classList.add('selected');
};

const movePiece = (square) => {
    if (selectedPiece) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const pieceRow = parseInt(selectedPiece.parentElement.dataset.row);
        const pieceCol = parseInt(selectedPiece.parentElement.dataset.col);
        const color = selectedPiece.dataset.color;

        if (Math.abs(row - pieceRow) === 1 && Math.abs(col - pieceCol) === 1) {
            // Simple move
            square.appendChild(selectedPiece);
            endTurn();
        } else if (Math.abs(row - pieceRow) === 2 && Math.abs(col - pieceCol) === 2) {
            // Capture move
            const capturedRow = (row + pieceRow) / 2;
            const capturedCol = (col + pieceCol) / 2;
            const capturedSquare = document.querySelector(`[data-row="${capturedRow}"][data-col="${capturedCol}"]`);
            const capturedPiece = capturedSquare.querySelector('.piece');
            if (capturedPiece && capturedPiece.dataset.color !== color) {
                capturedSquare.removeChild(capturedPiece);
                square.appendChild(selectedPiece);
                endTurn();
            }
        }
    }
};

const endTurn = () => {
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
    turn = turn === 'red' ? 'black' : 'red';
    if (turn === 'black') {
        setTimeout(computerMove, 500);
    }
};

board.addEventListener('click', (e) => {
    const piece = e.target;
    if (piece.classList.contains('piece') && piece.dataset.color === turn) {
        selectPiece(piece);
    } else if (piece.classList.contains('square') && selectedPiece) {
        movePiece(piece);
    }
});

const getValidMoves = (piece) => {
    const row = parseInt(piece.parentElement.dataset.row);
    const col = parseInt(piece.parentElement.dataset.col);
    const color = piece.dataset.color;
    const directions = color === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    const moves = [];

    directions.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const square = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
            if (square && !square.querySelector('.piece')) {
                moves.push(square);
            } else if (square && square.querySelector('.piece') && square.querySelector('.piece').dataset.color !== color) {
                const jumpRow = newRow + dRow;
                const jumpCol = newCol + dCol;
                const jumpSquare = document.querySelector(`[data-row="${jumpRow}"][data-col="${jumpCol}"]`);
                if (jumpSquare && !jumpSquare.querySelector('.piece')) {
                    moves.push(jumpSquare);
                }
            }
        }
    });

    return moves;
};

const computerMove = () => {
    const pieces = Array.from(document.querySelectorAll('.black-piece'));
    let moveMade = false;

    while (pieces.length > 0 && !moveMade) {
        const pieceIndex = Math.floor(Math.random() * pieces.length);
        const piece = pieces.splice(pieceIndex, 1)[0];
        const validMoves = getValidMoves(piece);

        if (validMoves.length > 0) {
            const moveIndex = Math.floor(Math.random() * validMoves.length);
            const move = validMoves[moveIndex];
            movePiece.call({ target: move }, move);
            moveMade = true;
        }
    }

    if (!moveMade) {
        alert('Game Over! No more moves for the computer.');
    }
};
