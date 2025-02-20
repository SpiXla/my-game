// ship.js
export default class Ship {
    constructor() {
        this.element = document.createElement("div");
        this.ship = document.createElement("img")
        this.ship.classList.add("ship");
        this.ship.classList.add("alive")
        this.ship.src = "../../assets/shipOne.png"
        this.ship.style.position = "absolute";
        this.ship.style.left = "50%"; // Center the ship horizontally
        this.ship.style.bottom = "20px"; // Position the ship near the bottom
        this.ship.style.width = "50px"; // Set the size of the ship
        this.ship.style.height = "50px";
        this.ship.style.zIndex ="1"
        this.element.append(this.ship)
        // this.element.style.backgroundColor = "blue"; // Placeholder for ship appearance
        document.body.append(this.element);
    }

    takeDamage() {
        console.log("Ship took damage!");
        // Add logic for handling ship damage (e.g., reduce health, game over, etc.)
    }
}


// constructor() {
//     this.duck = document.createElement("img")
//     this.duck.classList.add("ship")
//     this.duck.classList.add("alive")
//     this.duck.src = "../../assets/shipOne.png"
//     this.duck.style.width = "50px"
//     this.duck.style.height = "50px"
//     document.body.append(this.duck)
//     this.duck.style.position = "absolute"
//     this.duck.style.left = Math.floor(document.width/2) + 'px';
//     this.duck.style.top =  window.innerHeight - 150 + 'px'; 
//     // this.randomPos()

//     //this.animateDuck()

//     // this.duck.addEventListener("click", ()=> this.shootedDuck())
// }