class Game {
  constructor() {
    //we're caching all the unchangeable things so that the calculations are faster

    this.gameContainer = document.querySelector('.game-container');
    this.gameBoard = document.querySelector('.game-board');
    this.bricksGrid = document.getElementById('bricks-grid');
    this.paddle = document.getElementById('paddle');
    this.ball = document.getElementById('ball');
    this.livesCount = document.getElementById('lives-count');
    this.scoreValue = document.getElementById('score-value');
    this.timeValue = document.getElementById('time-value');

    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.winScreen = document.getElementById('win-screen');

    this.startBtn = document.getElementById('start-btn');
    this.playAgainBtn = document.getElementById('play-again-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.resumeBtn = document.getElementById('resume-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.nextLevelBtn = document.getElementById('next-level-btn');

    this.isPlaying = false;
    this.isPaused = false;
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.time = 0;
    this.timerInterval = null;

    this.paddleWidth = 100;
    this.paddleHeight = 15;
    this.ballSize = 18;
    this.brickRowCount = 3;
    this.brickColumnCount = 8;

    this.paddleX = (this.gameBoard.offsetWidth - this.paddleWidth) / 2;
    this.ballX = this.gameBoard.offsetWidth / 2 - this.ballSize / 2;
    this.ballY = this.gameBoard.offsetHeight - 100;
    this.ballSpeedX = 4;
    this.ballSpeedY = -4;

    this.startBtn.addEventListener('click', () => this.startGame());
    this.playAgainBtn.addEventListener('click', () => this.resetGame());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.resumeBtn.addEventListener('click', () => this.togglePause());
    this.restartBtn.addEventListener('click', () => this.resetGame());
    this.nextLevelBtn.addEventListener('click', () => this.nextLevel());

    document.addEventListener('keydown', (e) => this.keyDownHandler(e));
    document.addEventListener('keyup', (e) => this.keyUpHandler(e));


    this.init();
  }

  init() {
    this.paddle.style.width = `${this.paddleWidth}px`;
    this.paddle.style.height = `${this.paddleHeight}px`;
    this.ball.style.width = `${this.ballSize}px`;
    this.ball.style.height = `${this.ballSize}px`;

    this.paddle.style.left = `${this.paddleX}px`;

    this.ball.style.left = `${this.ballX}px`;
    this.ball.style.top = `${this.ballY}px`;

    this.showScreen('start');

    this.createBricks();
  }

  createBricks() {
    this.bricksGrid.innerHTML = '';
    this.bricks = [];

    const padding = 8;
    const offsetX = 20;
    const offsetY = 20;
    const brickWidth = (this.gameBoard.offsetWidth - offsetX * 2) / this.brickColumnCount - padding;
    const brickHeight = 20;

    for (let r = 0; r < this.brickRowCount + this.level; r++) {
      for (let c = 0; c < this.brickColumnCount; c++) {
        const brickX = offsetX + c * (brickWidth + padding);
        const brickY = offsetY + r * (brickHeight + padding);

        const brick = document.createElement('div');
        brick.className = 'brick';
        brick.style.width = `${brickWidth}px`;
        brick.style.height = `${brickHeight}px`;
        brick.style.left = `${brickX}px`;
        brick.style.top = `${brickY}px`;

        this.bricksGrid.appendChild(brick);

        this.bricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          destroyed: false,
          element: brick,
        });
      }
    }
  }

  startGame() {
    this.isPlaying = true;
    this.isPaused = false;
    this.hideAllScreens();

    this.ballX = this.gameBoard.offsetWidth / 2 - this.ballSize / 2;
    this.ballY = this.gameBoard.offsetHeight - 100;
    this.ballSpeedX = 4;
    this.ballSpeedY = -4;

    this.paddleX = (this.gameBoard.offsetWidth - this.paddleWidth) / 2;
    this.paddle.style.left = `${this.paddleX}px`;

    this.startTimer();

    this.gameLoop();
  }

  resetGame() {
    this.lives = 3;
    this.score = 0;
    this.time = 0;
    this.level = 1;
    this.updateStats();
    this.createBricks();
    this.startGame();
  }

  nextLevel() {
    this.level++;
    this.createBricks();
    this.startGame();
  }

  togglePause() {
    if (!this.isPlaying) return;
    console.log(this.isPlaying, this.isPaused);

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.showScreen('pause');
      // clearInterval(this.timerInterval);
    } else {
      this.hideAllScreens();
      this.startTimer();
      this.gameLoop();
    }
  }

  gameOver() {
    this.isPlaying = false;
    clearInterval(this.timerInterval);

    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-time').textContent = `${this.time}s`;
    document.getElementById('result-title').textContent = 'GAME OVER';
    document.getElementById('result-title').style.backgroundImage = 'linear-gradient(to right, #ff416c, #ff4b2b)';

    this.showScreen('game-over');
  }

  levelComplete() {
    this.isPlaying = false;
    clearInterval(this.timerInterval);

    document.getElementById('win-score').textContent = this.score;
    document.getElementById('win-time').textContent = `${this.time}s`;

    this.showScreen('win');
  }

  startTimer() {
    this.time = 0;
    this.timeValue.textContent = this.time;
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.time++;
      this.timeValue.textContent = this.time;
    }, 1000);
  }

  updateStats() {
    this.livesCount.textContent = this.lives;
    this.scoreValue.textContent = this.score;
    this.timeValue.textContent = this.time;
  }

  showScreen(screen) {
    this.hideAllScreens();

    switch (screen) {
      case 'start':
        this.startScreen.style.display = 'flex';
        break;
      case 'game-over':
        this.gameOverScreen.style.display = 'flex';
        break;
      case 'pause':
        this.pauseScreen.style.display = 'flex';
        break;
      case 'win':
        this.winScreen.style.display = 'flex';
        break;
    }
  }

  hideAllScreens() {
    this.startScreen.style.display = 'none';
    this.gameOverScreen.style.display = 'none';
    this.pauseScreen.style.display = 'none';
    this.winScreen.style.display = 'none';
  }

  // gameLoop() {
  //   if (!this.isPlaying || this.isPaused) return;

  //   // Move ball
  //   this.ballX += this.ballSpeedX;
  //   this.ballY += this.ballSpeedY;

  //   // Wall collision (left/right)
  //   if (this.ballX <= 0 || this.ballX + this.ballSize >= this.gameBoard.offsetWidth) {
  //     this.ballSpeedX = -this.ballSpeedX;
  //     // Fix position if ball went beyond bounds
  //     if (this.ballX < 0) this.ballX = 0;
  //     if (this.ballX + this.ballSize > this.gameBoard.offsetWidth) {
  //       this.ballX = this.gameBoard.offsetWidth - this.ballSize;
  //     }
  //   }

  //   // Wall collision (top)
  //   if (this.ballY <= 0) {
  //     this.ballSpeedY = -this.ballSpeedY;
  //     this.ballY = 0; // Fix position
  //   }

  //   // Get actual paddle position for collision detection
  //   const paddleTop = this.gameBoard.offsetHeight - this.paddleHeight - 10; // Assuming paddle is at bottom with 10px margin

  //   // Paddle collision - fixed version
  //   if (
  //     this.ballY + this.ballSize >= paddleTop &&
  //     this.ballY <= paddleTop + this.paddleHeight &&
  //     this.ballX + this.ballSize >= this.paddleX &&
  //     this.ballX <= this.paddleX + this.paddleWidth
  //   ) {
  //     // Prevent ball from getting stuck in paddle
  //     if (this.ballSpeedY > 0) {
  //       // Only reverse direction if ball is moving downward
  //       this.ballY = paddleTop - this.ballSize;

  //       // Calculate bounce angle based on where ball hits paddle
  //       const hitPosition = (this.ballX + this.ballSize / 2) - (this.paddleX + this.paddleWidth / 2);
  //       const normalizedHit = hitPosition / (this.paddleWidth / 2);
  //       const bounceAngle = normalizedHit * Math.PI / 3; // Max 60 degrees

  //       const speed = Math.sqrt(this.ballSpeedX * this.ballSpeedX + this.ballSpeedY * this.ballSpeedY);
  //       this.ballSpeedX = speed * Math.sin(bounceAngle);
  //       this.ballSpeedY = -speed * Math.cos(bounceAngle);
  //     }
  //   }

  //   // Bottom wall collision (lose life)
  //   if (this.ballY + this.ballSize >= this.gameBoard.offsetHeight) {
  //     this.lives--;
  //     this.updateStats();

  //     if (this.lives <= 0) {
  //       this.gameOver();
  //       return;
  //     } else {
  //       // Reset ball and paddle
  //       this.ballX = this.gameBoard.offsetWidth / 2 - this.ballSize / 2;
  //       this.ballY = this.gameBoard.offsetHeight - 100;
  //       this.paddleX = (this.gameBoard.offsetWidth - this.paddleWidth) / 2;
  //       this.ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
  //       this.ballSpeedY = -4;
  //     }
  //   }

  //   // Brick collision
  //   let bricksRemaining = 0;
  //   for (let brick of this.bricks) {
  //     if (brick.destroyed) continue;
  //     bricksRemaining++;

  //     const bx = brick.x;
  //     const by = brick.y;
  //     const bw = brick.width;
  //     const bh = brick.height;

  //     const ballLeft = this.ballX;
  //     const ballRight = this.ballX + this.ballSize;
  //     const ballTop = this.ballY;
  //     const ballBottom = this.ballY + this.ballSize;

  //     const brickLeft = bx;
  //     const brickRight = bx + bw;
  //     const brickTop = by;
  //     const brickBottom = by + bh;

  //     const isColliding =
  //       ballRight > brickLeft &&
  //       ballLeft < brickRight &&
  //       ballBottom > brickTop &&
  //       ballTop < brickBottom;

  //     if (isColliding) {
  //       brick.destroyed = true;
  //       brick.element.classList.add('destroyed');
  //       this.score += 10 * this.level;
  //       this.updateStats();

  //       const prevBallX = this.ballX - this.ballSpeedX;
  //       const prevBallY = this.ballY - this.ballSpeedY;
  //       const prevBallRight = prevBallX + this.ballSize;
  //       const prevBallBottom = prevBallY + this.ballSize;

  //       const hitFromTop = prevBallBottom <= brickTop;
  //       const hitFromBottom = prevBallY >= brickBottom;
  //       const hitFromLeft = prevBallRight <= brickLeft;
  //       const hitFromRight = prevBallX >= brickRight;

  //       if (hitFromTop || hitFromBottom) {
  //         this.ballSpeedY = -this.ballSpeedY;
  //       } else if (hitFromLeft || hitFromRight) {
  //         this.ballSpeedX = -this.ballSpeedX;
  //       } else {
  //         this.ballSpeedY = -this.ballSpeedY;
  //       }

  //       break; // Only handle one brick per frame
  //     }
  //   }

  //   // Level complete
  //   if (bricksRemaining === 0) {
  //     this.levelComplete();
  //     return;
  //   }

  //   // Update ball position
  //   this.ball.style.left = `${this.ballX}px`;
  //   this.ball.style.top = `${this.ballY}px`;

  //   // Paddle movement
  //   const paddleSpeed = 7;
  //   if (this.rightPressed) {
  //     this.paddleX = Math.min(this.paddleX + paddleSpeed, this.gameBoard.offsetWidth - this.paddleWidth);
  //   }
  //   if (this.leftPressed) {
  //     this.paddleX = Math.max(this.paddleX - paddleSpeed, 0);
  //   }

  //   // Apply paddle position
  //   this.paddle.style.left = `${this.paddleX}px`;

  //   // Continue loop
  //   requestAnimationFrame(() => this.gameLoop());
  // }
  // Replace the entire gameLoop() method with this improved version
  gameLoop() {
    if (!this.isPlaying || this.isPaused) return;

    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Wall collision (left/right)
    if (this.ballX <= 0 || this.ballX + this.ballSize >= this.gameBoard.offsetWidth) {
      this.ballSpeedX = -this.ballSpeedX;
      //byond walls
      if (this.ballX < 0) this.ballX = 0;
      if (this.ballX + this.ballSize > this.gameBoard.offsetWidth) {
        this.ballX = this.gameBoard.offsetWidth - this.ballSize;
      }
    }


    if (this.ballY <= 0) {
      this.ballSpeedY = -this.ballSpeedY;
      this.ballY = 0;
    }

    // const paddleTop = this.gameBoard.offsetHeight - this.paddleHeight;
    // // Paddle collision
    // const ballCenterX = this.ballX + this.ballSize / 2;
    // const ballBottom = this.ballY + this.ballSize;

    const ballRect = this.ball.getBoundingClientRect();
    const paddleRect = this.paddle.getBoundingClientRect();
    
    
    if (
      paddleRect.left < ballRect.right &&
      paddleRect.top < ballRect.bottom &&
      paddleRect.right > ballRect.left &&
      paddleRect.bottom > ballRect.top && // i should add a condition for the bottom collession between the ball and paddle 
      this.ballSpeedY > 0
    ) {
       
      const hitPosition = (ballRect.left + ballRect.width / 2) - (paddleRect.left + paddleRect.width / 2);
      const normalizedHit = hitPosition / (paddleRect.width / 2);
      const bounceAngle = normalizedHit * Math.PI / 3;

      const speed = 5;
      this.ballSpeedX = speed * Math.sin(bounceAngle);
      this.ballSpeedY = -speed * Math.cos(bounceAngle);
    }

    // Bottom collision 
    if (this.ballY + this.ballSize >= this.gameBoard.offsetHeight) {
      this.lives--;
      this.updateStats();

      if (this.lives <= 0) {
        this.gameOver();
        return;
      } else {
        // Reset 
        this.ballX = this.gameBoard.offsetWidth / 2 - this.ballSize / 2;
        this.ballY = this.gameBoard.offsetHeight - 100;
        this.paddleX = (this.gameBoard.offsetWidth - this.paddleWidth) / 2;
        this.ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.ballSpeedY = -4;
      }
    }

    // Brick collision 
    let bricksRemaining = 0;
    for (let brick of this.bricks) {
      if (brick.destroyed) continue;
      bricksRemaining++;

      const bx = brick.x;
      const by = brick.y;
      const bw = brick.width;
      const bh = brick.height;

      const ballLeft = this.ballX;
      const ballRight = this.ballX + this.ballSize;
      const ballTop = this.ballY;
      const ballBottom = this.ballY + this.ballSize;

      const brickLeft = bx;
      const brickRight = bx + bw;
      const brickTop = by;
      const brickBottom = by + bh;

      const isColliding =
        ballRight > brickLeft &&
        ballLeft < brickRight &&
        ballBottom > brickTop &&
        ballTop < brickBottom;

      if (isColliding) {
        brick.destroyed = true;
        brick.element.classList.add('destroyed');
        this.score += 10 * this.level;
        this.updateStats();

        const prevBallX = this.ballX - this.ballSpeedX;
        const prevBallY = this.ballY - this.ballSpeedY;
        const prevBallRight = prevBallX + this.ballSize;
        const prevBallBottom = prevBallY + this.ballSize;

        const hitFromTop = prevBallBottom <= brickTop;
        const hitFromBottom = prevBallY >= brickBottom;
        const hitFromLeft = prevBallRight <= brickLeft;
        const hitFromRight = prevBallX >= brickRight;

        if (hitFromTop || hitFromBottom) {
          this.ballSpeedY = -this.ballSpeedY;
        } else if (hitFromLeft || hitFromRight) {
          this.ballSpeedX = -this.ballSpeedX;
        } else {
          this.ballSpeedY = -this.ballSpeedY;
        }

        break; // Only handle one brick per frame
      }
    }

    if (bricksRemaining === 0) {
      this.levelComplete();
      return;
    }

    this.ball.style.left = `${this.ballX}px`;
    this.ball.style.top = `${this.ballY}px`;

    const paddleSpeed = 7;
    if (this.rightPressed) {
      this.paddleX = Math.min(this.paddleX + paddleSpeed, this.gameBoard.offsetWidth - this.paddleWidth);
    }
    if (this.leftPressed) {
      this.paddleX = Math.max(this.paddleX - paddleSpeed, 0);
    }
    this.paddle.style.transform = `translateX(${this.paddleX  - this.gameBoard.offsetWidth/2 + this.paddleWidth}px)`;
    // this.paddle.style.left = `${this.paddleX+this.paddleWidth /2}px`

    requestAnimationFrame(() => this.gameLoop());
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    } else if (e.key === ' ') {
      this.togglePause();
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }


}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});