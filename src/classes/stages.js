import Ship from "./ship.js"; // Represents the player
import Enemy from "./enemy.js"; // Represents the enemies
import Game from "./game.js";

class Stages {
    constructor(rounds, timer, enemiesNumber) {
        this.rounds = rounds;
        this.timer = timer;
        this.enemiesNumber = enemiesNumber; // Number of enemies
        this.enemies = []; // Array to store enemy instances
        this.ship = new Ship(); // Create the player's ship
        this.startStage(); // Start the stage (and the first round)
    }

    lost() {
        document.body.innerHTML = "";
        const lostMsg = document.createElement("p");
        lostMsg.classList.add("lost-p");
        lostMsg.innerText = "You Lost! Try Again!";
        document.body.append(lostMsg);
        this.resetGame();
    }

    resetGame() {
        const game = new Game(); // Restart the game
    }

    startStage() {
        this.startRound(); // Start the first round
    }

    wonRound() {
        this.rounds--;
        console.log(`Rounds left: ${this.rounds}`);
        if (this.rounds === 0) {
            this.proceedToNextStage(); // Proceed to the next stage
        } else {
            this.startRound(); // Start the next round
        }
    }

    proceedToNextStage() {
        // Override in child classes
    }

    // stages.js
    startRound() {
        // Clear existing enemies
        this.enemies.forEach(enemy => enemy.element.remove());
        this.enemies = [];

        // Create new enemies
        for (let i = 0; i < this.enemiesNumber; i++) {
            const enemy = new Enemy(this.ship); // Pass the ship reference
            this.enemies.push(enemy);
        }

        const handleClick = () => {
            const aliveEnemies = document.querySelectorAll(".enemy.alive").length;
            if (aliveEnemies === 0) {
                setTimeout(() => {
                    this.wonRound();
                }, 1500);
            }
        };

        setTimeout(() => {
            window.addEventListener("click", handleClick);
        }, 100);
    }
}

// Export Stage1 as the default export
export default class Stage1 extends Stages {
    constructor() {
        super(3, 5, 1); // 3 rounds, 5-second timer, 1 enemy
    }

    proceedToNextStage() {
        this.currentStage = new Stage2(); // Move to Stage 2
        this.currentStage.startStage();
    }
}

// Export Stage2 and Stage3 as named exports
export class Stage2 extends Stages {
    constructor() {
        super(4, 5, 2); // 4 rounds, 5-second timer, 2 enemies
    }

    proceedToNextStage() {
        this.currentStage = new Stage3(); // Move to Stage 3
        this.currentStage.startStage();
    }
}

export class Stage3 extends Stages {
    constructor() {
        super(5, 5, 4); // 5 rounds, 5-second timer, 4 enemies
    }

    proceedToNextStage() {
        this.win(); // Player wins the game
    }

    win() {
        document.body.innerHTML = "";
        const winMsg = document.createElement("p");
        winMsg.classList.add("win-p");
        winMsg.innerText = "You Win! Congratulations!";
        document.body.append(winMsg);
        const game = new Game(); // Restart the game
    }
}

// Start the game
function startGame() {
    const stage1 = new Stage1(); // Start with Stage 1
}

// Call startGame to begin the game
startGame();