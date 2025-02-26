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
        this.levels = null;
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
        this.resetGame();
        this.container.innerHTML = "";
        this.tyara = new Ship();
        this.levels = new Waves(this.timer, this.wordGroup, this.tyara);
    }

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
        
        if (ship) ship.remove();
        if (timerElement) timerElement.remove();
        if (existingWon) existingWon.remove();

        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = `WAVE 000${this.currentwave} CLEAR`;

        setTimeout(() => {
            won.remove();
            
            const words = document.querySelectorAll(".word");
            words.forEach(word => {
                const parentDiv = word.parentNode;
                if (parentDiv) parentDiv.remove();
            });
            
            if (this.currentwave < 10) {
                this.startWaves();
            } else {
                console.log("All waves completed!");
            }
        }, 3000);
    }

    resetGame() {
        this.wordGroup = 10;
        this.currentwave = 0;
        this.timer = 1000000;
        this.levels = null;
    }

    buttonListen() {
        this.startbtn = document.createElement("button");
        this.startbtn.textContent = "Start Game";
        this.startbtn.className = "startbtn";
        this.container.append(this.startbtn);
        this.startbtn.addEventListener("click", () => this.gameStart());
    }
}