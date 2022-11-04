import { BACKUP_WORDS, WORD_LIST, DIFFICULTY_LEVEL } from './constants.js';

const settingsBtn = document.querySelector('.settings-btn');
const settingsIcon = document.querySelector('.fa-gear');
const settingsContainer = document.querySelector('.settings');
const testText = document.querySelector('.display-text');
const scoreEl = document.querySelector('.score-container');
const endgameContainer = document.querySelector('.end-game-container');
const settingsForm = document.querySelector('#settings-form');
const difficultyEl = document.querySelector('#difficulty');
const inputText = document.querySelector('.text');
const timeEl = document.querySelector('#time-left');
const startGame = document.querySelector('.start-game');
const timeSetting = document.querySelector('#time-setting');

let randomWord;
let score = 0;
let time = Number(timeSetting.value);
let gameOver = false;
let timeInterval;

async function getWords() {
  let level = difficultyEl.value;

  // only fetch once and store in the obj
  if (WORD_LIST[level].length === 0) {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?number=50&length=${DIFFICULTY_LEVEL[level]}`
      );

      const data = await response.json();

      WORD_LIST[level] = data;
      addWordToDOM();
    } catch (error) {
      console.log(error.message);
      WORD_LIST[level] = BACKUP_WORDS[level];
      addWordToDOM();
    }
  }
}

function getRandomWord() {
  let level = difficultyEl.value;

  let words = WORD_LIST[level];

  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDOM() {
  let randomWord = getRandomWord();
  testText.textContent = randomWord;
}

function updateScore() {
  scoreEl.textContent = ++score;
}

function updateTime() {
  if (time < 1) {
    clearInterval(timeInterval);
    endGame();
    return;
  }
  timeEl.textContent = `${--time}s`;
}

function endGame() {
  gameOver = true;
  endgameContainer.style.display = 'flex';
  endgameContainer.innerHTML = `
    <h1>Ahh! Time's up!</h1>
    <p>Your final score is <span class="total-score">${score}</span> 🎉🎉</p>
    <button onclick="location.reload()" class="reload-btn">Play again!</button>
  `;
}

function App() {
  // fetch words from api
  getWords();

  // setting time
  timeEl.textContent = `${time}s`;

  // Event Listeners

  // start game
  startGame.addEventListener('click', () => {
    testText.classList.remove('blured-text');
    timeInterval = setInterval(updateTime, 1000);
    inputText.focus();
    startGame.style.display = 'none';
  });

  // settings button
  settingsBtn.addEventListener('click', () => {
    settingsIcon.classList.toggle('icon-rotate');
    settingsContainer.classList.toggle('show');
  });

  // Get words based on difficulty
  difficultyEl.addEventListener('change', getWords);

  timeSetting.addEventListener('change', (e) => {
    timeEl.textContent = `${e.target.value}s`;
    time = Number(e.target.value);
  });

  // input
  inputText.addEventListener('input', (e) => {
    const inputValue = e.target.value;

    // check if inputValue is equal to randomWord displayed
    if (inputValue.trim() === testText.textContent) {
      addWordToDOM();
      e.target.value = '';
      updateScore();
    }
  });
}

App();

/**
 * API Details :
 *
 * For Easy : https://random-word-api.herokuapp.com/word?number=50&length=5
 *
 * For Medium : https://random-word-api.herokuapp.com/word?number=50&length=10
 *
 * For Hard : https://random-word-api.herokuapp.com/word?number=50&length=15
 *
 */
