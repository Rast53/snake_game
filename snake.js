const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snakeBlock = 20;
let snakeSpeed = 150; // Скорость змейки, значение в миллисекундах
let score = 0;
let level = 1;
let pointsToNextLevel = 50;
let isPaused = false;
let gameOver = false;

let snake = [{x: canvas.width / 2, y: canvas.height / 2}];
let direction = {x: 0, y: 0};
let food = spawnFood();

// Размер игрового поля для мобильных устройств
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth, 800);
    canvas.height = Math.min(window.innerHeight, 600);
    snakeBlock = Math.min(canvas.width / 40, 20);
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#282c34");
    gradient.addColorStop(1, "#3a3f47");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        const gradient = ctx.createRadialGradient(part.x + snakeBlock / 2, part.y + snakeBlock / 2, 5, part.x + snakeBlock / 2, part.y + snakeBlock / 2, snakeBlock);
        gradient.addColorStop(0, "rgba(34, 193, 195, 1)");
        gradient.addColorStop(1, "rgba(253, 187, 45, 1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(part.x, part.y, snakeBlock, snakeBlock);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.strokeRect(part.x, part.y, snakeBlock, snakeBlock);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x * snakeBlock, y: snake[0].y + direction.y * snakeBlock};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        pointsToNextLevel -= 10;
        if (pointsToNextLevel <= 0) {
            level++;
            snakeSpeed = Math.max(snakeSpeed - 10, 50); // Ускорение змейки
            pointsToNextLevel = 50;
        }
        food = spawnFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
        drawCollisionEffect(head.x, head.y);
        gameOver = true;
        setTimeout(showGameOverScreen, 500);
    }
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvas.width / snakeBlock)) * snakeBlock;
    const y = Math.floor(Math.random() * (canvas.height / snakeBlock)) * snakeBlock;
    return {x, y};
}

function drawFood() {
    ctx.fillStyle = "rgba(255, 69, 0, 1)";
    ctx.shadowColor = "rgba(255, 69, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x, food.y, snakeBlock, snakeBlock);
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Next Level In: " + pointsToNextLevel + " points", 10, 50);
    ctx.fillText("Level: " + level, canvas.width - 90, 20);
}

function drawPauseMessage() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACE or TAP to Pause/Resume", canvas.width / 2, canvas.height - 20);
}

function showGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Level: " + level, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText("Press R or TAP to Restart", canvas.width / 2, canvas.height / 2 + 80);
}

function resetGame() {
    snake = [{x: canvas.width / 2, y: canvas.height / 2}];
    direction = {x: 0, y: 0};
    score = 0;
    level = 1;
    snakeSpeed = 150;
    pointsToNextLevel = 50;
    food = spawnFood();
    gameOver = false;
}

function checkCollision(head) {
    return snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y);
}

function drawCollisionEffect(x, y) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(x + snakeBlock / 2, y + snakeBlock / 2, snakeBlock * 2, 0, Math.PI * 2);
    ctx.fill();
}

function update() {
    if (!isPaused && !gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGradientBackground();
        moveSnake();
        drawSnake();
        drawFood();
        drawScore();
    }
    if (!gameOver) {
        drawPauseMessage();
    }
    setTimeout(update, snakeSpeed);
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) { // Left arrow
        direction = {x: -1, y: 0};
    } else if (key === 38 && direction.y === 0) { // Up arrow
        direction = {x: 0, y: -1};
    } else if (key === 39 && direction.x === 0) { // Right arrow
        direction = {x: 1, y: 0};
    } else if (key === 40 && direction.y === 0) { // Down arrow
        direction = {x: 0, y: 1};
    } else if (key === 32) { // Space bar for Pause/Resume
        isPaused = !isPaused;
    } else if (key === 82 && gameOver) { // R key for Restart
        resetGame();
    }
}

function handleTouch(event) {
    if (gameOver) {
        resetGame();
        return;
    }

    if (isPaused) {
        isPaused = false;
        return;
    }

    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const head = snake[0];

    if (Math.abs(touchX - head.x) > Math.abs(touchY - head.y)) {
        if (touchX < head.x) {
            direction = {x: -1, y: 0}; // Move left
        } else {
            direction = {x: 1, y: 0}; // Move right
        }
    } else {
        if (touchY < head.y) {
            direction = {x: 0, y: -1}; // Move up
        } else {
            direction = {x: 0, y: 1}; // Move down
        }
    }
}

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", handleTouch);

update();
