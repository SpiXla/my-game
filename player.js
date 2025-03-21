export class Player {
    constructor() {
        this.element = document.getElementById("player")
        this.container = document.getElementById("game-container")

        this.containerWidth = this.container.clientWidth
        this.containerHeight = this.container.clientHeight

        this.width = 30
        this.height = 30
        this.x = 50
        this.y = this.containerHeight - 100
        this.velocityX = 0
        this.velocityY = 0
        this.velocity = 0.8
        this.maxvelocity = 5
        this.friction = 0.85
        this.gravity = 0.3
        this.jumpStrength = 8
        this.isJumping = false
        this.onGround = false
        this.facing = "right"
        this.keys = {}

        this.initControls()
        this.update()
    }

    initControls() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key] = true

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault()
            }
        })

        document.addEventListener("keyup", (e) => {
            this.keys[e.key] = false
        })
    }

    move(mapCollisions) {
        // const prevX = this.x
        // const prevY = this.y

        if (this.keys["ArrowRight"]) {
            this.velocityX += this.velocity
            this.facing = "right"
        }
        if (this.keys["ArrowLeft"]) {
            this.velocityX -= this.velocity
            this.facing = "left"
        }

        if ((this.keys["ArrowUp"] ) &&
            (mapCollisions.onGround)) {
            this.velocityY = -this.jumpStrength
            this.isJumping = true
            this.onGround = false
        }

        this.velocityX *= this.friction
        this.velocityY += this.gravity

        const maxFallvelocity = 10
        if (this.velocityY > maxFallvelocity) {
            this.velocityY = maxFallvelocity
        }

        this.x += this.velocityX

        this.y += this.velocityY

        this.onGround = mapCollisions.onGround

        if (Math.abs(this.velocityX) > this.maxvelocity) {
            this.velocityX = this.maxvelocity * Math.sign(this.velocityX)
        }

        if (this.x < 0) this.x = 0
        if (this.x > this.containerWidth - this.width) {
            this.x = this.containerWidth - this.width
        }
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`

        // Update facing direction visually
        if (this.facing === "left") {
            this.element.classList.add("facing-left")
        } else {
            this.element.classList.remove("facing-right")
        }
    }

    update() {
        // The map collision checking will be done in the game loop
        // to prevent circular dependencies
        requestAnimationFrame(() => this.update())
    }

    reset() {
        this.x = 50
        this.y = this.containerHeight - 100
        this.velocityX = 0
        this.velocityY = 0
        this.updatePosition()
    }
}