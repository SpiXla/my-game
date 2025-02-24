import Ship from "./ship.js"
import waves from "./levels.js"

export default class Game {
    constructor() {
        this.wordGroup = 3
        this.waves = 10
        this.currentwave = 0
        this.timer = 10000;
        this.delay = 500;
        this.createContainer()
        this.buttonListen()
    }

    createContainer() {
        if (document.querySelector(".container") == null) {
            this.container = document.createElement("div")
            this.container.classList.add("container")
            this.container.id = "container"
            document.body.append(this.container)
        }else {
            this.container = document.querySelector(".container")
        }
    }

    gameStart() {
        this.container.innerHTML = ""
        this.ship = new Ship()
        this.startwaves()
    }

    startwaves() {
        this.levels = new waves(this.timer, this.wordGroup);
        this.wordGroup++;
        this.currentwave++;
        this.timer += 1000;
        setTimeout(() => {
            let intervalId;
            let timeoutId;
            const checkForWords = () => {
                const words = document.querySelectorAll(".word").length;
                if (words === 0) {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    this.wonWan();
                }
            };
            const handleWaveTimeout = () => {
                clearInterval(intervalId);
                const words = document.querySelectorAll(".word").length;
                if (words > 0) {
                    this.lost();
                }
            };

            intervalId = setInterval(checkForWords, this.delay);
            timeoutId = setTimeout(handleWaveTimeout, this.timer - this.delay);
        }, this.delay);
    }

    lost() {
        this.container.innerHTML = ""
        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = "YOU LOST";
        this.resetGame()
    }

    wonWan() {
        const existingWon = document.querySelector(".won-wave");
        document.querySelector(".timer").remove()
        if (existingWon) {
            existingWon.remove();
        }

        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = "WAVE 000" + this.currentwave + " CLEAR";

        setTimeout(() => {
            won.remove();
            if (this.currentwave < 10) {
                this.startwaves();
            } else {
                console.log("All waves completed!");
            }
        }, 3000);
    }

    resetGame() {
        const ngame = new Game()
    }


    buttonListen() {
        this.startbtn = document.createElement("button")
        this.startbtn.textContent = "Start Game"
        this.startbtn.className = "startbtn"
        this.container.append(this.startbtn)
        this.startbtn.addEventListener("click", () => this.gameStart())
    }
}