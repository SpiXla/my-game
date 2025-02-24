export default class Ship {
    constructor() {
        this.duck = document.createElement("img")
        this.duck.classList.add("ship")
        this.duck.classList.add("alive")
        this.duck.src = "../../assets/shipOne.png"
        this.duck.style.width = "50px"
        this.duck.style.height = "50px"
        this.container = document.getElementById("container")
        this.container.append(this.duck)
        this.duck.style.position = "absolute"
        this.duck.style.left = Math.floor(this.container.offsetWidth/2) -30 + 'px';
        this.duck.style.top =  this.container.offsetHeight - 100 + 'px'; 
    }
}