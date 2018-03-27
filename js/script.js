

function generateBoard() {
  clearBoard();
  const fragment = document.createDocumentFragment();
  const backImages = generateBackArray();

  for (let i = 0; i < 16; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-number', backImages[i]);
    const front = document.createElement('div');
    front.className = 'front';
    const back = document.createElement('div');
    back.className = 'back';
    back.style.backgroundImage = `url(img/food_${backImages[i]}.jpg)`;
    card.appendChild(front);
    card.appendChild(back);
    fragment.appendChild(card);
  }
  board.appendChild(fragment);
}

function clearBoard() {
  const cards = board.childNodes;
  while (cards.length > 0) {
    board.removeChild(cards[0]);
  }
}

function generateBackArray() {
  const helpArr = [0, 0, 0, 0, 0, 0, 0, 0];
  const backArr = [];
  for (let i = 0; i < 16; i++) {
    let randNum = Math.floor(Math.random() * 8);
    while (helpArr[randNum] === 2) {
      if (randNum === 7) {
        randNum = 0;
      } else {
        randNum++;
      }
    }
    backArr.push(randNum);
    helpArr[randNum]++;
  }
  return backArr;
}

function startGame() {
  matchings = 0;
  if (inviting.classList.contains('hidden')) {
    generateBoard();
    resetRating();
    resetMoves();
    resetTimer();
  } else {
    inviting.classList.add('hidden');
  }
  timer = setInterval(updateTime, 1000);
}

function resetRating() {
  rating = 3;
  let stars = document.querySelectorAll('.fa-star');
  for (let star of stars) {
    star.dataset.prefix = 'fas';
  }
  cat.style.backgroundImage = '';
}

function decreaseRating() {
  if (rating > 0) {
    let star = document.querySelector(`.rate${rating}`);
    star.classList.add('far');
    star.classList.remove('fas');
    cat.style.backgroundImage = `url(img/cat_${rating}.png)`
    rating--;
  }
}

function resetMoves() {
  movesCount = 0;
  moves.innerText = 0;
}

function increaseMoves() {
  movesCount++;
  moves.innerText = movesCount;
  checkRating();
}

function updateTime() {
  sCounter++;
  if (sCounter === 60) {
    sCounter = 0;
    mCounter++;
  }
  seconds.innerText = formatTime(sCounter);
  minutes.innerText = formatTime(mCounter);
}

function formatTime(num) {
  var str = ('00' + num).slice(-2);
  return str;
}

function resetTimer() {
  clearInterval(timer);
  sCounter = 0;
  mCounter = 0;
  seconds.innerText = '00';
  minutes.innerText = '00';

}

function checkRating() {
  if ([24, 32, 40].indexOf(movesCount) !== -1) {
    decreaseRating();
  }
  if (movesCount < 16 && matchings > 3) {
    cat.style.backgroundImage = `url(img/cat_4.png)`;
  }
}

function checkMatching() {
  if (openedCards[0].getAttribute('data-number') === openedCards[1].getAttribute('data-number')) {
    animateMatchingCards();
    matchings++;
    if (matchings === 8) {
      setTimeout(winGame, 1000);
    }
  } else {
    for (const card of openedCards) {
      card.classList.toggle('clicked');
    }
  }
  openedCards = [];
}

function animateMatchingCards() {
  for (const card of openedCards) {
    card.classList.add('matched');
    setTimeout(function() {
      card.classList.remove('matched');
    }, 500);
  }
}

function winGame() {
  clearInterval(timer);
  alert('yep!');
}

const board = document.querySelector('.board');
const inviting = document.querySelector('.invite-wrapper');
const moves = document.querySelector('#moves');
const cat = document.querySelector('.cat');

const minutes = document.querySelector('#timer-minutes');
const seconds = document.querySelector('#timer-seconds');


let openedCards = [];
let matchings = 0;
let rating = 3;
let movesCount = 0;
let mCounter = 0, sCounter = 0, timer;


generateBoard();

board.addEventListener('click', function(evt) {
  if (evt.target.classList.contains('front') && openedCards.length < 2) {
    const card = evt.target.parentNode;
    card.classList.toggle('clicked');
    openedCards.push(card);
    increaseMoves();
    if (openedCards.length === 2) {
      setTimeout(checkMatching, 500);
    }
  }
})

document.getElementById('reset').addEventListener('click', startGame);
