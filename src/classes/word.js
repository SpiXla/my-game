export let words = [
    "apple", "beta", "cake", "data", "echo", "fire", "game", "halo", "icon", "jazz",
    "kite", "lamp", "moon", "note", "open", "palm", "quiz", "rose", "star", "tide",
    "unit", "vote", "wave", "xray", "yoga", "zinc", "atom", "bird", "coin", "dive",
    "edit", "fuel", "glow", "hope", "iris", "jump", "knot", "leaf", "mint", "nova",
    "oval", "peak", "quip", "ruby", "ship", "turn", "user", "void", "wind", "xeno",
    "yarn", "zest", "arch", "blue", "core", "dual", "edge", "flow", "grid", "heat",
    "idea", "java", "kind", "loop", "meta", "node", "open", "path", "quiz", "rate",
    "site", "test", "unix", "view", "word", "xray", "year", "zero", "acid", "beam",
    "cool", "dash", "envy", "fizz", "glue", "hype", "iced", "jolt", "keel", "limb"
];

export class Word {
    constructor(content) {
        this.isAlive = true;
        this.ship = document.querySelector('.ship');
        this.container = document.getElementById("container");
        this.div = document.createElement("div");
        this.div.style.width = '70px';
        this.div.style.height = '70px';
        this.div.classList.add("enemy_container");
        this.enemy = document.createElement('img');
        this.enemy.classList.add("enemy", "alive");
        this.enemy.src = "../../assets/mine.png";
        this.enemy.style.position = "absolute";
        this.enemy.style.width = "50px";
        this.enemy.style.height = "50px";
        this.div.append(this.enemy);
        this.word = document.createElement("div");
        this.word.classList.add("word");
        this.word.textContent = content;
        this.div.append(this.word);
        this.container.append(this.div);
        this.randomPos();
        this.move();
    }

    randomPos() {
        let x = Math.floor(Math.random() * (this.container.offsetWidth - 50));
        let y = 0;
        this.div.style.position = "absolute";
        this.div.style.left = `${x}px`;
        this.div.style.top = `${y}px`;
    }

    destroy() {
        if (this.enemy.classList.contains("alive")) {
            this.enemy.classList.remove("alive");
            this.enemy.src = "../../assets/explosion-huge.png";
            this.enemy.style.width = "70px";
            this.enemy.style.height = "70px";
            this.isAlive = false;
            setTimeout(() => {
                this.div.remove();
            }, 100);
        }
    }

    move() {
        const moveEnemy = () => {
            if (!this.isAlive) return;
            this.speed = 1;
            const containerRect = this.container.getBoundingClientRect();
            const currentLeft = parseFloat(this.div.style.left);
            const currentTop = parseFloat(this.div.style.top);
            const shipRect = this.ship.getBoundingClientRect();
            const shipX = shipRect.left - containerRect.left;
            const shipY = shipRect.top - containerRect.top;
            const dx = shipX - currentLeft;
            const dy = shipY - currentTop;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.div.style.left = `${currentLeft + directionX * this.speed}px`;
            this.div.style.top = `${currentTop + directionY * this.speed}px`;

            const enemyRect = this.enemy.getBoundingClientRect();
            const shipRectAdjusted = this.ship.getBoundingClientRect();

            if (
                enemyRect.left <= shipRectAdjusted.right &&
                enemyRect.right >= shipRectAdjusted.left &&
                enemyRect.top <= shipRectAdjusted.bottom &&
                enemyRect.bottom >= shipRectAdjusted.top
            ) {
                this.destroy();
            } else {
                requestAnimationFrame(moveEnemy);
            }
        };
        moveEnemy();
    }
}