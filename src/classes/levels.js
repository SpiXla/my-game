import { words, Word } from "./word.js";

export default class Waves {
    constructor(timer, wordsNumer, ship) {
        this.IsGameOver = false;
        this.randomWords = getRandomElements([...words], wordsNumer);
        this.ship = ship;
        this.container = document.querySelector(".container");
        this.timer = timer;
        this.wordsNumer = Math.min(wordsNumer, 10);
        this.enemyCount = 0;
        this.activeWord = null; // Track the active word
        
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
                console.log('mok');
                
                this.lost(); // End game if timer runs out
            }
        };

        this.timerInterval = setInterval(displayTime, 1000);
    }

    typingListening() {
        document.addEventListener("keydown", (e) => {
            if (this.IsGameOver) return;
            const k = e.key.toLowerCase();

            // If no active word, find the first one
            if (!this.activeWord) {
                const enemyContainers = document.querySelectorAll(".enemy_container");
                for (const container of enemyContainers) {
                    const wordElement = container.querySelector(".word");

                    if (wordElement && wordElement.textContent[0] === k) {
                        this.activeWord = wordElement; // Set as active word
                        break;
                    }
                }
            }

            // If an active word is set, process it
            if (this.activeWord && this.activeWord.textContent[0] === k) {
                this.activeWord.textContent = this.activeWord.textContent.slice(1);

                // If the word is fully typed, remove it and reset active word
                if (this.activeWord.textContent.length === 0) {
                    this.activeWord.parentElement.remove(); // Remove enemy container
                    this.activeWord = null; // Reset active word tracking
                }
            }
        });
    }

    spawnWave() {
        let index = 0;

        const spawnNextWord = () => {
            console.log(this.IsGameOver ,index >= this.randomWords.length );
            if (this.IsGameOver || index >= this.randomWords.length) return;

            const wordContent = this.randomWords[index++];
            new Word(wordContent); // Create and spawn the word
            this.enemyCount++; // Increment enemy count

            // Adjust the delay based on the number of active words
            const currentWords = this.container.querySelectorAll(".word");
            const delay = currentWords.length >= 6 ? 2500 : 1500; // Adjust delay

            setTimeout(spawnNextWord, delay); // Schedule the next word spawn
        };

        // Start the spawning process
        spawnNextWord();
    }

    lost() {
        this.IsGameOver = true; // Set game over state
        this.container.innerHTML = ""; // Clear the game container
        const lostMessage = document.createElement("div");
        lostMessage.classList.add("lost-game");
        lostMessage.textContent = "YOU LOST";
        this.container.append(lostMessage);

        // Stop any ongoing intervals
        clearInterval(this.timerInterval); // Stop the timer
        document.removeEventListener("keydown", this.typingListening); // Stop listening for typing
    }

    checkCollisions() {
        setInterval(() => {
            if (this.IsGameOver) return;

            const enemies = document.querySelectorAll(".word");
            const shipElement = document.querySelector(".ship");
            if (!shipElement) return;

            const shipRect = shipElement.getBoundingClientRect();

            enemies.forEach((enemy) => {
                const enemyRect = enemy.getBoundingClientRect();

                // Check for collision
                if (
                    enemyRect.bottom >= shipRect.top &&
                    enemyRect.top <= shipRect.bottom &&
                    enemyRect.right >= shipRect.left &&
                    enemyRect.left <= shipRect.right
                ) {
                    console.log("Collision detected!");
                    this.lost(); // Game over on collision
                }
            });
        }, 100); // Check for collisions every 100ms
    }

    resetGame() {
        this.IsGameOver = false; // Reset game over flag
        new Game(); // Start a new game
    }
}

// Improved getRandomElements function
function getRandomElements(arr, n) {
    const copyArr = [...arr]; // Prevent modification of original array
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
