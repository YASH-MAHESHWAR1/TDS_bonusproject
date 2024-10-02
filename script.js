const cardImages = [
    '🍎', '🍌', '🍇', '🍉', 
    '🍓', '🍊', '🍍', '🍒'
];

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchCount = 0;
let timerInterval;
let startTime;

const cardGrid = document.getElementById('card-grid');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const timerDisplay = document.getElementById('time');
const finalTimeDisplay = document.getElementById('final-time');
const scoreBoard = document.getElementById('score-board');

function createCards() {
    const cardArray = [...cardImages, ...cardImages]; // Duplicate images for pairs
    shuffleArray(cardArray);

    cardGrid.innerHTML = '';
    cardArray.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-image', image);
        card.innerText = '?';
        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
        cards.push(card);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    this.innerText = this.getAttribute('data-image');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-image') === secondCard.getAttribute('data-image');

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matchCount++;
    resetBoard();
    if (matchCount === cardImages.length) {
        clearInterval(timerInterval);
        showScoreBoard();
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '?';
        secondCard.innerText = '?';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    createCards();
    startTimer();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.innerText = elapsedTime;
    }, 1000);

    setTimeout(() => {
        createCards();
    }, 3000);
}

function showScoreBoard() {
    scoreBoard.classList.remove('hidden');
    finalTimeDisplay.innerText = timerDisplay.innerText;
}

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('play-again-btn').addEventListener('click', () => {
    scoreBoard.classList.add('hidden');
    matchCount = 0;
    createCards();
    startTimer();
});
