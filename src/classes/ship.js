export default class Ship {
    constructor() {
        this.ship = document.createElement("img");
        this.ship.classList.add("ship");
        this.ship.classList.add("alive");
        this.ship.src = "../../assets/shipOne.png";
        this.ship.style.width = "50px";
        this.ship.style.height = "50px";
        this.container = document.getElementById("container");
        this.container.append(this.ship);
        this.ship.style.position = "absolute";
        this.ship.style.left = Math.floor(this.container.offsetWidth / 2) - 30 + 'px';
        this.ship.style.top = this.container.offsetHeight - 100 + 'px';
        this.ship.style.transformOrigin = "center"; // Ensure rotation is around the center
    }

    shoot(elem) {
        if (!elem) {
            console.error("Invalid target element for shooting.");
            return;
        }

        // Create a bullet element
        const bullet = document.createElement("img");
        bullet.classList.add("bullet");
        bullet.src = "../../assets/plasma.png"; // Bullet image
        bullet.style.position = "absolute";
        bullet.style.width = "40px";
        bullet.style.height = "40px";
        bullet.style.zIndex = "1000";
        this.container.append(bullet);

        // Get container and element positions
        const containerRect = this.container.getBoundingClientRect();
        const shipRect = this.ship.getBoundingClientRect();
        const targetRect = elem.getBoundingClientRect();

        // Calculate positions relative to the container
        const shipX = shipRect.left - containerRect.left + shipRect.width / 2;
        const shipY = shipRect.top - containerRect.top + shipRect.height / 2;
        const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;


        bullet.style.left = `${shipX - bullet.width / 2}px`;
        bullet.style.top = `${shipY - bullet.height / 2}px`;


        // Calculate direction vector
        const dx = targetX - shipX;
        const dy = targetY - shipY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;

        // Define bullet speed (pixels per frame)
        const speed = 70; // Adjust speed as needed

        // Calculate travel time in milliseconds
        const timeToHit = (distance / speed) * 16; // 16ms per frame (60 FPS)
        console.log(`Bullet will hit in: ${timeToHit.toFixed(2)} ms`);

        // Rotate ship towards target
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        this.ship.style.transform = `rotate(${angle}deg)`;
        bullet.style.transform = `rotate(${angle}deg)`;

        // Move the bullet
        const moveBullet = () => {
            const bulletX = parseFloat(bullet.style.left);
            const bulletY = parseFloat(bullet.style.top);

            // Update bullet position
            bullet.style.left = `${bulletX + directionX * speed}px`;
            bullet.style.top = `${bulletY + directionY * speed}px`;

            // Check for collision
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = elem.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                console.log("Collision detected!");
                bullet.remove();
                // elem.remove(); // Remove the enemy
                return;
            }

            // If bullet moves out of screen
            if (
                bulletX < 0 ||
                bulletX > this.container.offsetWidth ||
                bulletY < 0 ||
                bulletY > this.container.offsetHeight
            ) {
                bullet.remove();
                return;
            }

            requestAnimationFrame(moveBullet);
        };

        // Trigger any other functions based on `timeToHit`
        setTimeout(() => {
            console.log("Time-based event triggered!");
        }, timeToHit);

        moveBullet(); // Start movement

        return timeToHit; // Return the time it takes to hit
    }




}