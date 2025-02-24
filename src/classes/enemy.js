// import { Word } from "./word.js";
// enemy.js
export default class Enemy {
    constructor(ship) {
        this.ship = ship; // Reference to the player's ship
        this.speed = 2; // Speed of the enemy movement
        this.chacha = document.getElementById("container")    
        this.container = document.createElement("div");
        this.container.classList.add("enemy_container")
        this.element = document.createElement("img");
        this.element.classList.add("enemy", "alive");
        this.element.src = " ../../assets/mine.png"; // Replace with the path to your enemy image
        this.element.style.position = "absolute";
        this.element.style.width = "50px"; // Set the size of the enemy
        this.element.style.height = "50px";
        this.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Random X position
        this.element.style.top = `-50px`; // Start above the screen
        this.container.append(this.element);
        this.chacha.append(this.container);

        // Add a click event to "destroy" the enemy
        this.element.addEventListener("click", () => {
            this.destroy();
        });

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
            if (this.element.classList.contains("alive")) {
                // Get the current position of the enemy
                const currentLeft = parseFloat(this.element.style.left);
                const currentTop = parseFloat(this.element.style.top);

                // Get the ship's position
                const shipRect = this.ship.element.getBoundingClientRect();
                const shipX = shipRect.left; // Left edge of the ship
                const shipY = shipRect.top; // Top edge of the ship

                // Calculate the direction vector
                const dx = shipX - currentLeft; // Move toward the ship's left edge
                const dy = shipY - currentTop; // Move toward the ship's top edge
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Normalize the direction vector
                const directionX = dx / distance;
                const directionY = dy / distance;

                // Update the enemy's position
                this.element.style.left = `${currentLeft + directionX * this.speed}px`;
                this.element.style.top = `${currentTop + directionY * this.speed}px`;

                // Check if the enemy has touched the top of the ship
                const enemyRect = this.element.getBoundingClientRect();
                if (
                    enemyRect.left < shipRect.right && // Enemy is to the left of the ship's right edge
                    enemyRect.right > shipRect.left && // Enemy is to the right of the ship's left edge
                    enemyRect.bottom >= shipRect.top // Enemy's bottom has reached the ship's top
                ) {
                    // Enemy has touched the top of the ship
                    this.destroy(); // Destroy the enemy
                    this.ship.disappear(); // Make the ship disappear
                } else {
                    // Continue moving
                    requestAnimationFrame(moveEnemy);
                }
            }
        };

        // Start the animation
        moveEnemy();
    }
}