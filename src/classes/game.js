import Stage1 from "./stages.js"

export default class Game {
    constructor(){
        this.buttonListen()
    }

    gameStart(){
        document.body.innerHTML = ""
        this.currentStage = new Stage1();
    }

    resetGame() {
        document.body.innerHTML = "";
        this.buttonListen();
    }

    
    buttonListen() {
        console.log('salam');
        
        this.startbtn = document.createElement("button")
        this.startbtn.textContent = "Start Game"
        this.startbtn.className = "startbtn"
        document.body.append(this.startbtn)
        this.startbtn.addEventListener("click", () => this.gameStart())
    }
}