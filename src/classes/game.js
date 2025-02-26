import Ship from "./ship.js";
import Waves from "./levels.js";

export default class Game {
    constructor() {
        this.wordGroup = 10;
        this.waves = 1;
        this.currentwave = 0;
        this.timer = 1000000;
        this.createContainer();
        this.buttonListen();
        this.levels = null; // Declare levels here to maintain a single instance
    }

    createContainer() {
        if (document.querySelector(".container") == null) {
            this.container = document.createElement("div");
            this.container.classList.add("container");
            this.container.id = "container";
            document.body.append(this.container);
        } else {
            this.container = document.querySelector(".container");
        }
    }

    gameStart() {
        this.resetGame(); // Reset game state before starting
        this.container.innerHTML = "";
        this.tyara = new Ship(); // Create the ship instance
        this.levels = new Waves(this.timer, this.wordGroup, this.tyara); // Create waves instance        
        // this.startWaves();
    }

    // startWaves() {
    //     if (this.levels.IsGameOver) {
    //         console.log('mamak');
            
    //         this.lost();
    //         return;
    //     }

    //     this.wordGroup++;
    //     this.currentwave++;
    //     if (this.currentwave === 10) {
    //         this.wonGame();
    //         return;
    //     }
    //     this.timer += 1000;

    //     setTimeout(() => {
           

    //         const intervalId = setInterval(() => {
    //             const words = document.querySelectorAll(".word").length;
    //             if (words === 0) {
    //                 clearInterval(intervalId);
    //                 this.wonWave();
    //             }
    //         }, this.delay);

    //         const timeoutId = setTimeout(() => {
    //             clearInterval(intervalId);
    //             const words = document.querySelectorAll(".word").length;
    //             if (words > 0) {
    //                 console.log('mmm');
                    
    //                 this.levels.lost(); // Set the game over state in the levels instance
    //                 this.lost();
    //             }
    //         }, this.timer - this.delay);
    //     }, this.delay);
    // }

    wonGame() {
        this.container.innerHTML = "";
        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = "YOU Win Congrats!!!";
        this.resetGame();
    }

    lost() {
        this.container.innerHTML = "";
        const lostMessage = document.createElement("div");
        lostMessage.classList.add("won-wave");
        this.container.append(lostMessage);
        lostMessage.textContent = "YOU LOST";
        this.resetGame();
    }

    wonWave() {
        const existingWon = document.querySelector(".won-wave");
        const ship = document.querySelector(".ship");
        const timerElement = document.querySelector(".timer");

        // Clean up elements
        if (ship) ship.remove();
        if (timerElement) timerElement.remove();
        if (existingWon) existingWon.remove();

        // Create wave clear message
        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = `WAVE 000${this.currentwave} CLEAR`;

        // Clean container but keep the won message
        setTimeout(() => {
            won.remove();
            // Clear any remaining elements from previous wave
            const words = document.querySelectorAll(".word");
            words.forEach(word => {
                const parentDiv = word.parentNode;
                if (parentDiv) parentDiv.remove();
            });

            if (this.currentwave < 10) {
                this.startWaves(); // Start next wave
            } else {
                console.log("All waves completed!");
            }
        }, 3000);
    }

    resetGame() {
        this.wordGroup = 10; // Reset word group
        this.currentwave = 0; // Reset current wave
        this.timer = 1000000; // Reset timer
        this.levels = null; // Reset levels to allow new instance creation on the next game start
    }

    buttonListen() {
        this.startbtn = document.createElement("button");
        this.startbtn.textContent = "Start Game";
        this.startbtn.className = "startbtn";
        this.container.append(this.startbtn);
        this.startbtn.addEventListener("click", () => this.gameStart());
    }
}
