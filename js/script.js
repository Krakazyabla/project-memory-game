

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
  board.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('front') && openedCards.length < 2) {
      const card = evt.target.parentNode;
      card.classList.toggle('clicked');
      openedCards.push(card);
      if (openedCards.length === 2) {
        setTimeout(checkMatching, 500);
      }
    }
  })

}

function clearBoard() {
  const cards = board.childNodes;
  for (let card of cards) {
    board.removeChild(card);
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

function checkMatching() {
  if (openedCards[0].getAttribute('data-number') === openedCards[1].getAttribute('data-number')) {
    animateMatchingCards();
    matchings++;
    if (matchings === 8) {
      winGame();
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
  alert('yep!');
}

const board = document.querySelector('.board');
let openedCards = [];
let matchings = 0;


generateBoard();
