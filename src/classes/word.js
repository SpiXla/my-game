export let words = [
    "apple", "beta", "cake", "data", "echo", "fire", "game", "halo", "icon", "jazz",
    "kite", "lamp", "moon", "note", "open", "palm", "quiz", "rose", "star", "tide",
    "unit", "vote", "wave", "xray", "yoga", "zinc", "atom", "bird", "coin", "dive",
    "edit", "fuel", "glow", "hope", "iris", "jump", "knot", "leaf", "mint", "nova",
    "oval", "peak", "quip", "ruby", "ship", "turn", "user", "void", "wind", "xeno",
    "yarn", "zest", "arch", "blue", "core", "dual", "edge", "flow", "grid", "heat",
    "idea", "java", "kind", "loop", "meta", "node", "open", "path", "quiz", "rate",
    "site", "test", "unix", "view", "word", "xray", "year", "zero", "acid", "beam",
    "cool", "dash", "envy", "fizz", "glue", "hype", "iced", "jolt", "keel", "limb"
]


export class Word {
    constructor(content) {
        this.ship = document.querySelector('.ship');
        // console.log(this.ship);
        this.container = document.getElementById("container")
        this.div = document.createElement("div");
        this.div.style.width = '70px'
        this.div.style.height = '70px'
        this.div.classList.add("enemy_container")
        this.enemy = document.createElement('img')
        this.enemy.classList.add("enemy", "alive");
        this.enemy.src = " ../../assets/mine.png"; // Replace with the path to your enemy image
        this.enemy.style.position = "absolute";
        this.enemy.style.width = "50px"; // Set the size of the enemy
        this.enemy.style.height = "50px";
        this.div.append(this.enemy)
        this.word = document.createElement("div")
        // this.word.style.position = "absolute";
        this.word.classList.add("word")
        this.word.textContent = content
        this.div.append(this.word)
        this.container.append(this.div)
        this.randomPos()
        this.move()
    }

    randomPos() {
        //  const shipRect = this.ship.getBoundingClientRect();
        let x; let y
        x = Math.floor(Math.random() * (this.container.offsetWidth - 50))
        y = 0
        this.div.style.position = "absolute"
        this.div.style.left = x + 'px'
        this.div.style.top = y + 'px'

    }

    move() {
        const moveEnemy = () => {
            if (this.div) {
                this.speed = 2
                // Get the container's position
                const containerRect = this.container.getBoundingClientRect();

                // Get the current position of the enemy relative to the container
                const currentLeft = parseFloat(this.div.style.left);
                const currentTop = parseFloat(this.div.style.top);

                // Get the ship's position relative to the container
                const shipRect = this.ship.getBoundingClientRect();
                const shipX = shipRect.left - containerRect.left; // Relative to container
                const shipY = shipRect.top - containerRect.top; // Relative to container

                // Calculate the direction vector
                const dx = shipX - currentLeft;
                const dy = shipY - currentTop;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Normalize the direction vector
                const directionX = dx / distance;
                const directionY = dy / distance;

                // Update the enemy's position
                this.div.style.left = `${currentLeft + directionX * this.speed}px`;
                this.div.style.top = `${currentTop + directionY * this.speed}px`;

                // Get the enemy's position relative to the container
                const enemyRect = this.div.getBoundingClientRect();
                const enemyLeft = enemyRect.left - containerRect.left;
                const enemyRight = enemyRect.right - containerRect.left;
                const enemyBottom = enemyRect.bottom - containerRect.top;

                // Check if the enemy has touched the ship
                if (
                    enemyLeft < shipRect.right - containerRect.left && // Enemy is to the left of the ship's right edge
                    enemyRight > shipRect.left - containerRect.left && // Enemy is to the right of the ship's left edge
                    enemyBottom >= shipRect.top - containerRect.top // Enemy's bottom has reached the ship's top --> MIGHT WANNA CHECK bottom
                ) {
                    this.destroy(); // Destroy the enemy
                    // this.ship.disappear(); // Make the ship disappear
                } else {                    
                    requestAnimationFrame(moveEnemy);
                }
            }
        };

        moveEnemy(); // Start the animation
    }
}


// // import { Word } from "./word.js";
// // enemy.js
export default class Enemy {
    constructor() {
        this.ship = document.querySelector('.ship'); // Reference to the player's ship
        console.log(ship);

        this.speed = 2; // Speed of the enemy movement
        this.chacha = document.getElementById("container")

        this.element = document.createElement("img");
        this.element.classList.add("enemy", "alive");
        this.element.src = " ../../assets/mine.png"; // Replace with the path to your enemy image
        this.element.style.position = "absolute";
        this.element.style.width = "50px"; // Set the size of the enemy
        this.element.style.height = "50px";
        // this.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Random X position
        // this.element.style.top = `-50px`; // Start above the screen
        this.container.append(this.element);
        this.chacha.append(this.container);
        // Start moving the enemy toward the ship
        this.move();
    }

    // Method to destroy the enemy
    destroy() {
        if (this.element.classList.contains("alive")) {
            this.element.classList.remove("alive");
            this.element.src = "../../assets/explosion-huge.jpg"; // Replace with the path to your explosion image
            setTimeout(() => this.element.remove(), 500); // Remove after explosion
        }
    }

    // Method to move the enemy toward the ship
    move() {
        const moveEnemy = () => {
            if (this.word) {
                // Get the container's position
                const containerRect = this.container.getBoundingClientRect();

                // Get the current position of the enemy relative to the container
                const currentLeft = parseFloat(this.word.style.left);
                const currentTop = parseFloat(this.word.style.top);

                // Get the ship's position relative to the container
                const shipRect = this.ship.getBoundingClientRect();
                const shipX = shipRect.left - containerRect.left; // Relative to container
                const shipY = shipRect.top - containerRect.top; // Relative to container

                // Calculate the direction vector
                const dx = shipX - currentLeft;
                const dy = shipY - currentTop;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Normalize the direction vector
                const directionX = dx / distance;
                const directionY = dy / distance;

                // Update the enemy's position
                this.word.style.left = `${currentLeft + directionX * this.speed}px`;
                this.word.style.top = `${currentTop + directionY * this.speed}px`;

                // Get the enemy's position relative to the container
                const enemyRect = this.word.getBoundingClientRect();
                const enemyLeft = enemyRect.left - containerRect.left;
                const enemyRight = enemyRect.right - containerRect.left;
                const enemyBottom = enemyRect.bottom - containerRect.top;

                // Check if the enemy has touched the ship
                if (
                    enemyLeft < shipRect.right - containerRect.left && // Enemy is to the left of the ship's right edge
                    enemyRight > shipRect.left - containerRect.left && // Enemy is to the right of the ship's left edge
                    enemyBottom >= shipRect.top - containerRect.top // Enemy's bottom has reached the ship's top
                ) {
                    this.destroy(); // Destroy the enemy
                    this.ship.disappear(); // Make the ship disappear
                } else {
                    requestAnimationFrame(moveEnemy);
                }
            }
        };

        moveEnemy(); // Start the animation
    }
}    
