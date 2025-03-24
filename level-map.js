export class LevelMap {
    constructor(container) {
        this.container = container || document.getElementById("game-container"); if (!this.container) return
        this.platforms = []
        this.collectibles = []
        this.trees = []
        this.exits = []
        this.fireballs = []  // Array to track fireballs

        this.width = this.container.clientWidth
        this.height = this.container.clientHeight

        this.wallThickness = 20
    }

    createPlatform(x, y, width, height) {
        const platform = document.createElement("div")
        platform.classList.add("platform")
        platform.style.transform = `translate(${x}px, ${y}px)`
        
        platform.style.width = `${width}px`
        platform.style.height = `${height}px`

        this.container.appendChild(platform)

        this.platforms.push({
            element: platform,
            x,
            y,
            width,
            height
        })

        return platform
    }

    createCollectible(x, y, type = "gem") {
        const collectible = document.createElement("div")
        const temp = type.split("-")
        if (temp.length != 2 || temp[1] != 'power') {
            collectible.classList.add("collectible")
        } else {
            collectible.classList.add("powerUp")
        }
        collectible.classList.add(type)
        collectible.style.left = `${x}px`
        collectible.style.top = `${y}px`

        this.container.appendChild(collectible)

        this.collectibles.push({
            element: collectible,
            x,
            y,
            width: 20,
            height: 20,
            type
        })

        return collectible
    }

    createExit(x, y) {
        const exit = document.createElement("div")
        exit.classList.add("exit")
        exit.style.left = `${x}px`
        exit.style.top = `${y}px`

        this.container.appendChild(exit)

        this.exits.push({
            element: exit,
            x,
            y,
            width: 40,
            height: 40
        })

        return exit
    }

    createFireball(x, y, direction) {
        const fireball = document.createElement("div")
        fireball.classList.add("fireball")
        fireball.style.left = `${x}px`
        fireball.style.top = `${y}px`

        this.container.appendChild(fireball)

        const fireBallObj = {
            element: fireball,
            x,
            y,
            width: 15,
            height: 15,
            direction,
            speed: 10
        }

        this.fireballs.push(fireBallObj)
        return fireBallObj
    }

    updateFireballs() {//might wanna use transform here
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fireball = this.fireballs[i]
            
            // Move fireball
            if (fireball.direction === 'right') {
                fireball.x += fireball.speed
            } else {
                fireball.x -= fireball.speed
            }

            // Update visual position
            fireball.element.style.left = `${fireball.x}px`
            fireball.element.style.top = `${fireball.y}px`

            // Remove fireball if it goes off screen
            if (fireball.x < 0 || fireball.x > this.width) {
                this.container.removeChild(fireball.element)
                this.fireballs.splice(i, 1)
            }

            // Check fireball collisions with platforms
            for (const platform of this.platforms) {
                if (fireball.x < platform.x + platform.width &&
                    fireball.x + fireball.width > platform.x &&
                    fireball.y < platform.y + platform.height &&
                    fireball.y + fireball.height > platform.y) {
                    
                    // Remove fireball on platform collision
                    this.container.removeChild(fireball.element)
                    this.fireballs.splice(i, 1)
                    break
                }
            }
        }
    }

    loadLevel1() {
        this.clearMap()
        this.createPlatform(0, 0, this.width, this.wallThickness) // Top
        this.createPlatform(0, this.height - this.wallThickness, this.width, this.wallThickness) // Bottom
        this.createPlatform(0, 0, this.wallThickness, this.height) // Left
        this.createPlatform(this.width - this.wallThickness, 0, this.wallThickness, this.height) // Right

        // Top section
        this.createPlatform(this.wallThickness, 100, 300, this.wallThickness)
        this.createPlatform(400, 100, 350, this.wallThickness)
        this.createPlatform(400, 100,  this.wallThickness, 350)

        // Middle section
        this.createPlatform(600, 300, 150, this.wallThickness)
        this.createPlatform(200, 200, 150, this.wallThickness)
        this.createPlatform(400, 200, 300, this.wallThickness)

        // Bottom section 
        this.createPlatform(100, 500, 200, this.wallThickness)
        this.createPlatform(350, 400, 200, this.wallThickness)

        //collectibles
        this.createCollectible(120, 80, "yellow-gem")
        this.createCollectible(550, 80, "blue-gem")
        this.createCollectible(450, 180, "red-gem")
        // powerUps
        this.createCollectible(550, this.height - 50, "air-power")
        this.createCollectible(400, this.height - 50, "teleport-power")
        // this.createCollectible(200, this.height - 50, "magic-power")
        // this.createCollectible(this.width - 100, 200, "teleport-power")
        // exit
        this.createExit(this.width - 80, this.height - 80)

        return this
    }

    clearMap() {
        [...this.platforms, ...this.collectibles, ...this.trees, ...this.exits, ...this.fireballs].forEach(item => {
            if (item.element && item.element.parentNode) {
                item.element.parentNode.removeChild(item.element)
            }
        })

        this.platforms = []
        this.collectibles = []
        this.trees = []
        this.exits = []
        this.fireballs = []
    }

    checkCollisions(player) {
        let onGround = false
        let hitCeiling = false
        let hitWall = false

        const velocityMagnitude = Math.sqrt(
            player.velocityX * player.velocityX +
            player.velocityY * player.velocityY
        )

        const bufferY = Math.min(velocityMagnitude, player.height / 2)
        const bufferX = Math.min(velocityMagnitude, player.width / 2)

        for (const platform of this.platforms) { // i need to double check this
            // Bottom collision
            if (player.x + player.width > platform.x + 2 &&
                player.x < platform.x + platform.width - 2 &&
                player.y + player.height >= platform.y - bufferY &&
                player.y + player.height <= platform.y + 10 + bufferY) {

                if (player.velocityY >= 0) {
                    player.y = platform.y - player.height
                    player.velocityY = 0
                    onGround = true
                }
            }

            // Top collision 
            if (player.x + player.width > platform.x + 2 &&
                player.x < platform.x + platform.width - 2 &&
                player.y <= platform.y + platform.height + bufferY &&
                player.y >= platform.y + platform.height - 10 - bufferY) {

                if (player.velocityY < 0) {
                    player.y = platform.y + platform.height
                    player.velocityY = 0
                    hitCeiling = true
                }
            }

            // Left/Right
            if (player.y + player.height > platform.y + 2 &&
                player.y < platform.y + platform.height - 2) {

                // Right side of player hits left side of platform
                if (player.x + player.width >= platform.x - bufferX &&
                    player.x + player.width <= platform.x + 10 + bufferX) {

                    // Only push back if moving right
                    if (player.velocityX > 0) {
                        player.x = platform.x - player.width
                        player.velocityX = 0
                    }
                    hitWall = true
                }

                // Left side of player hits right side of platform
                if (player.x <= platform.x + platform.width + bufferX &&
                    player.x >= platform.x + platform.width - 10 - bufferX) {

                    // Only push back if moving left
                    if (player.velocityX < 0) {
                        player.x = platform.x + platform.width
                        player.velocityX = 0
                    }
                    hitWall = true
                }
            }
        }

        // boundary limitation
        if (player.x < 0) {
            player.x = 0
            player.velocityX = 0
        }

        if (player.x + player.width > this.width) {
            player.x = this.width - player.width
            player.velocityX = 0
        }

        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i]
            if (player.x < collectible.x + collectible.width &&
                player.x + player.width > collectible.x &&
                player.y < collectible.y + collectible.height &&
                player.y + player.height > collectible.y) {

                if (collectible.element && collectible.element.parentNode) {
                    if (collectible.element.classList.contains('powerUp')) {
                        return { type: "powerUp" , name: collectible.element.classList[1] , onGround, hitCeiling, hitWall }
                    } else {
                        collectible.element.parentNode.removeChild(collectible.element)
                    }
                }
                
                const collected = collectible
                this.collectibles.splice(i, 1)
                return { type: "collectible", item: collected, onGround, hitCeiling, hitWall }
            }
        }

        // Check for exit
        for (const exit of this.exits) {
            if (player.x < exit.x + exit.width &&
                player.x + player.width > exit.x &&
                player.y < exit.y + exit.height &&
                player.y + player.height > exit.y) {
                return { type: "exit", onGround, hitCeiling, hitWall }
            }
        }

        return { onGround, hitCeiling, hitWall }
    }
}