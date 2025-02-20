export default class Duck {
    constructor() {
        this.duck = document.createElement("img")
        this.duck.classList.add("ship")
        this.duck.classList.add("alive")
        this.duck.src = "../../assets/shipOne.png"
        this.duck.style.width = "50px"
        this.duck.style.height = "50px"
        document.body.append(this.duck)
        this.randomPos()

        //this.animateDuck()

        this.duck.addEventListener("click", ()=> this.shootedDuck())
    }

    shootedDuck(){
        this.duck.src = "../../assets/duck-hit.png"
        this.duck.classList.remove("alive")
        setTimeout(()=>{
            this.duck.src = "../../assets/boog.gif"
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