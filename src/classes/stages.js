import Ship from "./duck.js";
import Game from "./game.js";

class stages {
    constructor(rounds, ships, timer, shipsNumber) {
        this.rounds = rounds;
        this.ships = ships;
        this.timer = timer;
        this.shipsNumber = shipsNumber;
        this.shotUsed = 0;
        this.startStage();
    }

    lost() {
        document.body.innerHTML = "";
        const lostMssg = document.createElement("p");
        lostMssg.classList.add("lost-p");
        lostMssg.innerText = "You Lost! Try Again!";
        document.body.append(lostMssg);
        this.resetGame();
    }

    resetGame() {
        const game = new Game();
    }

    startStage() {
        this.startRound();
    }

    wonRound() {
        this.rounds--;
        console.log(`Rounds left: ${this.rounds}`);
        if (this.rounds === 0) {
            this.proceedToNextStage(); 
        } else {
            this.startRound();
        }
    }

    proceedToNextStage() {

    }

    startRound() {
        for (let i = 0; i < this.shipsNumber; i++) {
            this.duck = new Ship();
        }
        const handleClick = () => {
            this.shotUsed++;
            const ducksN = document.querySelectorAll(".alive").length;
            if (ducksN === 0) {
                setTimeout(() => {
                    this.wonRound();
                }, 1500);
            }

            if (this.shotUsed >= this.ship) {
                if (ducksN > 0) {
                    this.shotUsed = 0;
                    window.removeEventListener("click", handleClick);
                    this.lost();
                } else {
                    this.shotUsed = 0;
                    this.startRound();
                }
            }
        };
        setTimeout(() => {
            window.addEventListener("click", handleClick);
        }, 100);
    }
}

export class stage1 extends stages {
    constructor() {
        super(3, 3, 5, 1);
    }

    proceedToNextStage() {
        this.currentStage = new stage2();
        this.currentStage.startStage();
    }
}

export class stage2 extends stages {
    constructor() {
        super(4, 3, 5, 2);
    }

    proceedToNextStage() {
        this.currentStage = new stage3();
        this.currentStage.startStage();
    }
}

export class stage3 extends stages {
    constructor() {
        super(5, 4, 5, 4);
    }

    proceedToNextStage() {
        this.win();
    }

    win() {
        document.body.innerHTML = "";
        const winMsg = document.createElement("p");
        winMsg.classList.add("win-p");
        winMsg.innerText = "You Win! Congratulations!";
        document.body.append(winMsg);
        const game = new Game();
    }
}