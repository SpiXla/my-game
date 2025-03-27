export class Player {
    constructor(container) {
        this.container = container || document.getElementById("game-container");
        if (!this.container) {
            console.error("Game container not found!");
            return;
        }

        this.element = document.getElementById("player");

        // Reference resolution (1920x1080)
        this.refWidth = 1920;
        this.refHeight = 1080;

        // Base initial position (as a proportion of reference dimensions)
        this.baseStartX = 50 / this.refWidth;  // 50 pixels from left as a proportion
        this.baseStartY = (this.refHeight - 100) / this.refHeight;  // 100 pixels from bottom as a proportion

        // Base dimensions (will be scaled)
        this.baseWidth = 30;
        this.baseHeight = 30;
        this.baseVelocity = 0.8;
        this.baseMaxVelocity = 5;
        this.baseJumpStrength = 8;
        this.baseGravity = 0.3;

        // Initialize sizes and positions
        this.updateSizes();
        
        // Initial state with proportional positioning
        this.x = Math.round(this.containerWidth * this.baseStartX);
        this.y = Math.round(this.containerHeight * this.baseStartY);
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocity = this.baseVelocity * this.scaleX;
        this.maxvelocity = this.baseMaxVelocity * this.scaleX;
        this.friction = 0.85;
        this.gravity = this.baseGravity * this.scaleY;
        this.jumpStrength = this.baseJumpStrength * this.scaleY;
        
        this.isJumping = false;
        this.onGround = false;
        this.facing = "right";
        this.keys = {};
        this.power = '';

        // Setup resize handler
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.container);

        this.initControls();
        this.updatePosition();
    }

    updateSizes() {
        this.containerWidth = this.container.clientWidth;
        this.containerHeight = this.container.clientHeight;
        this.scaleX = this.containerWidth / this.refWidth;
        this.scaleY = this.containerHeight / this.refHeight;

        // Scale dimensions
        this.width = Math.round(this.baseWidth * Math.min(this.scaleX, this.scaleY));
        this.height = Math.round(this.baseHeight * Math.min(this.scaleX, this.scaleY));

        // Rescale velocity and jump parameters
        this.velocity = this.baseVelocity * this.scaleX;
        this.maxvelocity = this.baseMaxVelocity * this.scaleX;
        this.gravity = this.baseGravity * this.scaleY;
        this.jumpStrength = this.baseJumpStrength * this.scaleY;
    }

    handleResize() {
        // Store the current relative position
        const propX = this.x / this.containerWidth;
        const propY = this.y / this.containerHeight;

        // Update sizes
        this.updateSizes();

        // Reposition player using the original proportional start position
        this.x = Math.round(this.containerWidth * this.baseStartX);
        this.y = Math.round(this.containerHeight * this.baseStartY);

        // Ensure player is within container bounds
        this.x = Math.max(0, Math.min(this.x, this.containerWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.containerHeight - this.height));

        // Update visual position
        this.updatePosition();
    }

    initControls() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
            }
        });

        document.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });
    }

    move(mapCollisions) {
        if (mapCollisions.name === 'air-power') {
            this.power = 'air-power';
        }

        if (mapCollisions.name === 'teleport-power') {
            this.power = 'magic-power';
        }

        if (this.keys["ArrowRight"]) {
            this.velocityX += this.velocity;
            this.facing = "right";
        }
        if (this.keys["ArrowLeft"]) {
            this.velocityX -= this.velocity;
            this.facing = "left";
        }

        if (this.keys["ArrowUp"] && (mapCollisions.onGround)) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
            this.onGround = false;
        }

        const isSpacePressed = this.keys[' '];
        if (isSpacePressed) {
            if (this.power === 'air-power') {
                this.velocityY = -this.jumpStrength;
                this.isJumping = true;
                this.onGround = false;
            } else if (this.power == 'magic-power') {
                this.shootFireball();
            }
            this.power = '';
        }

        this.velocityX *= this.friction;
        this.velocityY += this.gravity;

        const maxFallVelocity = 10 * this.scaleY;
        if (this.velocityY > maxFallVelocity) {
            this.velocityY = maxFallVelocity;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.onGround = mapCollisions.onGround;

        if (Math.abs(this.velocityX) > this.maxvelocity) {
            this.velocityX = this.maxvelocity * Math.sign(this.velocityX);
        }

        if (this.x < 0) this.x = 0;
        if (this.x > this.containerWidth - this.width) {
            this.x = this.containerWidth - this.width;
        }
    }

    shootFireball() {
        const fireballX = this.facing === 'right'
            ? this.x + this.width
            : this.x - 15 * this.scaleX;

        const fireballY = this.y + this.height / 2;

        const fireballEvent = new CustomEvent('shoot-fireball', {
            detail: {
                x: fireballX,
                y: fireballY,
                direction: this.facing
            }
        });
        console.log('Fireball event dispatched:', {
            x: fireballX,
            y: fireballY,
            direction: this.facing
        });
        this.power = '';
        document.dispatchEvent(fireballEvent);
    }

    updatePosition() {
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

        if (this.facing === "left") {
            this.element.classList.add("facing-left");
        } else {
            this.element.classList.remove("facing-left");
        }
    }

    reset() {
        this.x = Math.round(50 * this.scaleX);
        this.y = Math.round((this.refHeight - 100) * this.scaleY);
        this.velocityX = 0;
        this.velocityY = 0;
        this.power = '';
        this.updatePosition();
    }
}