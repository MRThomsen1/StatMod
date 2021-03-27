function drawLineLoad(
  start,
  length,
  sizeLeft,
  sizeRight,
  yPosition,
  color,
  density
) {
  const lineLoadCoordinates = [
    start,
    yPosition,
    start,
    yPosition - sizeLeft,
    start + length,
    yPosition - sizeRight,
    start + length,
    yPosition,
  ];
  ctx.strokeStyle = color;
  // Draw frame
  ctx.beginPath();
  ctx.moveTo(
    lineLoadCoordinates[lineLoadCoordinates.length - 2],
    lineLoadCoordinates[lineLoadCoordinates.length - 1]
  );
  for (let i = 0; i <= lineLoadCoordinates.length; i = i + 2) {
    ctx.lineTo(lineLoadCoordinates[i], lineLoadCoordinates[i + 1]);
    ctx.stroke();
  }

  const INITIALDISTANCE = 25;
  const distance = INITIALDISTANCE * density;
  const numberOfArrows = Math.round(length / distance);
  const centerXCoordinate = start + length / 2;
  let arrowXCoordinatesLeft = [];
  let arrowXCoordinatesRight = [];

  if (isOdd(numberOfArrows)) {
    arrowXCoordinatesLeft = [centerXCoordinate];
    numberOfArrows > 1
      ? (arrowXCoordinatesRight = [centerXCoordinate + distance])
      : (arrowXCoordinatesRight = []);
    for (let i = 1; i <= (numberOfArrows - 1) / 2; i++) {
      arrowXCoordinatesLeft.push(arrowXCoordinatesLeft[i - 1] - distance);
    }
    for (let j = 1; j < (numberOfArrows - 1) / 2; j++) {
      arrowXCoordinatesRight.push(arrowXCoordinatesRight[j - 1] + distance);
    }
  } else {
    arrowXCoordinatesLeft = [centerXCoordinate - distance / 2];
    arrowXCoordinatesRight = [centerXCoordinate + distance / 2];
    for (let i = 1; i <= (numberOfArrows - 2) / 2; i++) {
      arrowXCoordinatesLeft.push(arrowXCoordinatesLeft[i - 1] - distance);
      arrowXCoordinatesRight.push(arrowXCoordinatesRight[i - 1] + distance);
    }
  }

  for (let i = 0; i < arrowXCoordinatesLeft.length; i++) {
    const x1 = start;
    const x2 = start + length;
    const y1 = sizeLeft;
    const y2 = sizeRight;
    const arrowX = arrowXCoordinatesLeft[i];
    const arrowSize = y1 + ((y2 - y1) / (x2 - x1)) * (arrowX - x1);
    drawArrowForLoad(arrowX, yPosition, arrowSize, color);
  }
  for (let i = 0; i < arrowXCoordinatesRight.length; i++) {
    const x1 = start;
    const x2 = start + length;
    const y1 = sizeLeft;
    const y2 = sizeRight;
    const arrowX = arrowXCoordinatesRight[i];
    const arrowSize = y1 + ((y2 - y1) / (x2 - x1)) * (arrowX - x1);
    drawArrowForLoad(arrowX, yPosition, arrowSize, color);
  }
}