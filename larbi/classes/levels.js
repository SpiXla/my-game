import { words, Word } from "./word.js"
// import ship from "./ship.js"

export default class Waves {
    constructor(timer, wordsNumer, ship) {
        this.IsGameOver = false
        this.randomWords = getRandomElements([...words], wordsNumer)
        this.ship = ship
        this.container = document.querySelector(".container")
        this.timer = timer
        this.wordsNumer = Math.min(wordsNumer, 10)
        this.enemyCount = 0
        this.ispaused = false; // Pause state
        this.activeWord = null
        this.typingTimeout = null  // Move typingTimeout to class level
        this.spawnTimeout = null; // Track the spawn timeout
        this.startTimer()
        this.spawnWave()
        this.typingListening()
        this.checkCollisions()
        this.pauseGame()
    }

    pauseGame() {
        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape") {
                this.ispaused = !this.ispaused;
                if (this.ispaused) {
                    this.clearTimers(); 
                    const continueBtn = document.querySelector(".ctn-btn");
                    const restartBtn = document.querySelector(".rstr-btn");
    
                    if (continueBtn) {
                        continueBtn.addEventListener("click", () => {
                            this.ispaused = false;
                            this.resumeTimers();
                        });
                    }
    
                    if (restartBtn) {
                        restartBtn.addEventListener("click", () => {
                            this.ispaused = true;
                            this.clearTimers();
                        });
                    }
                } else {
                    this.resumeTimers();
                }
            }
        });
    }

    clearTimers() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    
        if (this.spawnTimeout) {
            clearTimeout(this.spawnTimeout);
            this.spawnTimeout = null;
        }
    }
    
    resumeTimers() {
        if (!this.timerInterval) {
            this.startTimer();
        }
            if (!this.IsGameOver && !this.ispaused) {
            this.spawnWave();
        }
            if (!this.IsGameOver) {
            this.checkCollisions();
        }
    }

    startTimer() {
        const time = document.createElement("div")
        time.classList.add("timer")
        this.container.append(time)
        let count = 0
        const displayTime = () => {
            let t = (this.timer - count) / 1000
            if (t <= 3) {
                time.classList.add("low-time")
            }
            time.textContent = t.toFixed(0)
            count += 1000
            if (count >= this.timer) {
                this.lost()
            }
        }
        this.timerInterval = setInterval(displayTime, 1000)
    }

    typingListening() {
        document.addEventListener("keydown", this.handleKeyDown)
    }

    handleKeyDown = (e) => {
        if (this.IsGameOver) return
        const k = e.key.toLowerCase()

        if (!this.activeWord) {
            const enemyContainers = document.querySelectorAll(".enemy_container")
            for (const container of enemyContainers) {
                const wordElement = container.querySelector(".word")
                if (wordElement && wordElement.textContent[0] === k) {
                    this.activeWord = wordElement
                    break
                }
            }
        }

        // might wanna check another way to not have the delay o function firing
        if (this.activeWord && this.activeWord.textContent.length !== 0 && this.activeWord.textContent[0] === k) {
            const lweqt = this.ship.shoot(this.activeWord)
            this.removeChar(this.activeWord, lweqt)

            if (this.activeWord.textContent.length === 1) {
                setTimeout(() => {
                    this.activeWord.parentElement.remove()
                    this.activeWord = null
                }, lweqt)

            }
        }
    }

    removeChar(wordElement, delay) {
        setTimeout(() => {
            wordElement.textContent = wordElement.textContent.slice(1)
        }, delay)
    }

    spawnWave() {
        let index = 0;
        const spawnNextWord = () => {
            if (this.IsGameOver || index >= this.randomWords.length || this.ispaused) return;

            const wordContent = this.randomWords[index++];
            new Word(wordContent);
            this.enemyCount++;

            const currentWords = this.container.querySelectorAll(".word");
            const delay = currentWords.length >= 6 ? 2500 : 1500;

            this.spawnTimeout = setTimeout(spawnNextWord, delay);
        };

        spawnNextWord();
    }

    lost() {
        this.IsGameOver = true
        this.container.innerHTML = ""
        const lostMessage = document.createElement("div")
        lostMessage.classList.add("lost-game")
        lostMessage.textContent = "YOU LOST"
        this.container.append(lostMessage)
        clearInterval(this.timerInterval)
        document.removeEventListener("keydown", this.handleKeyDown) // Correctly remove the event listener
    }

    checkCollisions() {
        const check = () => {
            if (this.IsGameOver) return
            const enemies = document.querySelectorAll(".word")
            const shipElement = document.querySelector(".ship")
            if (!shipElement) return
            const shipRect = shipElement.getBoundingClientRect()
            enemies.forEach((enemy) => {
                const enemyRect = enemy.parentNode.getBoundingClientRect()
                // console.log(enemyRect, shipRect);
                
                if (
                    enemyRect.bottom >= shipRect.top &&
                    enemyRect.top <= shipRect.bottom &&
                    enemyRect.right >= shipRect.left &&
                    enemyRect.left <= shipRect.right
                ) {
                console.log('************mok************')

                    this.lost()
                }
            })
            if (!this.IsGameOver) {
                requestAnimationFrame(check) 
            }
        }
        requestAnimationFrame(check)
    }

    resetGame() {
        this.IsGameOver = false
        new Game()
    }
}

function getRandomElements(arr, n) {
    const copyArr = [...arr]
    const result = []
    const usedLetters = new Set()
    while (result.length < n && copyArr.length > 0) {
        const randomIndex = Math.floor(Math.random() * copyArr.length)
        const word = copyArr[randomIndex]
        const firstLetter = word[0]
        if (!usedLetters.has(firstLetter)) {
            result.push(word)
            usedLetters.add(firstLetter)
            copyArr.splice(randomIndex, 1)
        }
    }
    return result
}
