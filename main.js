
const maxRange = document.getElementById("maxRange");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const remainingRange = document.getElementById("remainingRange");
const rangeDisplay = document.getElementById("rangeDisplay");
const restartBtn = document.getElementById("restartBtn");
const gameCard = document.querySelector(".game-card");

let max;
let random;
let attempts = 0;
let low = 1;
let high;
let gameOver = false;

// Start a new game
startBtn.addEventListener("click", function () {
    max = Number(maxRange.value);

    if (
        maxRange.value.trim() === "" ||
        !Number.isInteger(max) ||
        max < 2 ||
        max > 1000000
    ) {
        alert("Enter a whole number between 2 and 1,000,000.");
        maxRange.focus();
        return;
    }

    // Generate a random integer from 1 to max, inclusive
    random = Math.floor(Math.random() * max) + 1;

    attempts = 0;
    low = 1;
    high = max;
    gameOver = false;

    attemptsDisplay.textContent = attempts;
    rangeDisplay.textContent = max;
    remainingRange.textContent = `${low}–${high}`;

    message.textContent = "Make your first guess. You've got this!";
    message.className = "message";

    gameCard.classList.remove("right-win", "wrong-shake");

    gameArea.classList.remove("hidden");
    startBtn.classList.add("hidden");
    restartBtn.classList.add("hidden");

    maxRange.disabled = true;
    guessInput.disabled = false;
    guessInput.min = 1;
    guessInput.max = max;
    guessInput.value = "";

    guessInput.focus();
});

// Handle guesses
guessForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (gameOver) return;

    const inputValue = guessInput.value.trim();
    const guess = Number(inputValue);

    // Validate input
    if (
        inputValue === "" ||
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > max
    ) {
        message.textContent =
            `Enter a whole number between 1 and ${max}.`;
        message.className = "message error";
        guessInput.focus();
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    // Correct guess
    if (guess === random) {
        message.textContent =
            `🎉 Incredible! ${random} was the secret number. You cracked it in ${attempts} ${attempts === 1 ? "attempt" : "attempts"}!`;

        message.className = "message success";
        gameOver = true;

        gameCard.classList.remove("wrong-shake");
        gameCard.classList.add("right-win");

        finishGame();
    }

    // Guess is too high
    else if (guess > random) {
        high = Math.min(high, guess - 1);

        message.textContent = "📉 Too high! Try a smaller number.";
        message.className = "message error";

        animateWrongGuess();
    }

    // Guess is too low
    else {
        low = Math.max(low, guess + 1);

        message.textContent = "📈 Too low! Try a bigger number.";
        message.className = "message error";

        animateWrongGuess();
    }

    remainingRange.textContent = `${low}–${high}`;

    if (!gameOver) {
        guessInput.value = "";
        guessInput.focus();
    }
});

// Animate every incorrect guess, even consecutive ones
function animateWrongGuess() {
    gameCard.classList.remove("wrong-shake");
    message.classList.remove("wrong-pop");

    // Force a reflow so the animation restarts
    void gameCard.offsetWidth;
    void message.offsetWidth;

    gameCard.classList.add("wrong-shake");
    message.classList.add("wrong-pop");
}

// Finish the game
function finishGame() {
    guessInput.disabled = true;
    restartBtn.classList.remove("hidden");
}

// Play again
restartBtn.addEventListener("click", function () {
    gameArea.classList.add("hidden");
    startBtn.classList.remove("hidden");

    maxRange.disabled = false;
    maxRange.focus();

    gameCard.classList.remove("right-win", "wrong-shake");
});
