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
        bullet.src = "../../assets/plasma.png"; // Path to bullet image
        bullet.style.position = "absolute";
        bullet.style.width = "40px";
        bullet.style.height = "40px";
        bullet.style.zIndex = "1000";
    
        // Append bullet to the container
        this.container.append(bullet);
    
        // Get the container's position
        const containerRect = this.container.getBoundingClientRect();
        const shipRect = this.ship.getBoundingClientRect();
        const targetRect = elem.getBoundingClientRect();
    
        // Calculate ship and target positions relative to the container
        const shipX = shipRect.left - containerRect.left + shipRect.width / 2;
        const shipY = shipRect.top - containerRect.top + shipRect.height / 2;
        const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
    
        // Set initial bullet position
        bullet.style.left = `${shipX}px`;
        bullet.style.top = `${shipY}px`;
    
        // Calculate direction vector
        const dx = targetX - shipX;
        const dy = targetY - shipY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;
    
        // Rotate ship towards target
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        this.ship.style.transform = `rotate(${angle}deg)`;
    
        // Move the bullet
        const speed = 5; // Lower speed for smoother movement
        const moveBullet = () => {
            const bulletX = parseFloat(bullet.style.left);
            const bulletY = parseFloat(bullet.style.top);
    
            // Update bullet position
            bullet.style.left = `${bulletX + directionX * speed}px`;
            bullet.style.top = `${bulletY + directionY * speed}px`;
    
            // Check if bullet reaches target
            const remainingDistance = Math.sqrt(
                Math.pow(targetX - bulletX, 2) + Math.pow(targetY - bulletY, 2)
            );
    
            if (remainingDistance < 10) { // Slightly increased threshold
                bullet.remove();
                elem.remove();
                console.log("Target hit!");
            } else {
                requestAnimationFrame(moveBullet);
            }
        };
    
        moveBullet(); // Start movement
    }
    
    
}