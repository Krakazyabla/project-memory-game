function startGame() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 16; i++) {
    let card = document.createElement('div');
    card.className = 'card';
    let front = document.createElement('div');
    front.className = 'front';
    let back = document.createElement('div');
    back.className = 'back';
    card.appendChild(front);
    card.appendChild(back);
    fragment.appendChild(card);
  }
  document.getElementsByClassName('board')[0].appendChild(fragment);
}

startGame();
