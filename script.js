let sequence = [];
let playerSequence = [];
let flash;
let turn;
let good;
let intervalId;
let on = false;
let win;
let highestScores = [];
let score;
let timer;
let timeLimit = 60;
let gameMode = 'classic';
let timerInterval;

const turnCounter = document.querySelector("#gameStatus");
const colorButtons = document.querySelectorAll(".colorButton");
const highestScoresList = document.querySelector("#highestScoresList");
const startButton = document.querySelector("#startButton");

document.querySelector('#classicModeButton').addEventListener('click', () => setGameMode('classic'));
document.querySelector("#timedModeButton").addEventListener('click', () => setGameMode('timed'));
document.querySelector("#timeSelect").addEventListener('change', function(event) {
    timeLimit = parseInt(event.target.value);
    startButton.style.display = 'block';
});
startButton.addEventListener('click', startGame);
document.querySelector('#menuButton').addEventListener('click', resetGameState);

function setGameMode(mode) {
    gameMode = mode;
    toggleModeSelection(false);
    if (mode === 'timed') document.querySelector("#timeSelect").style.display = 'block';
    else startButton.style.display = 'block';
}

function toggleModeSelection(show) {
    document.querySelector("#classicModeButton").style.display = show ? 'block' : 'none';
    document.querySelector("#timedModeButton").style.display = show ? 'block' : 'none';
}

function startGame() {
    resetGame();
    addNextColorToSequence();
    if (gameMode === 'timed') startTimedMode();
    intervalId = setInterval(gameTurn, 1200);
    console.log("Starting game...");
}

function resetGame() {
    flash = 0;
    compTurn = true;
    sequence = [];
    playerSequence = [];
    score = 0;
    turn = 1;
    win = false;
    good = true;
    on = true;
    clearInterval(intervalId);
    clearInterval(timerInterval);
    updateScoreDisplay();
    turnCounter.innerHTML = '';
    document.querySelector("#colorButtons").style.display = 'block';
    startButton.style.display = 'none';
    document.querySelector("#timeSelect").style.display = 'none';
}

function startTimedMode() {
    timer = timeLimit;
    updateTimerDisplay();
    document.querySelector("#timerDisplay").style.display = 'block';
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (--timer <= 0) {
        clearInterval(timerInterval);
        turnCounter.innerHTML = "Time Over";
        finishGame();
    } else {
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    document.querySelector("#timerDisplay").innerText = timer + " seconds left";
}

colorButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        if (on) {
            playerSequence.push(index + 1);
            check();
            if (!win) {
                setTimeout(() => {
                    clearColor();
                }, 300);
            }
        }
    });
});

function addNextColorToSequence() {
    sequence.push(Math.floor(Math.random() * 4) + 1);
}

function gameTurn() {
    console.log("gameTurn - flash: " + flash + ", turn: " + turn + ", compTurn: " + compTurn);
    on = false;

    if (flash === turn) {
        clearInterval(intervalId);
        clearColor();
        compTurn = false;
        on = true;
        return;
    }

    if (compTurn) {
        clearColor();
        setTimeout(() => {
            switch (sequence[flash]) {
                case 1: one(); break;
                case 2: two(); break;
                case 3: three(); break;
                case 4: four(); break;
            }
            flash++;
        }, 200);
    }
}

function one() {
    document.querySelector("#red").style.backgroundColor = "lightpink";
}

function two() {
    document.querySelector("#green").style.backgroundColor = "lightgreen";
}

function three() {
    document.querySelector("#blue").style.backgroundColor = "lightblue";
}

function four() {
    document.querySelector("#yellow").style.backgroundColor = "lightyellow";
}

function clearColor() {
    document.querySelector("#red").style.backgroundColor = "red";
    document.querySelector("#green").style.backgroundColor = "green";
    document.querySelector("#blue").style.backgroundColor = "blue";
    document.querySelector("#yellow").style.backgroundColor = "yellow";
}

function check() {
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        good = false;
        finishGame();
    } else if (playerSequence.length === sequence.length) {
        if (playerSequence.length === 20) {
            winGame();
        } else {
            score = turn;
            nextLevel();
        }
    }
}

function nextLevel() {
    turn++;
    playerSequence = [];
    compTurn = true;
    flash = 0;
    addNextColorToSequence();
    intervalId = setInterval(gameTurn, 1200);
    updateScoreDisplay();
}

function winGame() {
    clearColor();
    turnCounter.innerHTML = "WIN!";
    on = false;
    win = true;
}

function finishGame() {
    clearColor();
    turnCounter.innerHTML = good ? "WIN!" : "Game Over!";
    clearInterval(intervalId);
    if (timerInterval) clearInterval(timerInterval);
    on = false;
    win = true;
    if (score > 0) updateHighestScores(score);
    centerModeButtons();
    toggleModeSelection(true);
    document.querySelector("#colorButtons").style.display = 'none';
}
function centerModeButtons() {
    document.querySelector("#modeButtonsContainer").style.textAlign = 'center';
    document.querySelector("#classicModeButton").style.display = 'inline-block';
    document.querySelector("#timedModeButton").style.display = 'inline-block';
    document.querySelector("#timeSelect").style.display = 'none'; // Hide time select dropdown
}
function updateHighestScores(newScore) {
    highestScores.push(newScore);
    highestScores.sort((a, b) => b - a);
    if (highestScores.length > 10) highestScores.length = 10;
    displayHighestScores();
}

function displayHighestScores() {
    highestScoresList.innerHTML = highestScores.map((score, index) => `<li>Score ${index + 1}: ${score}</li>`).join('');
}

function updateScoreDisplay() {
    console.log("Updating score: " + score);
    turnCounter.innerHTML = "Score: " + score;
}

function resetGameState() {
    resetGame();
    toggleModeSelection(true);
    document.querySelector("#timerDisplay").style.display = 'none';
    document.querySelector("#modeButtonsContainer").style.textAlign = 'center';
    document.querySelector("#classicModeButton").style.display = 'inline-block';
    document.querySelector("#timedModeButton").style.display = 'inline-block';
}
