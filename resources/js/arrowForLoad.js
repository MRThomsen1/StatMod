function drawArrowForLoad(X, Y, length, color) {
  //  ctx.lineCap = "square"
  ctx.fillStyle = color;
  // Define thickness the main line of the arrow
  let paddingMainEnd = 2;
  let thicknessMainStart = 0;
  // Define points for main line
  const mainPointsX = [
    X + thicknessMainStart,
    X - thicknessMainStart,
    X - paddingMainEnd,
    X + paddingMainEnd,
  ];
  const mainPointsY = [Y, Y, Y - length, Y - length];
  // Draw main line
  ctx.beginPath();
  ctx.moveTo(mainPointsX[3], mainPointsY[3]);
  for (i = 0; i < 5; i++) {
    ctx.lineTo(mainPointsX[i], mainPointsY[i]);
    // ctx.stroke();
  }
  ctx.fill();
  // Define lenght, angle and thickness for the backwarspointing (?) lines on the arrowhead
  let backLineLenght = 10;
  let backLineAngle = 30;
  let paddingBackEnd = 3;

  // Define points for left backwardspointing line
  const leftBackPointsX = [
    mainPointsX[1],
    mainPointsX[1] -
      (Math.cos(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght -
        Math.cos(((90 - backLineAngle) * Math.PI) / 180) * paddingBackEnd),
    mainPointsX[1] -
      (Math.cos(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght +
        Math.cos(((90 - backLineAngle) * Math.PI) / 180) * paddingBackEnd),
  ];
  const leftBackPointsY = [
    Y,
    Y - Math.sin(((90 + backLineAngle) * Math.PI) / 180) * backLineLenght, //-Math.sin(backLineAngle*Math.PI/180*paddingBackEnd)),
    Y - Math.sin(((90 + backLineAngle) * Math.PI) / 180) * backLineLenght, //-Math.sin(backLineAngle*Math.PI/180*paddingBackEnd)),
  ];
  // Draw left back-line
  ctx.beginPath();
  ctx.moveTo(leftBackPointsX[3], leftBackPointsY[3]);
  for (i = 0; i < 4; i++) {
    ctx.lineTo(leftBackPointsX[i], leftBackPointsY[i]);
    //  ctx.stroke();
  }
  ctx.fill();
  // Define points for RIGHT backwardspointing line
  const rightBackPointsX = [
    mainPointsX[0],
    mainPointsX[0] +
      (Math.cos(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght -
        Math.cos(((90 - backLineAngle) * Math.PI) / 180) * paddingBackEnd),
    mainPointsX[0] +
      (Math.cos(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght +
        Math.cos(((90 - backLineAngle) * Math.PI) / 180) * paddingBackEnd),
  ];
  const rightBackPointsY = [
    Y,
    Y - Math.sin(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght, //-Math.sin(backLineAngle*Math.PI/180*paddingBackEnd)),
    Y - Math.sin(((90 - backLineAngle) * Math.PI) / 180) * backLineLenght, //-Math.sin(backLineAngle*Math.PI/180*paddingBackEnd)),
  ];
  // Draw RIGHT back-line
  ctx.beginPath();
  ctx.moveTo(rightBackPointsX[3], rightBackPointsY[3]);
  for (i = 0; i < 4; i++) {
    ctx.lineTo(rightBackPointsX[i], rightBackPointsY[i]);
    //  ctx.stroke();
  }
  ctx.fill();
}