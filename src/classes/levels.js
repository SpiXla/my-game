import Game from "./game.js"


let words = [
    "apple", "banana", "chocolate", "dragon", "elephant", "fantastic", "guitar", "happiness", "internet", "jazz",
    "kangaroo", "lighthouse", "mountain", "notebook", "ocean", "penguin", "quasar", "rainbow", "sunset", "tiger",
    "umbrella", "volcano", "waterfall", "xylophone", "yacht", "zebra", "astronomy", "butterfly", "cactus", "dolphin",
    "eclipse", "firefly", "galaxy", "harmony", "island", "jungle", "kaleidoscope", "lightning", "moonlight", "nebula",
    "octopus", "paradise", "quartz", "rocket", "sapphire", "tornado", "universe", "vortex", "whale", "xenon",
    "yoga", "zeppelin", "algorithm", "binary", "cache", "database", "encrypt", "firewall", "gateway", "hacker",
    "interface", "javascript", "kernel", "linux", "malware", "network", "open-source", "protocol", "query", "router",
    "server", "terminal", "username", "virtual", "webpage", "xml", "youtube", "zip", "alpha", "beta",
    "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu",
    "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi"
]

class Word {
    constructor(content){
        this.word = document.createElement("div")
        this.word.classList.add("word") 
        document.body.append(this.word)
        this.word.textContent = content
        this.randomPos()
    }

    randomPos() {
        let x ;let y
        x = Math.floor(Math.random() * window.innerWidth -200) + 50
        y = 0
        this.word.style.position = "absolute"
        this.word.style.left = x + 'px'
        this.word.style.top = y + 'px' 
          
    }

    moving() {

    }

}
export default class waves {
    constructor(timer, wordsNumer) {
        this.randomWords = getRandomElements(words, wordsNumer)
        if (wordsNumer>10){
            wordsNumer = 10
        }
        this.timer = timer
        this.wordsNumer = wordsNumer
        this.startWave()
        this.typingListening()
    }

    typingListening(){
        document.addEventListener("keydown",(e)=>{
            const k = e.key
            const words = document.querySelectorAll(".word")
            Array.from(words).forEach((r)=>{
                let wordC = r.textContent
                const isActive = document.querySelectorAll(".active-word").length
                console.log("hh");
                if (isActive == 0 ) {
                    console.log("nn");
                    if (k.toLocaleLowerCase() == wordC[0]){
                        r.textContent = r.textContent.slice(1)
                        r.style.color = "#ff00cc" 
                        r.style.textShadow = "0 0 10px #ff00cc, 0 0 20px #ff00cc" 
                        r.style.transform = "scale(1.9)" 
                        r.classList.add("active-word")
                        this.activeWord()
                    }
                }
            })
        })
    }

    activeWord(){
        const listening = (e)=>{
            const activeWord = document.querySelector(".active-word")
            let content
            if (activeWord != null) {
                content = activeWord.textContent
                if (content.length == 0){
                    activeWord.remove()
                    removeEventListener("keydown",listening)
                }
                if (e.key.toLocaleLowerCase() == content[0]){
                    activeWord.textContent = activeWord.textContent.slice(1)
                }
            }

        }
        document.addEventListener("keydown",listening)
    }

    startWave(){
        let count = 1
        const generateWords = () => {
              if (count == this.wordsNumer){
                clearInterval(intervalId)
              }
              const content = this.randomWords.pop()
              const word = new Word(content)
            count++
        }
        const intervalId = setInterval(generateWords, 500)
            
    }

    resetGame() {
        const game = new Game()
    }

}

function getRandomElements(arr, n) {
    const result = []
    const usedLetters = new Set() 

    while (result.length < n) {
        const randomIndex = Math.floor(Math.random() * arr.length)
        const word = arr[randomIndex]
        const firstLetter = word[0]

        if (!usedLetters.has(firstLetter)) {
            result.push(word) 
            usedLetters.add(firstLetter) 
            arr.splice(randomIndex, 1) 
        }
    }

    return result
}