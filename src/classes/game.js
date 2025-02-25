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
        this.startwaves()
    }

    startwaves() {
        this.tyara = new Ship();
        this.levels = new waves(this.timer, this.wordGroup,this.tyara);
        
        this.wordGroup++;
        this.currentwave++;
        if (this.currentwave == 10) {
            this.wonGame()
        }
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
    wonGame() {
        this.container.innerHTML = ""
        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = "YOU Win Congrats!!!";
        this.resetGame()
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
        const ship = document.querySelector(".ship");
        const existt = document.querySelector(".timer");
        
        // Clean up elements
        if (ship) ship.remove();
        if (existt) existt.remove();
        if (existingWon) existingWon.remove();
    
        // Create wave clear message
        const won = document.createElement("div");
        won.classList.add("won-wave");
        this.container.append(won);
        won.textContent = "WAVE 000" + this.currentwave + " CLEAR";
    
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