import Ship from "./ship.js"
import waves from "./levels.js"

export default class Game {
    constructor(){
        this.wordGroup = 3
        this.waves = 10
        this.currentwave = 0
        this.timer = 10500
        this.buttonListen()
    }

    gameStart(){
        document.body.innerHTML = ""
        this.ship = new Ship()
        this.startwaves()
    }

    startwaves() {
        this.delay = 500; 
        this.timer = 10000;
        this.levels = new waves(this.timer, this.wordGroup); 
        this.wordGroup++;
        this.currentwave++;
    
        setTimeout(() => {
            let intervalId;
    
            const checkForWords = () => {
                const ships = document.querySelectorAll(".word").length;
                if (ships == 0) {
                    clearInterval(intervalId); 
                    this.wonWan();
                }
            };
    
            intervalId = setInterval(checkForWords, this.delay);
    
            setTimeout(() => {
                clearInterval(intervalId); 
            }, this.timer - this.delay);
        }, this.delay);
    }
    
    wonWan() {
        const existingWon = document.querySelector(".won-wave");
        if (existingWon) {
            existingWon.remove();
        }
    
        const won = document.createElement("div");
        won.classList.add("won-wave");
        document.body.append(won);
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
        document.body.innerHTML = "";
        this.buttonListen();
    }

    
    buttonListen() {
        this.startbtn = document.createElement("button")
        this.startbtn.textContent = "Start Game"
        this.startbtn.className = "startbtn"
        document.body.append(this.startbtn)
        this.startbtn.addEventListener("click", () => this.gameStart())
    }
}