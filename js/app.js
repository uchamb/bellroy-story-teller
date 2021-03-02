$(function() {
  const board = new Board({
    width: 5,
    height: 5,
    onPress: (directionCode) => robot.turnTo(directionCode),
    beforeScoreGeneration: (x, y) => {
      const robotCoords = robot.getCoords();
      return !(robotCoords.x === x && robotCoords.y === y);
    }
  });

  const robot = new Robot({
    board: board,
    x: 2,
    y: 4,
    onMove: (x, y) => board.checkMove(x, y)
  });

  board.start();
});