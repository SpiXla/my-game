// enemy.js
export default class Enemy {
    constructor(ship) {
        this.ship = ship; // Reference to the player's ship
        this.speed = 2; // Speed of the enemy movement
        this.element = document.createElement("img");
        this.element.classList.add("enemy", "alive");
        this.element.src = "../../assets/mine.png"; // Replace with the path to your enemy image
        this.element.style.position = "absolute";
        this.element.style.width = "50px"; // Set the size of the enemy
        this.element.style.height = "50px";
        this.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Random X position
        this.element.style.top = `-50px`; // Start above the screen
        document.body.append(this.element);

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
            this.element.src = "path/to/explosion-image.png"; // Replace with the path to your explosion image
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
                const shipX = shipRect.left + 25; // Center of the ship (50px / 2 = 25px)
                const shipY = shipRect.top + 25; // Center of the ship (50px / 2 = 25px)

                // Calculate the direction vector
                const dx = shipX - (currentLeft + 25); // Enemy's center X
                const dy = shipY - (currentTop + 25); // Enemy's center Y
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Normalize the direction vector
                const directionX = dx / distance;
                const directionY = dy / distance;

                // Update the enemy's position
                this.element.style.left = `${currentLeft + directionX * this.speed}px`;
                this.element.style.top = `${currentTop + directionY * this.speed}px`;

                // Check if the enemy has reached the ship's position
                const enemyRect = this.element.getBoundingClientRect();
                const enemyX = enemyRect.left + 25; // Enemy's center X
                const enemyY = enemyRect.top + 25; // Enemy's center Y

                if (Math.abs(enemyX - shipX) < 5 && Math.abs(enemyY - shipY) < 5) {
                    // Enemy has reached the ship
                    this.destroy(); // Destroy the enemy
                    this.ship.takeDamage(); // Damage the ship (if applicable)
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