import { Player } from "./player.js";
import { LevelMap } from "./level-map.js";

export class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.player = new Player();
        this.map = new LevelMap(this.container);

        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.gemsCollected = 0;
        this.totalGems = 0;
        this.laserBlocks = [];

        this.scoreElement = document.getElementById("score") || this.createScoreElement();
        this.livesElement = document.getElementById("lives") || this.createLivesElement();

        document.addEventListener('shoot-fireball', (e) => this.createFireball(e.detail));

        this.loadLevel(1);

        this.gameLoop();
    }

    createScoreElement() {
        const scoreElement = document.createElement("div");
        scoreElement.id = "score";
        scoreElement.textContent = "Score: 0";
        scoreElement.classList.add("game-ui");
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    createLivesElement() {
        const livesElement = document.createElement("div");
        livesElement.id = "lives";
        livesElement.textContent = "Lives: 3";
        livesElement.classList.add("game-ui");
        document.body.appendChild(livesElement);
        return livesElement;
    }

    loadLevel(levelNumber) {
        this.clearLevel();

        if (levelNumber === 1) {
            this.map.loadLevel1();
            this.totalGems = this.map.collectibles.length;

            const laserBlock1 = this.map.createLaserBlock(600, 400, 'vertical');
            this.laserBlocks.push(laserBlock1);

            // Start laser cycles
            this.laserBlocks.forEach(block => block.startLaserCycle());
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

        this.map.updateFireballs();

        const mapCollisions = this.map.checkCollisions(this.player);

        this.player.move(mapCollisions);
        this.player.updatePosition();

        if (mapCollisions.type === "collectible") {
            this.gemsCollected++;

            let points = 10;
            if (mapCollisions.item.type === "yellow-gem") points = 20;
            if (mapCollisions.item.type === "red-gem") points = 30;
            if (mapCollisions.item.type === "blue-gem") points = 50;

            this.updateScore(points);
        } else if (mapCollisions.type === "exit") {
            if (this.gemsCollected >= this.totalGems) {
                this.levelComplete();
            }
        } else if (mapCollisions.type === "laser-hit") {
            console.log('Laser hit detected! Reducing lives.');
            this.updateLives(-1);
            // need to respawn the player on the start 
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    levelComplete() {
        const levelCompleteElement = document.createElement("div");
        levelCompleteElement.classList.add("level-complete");
        levelCompleteElement.innerHTML = `
            <h2>Level Complete!</h2>
            <p>Score: ${this.score}</p>
            <p>Gems Collected: ${this.gemsCollected}/${this.totalGems}</p>
            <button id="next-level">Next Level</button>
        `;

        this.container.appendChild(levelCompleteElement);

        this.isGameOver = true;

        document.getElementById("next-level").addEventListener("click", () => {
            levelCompleteElement.remove();
            this.isGameOver = false;
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

    createFireball(detail) {
        console.log('Creating fireball:', detail);
        this.map.createFireball(detail.x, detail.y, detail.direction);
    }

    clearLevel() {
        this.laserBlocks.forEach(block => {
            block.stopLaserCycle();
            if (block.element && block.element.parentNode) {
                this.container.removeChild(block.element);
            }
            if (block.rayElement && block.rayElement.parentNode) {
                this.container.removeChild(block.rayElement);
            }
        });
        this.laserBlocks = [];

        this.map.clearMap();
    }
}