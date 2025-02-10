class Duck {
    constructor() {
        this.duck = document.createElement("img")
        this.duck.src = "images/duck.gif"
        this.duck.style.width = "100px"
        this.duck.style.height = "100px"
        document.body.append(this.duck)
        this.randomPos()
    }
    randomPos() {
        let x 
        let y
        const n = Math.floor(Math.random() * 4) + 1
        switch (n) {
            case 1:
                x = 0
                y = Math.floor(Math.random() * window.innerHeight) + 1
                break
            case 2:
                x = window.innerWidth - 100 
                y = Math.floor(Math.random() * window.innerHeight) + 1
                break
                case 3:
                    x = Math.floor(Math.random() * window.innerWidth) + 1
                    y = 0
                    break
                case 4:
                x = Math.floor(Math.random() * window.innerWidth) + 1
                y = window.innerHeight - 100
                break
            }
            if (y==window.innerHeight){
                y -= 100
            }
            if (x==window.innerWidth){
                x -= 100
            }
        console.log(n,x,y);
        this.duck.style.position = "absolute"
        this.duck.style.left = x + 'px';
        this.duck.style.top = y + 'px';    
    }
}


class Game {
    gameStart(){
        this.startbtn.style.display = "none"
        this.duck = new Duck()
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
game.buttonListen()