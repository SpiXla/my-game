class Duck {
    constructor() {
        this.duckElement = this.createDuck();
        console.log(this.duckElement);
        this.posX = Math.random() * (window.innerWidth - 100);
        this.posY = Math.random() * (window.innerHeight - 250);
        this.lastAngle = null;
        this.setRandomSpeed();
        this.animateDuck();
        this.listen()
    }

    listen() {
        this.duckElement.addEventListener("click",(e)=>{
            console.log("hhh");
        })
    }

    createDuck() {
        const duck = document.createElement("img");
        duck.src = "images/duck.gif";
        duck.style.height = "100px";
        duck.style.width = "100px";
        duck.style.position = "absolute";
        document.body.appendChild(duck);
        return duck;
    }

    setRandomSpeed() {
        let newAngle;
        do {
            newAngle = Math.random() * 2 * Math.PI;
        } while (this.lastAngle !== null && Math.abs(newAngle - this.lastAngle) < Math.PI / 4);
        
        this.lastAngle = newAngle;
        this.speedX = Math.cos(newAngle) * (Math.random() * 4 + 4);
        this.speedY = Math.sin(newAngle) * (Math.random() * 4 + 4);
        this.updateDirection();
    }

    updateDirection() {
        this.duckElement.style.transform = this.speedX > 0 ? "scaleX(1)" : "scaleX(-1)";
    }

    animateDuck() {
        const move = () => {
            this.posX += this.speedX;
            this.posY += this.speedY;
            
            if (this.posX <= 0 || this.posX >= window.innerWidth - 100) {
                this.posX = Math.max(1, Math.min(this.posX, window.innerWidth - 101)); 
                this.setRandomSpeed();
            }
            if (this.posY <= 0 || this.posY >= window.innerHeight - 250) {
                this.posY = Math.max(1, Math.min(this.posY, window.innerHeight - 251)); 
                this.setRandomSpeed();
            }

            this.duckElement.style.left = `${this.posX}px`;
            this.duckElement.style.top = `${this.posY}px`;

            requestAnimationFrame(move);
        };
        requestAnimationFrame(move);
    }
}

class Game {
    constructor() {
        this.startBtn = null;
        this.duck = null;
        this.initializeGame();
    }

    initializeGame() {
        this.createStartButton();
    }

    createStartButton() {
        this.startBtn = document.createElement("button");
        this.startBtn.id = "start-button";
        this.startBtn.textContent = "Start Game";
        document.body.appendChild(this.startBtn);
        this.startBtn.addEventListener("click", () => this.startGame());
    }

    startGame() {
        this.startBtn.remove();
        this.duck = new Duck();
    }
}

const game = new Game();
