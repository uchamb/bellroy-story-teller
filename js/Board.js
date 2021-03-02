class Board {
  #keys = {
    37: { name: 'left', btn: $('button.left') },
    38: { name: 'up', btn: $('button.up') },
    39: { name: 'right', btn: $('button.right') },
    40: { name: 'down', btn: $('button.down') },
  };

  #currentScore = 0;
  #currentLevel = 0;

  #scores = [
    { img: 'wallet', score: 2010 },
    { img: 'travel-wallet', score: 2011 },
    { img: 'phone-case', score: 2015 },
    { img: 'backpack', score: 2017 },
    { img: 'pouch', score: 2018 },
    { img: 'bottle-1', score: 2019 },
    { img: 'bottle-2', score: 2020 },
    { img: 'bottle-3', score: 2021 },
  ];

  constructor({ width, height, onPress, beforeScoreGeneration }) {
    const self = this;
    this.el = $('#board');
    this.width = width;
    this.height = height;
    this.onPress = onPress;
    this.beforeScoreGeneration = beforeScoreGeneration;
    this.#init();

    $(document).keydown((e) => {
      const code = e.which || e.keyCode;
      if(this.#keys[code]) {
        this.#keys[code].btn.addClass('active');
        this.onPress(code);
      }
    }).keyup(() => {
      $('.arrows button').removeClass('active');
    });

    $('.arrows button').click(function() {
      self.onPress($(this).data().code);
    });
  }

  start() {
    this.#showScore();
  }

  checkMove(x, y) {
    if(x === this.scorePosition.x && y === this.scorePosition.y) {
      const activeScoreImg = this.el.find('.cell img');

      setTimeout(() => {
        activeScoreImg.addClass('animate');

        const scoreEl = $('.score');
        this.#currentScore = this.#scores[this.#currentLevel].score;
        scoreEl.find('[data-prop="score"]').text(this.#currentScore);
        scoreEl.addClass('bounce');
        setTimeout(() => scoreEl.removeClass('bounce'), 1000);

        setTimeout(() => {
          activeScoreImg.remove();
          this.#nextLevel();
        }, 1000);
      }, 300);
    }
  }

  getPosition(x, y) {
    const selfOffset = this.el.find(`.cell[data-x="${x}"][data-y="${y}"]`).offset();
    const parentOffset = this.el.parent().offset();
    return { left: selfOffset.left - parentOffset.left, top: selfOffset.top - parentOffset.top };
  }

  getNextCoords(x, y, directionCode) {
    if(this.#keys[directionCode].name === 'up') {
      y--;
      if(y < 0) return null; // Out of the matrix
    }

    if(this.#keys[directionCode].name === 'down') {
      y++;
      if(y >= this.height) return null; // Out of the matrix
    }

    if(this.#keys[directionCode].name === 'left') {
      x--;
      if(x < 0) return null; // Out of the matrix
    }

    if(this.#keys[directionCode].name === 'right') {
      x++;
      if(x >= this.width) return null; // Out of the matrix
    }

    return { x: x, y: y };
  }

  disableButtons() {
    $('.arrows button').prop({ disabled: true });
  }

  enableButtons() {
    $('.arrows button').prop({ disabled: false });
  }

  #init() {
    for(let i = 0; i < this.width; i++) {
      for(let j = 0; j < this.height; j++) {
        this.el.append(
          $('<div>').addClass('cell').attr({ 'data-x': j, 'data-y': i })
        );
      }
    }
  }

  #showScore() {
    const [ x, y ] = [ Math.round(Math.random() * 100) % this.width, Math.round(Math.random() * 100) % this.height, ];
    if(!this.beforeScoreGeneration(x, y)) {
      return this.#showScore();
    } else {
      this.scorePosition = { x, y };
      const img = this.#scores[this.#currentLevel].img;
      const cell = this.el.find(`.cell[data-x="${x}"][data-y="${y}"]`);
      cell.append($(`<img src="img/${img}.png" alt="${img}" />`));
      return true;
    }
  }

  #nextLevel() {
    this.#currentLevel++;
    if(this.#currentLevel < this.#scores.length) {
      this.#showScore();
    } else {
      this.#finish();
    }
  }

  #finish() {
    $('#board').addClass('hidden');
    $('body').addClass('final');
    $('.score').html('You Won!').addClass('bounce')
  }
}