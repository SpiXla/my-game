import Ship from "./ship.js";
import Waves from "./levels.js";

export default class Game {
    constructor() {
        this.wordGroup = 10;
        this.waves = 1;
        this.currentwave = 0;
        this.timer = 1000000;
        this.ispaused = false; // Pause state
        this.createContainer();
        this.buttonListen();
        this.levels = null;
    }

    p = (e) => {
        console.log(e.key);
        if (e.key == "Escape") {
            this.ispaused = !this.ispaused;
            if (this.ispaused) {
                // Pause the game
                const menu = document.createElement("div");
                menu.classList.add("menu");
                this.container.append(menu);

                const continueBtn = document.createElement("button");
                continueBtn.classList.add("ctn-btn");
                continueBtn.textContent = "Continue";
                
                const check = () => {
                    this.ispaused = false;
                    menu.remove();
                    removeEventListener("click",check)
                }
                continueBtn.addEventListener("click", check);

                const restartBtn = document.createElement("button");
                continueBtn.classList.add("rstr-btn");
                restartBtn.textContent = "Restart";
                restartBtn.addEventListener("click", () => {
                    document.body.innerHTML = ""
                    this.resetGame()
                    // ngame.gameStart();
                });

                menu.append(continueBtn);
                menu.append(restartBtn);
            } else {
                // Resume the game
                const m = document.querySelector(".menu");
                if (m) {
                    m.remove();
                }
            }
        }
    }

    pauseGame() {
        document.addEventListener("keydown", this.p);
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
        // this.resetGame();
        this.container.innerHTML = "";
        this.pauseGame(); // Add pause functionality
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

    hh =  () => {this.gameStart()}

    resetGame() {
        removeEventListener("click",this.hh)
        removeEventListener("keydown",this.p)
        document.body.innerHTML = ""
        this.wordGroup = 10;
        this.waves = 1;
        this.currentwave = 0;
        this.timer = 1000000;
        this.ispaused = false; // Pause state
        this.createContainer();
        this.buttonListen();
        this.levels = null;
    }

    buttonListen() {
        this.startbtn = document.createElement("button");
        this.startbtn.textContent = "Start Game";
        this.startbtn.className = "startbtn";
        this.container.append(this.startbtn);

        this.startbtn.addEventListener("click",this.hh);
    }
}