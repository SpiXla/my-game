export default class Ship {
    constructor() {
        this.duck = document.createElement("img")
        this.duck.classList.add("ship")
        this.duck.classList.add("alive")
        this.duck.src = "../../assets/shipOne.png"
        this.duck.style.width = "50px"
        this.duck.style.height = "50px"
        document.body.append(this.duck)
        this.duck.style.position = "absolute"
        this.duck.style.left = Math.floor(document.width/2) + 'px';
        this.duck.style.top =  window.innerHeight - 150 + 'px'; 
    }
}