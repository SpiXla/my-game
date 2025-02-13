class Duck {
    constructor() {
        this.duck = document.createElement("img")
        this.duck.classList.add("duck")
        this.duck.classList.add("alive")
        this.duck.src = "images/duck.gif"
        this.duck.style.width = "100px"
        this.duck.style.height = "100px"
        document.body.append(this.duck)
        this.randomPos()

        //this.animateDuck()

        this.duck.addEventListener("click", ()=> this.shootedDuck())
    }

    shootedDuck(){
        this.duck.src = "images/duck-hit.png"
        this.duck.classList.remove("alive")
        setTimeout(()=>{
            this.duck.src = "images/boog.gif"
            setTimeout(()=>{
                this.duck.remove()
            },500)
        },2000)
    }

    animateDuck(){
        // animi azbi
    }

    randomPos() {
        let x ;let y
        const n = Math.floor(Math.random() * 4) + 1
        switch (n) {
            case 1:
                x = 0
                y = Math.floor(Math.random() * (window.innerHeight - 250)) + 1
                break
            case 2:
                x = window.innerWidth - 100 
                y = Math.floor(Math.random() * (window.innerHeight- 250)) + 1
                break
                case 3:
                    x = Math.floor(Math.random() * (window.innerWidth - 100)) + 1
                    y = 0
                    break
                case 4:
                x = Math.floor(Math.random() * (window.innerWidth - 100)) + 1
                y = window.innerHeight - 250
                break
            }

        this.duck.style.position = "absolute"
        this.duck.style.left = x + 'px';
        this.duck.style.top = y + 'px';    
    }
}

class stages {
    constructor(rounds,shots,timer,duckNumber){
        this.rounds = rounds
        this.shots = shots
        this.timer = timer
        this.duckNumber = duckNumber
        this.shotUsed = 0;
        console.log(rounds,shots,timer,duckNumber);
        this.startStage()
    }

    lost(){
        this.resetGame()
        const lostMssg = document.createElement("p")
        lostMssg.classList.add("lost-p")
        lostMssg.innerText = "You Lost! Try Again!"
        document.body.append(lostMssg)
    }

    resetGame() {
        document.body.innerHTML = "";
        const game = new Game();
    }
    

    startStage(){
            this.startRound()
    }

    startRound() {
        this.rounds--
        for(let i = 0; i < this.duckNumber; i++){
            this.duck = new Duck()
        }
        setTimeout(()=>{
            window.addEventListener("click",()=>{
                shotUsed++
                console.log(this.shotUsed);
                if (this.shotUsed >= this.shots) {
                    const ducksN = document.querySelectorAll(".alive").length
                    if( ducksN > 0 ){
                        this.lost()
                    }else{
                        this.startRound()
                        
                    }
                }
            })
        },100)
    }

}
class stage1 extends stages {
    constructor(){
        super(3, 3, 5, 1); 
    }
    startRound() {
        super.startRound();
        if (this.rounds === 0) {
            this.currentStage = new stage2();
        }
    }
}
class stage2 extends stages {
    constructor(){
        super(4, 3, 5, 2);
    }
    startRound() {
        super.startRound();
        if (this.rounds === 0) {
            this.currentStage = new stage3();
        }
    }
}
class stage3 extends stages {
    constructor(){
        super(5, 4, 5, 4)
    }
    win() {
        document.body.innerHTML = "";
        const winMsg = document.createElement("p");
        winMsg.classList.add("win-p");
        winMsg.innerText = "You Win! Congratulations!";
        document.body.append(winMsg);
        const game = new Game();
    }
    startRound() {
        super.startRound();
        if (this.rounds === 0) {
            this.win();
        }
    }
}


class Game {
    constructor(){
        this.buttonListen()
    }

    gameStart(){
        const lost = document.querySelector(".lost-p")
        if (lost) {
            lost.remove()
        }
        this.startbtn.style.display = "none"
        this.currentStage = new stage1();
        // round shots timer dusckn
        // this.stage1 = new stages(3,3,5,1)
       
        // this.stage2 = new stages(4,3,5,2)
        // this.stage3 = new stages(5,4,5,4)
    }
    
    buttonListen() {
        this.startbtn = document.createElement("button")
        this.startbtn.textContent = "Start Game"
        this.startbtn.className = "startbtn"
        document.body.append(this.startbtn)
        this.startbtn.addEventListener("click", () => this.gameStart())
    }
}

const game = new Game()