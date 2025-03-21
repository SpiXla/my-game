export class PowerUp {
    constructor(x, y, container) {
        this.element = document.createElement("div");
        this.element.classList.add("powerup");
        this.container = container || document.getElementById("game-container");
        
        this.x = x || Math.random() * (this.container.offsetWidth - 20);
        this.y = y || Math.random() * 250;
        this.width = 20;
        this.height = 20;

        this.container.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    checkCollision(player) {
        if (player.x < this.x + this.width && player.x + player.width > this.x && 
            player.y < this.y + this.height && player.y + player.height > this.y) {
            this.element.remove();
            return true;
        }
        return false;
    }
}