export class LevelMap {
    constructor(container) {
        this.container = container || document.getElementById("game-container");
        if (!this.container) {
            console.error("Game container not found!");
            return;
        }

        // Game elements storage
        this.platforms = [];
        this.collectibles = [];
        this.trees = [];
        this.exits = [];
        this.fireballs = [];
        this.laserBlocks = [];

        // Reference resolution (1920x1080)
        this.refWidth = 1920;
        this.refHeight = 1080;
        
        // Initialize sizes
        this.updateSizes();
        
        // Base dimensions (will be scaled)
        this.baseWallThickness = 20;
        this.baseCollectibleSize = 20;
        this.baseFireballSize = 15;
        this.baseLaserBlockSize = 40;
        
        // Setup resize handler
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.container);
    }

    updateSizes() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.scaleX = this.width / this.refWidth;
        this.scaleY = this.height / this.refHeight;
        this.wallThickness = Math.round(this.baseWallThickness * this.scaleY);
        this.collectibleSize = Math.round(this.baseCollectibleSize * Math.min(this.scaleX, this.scaleY));
        this.fireballSize = Math.round(this.baseFireballSize * Math.min(this.scaleX, this.scaleY));
        this.laserBlockSize = Math.round(this.baseLaserBlockSize * Math.min(this.scaleX, this.scaleY));
    }

    handleResize() {
        this.updateSizes();
        this.repositionElements();
    }

    repositionElements() {
        const currentLevel = this.currentLevel;
        this.clearMap();
        
        if (currentLevel === 1) this.loadLevel1();
        else if (currentLevel === 2) this.loadLevel2();
        // Add more levels as needed
    }

    relativeStuff(x, y, w, h) {
        return {
            x: Math.round(x * this.scaleX),
            y: Math.round(y * this.scaleY),
            w: Math.round(w * this.scaleX),
            h: Math.round(h * this.scaleY)
        };
    }

    createPlatform(obj, flag) {
        const platform = document.createElement("div");
        platform.classList.add("platform");
        if (flag === 'destroyable') platform.classList.add("destroyable");
        
        platform.style.position = "absolute";
        platform.style.left = `${obj.x}px`;
        platform.style.top = `${obj.y}px`;
        platform.style.width = `${obj.w}px`;
        platform.style.height = `${obj.h}px`;

        this.container.appendChild(platform);

        const platformObj = {
            element: platform,
            x: obj.x,
            y: obj.y,
            width: obj.w,
            height: obj.h,
            isDestroyable: flag === 'destroyable'
        };

        this.platforms.push(platformObj);
        return platformObj;
    }

    createCollectible(x, y, type = "gem") {
        const collectible = document.createElement("div");
        const isPowerUp = type.split("-")[1] === 'power';
        
        collectible.classList.add(isPowerUp ? "powerUp" : "collectible", type);
        collectible.style.position = "absolute";
        collectible.style.left = `${x}px`;
        collectible.style.top = `${y}px`;
        collectible.style.width = `${this.collectibleSize}px`;
        collectible.style.height = `${this.collectibleSize}px`;

        this.container.appendChild(collectible);

        const collectibleObj = {
            element: collectible,
            x, y,
            width: this.collectibleSize,
            height: this.collectibleSize,
            type
        };

        this.collectibles.push(collectibleObj);
        return collectibleObj;
    }

    createExit(obj) {
        const exit = document.createElement("div");
        exit.classList.add("exit");
        exit.style.position = "absolute";
        exit.style.left = `${obj.x}px`;
        exit.style.top = `${obj.y}px`;
        exit.style.width = `${this.collectibleSize}px`;
        exit.style.height = `${this.collectibleSize}px`;

        this.container.appendChild(exit);

        const exitObj = {
            element: exit,
            x: obj.x,
            y: obj.y,
            width: this.collectibleSize,
            height: this.collectibleSize
        };

        this.exits.push(exitObj);
        return exitObj;
    }

    createFireball(x, y, direction) {
        const fireball = document.createElement("div");
        fireball.classList.add("fireball");
        fireball.style.position = "absolute";
        fireball.style.left = `${x}px`;
        fireball.style.top = `${y}px`;
        fireball.style.width = `${this.fireballSize}px`;
        fireball.style.height = `${this.fireballSize}px`;

        this.container.appendChild(fireball);

        const fireballObj = {
            element: fireball,
            x, y,
            width: this.fireballSize,
            height: this.fireballSize,
            direction,
            speed: Math.round(10 * this.scaleX)
        };

        this.fireballs.push(fireballObj);
        return fireballObj;
    }

    updateFireballs() {
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fb = this.fireballs[i];
            fb.x += fb.direction === 'right' ? fb.speed : -fb.speed;
            fb.element.style.left = `${fb.x}px`;

            // Boundary check
            if (fb.x < 0 || fb.x > this.width) {
                this.removeElement(fb);
                this.fireballs.splice(i, 1);
                continue;
            }

            // Platform collisions
            let shouldRemove = false;
            for (let j = this.platforms.length - 1; j >= 0; j--) {
                const p = this.platforms[j];
                if (this.checkCollision(fb, p)) {
                    this.removeElement(fb);
                    shouldRemove = true;
                    if (p.isDestroyable) {
                        this.removeElement(p);
                        this.platforms.splice(j, 1);
                    }
                    break;
                }
            }
            if (shouldRemove) this.fireballs.splice(i, 1);
        }
    }

    createLaserBlock(x, y, direction = 'horizontal') {
        const pos = this.relativeStuff(x, y, this.laserBlockSize, this.laserBlockSize);
        
        const block = document.createElement("div");
        block.classList.add("laser-block");
        block.style.position = "absolute";
        block.style.left = `${pos.x}px`;
        block.style.top = `${pos.y}px`;
        block.style.width = `${pos.w}px`;
        block.style.height = `${pos.h}px`;

        const ray = document.createElement("div");
        ray.classList.add("laser-ray");
        ray.style.display = "none";
        ray.style.position = "absolute";

        this.container.appendChild(block);
        this.container.appendChild(ray);

        const laserObj = {
            element: block,
            rayElement: ray,
            x: pos.x,
            y: pos.y,
            width: pos.w,
            height: pos.h,
            direction,
            shootInterval: null,
            startLaserCycle: () => {
                laserObj.shootInterval = setInterval(() => this.fireLaser(laserObj), 3000);
            },
            stopLaserCycle: () => {
                clearInterval(laserObj.shootInterval);
            }
        };

        this.laserBlocks.push(laserObj);
        return laserObj;
    }

    fireLaser(laser) {
        const ray = laser.rayElement;
        let length = laser.direction === 'horizontal' ? this.width : this.height;
        const thickness = Math.round(10 * Math.min(this.scaleX, this.scaleY));

        // Find closest collision
        for (const p of this.platforms) {
            if (laser.direction === 'horizontal') {
                if (p.y <= laser.y + laser.height/2 && p.y + p.height >= laser.y + laser.height/2) {
                    const dist = p.x - laser.x;
                    if (dist > 0 && dist < length) length = dist;
                }
            } else {
                if (p.x <= laser.x + laser.width/2 && p.x + p.width >= laser.x + laser.width/2) {
                    const dist = p.y - laser.y;
                    if (dist > 0 && dist < length) length = dist;
                }
            }
        }

        if (laser.direction === 'horizontal') {
            ray.style.width = `${length}px`;
            ray.style.height = `${thickness}px`;
            ray.style.left = `${laser.x}px`;
            ray.style.top = `${laser.y + laser.height/2 - thickness/2}px`;
        } else {
            ray.style.width = `${thickness}px`;
            ray.style.height = `${length}px`;
            ray.style.left = `${laser.x + laser.width/2 - thickness/2}px`;
            ray.style.top = `${laser.y}px`;
        }

        ray.style.display = "block";
        setTimeout(() => ray.style.display = "none", 500);
    }

    loadLevel1() {
        this.currentLevel = 1;
        this.clearMap();
        
        // Border walls
        this.createPlatform(this.relativeStuff(0, 0, this.refWidth, this.baseWallThickness));
        this.createPlatform(this.relativeStuff(0, this.refHeight - this.baseWallThickness, this.refWidth, this.baseWallThickness));
        this.createPlatform(this.relativeStuff(0, 0, this.baseWallThickness, this.refHeight));
        this.createPlatform(this.relativeStuff(this.refWidth - this.baseWallThickness, 0, this.baseWallThickness, this.refHeight));

        // Platforms
        this.createPlatform(this.relativeStuff(500, 300, 200, 20));
        this.createPlatform(this.relativeStuff(800, 500, 300, 20, 'destroyable'));
        this.createPlatform(this.relativeStuff(200, 600, 150, 20));
        
        // Collectibles
        this.createCollectible(this.relativeStuff(200, 200, 0, 0).x, this.relativeStuff(200, 200, 0, 0).y, "yellow-gem");
        this.createCollectible(this.relativeStuff(600, 250, 0, 0).x, this.relativeStuff(600, 250, 0, 0).y, "blue-gem");
        this.createCollectible(this.relativeStuff(400, 550, 0, 0).x, this.relativeStuff(200, 1000, 0, 0).y, "air-power");
        this.createCollectible(this.relativeStuff(400, 550, 0, 0).x, this.relativeStuff(400, 900, 0, 0).y, "teleport-power");
        
        // Exit
        this.createExit(this.relativeStuff(1800, 900, 0, 0));
        
        // Laser block
        const laser = this.createLaserBlock(1200, 400, 'horizontal');
        laser.startLaserCycle();
        
        return this;
    }

    // loadLevel2() {
    //     this.currentLevel = 2;
    //     this.clearMap();
        
    //     // Border walls (thicker for level 2)
    //     const thick = this.baseWallThickness * 1.5;
    //     this.createPlatform(this.relativeStuff(0, 0, this.refWidth, thick));
    //     this.createPlatform(this.relativeStuff(0, this.refHeight - thick, this.refWidth, thick));
    //     this.createPlatform(this.relativeStuff(0, 0, thick, this.refHeight));
    //     this.createPlatform(this.relativeStuff(this.refWidth - thick, 0, thick, this.refHeight));

    //     // Complex platform layout
    //     this.createPlatform(this.relativeStuff(300, 200, 150, 20));
    //     this.createPlatform(this.relativeStuff(500, 350, 200, 20, 'destroyable'));
    //     this.createPlatform(this.relativeStuff(800, 200, 150, 20));
    //     this.createPlatform(this.relativeStuff(1100, 350, 200, 20, 'destroyable'));
        
    //     // More collectibles
    //     this.createCollectible(this.relativeStuff(350, 150, 0, 0).x, this.relativeStuff(350, 150, 0, 0).y, "red-gem");
    //     this.createCollectible(this.relativeStuff(850, 150, 0, 0).x, this.relativeStuff(850, 150, 0, 0).y, "green-gem");
    //     this.createCollectible(this.relativeStuff(600, 500, 0, 0).x, this.relativeStuff(600, 1000, 0, 0).y, "air-power");
    //     this.createCollectible(this.relativeStuff(600, 500, 0, 0).x, this.relativeStuff(400, 900, 0, 0).y, "teleport-power");
        
    //     // Multiple exits
    //     this.createExit(this.relativeStuff(1650, 800, 0, 0));
        
    //     // Laser blocks
    //     const laser2 = this.createLaserBlock(1400, 300, 'horizontal');
    //     laser1.startLaserCycle();
    //     laser2.startLaserCycle();
        
    //     return this;
    // }

    clearMap() {
        // Remove all elements
        const allElements = [
            ...this.platforms,
            ...this.collectibles,
            ...this.trees,
            ...this.exits,
            ...this.fireballs,
            ...this.laserBlocks
        ];
        
        allElements.forEach(item => {
            this.removeElement(item);
            if (item.stopLaserCycle) item.stopLaserCycle();
        });

        // Clear arrays
        this.platforms = [];
        this.collectibles = [];
        this.trees = [];
        this.exits = [];
        this.fireballs = [];
        this.laserBlocks = [];
    }

    removeElement(obj) {
        if (obj.element && obj.element.parentNode) {
            obj.element.parentNode.removeChild(obj.element);
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    checkCollisions(player) {
        let result = {
            onGround: false,
            hitCeiling: false,
            hitWall: false
        };

        const velMag = Math.sqrt(player.velocityX ** 2 + player.velocityY ** 2);
        const bufferY = Math.min(velMag, player.height / 2);
        const bufferX = Math.min(velMag, player.width / 2);

        // Platform collisions
        for (const p of this.platforms) {
            // Bottom collision
            if (player.x + player.width > p.x + 2 &&
                player.x < p.x + p.width - 2 &&
                player.y + player.height >= p.y - bufferY &&
                player.y + player.height <= p.y + 10 + bufferY) {
                
                if (player.velocityY >= 0) {
                    player.y = p.y - player.height;
                    player.velocityY = 0;
                    result.onGround = true;
                }
            }

            // Top collision
            if (player.x + player.width > p.x + 2 &&
                player.x < p.x + p.width - 2 &&
                player.y <= p.y + p.height + bufferY &&
                player.y >= p.y + p.height - 10 - bufferY) {
                
                if (player.velocityY < 0) {
                    player.y = p.y + p.height;
                    player.velocityY = 0;
                    result.hitCeiling = true;
                }
            }

            // Side collisions
            if (player.y + player.height > p.y + 2 &&
                player.y < p.y + p.height - 2) {
                
                // Right collision
                if (player.x + player.width >= p.x - bufferX &&
                    player.x + player.width <= p.x + 10 + bufferX) {
                    
                    if (player.velocityX > 0) {
                        player.x = p.x - player.width;
                        player.velocityX = 0;
                    }
                    result.hitWall = true;
                }

                // Left collision
                if (player.x <= p.x + p.width + bufferX &&
                    player.x >= p.x + p.width - 10 - bufferX) {
                    
                    if (player.velocityX < 0) {
                        player.x = p.x + p.width;
                        player.velocityX = 0;
                    }
                    result.hitWall = true;
                }
            }
        }

        // Screen boundaries
        if (player.x < 0) {
            player.x = 0;
            player.velocityX = 0;
        }
        if (player.x + player.width > this.width) {
            player.x = this.width - player.width;
            player.velocityX = 0;
        }

        // Collectible collisions
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const c = this.collectibles[i];
            if (this.checkCollision(player, c)) {
                
                if (c.element.classList.contains('powerUp')) {
                    return { ...result, type: "powerUp", name: c.type };
                }
                const collected = this.collectibles.splice(i, 1)[0];
                this.removeElement(c);
                return { ...result, type: "collectible", item: collected };
            }
        }

        // Exit collision
        for (const exit of this.exits) {
            if (this.checkCollision(player, exit)) {
                return { ...result, type: "exit" };
            }
        }

        // Laser collision
        const activeLasers = Array.from(document.querySelectorAll('.laser-ray[style*="display: block"]'));
        for (const laser of activeLasers) {
            const lRect = laser.getBoundingClientRect();
            const pRect = player.element.getBoundingClientRect();
            
            if (lRect.left < pRect.right &&
                lRect.right > pRect.left &&
                lRect.top < pRect.bottom &&
                lRect.bottom > pRect.top) {
                return { ...result, type: "laser-hit" };
            }
        }

        return result;
    }
}