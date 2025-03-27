import { Player } from "./player.js";
import { LevelMap } from "./level-map.js";

export class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        if (!this.container) {
            console.error("Game container not found!");
            return;
        }

        // Initialize game elements
        this.map = new LevelMap(this.container);
        this.player = new Player(this.container);
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.gemsCollected = 0;
        this.totalGems = 0;
        this.currentLevel = 1;

        // UI Elements
        this.scoreElement = document.getElementById("score") || this.createUIElement("score", "Score: 0", "10px", "10px");
        this.livesElement = document.getElementById("lives") || this.createUIElement("lives", "Lives: 3", "10px", "10px", true);

        // Event listeners
        document.addEventListener('shoot-fireball', (e) => this.handleFireball(e.detail));
        window.addEventListener('resize', () => this.handleResize());

        // Start the game
        this.loadLevel(this.currentLevel);
        this.gameLoop();
    }

    createUIElement(id, text, left, top, isRight = false) {
        const element = document.createElement("div");
        element.id = id;
        element.textContent = text;
        element.classList.add("game-ui");
        element.style.left = isRight ? "" : left;
        element.style.right = isRight ? left : "";
        element.style.top = top;
        document.body.appendChild(element);
        return element;
    }

    loadLevel(levelNumber) {
        this.clearLevel();
        this.currentLevel = levelNumber;
        this.gemsCollected = 0;

        if (levelNumber === 1) {
            this.map.loadLevel1();
            this.totalGems = this.map.collectibles.length;
        } else if (levelNumber === 2) {
            this.map.loadLevel2();
            this.totalGems = this.map.collectibles.length;
        }

        this.player.reset();
    }

    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    updateLives(change) {
        this.lives += change;
        this.livesElement.textContent = `Lives: ${this.lives}`;

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameLoop() {
        if (this.isGameOver) return;

        // Update game elements
        this.map.updateFireballs();

        // Check collisions
        const collisions = this.map.checkCollisions(this.player);

        // Handle collisions
        this.handleCollisions(collisions);

        // Update player        
        this.player.move(collisions);
        this.player.updatePosition();

        requestAnimationFrame(() => this.gameLoop());
    }

    handleCollisions(collisions) {
        if (collisions.type === "laser-hit") {
            this.updateLives(-1);
            this.player.reset();
        } else if (collisions.type === "collectible") {
            this.handleCollectible(collisions.item);
        } else if (collisions.type === "exit") {
            if (this.gemsCollected >= this.totalGems) {
                this.levelComplete();
            }
        }
    }

    handleCollectible(item) {
        this.gemsCollected++;
        
        let points = 10;
        if (item.type === "yellow-gem") points = 20;
        if (item.type === "red-gem") points = 30;
        if (item.type === "blue-gem") points = 50;

        this.updateScore(points);
    }

    handleFireball(detail) {
        this.map.createFireball(detail.x, detail.y, detail.direction);
    }

    handleResize() {
        // Recalculate positions and sizes
        this.map.handleResize();
        this.player.updateSizes();
        this.player.updatePosition();
    }

    levelComplete() {
        this.isGameOver = true;

        const levelCompleteElement = document.createElement("div");
        levelCompleteElement.classList.add("level-complete");
        levelCompleteElement.innerHTML = `
            <h2>Level Complete!</h2>
            <p>Score: ${this.score}</p>
            <p>Gems Collected: ${this.gemsCollected}/${this.totalGems}</p>
            <button id="next-level">Next Level</button>
        `;

        this.container.appendChild(levelCompleteElement);

        document.getElementById("next-level").addEventListener("click", () => {
            levelCompleteElement.remove();
            this.isGameOver = false;
            this.loadLevel(2); // Load next level
            this.gameLoop();
        });
    }

    gameOver() {
        this.isGameOver = true;

        const gameOverElement = document.createElement("div");
        gameOverElement.classList.add("game-over");
        gameOverElement.innerHTML = `
            <h2>Game Over</h2>
            <p>Final Score: ${this.score}</p>
            <button id="restart-game">Play Again</button>
        `;

        this.container.appendChild(gameOverElement);

        document.getElementById("restart-game").addEventListener("click", () => {
            gameOverElement.remove();
            this.resetGame();
        });
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.gemsCollected = 0;

        this.updateScore(0);
        this.updateLives(0);

        this.loadLevel(1);
        this.gameLoop();
    }

    clearLevel() {
        this.map.clearMap();
    }
}