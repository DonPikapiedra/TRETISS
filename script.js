const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const ROWS = 20;
const COLUMNS = 10;
const SCALE = 30; // Ajuste del tamaño de los bloques

canvas.width = COLUMNS * SCALE;
canvas.height = ROWS * SCALE;
ctx.scale(SCALE, SCALE);

let score = 0;
let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
];

const colors = ["cyan", "yellow", "purple", "orange", "blue", "green", "red"];

let piece = newPiece();
let dropCounter = 0;
let lastTime = 0;

function newPiece() {
    const type = Math.floor(Math.random() * SHAPES.length);
    return {
        matrix: SHAPES[type],
        color: colors[type],
        pos: { x: Math.floor(COLUMNS / 2) - 1, y: 0 }
    };
}

function drawBoard() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = cell;
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawPiece() {
    piece.matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = piece.color;
                ctx.fillRect(piece.pos.x + x, piece.pos.y + y, 1, 1);
            }
        });
    });
}

function collide() {
    return piece.matrix.some((row, y) =>
        row.some((cell, x) =>
            cell &&
            (board[piece.pos.y + y] && board[piece.pos.y + y][piece.pos.x + x]) !== 0
        )
    );
}

function merge() {
    piece.matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) board[piece.pos.y + y][piece.pos.x + x] = piece.color;
        });
    });

    removeLines();
}

function removeLines() {
    let lines = 0;
    board = board.filter(row => {
        if (row.every(cell => cell !== 0)) {
            lines++;
            return false; // Elimina la línea completa
        }
        return true;
    });

    while (board.length < ROWS) {
        board.unshift(Array(COLUMNS).fill(0)); // Agrega una nueva línea vacía arriba
    }

    if (lines > 0) {
        score += lines * 100;
        scoreElement.innerText = score;
    }
}

function rotate() {
    const rotated = piece.matrix[0].map((_, i) => piece.matrix.map(row => row[i])).reverse();
    const prevMatrix = piece.matrix;
    piece.matrix = rotated;
    if (collide()) piece.matrix = prevMatrix;
}

function drop() {
    piece.pos.y++;
    if (collide()) {
        piece.pos.y--;
        merge();
        piece = newPiece();
        if (collide()) {
            alert("¡Game Over! Tu puntuación: " + score);
            score = 0;
            board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
            scoreElement.innerText = score;
        }
    }
    dropCounter = 0;
}

function move(dir) {
    piece.pos.x += dir;
    if (collide()) piece.pos.x -= dir;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > 1000) drop();
    drawBoard();
    drawPiece();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    else if (event.key === "ArrowRight") move(1);
    else if (event.key === "ArrowDown") drop();
    else if (event.key === "ArrowUp") rotate();
});

// 🚀 Botones táctiles
document.getElementById("left").addEventListener("click", () => move(-1));
document.getElementById("right").addEventListener("click", () => move(1));
document.getElementById("down").addEventListener("click", drop);
document.getElementById("rotate").addEventListener("click", rotate);

update();
