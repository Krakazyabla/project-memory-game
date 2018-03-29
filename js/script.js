function generateBoard() {
  clearBoard();
  const fragment = document.createDocumentFragment();
  const backImages = generateBackArray();
  for (let i = 0; i < 16; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    // use special attribute 'data-number' to check matching cards
    card.setAttribute('data-number', backImages[i]);
    const front = document.createElement('div');
    front.className = 'front';
    // div with class 'back' represents side of card that have an image on it
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
  // get an array of 16 random numbers from 0 to 7
  // each number used twice and corresponds to certain card image
  // array helpArr counts how many times we used a number of image, should be 2 times each
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
    // runs when user clicks New game during the current game
    generateBoard();
    resetRating();
    resetMoves();
    resetTimer();
  } else {
    // hide inviting div and so open board for game
    inviting.classList.add('hidden');
  }
  timer = setInterval(updateTime, 1000);
}

function resetRating() {
  rating = 3;
  // find all rating stars on the page
  let stars = document.querySelectorAll('.fa-star');
  for (let star of stars) {
    // attribute data-prefix="fas" uses for solid symbols in font-awesome
    star.dataset.prefix = 'fas';
  }
  cat.style.backgroundImage = '';
}

function decreaseRating() {
  if (rating > 1) {
    // finds rating stars that represent current rating in info panel and modal window
    let stars = document.querySelectorAll(`.rate${rating}`);
    for (star of stars) {
      // change solid star to regular star from font awesome set
      star.classList.add('far');
      star.classList.remove('fas');
    }
    cat.style.backgroundImage = `url(img/cat_${rating - 1}.png)`
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
  sCounter++; // counts seconds
  if (sCounter === 60) {
    sCounter = 0;
    mCounter++; // counts minutes
  }
  seconds.innerText = formatTime(sCounter);
  minutes.innerText = formatTime(mCounter);
}

// returns formatted string like '01:02'
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
  // checks number of moves and if it is 24 or 36 decreases rating of user
  if ([24, 36].indexOf(movesCount) !== -1) {
    decreaseRating();
  }
  if (movesCount < 16 && matchings > 3) {
    // if condition above is satisfied, cat at screen becomes very fat
    cat.style.backgroundImage = `url(img/cat_4.png)`;
  }
}

function checkMatching() {
  // checks if two opened cards match one another
  if (openedCards[0].getAttribute('data-number') === openedCards[1].getAttribute('data-number')) {
    animateMatchingCards();
    matchings++;
    if (matchings === 8) {
      // matchings equals to 8, have been opened 16 cards, so user won
      // uses setTimeout to show animation
      setTimeout(winGame, 1000);
    }
  } else {
    // returns opened cards to closed state
    for (const card of openedCards) {
      card.classList.toggle('clicked');
    }
  }
  openedCards = [];
}

function animateMatchingCards() {
  // happens css animation, and card returns to initial state
  for (const card of openedCards) {
    card.classList.add('matched');
    setTimeout(function() {
      card.classList.remove('matched');
    }, 500);
  }
}

function winGame() {
  // shows modal message, that displays message and image depending on user rating
  clearInterval(timer);
  const modalMessages = ['Your cat is completely disappointed in you',
                          '\"I think I\'ll byte you!\"',
                          'Your cat is fat and happy']
  document.getElementById('modal-moves').innerText = movesCount;
  document.getElementById('modal-time').innerText = `${minutes.innerText}:${seconds.innerText}`;
  document.getElementById('modal-cat').style.backgroundImage = `url(img/cat_modal${rating}.svg)`;
  document.getElementById('modal-message').innerText = modalMessages[rating - 1];
  modal.classList.remove('hidden');

}

function returnToBeginning() {
  // returns app to initial state after end of game and showing modal window with results
  modal.classList.add('hidden');
  inviting.classList.remove('hidden');
  generateBoard();
  resetRating();
  resetMoves();
  resetTimer();
  matchings = 0;
}

const board = document.querySelector('.board');
const inviting = document.querySelector('.invite-wrapper');
const moves = document.querySelector('#moves');
const cat = document.querySelector('.cat');
const modal = document.querySelector('.modal-wrapper');

const minutes = document.querySelector('#timer-minutes');
const seconds = document.querySelector('#timer-seconds');

let openedCards = [];
let matchings = 0;
let rating = 3;   // initial rating
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
      // use setTimeout to wait for an end of card animation
      setTimeout(checkMatching, 500);
    }
  }
})

document.getElementById('reset').addEventListener('click', startGame);
document.getElementById('modal-button').addEventListener('click', returnToBeginning);
