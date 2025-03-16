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
    gameInterval = setInterval(updateGame, speed);
    document.getElementById('startButton').disabled = true;
    updateScore();
}

// Actualizar el estado del juego
function updateGame() {
    currentPiecePosition.y++;

    if (checkCollision(currentPiece, currentPiecePosition)) {
        placePieceOnBoard(currentPiece, currentPiecePosition);
        removeFullRows();
        currentPiece = generateNewPiece();
        currentPiecePosition = { x: Math.floor(columns / 2) - 1, y: 0 };

        if (checkGameOver()) {
            clearInterval(gameInterval);
            alert('Game Over! Puntuación final: ' + score);
            document.getElementById('startButton').disabled = false;
        }
    }

    drawBoard();
}

// Verificar colisión con las paredes o piezas en el tablero
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
    score += 200; // Aumentar puntaje por fila eliminada
    updateScore();
}

// Eliminar las filas completas
function removeFullRows() {
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(columns).fill(0));
        }
    }
}

// Dibujar el tablero y las piezas
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

function drawPiece(piece, position) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                ctx.fillStyle = piece.color;
                ctx.fillRect((position.x + x) * blockSize, (position.y + y) * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Verificar si el juego está terminado
function checkGameOver() {
    return currentPiecePosition.y === 0 && checkCollision(currentPiece, currentPiecePosition);
}

// Mover la pieza a la izquierda
function moveLeft() {
    currentPiecePosition.x--;
    if (checkCollision(currentPiece, currentPiecePosition)) {
        currentPiecePosition.x++;
    }
}

// Mover la pieza a la derecha
function moveRight() {
    currentPiecePosition.x++;
    if (checkCollision(currentPiece, currentPiecePosition)) {
        currentPiecePosition.x--;
    }
}

// Rotar la pieza
function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index])
    ).reverse();

    const rotatedPiece = {
        shape: rotatedShape,
        color: currentPiece.color
    };

    const originalPiece = currentPiece;
    currentPiece = rotatedPiece;

    if (checkCollision(currentPiece, currentPiecePosition)) {
        currentPiece = originalPiece;
    }
}

// Actualizar el puntaje en la pantalla
function updateScore() {
    scoreDisplay.textContent = score;
}

// Agregar eventos a los botones
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('left').addEventListener('click', moveLeft);
document.getElementById('right').addEventListener('click', moveRight);
document.getElementById('rotate').addEventListener('click', rotatePiece);
