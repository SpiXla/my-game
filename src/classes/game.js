import Ship from "./ship.js"
import waves from "./levels.js"

export default class Game {
    constructor(){
        this.wordGroup = 10
        this.waves = 10
        this.currentwave = 0
        this.timer = 10000
        this.buttonListen()
    }

    gameStart(){
        document.body.innerHTML = ""
        this.ship = new Ship()
        this.startwaves()
    }

    startwaves() {
        this.delay = 2000
        this.levels = new waves(this.timer,this.wordGroup)
        this.wordGroup++
        this.currentwave++
        setTimeout(()=>{
            const checkForWords = () => {
                const ships = document.querySelectorAll(".alive").length
                if (ships == 0) {
                    this.startwaves()
                }
            }
            const intervalId = setInterval(checkForWords, this.delay);
            
            setTimeout(() => {
                clearInterval(intervalId);
            }, this.timer-this.delay);
        },this.delay)
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