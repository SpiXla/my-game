import { Player } from "./player.js";
import { LevelMap } from "./level-map.js";

export class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.player = new Player();
        this.map = new LevelMap(this.container);
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.gemsCollected = 0;
        this.totalGems = 0;
        
        // UI elements
        this.scoreElement = document.getElementById("score") || this.createScoreElement();
        this.livesElement = document.getElementById("lives") || this.createLivesElement();
        
        // Load first level
        this.loadLevel(1);
        
        // Start game loop
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
        if (levelNumber === 1) {
            this.map.loadLevel1();
            this.totalGems = this.map.collectibles.length;
        }
        
        // Reset player position for the new level
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
        
        // Check map collisions first
        const mapCollisions = this.map.checkCollisions(this.player);
        
        // Update player with collision info
        this.player.move(mapCollisions);
        this.player.updatePosition();
        
        // Check for collectibles or reaching exit
        if (mapCollisions.type === "collectible") {
            this.gemsCollected++;
            
            // Different gems give different points
            let points = 10;
            if (mapCollisions.item.type === "yellow-gem") points = 20;
            if (mapCollisions.item.type === "red-gem") points = 30;
            if (mapCollisions.item.type === "blue-gem") points = 50;
            
            this.updateScore(points);
            
            // Play collection sound effect
            // this.playSound("collect");
        } else if (mapCollisions.type === "exit") {
            if (this.gemsCollected >= this.totalGems) {
                // Level complete!
                this.levelComplete();
            } else {
                // Need more gems!
                // Maybe show a message
            }
        }
        
        // Check for falling out of the map
        if (this.player.y > this.container.clientHeight) {
            this.updateLives(-1);
            this.player.reset();
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
        
        // Pause the game
        this.isGameOver = true;
        
        // Add event listener for next level button
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
        
        // Add event listener for restart button
        document.getElementById("restart-game").addEventListener("click", () => {
            gameOverElement.remove();
            this.resetGame();
        });
    }
    
    resetGame() {
        // Reset game state
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.gemsCollected = 0;
        
        // Update UI
        this.updateScore(0);
        this.updateLives(0);
        
        // Load first level
        this.loadLevel(1);
        
        // Restart game loop
        this.gameLoop();
    }
    
    playSound(type) {
        // Simple sound implementation
        // Could be expanded with actual audio files
        console.log(`Playing ${type} sound`);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
});