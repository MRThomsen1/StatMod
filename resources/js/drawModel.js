
// Ændring af spændvidde og genoptegning af statisk model ved klik på "tegn"-knap

function setSpanLength() {
  if (isNaN(spanLengthInput.valueAsNumber)) {
    spanLength = spanLength;
  } else {
    spanLength = spanLengthInput.valueAsNumber;
  }
  const manualScaleCheckbox = document.getElementById("manualScaleCheckbox");
  if (manualScaleCheckbox.checked) {
    lineLength = setLineCoordinates(scale);
  } else {
    scale = INITIALSCALE;
    lineLength = setLineCoordinates(scale);
    setScale();
  }
  // lineLength = setLineCoordinates(scale);
  console.log(scale);
  drawModel();
  fullLoadCheckboxChangeHandler();
  updateLoadDrawings();
}

function setLineCoordinates(scale) {
  let coordinateOffset = (spanLength / 2) * scale;
  lineCoorLeftX = +centerOfLine - coordinateOffset;
  lineCoorRightX = +centerOfLine + coordinateOffset;
  return lineCoorRightX - lineCoorLeftX;
}

//Scale justeres, hvis linjen er for lang ifht. canvas
function setScale() {
  if (document.getElementById("manualScaleCheckbox").checked) {
    return;
  }
  while (lineLength > canvas.width - 150) {
    scale = scale - 0.0001;
    lineLength = setLineCoordinates(scale);
  }
  while (lineLength < MINIMUMLINELENGTH) {
    scale = scale + 0.0001;
    lineLength = setLineCoordinates(scale);
  }
  horizontalScaleInput.value = (scale / INITIALSCALE).toFixed(2);
  horizontalScaleSlider.value = (scale * INITIALSCALE) / 200;
}

// Linje i statisk model tegnes
function drawLine() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lineCoorLeftX, lineCoorY);
  ctx.lineTo(lineCoorRightX, lineCoorY);
  ctx.stroke();
}

// Tegning af understøtninger
function drawSupport(xCoor, yCoor, wheels) {
  ctx.lineWidth = 1;
  const circleRadius = 3;
  const heightTriangle = 15;
  const widthTriangle = 10; // (* 2)
  const x = xCoor;
  const y = yCoor + circleRadius;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + widthTriangle, y + heightTriangle);
  ctx.lineTo(x - widthTriangle, y + heightTriangle);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
  if (wheels == true) {
    //Der tegnes hjul på understøtningen, hvis wheels er true
    wheelsFunct(5);
    wheelsFunct(-5);
  } else {
    stationary(-7);
    stationary(-2);
    stationary(3);
    stationary(8);
  }

  function wheelsFunct(wheelOffset) {
    ctx.beginPath();
    ctx.arc(
      x + wheelOffset,
      y + heightTriangle + circleRadius,
      circleRadius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  function stationary(lineOffset) {
    const lineStartX = x + lineOffset;
    const lineStartY = y + circleRadius + heightTriangle - 2;

    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);
    ctx.lineTo(lineStartX - 2, lineStartY + 5);
    ctx.stroke();
  }
}

// Add label: Lenght of span
function labelSpan() {
  // Adjust number of decimals:
  spanLengthDecimal = parseFloat(spanLength).toFixed(numOfDecimals);
  spanLengthDecimal = spanLengthDecimal.replace(".", ",");
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(`${spanLengthDecimal} m`, canvas.width / 2, lineCoorY + 25);
}

function drawModel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine();
  drawSupport(lineCoorLeftX, lineCoorY, true);
  drawSupport(lineCoorRightX, lineCoorY, false);
  labelSpan();
}