const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Tamaño de cada bloque
const blockSize = 30;
const rows = canvas.height / blockSize;
const columns = canvas.width / blockSize;

// Estado del juego
let board = [];
let currentPiece;
let currentPiecePosition;
let gameInterval;
let score = 0;
let speed = 500;

// Formas de las piezas
const pieces = [
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1], [1, 1]],        // O
    [[1, 1, 0], [0, 1, 1]],  // S
    [[0, 1, 1], [1, 1, 0]],  // Z
    [[1, 1, 1, 1]],          // I
    [[1, 1, 1], [1, 0, 0]],  // L
    [[1, 1, 1], [0, 0, 1]]   // J
];

// Crear un tablero vacío
function createEmptyBoard() {
    return Array.from({ length: rows }, () => Array(columns).fill(0));
}

// Generar una nueva pieza aleatoria
function generateNewPiece() {
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        shape: randomPiece,
        color: getRandomColor()
    };
}

// Función para obtener un color aleatorio
function getRandomColor() {
    const colors = ['cyan', 'yellow', 'green', 'red', 'blue', 'orange', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Iniciar el juego
function startGame() {
    score = 0;
    speed = 500;
    board = createEmptyBoard();
    currentPiece = generateNewPiece();
    currentPiecePosition = { x: Math.floor(columns / 2) - 1, y: 0 };

    if (checkCollision(currentPiece, currentPiecePosition)) {
        alert("Game Over al iniciar. No hay espacio.");
        return;
    }

    gameInterval = setInterval(updateGame, speed);
    document.getElementById('startButton').disabled = true;
    updateScore();
}

// Actualizar el estado del juego
function updateGame() {
    currentPiecePosition.y++;

    if (checkCollision(currentPiece, currentPiecePosition)) {
        currentPiecePosition.y--;
        placePieceOnBoard(currentPiece, currentPiecePosition);
        removeFullRows();
        currentPiece = generateNewPiece();
        currentPiecePosition = { x: Math.floor(columns / 2) - 1, y: 0 };

        if (checkCollision(currentPiece, currentPiecePosition)) {
            clearInterval(gameInterval);
            alert('Game Over! Puntuación final: ' + score);
            document.getElementById('startButton').disabled = false;
            return;
        }
    }

    drawBoard();
}

// Verificar colisión
function checkCollision(piece, position) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = position.x + x;
                const newY = position.y + y;

                if (newX < 0 || newX >= columns || newY >= rows || board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Colocar la pieza en el tablero
function placePieceOnBoard(piece, position) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                board[position.y + y][position.x + x] = piece.color;
            }
        }
    }
    score += 100;
    updateScore();
}

// Eliminar filas completas
function removeFullRows() {
    board = board.filter(row => row.some(cell => cell === 0));
    while (board.length < rows) {
        board.unshift(Array(columns).fill(0));
    }
}

// Dibujar el tablero
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }

    drawPiece(currentPiece, currentPiecePosition);
}

// Dibujar la pieza actual
function drawPiece(piece, position) {
    ctx.fillStyle = piece.color;
    piece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillRect((position.x + x) * blockSize, (position.y + y) * blockSize, blockSize, blockSize);
            }
        });
    });
}

// Actualizar puntaje
function updateScore() {
    scoreDisplay.textContent = score;
}

// Controles
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('left').addEventListener('click', () => currentPiecePosition.x--);
document.getElementById('right').addEventListener('click', () => currentPiecePosition.x++);
document.getElementById('rotate').addEventListener('click', rotatePiece);
