import Game from "./game.js"
import { words,Word} from "./word.js"


export default class waves {
    constructor(timer, wordsNumer) {
        this.randomWords = getRandomElements(words, wordsNumer)
        if (wordsNumer>10){
            wordsNumer = 10
        }
        this.timer = timer
        this.wordsNumer = wordsNumer
        this.startTimer()
        this.startWave()
        this.typingListening()
    }

    startTimer(){
        const time = document.createElement("div")
        time.classList.add("timer")
        document.body.append(time)
        let count = 0
        const displayTime = ()=>{
            let t = (this.timer - count)/1000
            if (t <= 3) {
                time.classList.add("low-time")
            }
            time.textContent = t
            count+= 1000
        }
        setInterval(displayTime,1000)
    }

    typingListening(){
        const typingGame = (e)=>{
            const k = e.key
            const words = document.querySelectorAll(".word")
            Array.from(words).forEach((r)=>{
                let wordC = r.textContent
                const isActive = document.querySelectorAll(".active-word").length
                if (isActive == 0 ) {
                    if (k.toLocaleLowerCase() == wordC[0]){
                        r.textContent = r.textContent.slice(1)
                        r.style.color = "#EB5B00" 
                        r.style.transform = "scale(1.4)" 
                        r.classList.add("active-word")
                        removeEventListener("keydown",typingGame)
                        this.activeWord()
                    }
                }
            })
        }
        document.addEventListener("keydown",typingGame)
    }

    activeWord(){
        const listening = (e)=>{
            const activeWord = document.querySelector(".active-word")
            let content
            if (activeWord != null) {
                content = activeWord.textContent
                if (e.key.toLocaleLowerCase() == content[0]){
                    activeWord.textContent = activeWord.textContent.slice(1)
                }
                if (activeWord.textContent.length == 0 ){
                    activeWord.remove()
                    removeEventListener("keydown",listening)
                    this.typingListening()
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