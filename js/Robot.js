class Robot {
  #busy = false;

  constructor({ board, x, y, onMove }) {
    this.el = $('.robot');
    this.direction = 38; // Arrow codes
    this.rotation = 0;
    this.board = board;
    this.x = x;
    this.y = y;
    this.onMove = onMove;
    this.#moveTo(x, y);
    this.el.show();
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  #moveTo(x, y) {
    const pos = this.board.getPosition(x, y);
    this.el.css({ left: pos.left + 14 + 'px', top: pos.top + 6 + 'px' });
  }

  turnTo(newDirection) {
    if(this.#busy) return;
    this.#busy = true;
    this.board.disableButtons();

    if(this.direction === newDirection) {
      this.#forward().then(() => {
        this.#busy = false;
        this.board.enableButtons();
      });
    } else if(newDirection < this.direction) {
      this.#turnLeft((this.direction - newDirection) * 90).then(() => {
        this.#busy = false;
        this.board.enableButtons();
      });
    } else {
      this.#turnRight((newDirection - this.direction) * 90).then(() => {
        this.#busy = false;
        this.board.enableButtons();
      });
    }

    this.direction = newDirection;
  }

  #forward() {
    const nextCoords = this.board.getNextCoords(this.x, this.y, this.direction);
    if(nextCoords) {
      this.x = nextCoords.x;
      this.y = nextCoords.y;
      this.#moveTo(nextCoords.x, nextCoords.y);
      this.onMove(nextCoords.x, nextCoords.y);

      this.el.find('.wheel').addClass('forward');

      return new Promise((resolve) => {
        setTimeout(() => {
          this.el.find('.wheel').removeClass('forward');
          resolve();
        }, 1500);
      });
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  }

  #turnRight(turnStep) {
    // 270 deg rotation is the same as -90 deg
    this.rotation += turnStep === 270 ? -90 : turnStep;
    this.el.css({ transform: `rotate(${this.rotation}deg)` });
    this.el.find('.wheel').first().addClass('forward');
    this.el.find('.wheel').last().addClass('backward');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.el.find('.wheel').removeClass('forward backward');
        resolve();
      }, 1500);
    });
  }

  #turnLeft(turnStep) {
    // 270 deg rotation is the same as -90 deg
    this.rotation -= turnStep === 270 ? -90 : turnStep;
    this.el.css({ transform: `rotate(${this.rotation}deg)` });
    this.el.find('.wheel').first().addClass('backward');
    this.el.find('.wheel').last().addClass('forward');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.el.find('.wheel').removeClass('forward backward');
        resolve();
      }, 1500);
    });
  }
}