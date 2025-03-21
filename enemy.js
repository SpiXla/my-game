export class Enemy {
    constructor(x, y, container) {
        this.element = document.createElement("div");
        this.element.classList.add("enemy");
        this.container = container || document.getElementById("game-container");

        this.x = x || Math.random() * (this.container.offsetWidth - 30);
        this.y = y || 300;
        this.speed = 2;
        this.direction = Math.random() > 0.5 ? 1 : -1;

        this.container.appendChild(this.element);
        this.update();
    }

    move() {
        this.x += this.speed * this.direction;

        // Bounce off walls, using container width for proper boundaries
        const rightBoundary = this.container.offsetWidth - 30;
        if (this.x >= rightBoundary || this.x <= 0) {
            this.direction *= -1;
        }
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    update() {
        this.move();
        this.updatePosition();
        requestAnimationFrame(() => this.update());
    }

    checkCollision(player) {
        // Simple collision detection
        if (player.x < this.x + 30 && player.x + player.width > this.x && 
            player.y < this.y + 30 && player.y + player.height > this.y) {
            return true;
        }
        return false;
    }
}