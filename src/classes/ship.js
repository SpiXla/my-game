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
    
        // Create a bullet element using an image
        const bullet = document.createElement("img");
        bullet.classList.add("bullet");
        bullet.src = "../../assets/bullet.png"; // Path to your bullet image
        bullet.style.position = "absolute";
        bullet.style.width = "40px"; // Adjust size as needed
        bullet.style.height = "40px"; // Adjust size as needed
        bullet.style.zIndex = "1000"; // Ensure the bullet is on top
    
        // Get the container's position relative to the viewport
        const containerRect = this.container.getBoundingClientRect();
    
        // Recalculate the ship's position relative to the container
        const shipRect = this.ship.getBoundingClientRect();
        const shipX = shipRect.left - containerRect.left + shipRect.width / 2; // Center horizontally
        const shipY = shipRect.top - containerRect.top + shipRect.height / 2; // Center vertically
    
        // Position the bullet at the ship's center relative to the container
        bullet.style.left = `${shipX - 20}px`; // Adjust for bullet size (centered horizontally)
        bullet.style.top = `${shipY - 20}px`; // Adjust for bullet size (centered vertically)
        this.container.append(bullet);
    
        console.log(`Bullet created at: left=${bullet.style.left}, top=${bullet.style.top}`);
        console.log(`Ship position: left=${shipX}, top=${shipY}`);
    
        // Get the target element's position relative to the container
        const targetRect = elem.getBoundingClientRect();
        const targetX = targetRect.left - containerRect.left + targetRect.width / 2; // Center of the target
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2; // Center of the target
    
        console.log(`Target position: x=${targetX}, y=${targetY}`);
    
        // Calculate the direction vector
        const dx = targetX - shipX;
        const dy = targetY - shipY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;
    
        console.log(`Direction vector: dx=${directionX}, dy=${directionY}`);
    
        // Rotate the ship to face the target
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjust the angle if needed
        this.ship.style.transform = `rotate(${angle}deg)`; // Apply the rotation
    
        // Move the bullet towards the target
        const speed = 40; // Adjust speed as needed
        const moveBullet = () => {
            const currentX = parseFloat(bullet.style.left);
            const currentY = parseFloat(bullet.style.top);
    
            // Calculate the remaining distance to the target
            const remainingDistance = Math.sqrt(
                Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
            );
    
            console.log(`Remaining distance: ${remainingDistance}`);
    
            // Check if the bullet has reached the target
            if (remainingDistance <= speed) {
                // Snap the bullet to the target's center
                bullet.style.left = `${targetX}px`;
                bullet.style.top = `${targetY}px`;
    
                // Stop the animation
                bullet.remove(); // Remove the bullet
                // elem.remove(); // Remove the target element
                console.log("Target hit!");
                // Add scoring or other effects here
            } else {
                // Update the bullet's position
                bullet.style.left = `${currentX + directionX * speed}px`;
                bullet.style.top = `${currentY + directionY * speed}px`;
                requestAnimationFrame(moveBullet); // Continue the animation
            }
        };
    
        moveBullet(); // Start the animation
    }
}