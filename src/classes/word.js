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
]


export class Word {
    constructor(content){
        this.container = document.getElementById("container")
        this.word = document.createElement("div")
        this.word.classList.add("word") 
        this.container.append(this.word)
        this.word.textContent = content
        this.randomPos()
    }

    randomPos() {
        let x ;let y
        x = Math.floor(Math.random() * (this.container.offsetWidth -50 )) 
        y = 0
        this.word.style.position = "absolute"
        this.word.style.left = x + 'px'
        this.word.style.top = y + 'px' 
          
    }

    moving() {

    }

}