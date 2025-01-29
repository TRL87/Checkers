const board = document.getElementById('board');
const rows = 8;
const columns = 8;
let turn = 'red';

// Initialize board
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const square = document.createElement('div');
        square.classList.add('square');
        if ((row + col) % 2 === 0) {
            square.classList.add('white');
        } else {
            square.classList.add('black');
            if (row < 3) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black-piece');
                square.appendChild(piece);
            } else if (row > 4) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'red-piece');
                square.appendChild(piece);
            }
        }
        board.appendChild(square);
    }
}

// Add event listeners for piece movement
board.addEventListener('click', (e) => {
    const piece = e.target;
    if (piece.classList.contains('piece')) {
        // Implement piece movement logic here
        console.log('Piece clicked:', piece);
    }
});
