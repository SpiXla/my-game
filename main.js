// Game variables
const gameContainer = document.querySelector('.game-container');
const paddle = document.querySelector('.paddle');
const ball = document.querySelector('.ball');
const bricksContainer = document.querySelector('.bricks');
const startButton = document.getElementById('startButton');
const pauseMenu = document.getElementById('pauseMenu');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');

let ballX = 600; // Initial X position of the ball (center of the container)
let ballY = 400; // Initial Y position of the ball (center of the container)
let ballSpeedX = 8; // Horizontal speed of the ball
let ballSpeedY = -8; // Vertical speed of the ball
let paddleX = (gameContainer.offsetWidth - 200) / 2; // Center the paddle initially
let gameRunning = false; // Game state
let gamePaused = false; // Pause state

const paddleWidth = 200; // Paddle width
const ballSize = 30; // Ball size
const brickWidth = 100; // Brick width
const brickHeight = 40; // Brick height
const paddleSpeed = 10; // Paddle speed

// Track keyboard state
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
};

// Create bricks
function createBricks() {
  bricksContainer.innerHTML = ''; // Clear existing bricks
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const brick = document.createElement('div');
      brick.classList.add('brick');
      brick.style.left = `${col * (brickWidth + 15)}px`;
      brick.style.top = `${row * (brickHeight + 15)}px`;
      bricksContainer.appendChild(brick);
    }
  }
}

// Move paddle based on keyboard state
function movePaddle() {
  if (!gameRunning || gamePaused) return; // Don't move paddle if game is not running or paused

  if (keys.ArrowLeft) {
    paddleX -= paddleSpeed; // Move paddle left
  }
  if (keys.ArrowRight) {
    paddleX += paddleSpeed; // Move paddle right
  }

  // Clamp paddle position to stay within the container
  paddleX = Math.max(0, Math.min(gameContainer.offsetWidth - paddleWidth, paddleX));

  paddle.style.left = `${paddleX}px`;
}

// Keyboard event listeners
document.addEventListener('keydown', (event) => {
  if (event.key in keys) {
    keys[event.key] = true; // Set key state to true
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key in keys) {
    keys[event.key] = false; // Set key state to false
  }
});

// Check collision between ball and brick
function checkBrickCollision(brick) {
  const brickRect = brick.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();

  return (
    ballRect.left < brickRect.right &&
    ballRect.right > brickRect.left &&
    ballRect.top < brickRect.bottom &&
    ballRect.bottom > brickRect.top
  );
}

// Update ball position
function updateBall() {
  if (!gameRunning || gamePaused) return; // Don't update ball if game is not running or paused

  // Update ball position
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with walls
  if (ballX < 0 || ballX > gameContainer.offsetWidth - ballSize) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with paddle
  if (
    ballY + ballSize > gameContainer.offsetHeight - 50 &&
    ballX > paddleX &&
    ballX < paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY;
  }

  // Ball collision with bricks
  const bricks = document.querySelectorAll('.brick');
  let collisionDetected = false; // Flag to track if a collision has been detected

  bricks.forEach((brick) => {
    if (!collisionDetected && checkBrickCollision(brick)) {
      brick.remove(); // Destroy the brick
      collisionDetected = true; // Set flag to true to prevent further collisions in this frame

      // Determine the side of collision and bounce the ball accordingly
      const ballRect = ball.getBoundingClientRect();
      const brickRect = brick.getBoundingClientRect();

      const ballCenterX = ballRect.left + ballSize / 2;
      const ballCenterY = ballRect.top + ballSize / 2;
      const brickCenterX = brickRect.left + brickWidth / 2;
      const brickCenterY = brickRect.top + brickHeight / 2;

      const deltaX = ballCenterX - brickCenterX;
      const deltaY = ballCenterY - brickCenterY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal collision (left or right)
        ballSpeedX = -ballSpeedX;
      } else {
        // Vertical collision (top or bottom)
        ballSpeedY = -ballSpeedY;
      }
    }
  });

  // Game over condition
  if (ballY > gameContainer.offsetHeight) {
    alert('Game Over!');
    resetGame();
  }

  // Update ball position
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}

// Reset game
function resetGame() {
  ballX = 600;
  ballY = 400;
  ballSpeedX = 8;
  ballSpeedY = -8;
  paddleX = (gameContainer.offsetWidth - paddleWidth) / 2; // Reset paddle to center
  paddle.style.left = `${paddleX}px`;
  createBricks();
  gameRunning = false;
  startButton.style.display = 'block'; // Show start button
  pauseMenu.style.display = 'none'; // Hide pause menu
}

// Start game
function startGame() {
  gameRunning = true;
  startButton.style.display = 'none'; // Hide start button
  pauseMenu.style.display = 'none'; // Hide pause menu
}

// Pause game
function pauseGame() {
  gamePaused = true;
  pauseMenu.style.display = 'block'; // Show pause menu
}

// Resume game
function resumeGame() {
  gamePaused = false;
  pauseMenu.style.display = 'none'; // Hide pause menu
}

// Event listeners
startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', resumeGame);
restartButton.addEventListener('click', resetGame);

// Pause game on Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && gameRunning) {
    pauseGame();
  }
});

// Game loop
function gameLoop() {
  movePaddle(); // Update paddle position
  updateBall(); // Update ball position
  requestAnimationFrame(gameLoop); // Smooth rendering
}

// Initialize game
createBricks();
gameLoop();