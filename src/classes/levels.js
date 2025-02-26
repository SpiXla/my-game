import { words, Word } from "./word.js";
// import ship from "./ship.js";

export default class Waves {
    constructor(timer, wordsNumer, ship) {
        this.IsGameOver = false;
        this.randomWords = getRandomElements([...words], wordsNumer);
        this.ship = ship;
        this.container = document.querySelector(".container");
        this.timer = timer;
        this.wordsNumer = Math.min(wordsNumer, 10);
        this.enemyCount = 0;
        this.activeWord = null;
        this.typingTimeout = null;  // Move typingTimeout to class level
        this.startTimer();
        this.spawnWave();
        this.typingListening();
        this.checkCollisions();
    }

    startTimer() {
        const time = document.createElement("div");
        time.classList.add("timer");
        this.container.append(time);
        let count = 0;
        const displayTime = () => {
            let t = (this.timer - count) / 1000;
            if (t <= 3) {
                time.classList.add("low-time");
            }
            time.textContent = t.toFixed(0);
            count += 1000;
            if (count >= this.timer) {
                this.lost();
            }
        };
        this.timerInterval = setInterval(displayTime, 1000);
    }

    typingListening() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (this.IsGameOver) return;
        const k = e.key.toLowerCase();

        // Debounce the keydown event to reduce unnecessary calls
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            if (!this.activeWord) {
                const enemyContainers = document.querySelectorAll(".enemy_container");
                for (const container of enemyContainers) {
                    const wordElement = container.querySelector(".word");
                    if (wordElement && wordElement.textContent[0] === k) {
                        this.activeWord = wordElement;
                        break;
                    }
                }
            }

            // If we have an active word and it's a match
            if (this.activeWord && this.activeWord.textContent.length !== 0 && this.activeWord.textContent[0] === k) {
                const lweqt = this.ship.shoot(this.activeWord);
                this.removeChar(this.activeWord, lweqt); // Directly update the word's content

                // If the active word is fully matched (length is 0), remove it
                if (this.activeWord.textContent.length === 0) {
                    this.activeWord.parentElement.remove();
                    this.activeWord = null;
                }
            }
        }, 100);  // Debounce delay of 100ms
    }

    // Synchronously remove the first character after the specified delay
    removeChar(wordElement, delay) {
        setTimeout(() => {
            wordElement.textContent = wordElement.textContent.slice(1); // Remove the first character
        }, delay); // The time to wait before slicing the word
    }

    spawnWave() {
        let index = 0;
        const spawnNextWord = () => {
            if (this.IsGameOver || index >= this.randomWords.length) return;
            const wordContent = this.randomWords[index++];
            new Word(wordContent);
            this.enemyCount++;
            const currentWords = this.container.querySelectorAll(".word");
            const delay = currentWords.length >= 6 ? 2500 : 1500;
            setTimeout(spawnNextWord, delay);
        };
        spawnNextWord();
    }

    lost() {
        this.IsGameOver = true;
        this.container.innerHTML = "";
        const lostMessage = document.createElement("div");
        lostMessage.classList.add("lost-game");
        lostMessage.textContent = "YOU LOST";
        this.container.append(lostMessage);
        clearInterval(this.timerInterval);
        document.removeEventListener("keydown", this.handleKeyDown); // Correctly remove the event listener
    }

    checkCollisions() {
        const check = () => {
            if (this.IsGameOver) return;
            const enemies = document.querySelectorAll(".word");
            const shipElement = document.querySelector(".ship");
            if (!shipElement) return;
            const shipRect = shipElement.getBoundingClientRect();
            enemies.forEach((enemy) => {
                const enemyRect = enemy.getBoundingClientRect();
                if (
                    enemyRect.bottom >= shipRect.top &&
                    enemyRect.top <= shipRect.bottom &&
                    enemyRect.right >= shipRect.left &&
                    enemyRect.left <= shipRect.right
                ) {
                    this.lost();
                }
            });
            if (!this.IsGameOver) {
                requestAnimationFrame(check); // Use requestAnimationFrame for smoother checking
            }
        };
        requestAnimationFrame(check);
    }

    resetGame() {
        this.IsGameOver = false;
        new Game();
    }
}

function getRandomElements(arr, n) {
    const copyArr = [...arr];
    const result = [];
    const usedLetters = new Set();
    while (result.length < n && copyArr.length > 0) {
        const randomIndex = Math.floor(Math.random() * copyArr.length);
        const word = copyArr[randomIndex];
        const firstLetter = word[0];
        if (!usedLetters.has(firstLetter)) {
            result.push(word);
            usedLetters.add(firstLetter);
            copyArr.splice(randomIndex, 1);
        }
    }
    return result;
}
