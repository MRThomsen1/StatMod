//-------------------------------- Variables -------------------------------------

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.style.left = "300px";
canvas.style.top = "80px";
const canvasMarginRight = 75;
const canvasMarginBottom = 75;
let dpi = window.devicePixelRatio;
let lineCoorLeftX;
let lineCoorRightX;
let lineCoorY = canvas.height - (canvas.height * 1) / 4;
let centerOfLine = canvas.width / 2;
const INITIALSCALE = 200;
const MINIMUMLINELENGTH = 80;
let scale = INITIALSCALE;
let spanLength = 1.0;
let spanLengthDecimal;
let numOfDecimals = 2;

let lineLength = setLineCoordinates(scale);

let lineLoads = [];
let pointLoads = [];

const spanLengthInput = document.getElementById("spanLengthId");

const addLineLoadButton = document.getElementById("addLineLoadBtn");
const addPointLoadButton = document.getElementById("addPointLoadBtn");

const lineLoadDiv = document.getElementById("lineLoadDiv");
const pointLoadDiv = document.getElementById("pointLoadDiv");

const horizontalScaleInput = document.getElementById("horizontalScale");

const horizontalScaleSlider = document.getElementById("horizontalScaleSlider");

// ---------------------------------- FUNCTIONS --------------------------------

function resizeCanvas() {
  let newWidth =
    window.innerWidth -
    parseInt(canvas.style.left.slice(0, canvas.style.left.length - 2)) -
    canvasMarginRight;
  let newHeight =
    window.innerHeight -
    parseInt(canvas.style.top.slice(0, canvas.style.top.length - 2)) -
    canvasMarginBottom;
  canvas.width = newWidth;
  canvas.style.width = newWidth;
  canvas.height = newHeight;
  canvas.style.height = newHeight;
  centerOfLine = canvas.width / 2;
  lineCoorY = canvas.height - (canvas.height * 1) / 4;
  // Funktioner kaldes, og statisk model optegnes
  // setScale();
  setSpanLength();
  updateLoadDrawings();
}

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

// draw ()
function draw() {
  let arrowPic = document.getElementById("arrowPic");
  ctx.drawImage(arrowPic, 50, 50, 200, 200);
} // end draw

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

function clearLoads() {
  ctx.clearRect(0, 0, canvas.width, lineCoorY - 5);
}

function isOdd(x) {
  if (+x % 2 === 1) {
    return true;
  } else {
    return false;
  }
}


function addLineLoad() {
  let currentIndex = lineLoads.length;
  const lineLoadObject = {
    startX: lineCoorLeftX,
    length: lineLength,
    sizeLeft: null,
    sizeRight: null,
    startY: null,
    color: "black",
    labelPos: "TOP_RIGHT",
    density: 1,
    verticalScale: 10,
  };
  if (currentIndex === 0) {
    lineLoadObject.startY = lineCoorY - 15;
  } else {
    lineLoadObject.startY =
      lineLoads[currentIndex - 1].startY -
      lineLoads[currentIndex - 1].size -
      10;
  }
  const mainDiv = document.createElement("div");
  const h5 = document.createElement("h5");
  const form = document.createElement("form");

  mainDiv.id = `lineLoadIndex${currentIndex}`;
  mainDiv.classList.add("loadDiv");
  mainDiv.classList.add("lineLoadDiv");

  h5.textContent = `Linjelast #${currentIndex + 1}`;

  const settingsIconContainer = document.createElement("div");
  const settingsIcon = document.createElement("img");

  settingsIcon.src = "./resources/data/images/settingsicon.png";
  settingsIcon.classList.add("settingsIcon");

  settingsIconContainer.classList.add("settingsIconContainer");

  function toggleSettingsModal() {
    settingsModal.classList.toggle("pseudoHidden");
  }

  settingsIcon.addEventListener("click", toggleSettingsModal);

  settingsIconContainer.appendChild(settingsIcon);

  // adding input for size of load

  const loadSizeDiv = document.createElement("div");
  const div1 = document.createElement("div");
  const subDivTrapezoid = document.createElement("div");
  const checkboxTrapezoidLoad = document.createElement("input");
  const labelForCheckboxTrapezoidLoad = document.createElement("label");
  const loadSizeLeftInput = document.createElement("input");
  const labelForLoadLeftSizeInput = document.createElement("label");

  loadSizeDiv.classList.add("loadSizeDiv");
  div1.classList.add("div1");

  loadSizeLeftInput.id = `loadSizeLeftInputLineLoadIndex${currentIndex}`;
  loadSizeLeftInput.type = "number";
  loadSizeLeftInput.step = "any";
  loadSizeLeftInput.classList.add("numInput");
  loadSizeLeftInput.classList.add("loadInput");
  loadSizeLeftInput.classList.add("noSpinners");

  labelForLoadLeftSizeInput.htmlFor = `loadSizeLeftInputLineLoadIndex${currentIndex}`;
  labelForLoadLeftSizeInput.textContent = "Størrelse:";

  loadSizeLeftInput.addEventListener("change", updateLoadSizes);
  div1.appendChild(labelForLoadLeftSizeInput);
  div1.appendChild(loadSizeLeftInput);
  div1.insertAdjacentHTML("beforeend", "kN/m");

  loadSizeDiv.appendChild(div1);

  subDivTrapezoid.classList.add("subDivTrapezoid");

  checkboxTrapezoidLoad.type = "checkbox";
  checkboxTrapezoidLoad.id = `checkboxTrapezoidLineLoadIndex${currentIndex}`;

  labelForCheckboxTrapezoidLoad.htmlFor = `checkboxTrapezoidLineLoadIndex${currentIndex}`;
  labelForCheckboxTrapezoidLoad.textContent = "Trapezformet";

  subDivTrapezoid.appendChild(labelForCheckboxTrapezoidLoad);
  subDivTrapezoid.appendChild(checkboxTrapezoidLoad);
  div1.appendChild(subDivTrapezoid);

  loadSizeDiv.appendChild(div1);

  const loadSizeRightDiv = document.createElement("div");
  loadSizeRightDiv.classList.add("loadSizeRightDiv");
  loadSizeRightDiv.classList.add("hidden");
  const loadSizeRightInput = document.createElement("input");
  const labelForLoadRightSizeInput = document.createElement("label");

  loadSizeRightInput.id = `loadSizeRightInputLineLoadIndex${currentIndex}`;
  loadSizeRightInput.type = "number";
  loadSizeRightInput.step = "any";
  loadSizeRightInput.classList.add("numInput");
  loadSizeRightInput.classList.add("loadInput");
  loadSizeRightInput.classList.add("noSpinners");

  loadSizeRightInput.addEventListener("change", updateLoadSizes);

  labelForLoadRightSizeInput.htmlFor = `loadSizeRightInputLineLoadIndex${currentIndex}`;
  labelForLoadRightSizeInput.textContent = "Højre:";

  loadSizeRightDiv.appendChild(labelForLoadRightSizeInput);
  loadSizeRightDiv.appendChild(loadSizeRightInput);
  loadSizeRightDiv.insertAdjacentHTML("beforeend", "kN/m");

  loadSizeDiv.appendChild(loadSizeRightDiv);

  form.appendChild(loadSizeDiv);

  checkboxTrapezoidLoad.addEventListener("change", function () {
    loadSizeRightDiv.classList.toggle("hidden");
    if (checkboxTrapezoidLoad.checked) {
      labelForLoadLeftSizeInput.textContent = "Venstre:";
      labelPositionSettingsForTrapezoid("TRAPEZOID");
    } else {
      labelForLoadLeftSizeInput.textContent = "Størrelse:";
      labelPositionSettingsForTrapezoid("LINEAR");
    }
    loadSizeRightInput.value = loadSizeLeftInput.value;
    updateLoadSizes();
  });

  // input for size of load added

  // start and length inputs of load being added
  const labelForCheckbox1 = document.createElement("label");
  const checkbox1 = document.createElement("input");

  const div2 = document.createElement("div");

  const subDiv1 = document.createElement("div");
  const labelForNumInput2 = document.createElement("label");
  const numInput2 = document.createElement("input");

  const subDiv2 = document.createElement("div");
  const labelForNumInput3 = document.createElement("label");
  const numInput3 = document.createElement("input");

  checkbox1.id = `checkbox1ForLineLoadIndex${currentIndex}`;
  checkbox1.type = "checkbox";
  checkbox1.checked = true;
  checkbox1.addEventListener("change", fullLoadCheckboxChangeHandler);

  labelForCheckbox1.htmlFor = `checkbox1ForLineLoadIndex${currentIndex}`;
  labelForCheckbox1.textContent = "Last over hele modellens længde?";

  div2.id = `div2LineLoadIndex${currentIndex}`;
  div2.classList.add("div2");
  div2.classList.add("hidden");

  subDiv1.classList.add("subDiv1");
  subDiv2.classList.add("subDiv2");

  numInput2.id = `numInput2ForLineLoadIndex${currentIndex}`;
  numInput2.type = "number";
  numInput2.placeholder = "0,0";
  numInput2.step = "any";
  numInput2.classList.add("numInput");
  numInput2.classList.add("loadInput");
  numInput2.classList.add("noSpinners");
  numInput2.addEventListener("change", numInput2Handler);
  numInput2.addEventListener("keydown", numInput2Handler);
  function numInput2Handler(event) {
    if (
      event.type === "change" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      lineLoadObject.startX = lineCoorLeftX + numInput2.valueAsNumber * scale;
      if (isNaN(numInput3.valueAsNumber)) {
        lineLoadObject.length = lineLength - numInput2.valueAsNumber * scale;
      }
      updateLoadDrawings();
    }
  }

  labelForNumInput2.htmlFor = `numInput2ForLineLoadIndex${currentIndex}`;
  labelForNumInput2.textContent = "Start:";

  numInput3.id = `numInput3ForLineLoadIndex${currentIndex}`;
  numInput3.type = "number";
  numInput3.placeholder = `${spanLengthDecimal}`;
  numInput3.step = "any";
  numInput3.classList.add("numInput");
  numInput3.classList.add("loadInput");
  numInput3.classList.add("noSpinners");

  numInput3.addEventListener("change", numInput3Handler);
  numInput3.addEventListener("keydown", numInput3Handler);
  function numInput3Handler(event) {
    if (
      event.type === "change" ||
      (event.type === "keydown" && event.key === "Enter")
    ) {
      if (isNaN(numInput3.valueAsNumber)) {
        lineLoadObject.length = lineLength - numInput2.valueAsNumber * scale;
      } else {
        lineLoadObject.length = numInput3.valueAsNumber * scale;
      }
      updateLoadDrawings();
    }
  }

  labelForNumInput3.htmlFor = `numInput3ForLineLoadIndex${currentIndex}`;
  labelForNumInput3.textContent = "Udbredelse:";

  subDiv1.appendChild(labelForNumInput2);
  subDiv1.appendChild(numInput2);
  subDiv1.insertAdjacentHTML("beforeend", "m");
  subDiv2.appendChild(labelForNumInput3);
  subDiv2.appendChild(numInput3);
  subDiv2.insertAdjacentHTML("beforeend", "m");

  div2.appendChild(subDiv1);
  div2.appendChild(subDiv2);

  form.appendChild(labelForCheckbox1);
  form.appendChild(checkbox1);
  form.appendChild(div2);
  // start and length inputs of load added

  const settingsModal = document.createElement("div");
  const labelPlacementText = document.createElement("p");
  const labelPlacementSettings = document.createElement("div");
  const radio1 = document.createElement("input");
  const radio2 = document.createElement("input");
  const radio3 = document.createElement("input");
  const radio4 = document.createElement("input");
  const staticModelSprite = document.createElement("img");
  const exitIconContainer = document.createElement("div");
  const exitIcon = document.createElement("img");

  settingsModal.id = `settingsModalLineLoadIndex${currentIndex}`;
  settingsModal.classList.add("settingsModal");
  settingsModal.classList.add("pseudoHidden");
  labelPlacementText.textContent = "Placering af label";
  labelPlacementSettings.classList.add("labelPlacementSettings");
  staticModelSprite.src = "./resources/data/images/Statisk model2.png";
  radio1.type = "radio";
  radio1.name = `positionRadioLineLoadIndex${currentIndex}`;
  radio1.classList.add("radio1");
  radio1.addEventListener("click", changeLabelPositionTop);
  radio2.type = "radio";
  radio2.name = `positionRadioLineLoadIndex${currentIndex}`;
  radio2.classList.add("radio2");
  radio2.addEventListener("click", changeLabelPositionBottom);
  radio3.type = "radio";
  radio3.name = `positionRadioLineLoadIndex${currentIndex}`;
  radio3.classList.add("radio3");
  radio3.checked = true;
  radio3.addEventListener("click", changeLabelPositionTop);
  radio4.type = "radio";
  radio4.name = `positionRadioLineLoadIndex${currentIndex}`;
  radio4.classList.add("radio4");
  radio4.addEventListener("click", changeLabelPositionBottom);
  exitIconContainer.classList.add("exitIconContainer");
  exitIcon.src = "./resources/data/images/crossiconblack.png";

  function changeLabelPositionTop() {
    if (checkboxTrapezoidLoad.checked) {
      radio1.checked = true;
      radio3.checked = true;
      const position = "TOP";
      lineLoadObject.labelPos = position;
      updateLoadDrawings();
    } else {changeLabelPosition();}
  }
  function changeLabelPositionBottom() {
    if (checkboxTrapezoidLoad.checked) {
      radio2.checked = true;
      radio4.checked = true;
      const position = "BOTTOM";
      lineLoadObject.labelPos = position;
      updateLoadDrawings();
    } else {changeLabelPosition();}
  }

  function changeLabelPosition() {
    let position;
    if (radio1.checked) {
      position = "TOP_LEFT";
    } else if (radio2.checked) {
      position = "BOTTOM_LEFT";
    } else if (radio3.checked) {
      position = "TOP_RIGHT";
    } else if (radio4.checked) {
      position = "BOTTOM_RIGHT";
    }
  
    lineLoadObject.labelPos = position;
    updateLoadDrawings();
  }

  function labelPositionSettingsForTrapezoid(style) {
    currentIndex = parseInt(mainDiv.id.slice(13));
    if (style === "LINEAR") {
      radio1.name = `positionRadioLineLoadIndex${currentIndex}`;
      radio2.name = `positionRadioLineLoadIndex${currentIndex}`;
      radio3.name = `positionRadioLineLoadIndex${currentIndex}`;
      radio4.name = `positionRadioLineLoadIndex${currentIndex}`;
      radio3.checked = true;
    } else if (style === "TRAPEZOID") {
      radio1.name = `positionRadioLeftLineLoadIndex${currentIndex}`;
      radio2.name = `positionRadioLeftLineLoadIndex${currentIndex}`;
      radio3.name = `positionRadioRightLineLoadIndex${currentIndex}`;
      radio4.name = `positionRadioRightLineLoadIndex${currentIndex}`;
      radio1.checked = true;
      radio3.checked = true;
      changeLabelPositionTop();
    }
    
  }

  exitIcon.addEventListener("click", toggleSettingsModal);

  settingsIconContainer.appendChild(settingsModal);
  settingsModal.appendChild(labelPlacementText);
  settingsModal.appendChild(labelPlacementSettings);
  labelPlacementSettings.appendChild(radio1);
  labelPlacementSettings.appendChild(radio2);
  labelPlacementSettings.appendChild(staticModelSprite);
  labelPlacementSettings.appendChild(radio3);
  labelPlacementSettings.appendChild(radio4);
  exitIconContainer.appendChild(exitIcon);
  settingsModal.appendChild(exitIconContainer);

  const loadScaleSettings = document.createElement("div");
  const loadScaleInput = document.createElement("input");
  const labelForLoadScaleInput = document.createElement("label");

  loadScaleSettings.classList.add("loadScaleSettings");

  loadScaleInput.id = `loadScaleInputLineLoadIndex${currentIndex}`;
  loadScaleInput.type = "number";
  if (currentIndex === 0) {
    loadScaleInput.valueAsNumber = 10;
  } else {
    loadScaleInput.valueAsNumber = document.getElementById(
      `loadScaleInputLineLoadIndex${currentIndex - 1}`
    ).valueAsNumber;
  }
  loadScaleInput.classList.add("numInput");
  loadScaleInput.classList.add("scaleSpinner");
  loadScaleInput.classList.add("spinnerOpacity1");
  loadScaleInput.addEventListener("change", updateLoadSizes);

  labelForLoadScaleInput.htmlFor = `loadScaleInputLineLoadIndex${currentIndex}`;
  labelForLoadScaleInput.textContent = "Vertikal skala:";

  loadScaleSettings.appendChild(labelForLoadScaleInput);
  loadScaleSettings.appendChild(loadScaleInput);
  settingsModal.appendChild(loadScaleSettings);

  const colorPickerDiv = document.createElement("div");
  const loadColorPicker = document.createElement("input");
  const loadColorPickerWrapper = document.createElement("p");
  const loadColorPickerLabel = document.createElement("label");

  colorPickerDiv.classList.add("colorPickerDiv");

  loadColorPicker.type = "color";
  loadColorPicker.id = `loadColorLineLoadIndex${currentIndex}`;
  loadColorPicker.classList.add("colorPicker");
  loadColorPicker.value = "black";
  loadColorPicker.style.backgroundColor = loadColorPicker.value;

  loadColorPickerWrapper.id = `loadColorPickerWrapperLineLoadIndex${currentIndex}`;
  loadColorPickerWrapper.classList.add("colorPickerWrapper");
  loadColorPickerWrapper.style.backgroundColor = loadColorPicker.value;

  loadColorPickerLabel.htmlFor = loadColorPickerWrapper;
  loadColorPickerLabel.textContent = "Farve på last:";

  loadColorPicker.addEventListener("change", function () {
    lineLoadObject.color = loadColorPicker.value;
    loadColorPickerWrapper.style.backgroundColor = loadColorPicker.value;
    updateLoadDrawings();
  });

  loadColorPickerWrapper.appendChild(loadColorPicker);
  colorPickerDiv.appendChild(loadColorPickerLabel);
  colorPickerDiv.appendChild(loadColorPickerWrapper);
  settingsModal.appendChild(colorPickerDiv);

  const sameLineSettings = document.createElement("div");
  const checkbox2 = document.createElement("input");
  const labelForCheckbox2 = document.createElement("label");

  sameLineSettings.classList.add("sameLineSettings");
  checkbox2.type = "checkbox";
  checkbox2.id = `checkbox2ForLineLoadIndex${currentIndex}`;
  labelForCheckbox2.htmlFor = `checkbox2ForLineLoadIndex${currentIndex}`;
  labelForCheckbox2.textContent = "Tegn linjelast på samme linje som forrige?";
  if (currentIndex === 0) {
    sameLineSettings.classList.add("hidden");
  }

  sameLineSettings.appendChild(labelForCheckbox2);
  sameLineSettings.appendChild(checkbox2);
  settingsModal.appendChild(sameLineSettings);

  checkbox2.addEventListener("change", function () {
    // currentIndex = parseInt(mainDiv.id.slice(13));
    // const positionOnSameLine = 2
    updateLineLoadStartY();
  });

  const deleteLoadBtn = document.createElement("button");
  deleteLoadBtn.classList.add("btn1");
  deleteLoadBtn.classList.add("deleteLoadButton");
  deleteLoadBtn.textContent = "Slet linjelast";
  deleteLoadBtn.addEventListener("click", function () {
    currentIndex = parseInt(mainDiv.id.slice(13));
    if (currentIndex === 0) {
      sameLineSettings.classList.add("hidden");
    }
    lineLoads.splice(currentIndex, 1);
    reduceIndexInLoads("LINELOAD", currentIndex);
    mainDiv.parentNode.removeChild(mainDiv);
    updateLineLoadStartY();
    updateLoadSizes();
  });

  mainDiv.appendChild(h5);
  mainDiv.appendChild(deleteLoadBtn);
  mainDiv.appendChild(settingsIconContainer);
  mainDiv.appendChild(form);

  lineLoadDiv.appendChild(mainDiv);

  lineLoads.push(lineLoadObject);
  console.log(lineLoads);
}



function updateLineLoadStartY() {
  for (let j = 0; j < lineLoads.length; j++) {
    if (j === 0) {
      lineLoads[j].startY = lineCoorY - 15;
    } else if (
      document.getElementById(`checkbox2ForLineLoadIndex${j}`).checked
    ) {
      lineLoads[j].startY = lineLoads[j - 1].startY;
    } else {
      const previousMaxSize = Math.max(lineLoads[j - 1].sizeLeft, lineLoads[j - 1].sizeRight);
      lineLoads[j].startY =
      lineLoads[j - 1].startY - previousMaxSize - 10;
    }
  }
  updateLoadDrawings();
}

function updateLoadSizes() {
  for (let i = 0; i < lineLoads.length; i++) {
    lineLoads[i].sizeLeft =
      document.getElementById(`loadSizeLeftInputLineLoadIndex${i}`)
        .valueAsNumber *
      document.getElementById(`loadScaleInputLineLoadIndex${i}`).valueAsNumber *
      1.5;
    if (document.getElementById(`checkboxTrapezoidLineLoadIndex${i}`).checked) {
      lineLoads[i].sizeRight =
        document.getElementById(`loadSizeRightInputLineLoadIndex${i}`)
          .valueAsNumber *
        document.getElementById(`loadScaleInputLineLoadIndex${i}`)
          .valueAsNumber *
        1.5;
    } else {
      lineLoads[i].sizeRight = lineLoads[i].sizeLeft;
    }
  }
  for (let i = 0; i < pointLoads.length; i++) {
    pointLoads[i].size =
      document.getElementById(`loadSizeInputPointLoadIndex${i}`).valueAsNumber *
      document.getElementById(`loadScaleInputPointLoadIndex${i}`)
        .valueAsNumber *
      1.5;
  }
  updateLineLoadStartY();
  updateLoadDrawings();
}

function fullLoadCheckboxChangeHandler() {
  for (let i = 0; i < lineLoads.length; i++) {
    if (document.getElementById(`checkbox1ForLineLoadIndex${i}`).checked) {
      lineLoads[i].startX = lineCoorLeftX;
      lineLoads[i].length = lineLength;
      document.getElementById(`div2LineLoadIndex${i}`).classList.add("hidden");
    } else {
      document
        .getElementById(`div2LineLoadIndex${i}`)
        .classList.remove("hidden");
    }
  }
  updateLoadDrawings();
}

function updateLineLoadLengthPlaceholder() {
  for (let i = 0; i < lineLoads.length; i++) {
    document.getElementById(
      `numInput3ForLineLoadIndex${i}`
    ).placeholder = spanLengthDecimal;
  }
}

function updateLineLoadStart() {
  for (let i = 0; i < lineLoads.length; i++) {
    if (document.getElementById(`checkbox1ForLineLoadIndex${i}`).checked) {
      continue;
    } else {
      let newStartX = document.getElementById(`numInput2ForLineLoadIndex${i}`)
        .valueAsNumber;
      newStartX = isNaN(newStartX) ? 0 : newStartX;
      lineLoads[i].startX = lineCoorLeftX + newStartX * scale;
      if (
        isNaN(
          document.getElementById(`numInput3ForLineLoadIndex${i}`).valueAsNumber
        )
      ) {
        lineLoads[i].length = lineLength - newStartX * scale;
      }
    }
  }
}

function updateLineLoadLength() {
  for (let i = 0; i < lineLoads.length; i++) {
    if (document.getElementById(`checkbox1ForLineLoadIndex${i}`).checked) {
      continue;
    } else {
      let newLength = document.getElementById(`numInput3ForLineLoadIndex${i}`).valueAsNumber;
      if (isNaN(newLength)) {continue} else {
       lineLoads[i].length = newLength * scale;
      }
    }
  }
  updateLineLoadLengthPlaceholder();
}

function addLineLoadLabel() {
  for (let i = 0; i < lineLoads.length; i++) {
    numberOfDecimals = 2;
    const loadInputLeft = document.getElementById(
      `loadSizeLeftInputLineLoadIndex${i}`
    ).valueAsNumber;
    if (isNaN(loadInputLeft)) {
      continue;
    }
    loadSizeLeftDecimal = parseFloat(loadInputLeft).toFixed(numOfDecimals);
    loadSizeLeftDecimal = loadSizeLeftDecimal.replace(".", ",");

    if (document.getElementById(`checkboxTrapezoidLineLoadIndex${i}`).checked) {
      const loadInputRight = document.getElementById(
        `loadSizeRightInputLineLoadIndex${i}`
      ).valueAsNumber;
      if (isNaN(loadInputRight)) {
        continue;
      }
      loadSizeRightDecimal = parseFloat(loadInputRight).toFixed(numOfDecimals);
      loadSizeRightDecimal = loadSizeRightDecimal.replace(".", ",");
    }
    ctx.font = "14px Arial";
    ctx.fillStyle = lineLoads[i].color;
    let x1;
    let y1;
    let x2;
    let y2;
    let alignment1;
    let alignment2;
    const xOffset = 5;
    const yOffset = 10;
    if (lineLoads[i].labelPos === "TOP_RIGHT") {
      x1 = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y1 = lineLoads[i].startY - lineLoads[i].sizeRight + yOffset;
      alignment1 = "left";
    } else if (lineLoads[i].labelPos === "BOTTOM_RIGHT") {
      x1 = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y1 = lineLoads[i].startY - yOffset / 2;
      alignment1 = "left";
    } else if (lineLoads[i].labelPos === "TOP_LEFT") {
      x1 = lineLoads[i].startX - xOffset;
      y1 = lineLoads[i].startY - lineLoads[i].sizeLeft + yOffset;
      alignment1 = "right";
    } else if (lineLoads[i].labelPos === "BOTTOM_LEFT") {
      x1 = lineLoads[i].startX - xOffset;
      y1 = lineLoads[i].startY - yOffset / 2;
      alignment1 = "right";
    } else if (lineLoads[i].labelPos === "TOP") {
      x1 = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y1 = lineLoads[i].startY - lineLoads[i].sizeRight + yOffset;
      alignment1 = "left";
      x2 = lineLoads[i].startX - xOffset;
      y2 = lineLoads[i].startY - lineLoads[i].sizeLeft + yOffset;
      alignment2 = "right";
    } else if (lineLoads[i].labelPos === "BOTTOM") {
      x1 = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y1 = lineLoads[i].startY - yOffset / 2;
      alignment1 = "left";
      x2 = lineLoads[i].startX - xOffset;
      y2 = lineLoads[i].startY - yOffset / 2;
      alignment2 = "right";
    }
    if (lineLoads[i].labelPos === "TOP" || lineLoads[i].labelPos === "BOTTOM") {
      ctx.textAlign = alignment1;
      ctx.fillText(`${loadSizeRightDecimal} kN/m`, x1, y1);
      ctx.textAlign = alignment2;
      ctx.fillText(`${loadSizeLeftDecimal} kN/m`, x2, y2);
    } else {
      ctx.textAlign = alignment1;
      ctx.fillText(`${loadSizeLeftDecimal} kN/m`, x1, y1);
    }
  }
}

function adjustHorizontalScale() {
  scale = horizontalScaleInput.valueAsNumber * INITIALSCALE;
  setSpanLength();
  updateLoadDrawings();
}

function reduceIndexInLoads(type, deletedIndex) {
  let lineLoadIds;
  let lineLoadLabels;
  let pointLoadIds;
  let pointLoadLabels;
  if (type === "LINELOAD") {
    lineLoadIds = document.querySelectorAll("[id*='ineLoadIndex']");
    lineLoadLabels = document.querySelectorAll(".lineLoadDiv label");
  } else if (type === "POINTLOAD") {
    pointLoadIds = document.querySelectorAll("[id*='ointLoadIndex']");
    pointLoadLabels = document.querySelectorAll(".pointLoadDiv label");
  }
  const startingIndex = deletedIndex + 1;
  let searchedIds;
  if (type === "LINELOAD") {
    searchedIds = lineLoadIds;
  } else if (type === "POINTLOAD") {
    searchedIds = pointLoadIds;
  }
  for (let element of searchedIds) {
    let id = element.id;
    let idIndex;
    if (!isNaN(parseInt(id.slice(-3)))) {
      idIndex = id.slice(-3);
    } else if (!isNaN(parseInt(id.slice(-2)))) {
      idIndex = id.slice(-2);
    } else if (!isNaN(parseInt(id.slice(-1)))) {
      idIndex = id.slice(-1);
    }
    if (idIndex < startingIndex) {
      continue;
    }
    indexLength = String(idIndex).length;
    const idText = id.slice(0, -indexLength),
      newIdIndex = idIndex - 1;
    if (idText === "lineLoadIndex") {
      element.firstChild.innerHTML = `Linjelast #${idIndex}`;
    }
    if (idText === "pointLoadIndex") {
      element.firstChild.innerHTML = `Punktlast #${idIndex}`;
    }
    element.id = idText + newIdIndex;
  }
  let searchedLabels;
  if (type === "LINELOAD") {
    searchedLabels = lineLoadLabels;
  } else if (type === "POINTLOAD") {
    searchedLabels = pointLoadLabels;
  }
  for (const label of searchedLabels) {
    let labelFor = label.htmlFor;
    let labelForIndex;
    if (!isNaN(parseInt(labelFor.slice(-3)))) {
      labelForIndex = labelFor.slice(-3);
    } else if (!isNaN(parseInt(labelFor.slice(-2)))) {
      labelForIndex = labelFor.slice(-2);
    } else if (!isNaN(parseInt(labelFor.slice(-1)))) {
      labelForIndex = labelFor.slice(-1);
    }
    if (labelForIndex < startingIndex) {
      continue;
    }
    indexLength = String(labelForIndex).length;
    const labelForText = labelFor.slice(0, -indexLength),
      newLabelForIndex = labelForIndex - 1;
    label.htmlFor = labelForText + newLabelForIndex;
  }
}

function addPointLoad() {
  let currentIndex = pointLoads.length;
  const pointLoadObject = {
    X: lineCoorLeftX,
    Y: null,
    size: null,
    color: "black",
    labelPos: "TOP_RIGHT",
  };

  const mainDiv = document.createElement("div");
  const h5 = document.createElement("h5");
  const form = document.createElement("form");

  mainDiv.id = `pointLoadIndex${currentIndex}`;
  mainDiv.classList.add("loadDiv");
  mainDiv.classList.add("pointLoadDiv");

  h5.textContent = `Punktlast #${currentIndex + 1}`;

  const settingsIconContainer = document.createElement("div");
  const settingsIcon = document.createElement("img");

  settingsIcon.src = "./resources/data/images/settingsicon.png";
  settingsIcon.classList.add("settingsIcon");

  settingsIconContainer.classList.add("settingsIconContainer");

  function toggleSettingsModal() {
    settingsModal.classList.toggle("pseudoHidden");
  }

  settingsIcon.addEventListener("click", toggleSettingsModal);

  settingsIconContainer.appendChild(settingsIcon);

  // adding input for size of load

  const loadSizeDiv = document.createElement("div");
  const labelForLoadSizeInput = document.createElement("label");
  const loadSizeInput = document.createElement("input");

  loadSizeDiv.classList.add("loadSizeDiv");

  loadSizeInput.id = `loadSizeInputPointLoadIndex${currentIndex}`;
  loadSizeInput.type = "number";
  loadSizeInput.step = "any";
  // loadSizeInput.placeholder = `${spanLengthDecimal}`;
  loadSizeInput.classList.add("numInput");
  loadSizeInput.classList.add("loadInput");
  loadSizeInput.classList.add("noSpinners");

  labelForLoadSizeInput.htmlFor = loadSizeInput;
  labelForLoadSizeInput.textContent = "Størrelse:";

  loadSizeInput.addEventListener("change", function () {
    updateLoadSizes();
  });

  loadSizeInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      updateLoadSizes();
      event.preventDefault();
    }
  });

  loadSizeDiv.appendChild(labelForLoadSizeInput);
  loadSizeDiv.appendChild(loadSizeInput);
  loadSizeDiv.insertAdjacentHTML("beforeend", "kN");

  form.appendChild(loadSizeDiv);

  const div2 = document.createElement("div");
  const pointLoadXInput = document.createElement("input");
  const labelforPointLoadXInput = document.createElement("label");

  div2.classList.add("div2");

  pointLoadXInput.classList.add("numInput");
  pointLoadXInput.classList.add("spanInput");
  pointLoadXInput.classList.add("noSpinners");

  pointLoadXInput.id = `pointLoadXInputPointLoadIndex${currentIndex}`;
  pointLoadXInput.type = "number";
  pointLoadXInput.step = "any";

  labelforPointLoadXInput.htmlFor = pointLoadXInput;
  labelforPointLoadXInput.textContent = "Placering fra venstre:";

  pointLoadXInput.addEventListener("change", updateLoadDrawings);

  div2.appendChild(labelforPointLoadXInput);
  div2.appendChild(pointLoadXInput);
  div2.insertAdjacentHTML("beforeend", "m");

  form.appendChild(div2);

  // ------------ Settings modal ----------

  const settingsModal = document.createElement("div");
  const labelPlacementText = document.createElement("p");
  const labelPlacementSettings = document.createElement("div");
  const radio1 = document.createElement("input");
  const radio2 = document.createElement("input");
  const radio3 = document.createElement("input");
  const radio4 = document.createElement("input");
  const staticModelSprite = document.createElement("img");
  const exitIconContainer = document.createElement("div");
  const exitIcon = document.createElement("img");

  settingsModal.id = `settingsModalPointLoadIndex${currentIndex}`;
  settingsModal.classList.add("settingsModal");
  settingsModal.classList.add("pseudoHidden");
  labelPlacementText.textContent = "Placering af label";
  labelPlacementSettings.classList.add("pointLoadLabelPlacementSettings");
  staticModelSprite.src = "./resources/data/images/pointloadarrow.png";
  radio1.type = "radio";
  radio1.name = `positionRadioPointLoadIndex${currentIndex}`;
  radio1.classList.add("radio1");
  radio1.addEventListener("change", changeLabelPosition);
  radio2.type = "radio";
  radio2.name = `positionRadioPointLoadIndex${currentIndex}`;
  radio2.classList.add("radio2");
  radio2.addEventListener("change", changeLabelPosition);
  radio3.type = "radio";
  radio3.name = `positionRadioPointLoadIndex${currentIndex}`;
  radio3.classList.add("radio3");
  radio3.checked = true;
  radio3.addEventListener("change", changeLabelPosition);
  radio4.type = "radio";
  radio4.name = `positionRadioPointLoadIndex${currentIndex}`;
  radio4.classList.add("radio4");
  radio4.addEventListener("change", changeLabelPosition);
  exitIconContainer.classList.add("exitIconContainer");
  exitIcon.src = "./resources/data/images/crossiconblack.png";

  function changeLabelPosition() {
    let position;
    if (radio1.checked) {
      position = "TOP_LEFT";
    } else if (radio2.checked) {
      position = "BOTTOM_LEFT";
    } else if (radio3.checked) {
      position = "TOP_RIGHT";
    } else if (radio4.checked) {
      position = "BOTTOM_RIGHT";
    }
    pointLoadObject.labelPos = position;

    updateLoadDrawings();
  }

  exitIcon.addEventListener("click", toggleSettingsModal);

  settingsIconContainer.appendChild(settingsModal);
  settingsModal.appendChild(labelPlacementText);
  settingsModal.appendChild(labelPlacementSettings);
  labelPlacementSettings.appendChild(radio1);
  labelPlacementSettings.appendChild(radio2);
  labelPlacementSettings.appendChild(staticModelSprite);
  labelPlacementSettings.appendChild(radio3);
  labelPlacementSettings.appendChild(radio4);
  exitIconContainer.appendChild(exitIcon);
  settingsModal.appendChild(exitIconContainer);

  const loadScaleSettings = document.createElement("div");
  const loadScaleInput = document.createElement("input");
  const labelForLoadScaleInput = document.createElement("label");

  loadScaleSettings.classList.add("loadScaleSettings");

  loadScaleInput.id = `loadScaleInputPointLoadIndex${currentIndex}`;
  loadScaleInput.type = "number";
  if (currentIndex === 0) {
    loadScaleInput.valueAsNumber = 10;
  } else {
    loadScaleInput.valueAsNumber = document.getElementById(
      `loadScaleInputPointLoadIndex${currentIndex - 1}`
    ).valueAsNumber;
  }
  loadScaleInput.classList.add("numInput");
  loadScaleInput.classList.add("scaleSpinner");
  loadScaleInput.classList.add("spinnerOpacity1");
  loadScaleInput.addEventListener("change", updateLoadSizes);

  labelForLoadScaleInput.htmlFor = `loadScaleInputPointLoadIndex${currentIndex}`;
  labelForLoadScaleInput.textContent = "Vertikal skala:";

  loadScaleSettings.appendChild(labelForLoadScaleInput);
  loadScaleSettings.appendChild(loadScaleInput);
  settingsModal.appendChild(loadScaleSettings);

  const colorPickerDiv = document.createElement("div");
  const loadColorPicker = document.createElement("input");
  const loadColorPickerWrapper = document.createElement("p");
  const loadColorPickerLabel = document.createElement("label");

  colorPickerDiv.classList.add("colorPickerDiv");

  loadColorPicker.type = "color";
  loadColorPicker.id = `loadColorLineLoadIndex${currentIndex}`;
  loadColorPicker.classList.add("colorPicker");
  loadColorPicker.value = "black";
  loadColorPicker.style.backgroundColor = loadColorPicker.value;

  loadColorPickerWrapper.id = `loadColorPickerWrapperPointLoadIndex${currentIndex}`;
  loadColorPickerWrapper.classList.add("colorPickerWrapper");
  loadColorPickerWrapper.style.backgroundColor = loadColorPicker.value;

  loadColorPickerLabel.htmlFor = loadColorPickerWrapper;
  loadColorPickerLabel.textContent = "Farve på last:";

  loadColorPicker.addEventListener("change", function () {
    pointLoadObject.color = loadColorPicker.value;
    loadColorPickerWrapper.style.backgroundColor = loadColorPicker.value;
    updateLoadDrawings();
  });

  loadColorPickerWrapper.appendChild(loadColorPicker);
  colorPickerDiv.appendChild(loadColorPickerLabel);
  colorPickerDiv.appendChild(loadColorPickerWrapper);
  settingsModal.appendChild(colorPickerDiv);

  // ----------- End of settingsmodal --------

  const deleteLoadBtn = document.createElement("button");
  deleteLoadBtn.classList.add("btn1");
  deleteLoadBtn.classList.add("deleteLoadButton");
  deleteLoadBtn.textContent = "Slet punktlast";
  deleteLoadBtn.addEventListener("click", function () {
    currentIndex = parseInt(mainDiv.id.slice(14));
    pointLoads.splice(currentIndex, 1);
    reduceIndexInLoads("POINTLOAD", currentIndex);
    mainDiv.parentNode.removeChild(mainDiv);
    updatePointLoadY();
    updateLoadSizes();
  });

  mainDiv.appendChild(h5);
  mainDiv.appendChild(deleteLoadBtn);
  mainDiv.appendChild(settingsIconContainer);
  mainDiv.appendChild(form);

  pointLoadDiv.appendChild(mainDiv);

  pointLoads.push(pointLoadObject);
  updatePointLoadY();
}

function updatePointLoadY() {
  if (pointLoads.length === 0) {
    return;
  } else {
    let currentIndex = -1;
    for (const pointLoadObject of pointLoads) {
      currentIndex++;
      if (lineLoads.length !== 0) {
        let a = [];
        for (let i = lineLoads.length - 1; i >= 0; i--) {
          if (
            lineLoads[i].startX <= pointLoadObject.X &&
            pointLoadObject.X <= lineLoads[i].startX + lineLoads[i].length
          ) {
            const x1 = lineLoads[i].startX;
            const x2 = lineLoads[i].startX + lineLoads[i].length;
            const y1 = lineLoads[i].sizeLeft;
            const y2 = lineLoads[i].sizeRight;
            const pointLoadX = pointLoadObject.X;
            const lineLoadSize = y1 + ((y2 - y1) / (x2 - x1)) * (pointLoadX - x1);
            a.push(lineLoads[i].startY - lineLoadSize);
          }
        }
        if (a.length !== 0) {
          pointLoadObject.Y = Math.min(...a) - 10;
        } else {
          pointLoadObject.Y = lineCoorY - 15;
        }
      } else {
        pointLoadObject.Y = lineCoorY - 15;
      }

      let b = 0;
      if (pointLoads.length !== 0) {
        for (let i = 0; i < pointLoads.length; i++) {
          if (i < currentIndex) {
            b =
              pointLoads[i].X === pointLoadObject.X
                ? b + pointLoads[i].size + 10
                : b;
          }
        }
      }
      pointLoadObject.Y = pointLoadObject.Y - b;
    }
  }
}

function updatePointLoadX() {
  if (pointLoads.length === 0) {
    return;
  } else {
    for (let i = 0; i < pointLoads.length; i++) {
      const xInput = document.getElementById(
        `pointLoadXInputPointLoadIndex${i}`
      ).valueAsNumber;
      pointLoads[i].X = isNaN(xInput)
        ? lineCoorLeftX
        : lineCoorLeftX + xInput * scale;
    }
  }
}

function addPointLoadLabel() {
  for (let i = 0; i < pointLoads.length; i++) {
    numberOfDecimals = 2;
    const loadInput = document.getElementById(`loadSizeInputPointLoadIndex${i}`)
      .valueAsNumber;
    if (isNaN(loadInput)) {
      continue;
    }
    loadSizeDecimal = parseFloat(loadInput).toFixed(numOfDecimals);
    loadSizeDecimal = loadSizeDecimal.replace(".", ",");
    ctx.font = "14px Arial";
    ctx.fillStyle = pointLoads[i].color;
    loadX = pointLoads[i].X;
    loadY = pointLoads[i].Y;
    loadSize = pointLoads[i].size;
    let x;
    let y;
    let alignment;
    const xOffset = 8;
    const yOffset = 10;
    if (pointLoads[i].labelPos === "TOP_RIGHT") {
      x = loadX + xOffset;
      y = loadY - loadSize + yOffset;
      alignment = "left";
    } else if (pointLoads[i].labelPos === "BOTTOM_RIGHT") {
      x = loadX + xOffset;
      y = loadY - yOffset / 2;
      alignment = "left";
    } else if (pointLoads[i].labelPos === "TOP_LEFT") {
      x = loadX - xOffset;
      y = loadY - loadSize + yOffset;
      alignment = "right";
    } else if (pointLoads[i].labelPos === "BOTTOM_LEFT") {
      x = loadX - xOffset;
      y = loadY - yOffset / 2;
      alignment = "right";
    }
    ctx.textAlign = alignment;
    ctx.fillText(`${loadSizeDecimal} kN`, x, y);
  }
}

// --------------- Update Load Drawings Function -----------------------

function updateLoadDrawings() {
  drawModel();
  updateLineLoadStart();
  updateLineLoadLength();
  updatePointLoadX();
  updatePointLoadY();
  for (let i = 0; i < lineLoads.length; i++) {
    if (
      isNaN(
        document.getElementById(`loadSizeLeftInputLineLoadIndex${i}`)
          .valueAsNumber
      )
    ) {
      continue;
    }
    drawLineLoad(
      lineLoads[i].startX,
      lineLoads[i].length,
      lineLoads[i].sizeLeft,
      lineLoads[i].sizeRight,
      lineLoads[i].startY,
      lineLoads[i].color,
      lineLoads[i].density
    );
  }
  for (let j = 0; j < pointLoads.length; j++) {
    if (
      isNaN(
        document.getElementById(`loadSizeInputPointLoadIndex${j}`).valueAsNumber
      )
    ) {
      continue;
    }
    drawArrowForLoad(
      pointLoads[j].X,
      pointLoads[j].Y,
      pointLoads[j].size,
      pointLoads[j].color
    );
  }
  addLineLoadLabel();
  addPointLoadLabel();
}


// function changeDecimals(id, value)

// ---------------------------- END OF FUNCTIONS ---------------------------------

// ------------------------------ CODE EXECUTION -------------------------------

canvas.width =
  window.innerWidth -
  parseInt(canvas.style.left.slice(0, canvas.style.left.length - 2)) -
  canvasMarginRight;

canvas.height =
  window.innerHeight -
  parseInt(canvas.style.top.slice(0, canvas.style.top.length - 2)) -
  canvasMarginBottom;

resizeCanvas();

horizontalScaleInput.value = INITIALSCALE / INITIALSCALE;

// ------------------------------- EVENTLISTENERS ETC --------------------------

addLineLoadButton.addEventListener("click", addLineLoad);

addPointLoadButton.addEventListener("click", addPointLoad);

window.addEventListener("resize", resizeCanvas);

const spanLengthInputHandler = event => {
  if (
    event.type === "change" ||
    (event.type === "keydown" && event.key === "Enter")
  ) {
    if (
      isNaN(spanLengthInput.valueAsNumber) ||
      spanLengthInput.valueAsNumber === 0
    ) {
      return;
    }
    setSpanLength();
    event.preventDefault();
  }
};
spanLengthInput.addEventListener("change", spanLengthInputHandler);
spanLengthInput.addEventListener("keydown", spanLengthInputHandler);

horizontalScaleInput.addEventListener("change", adjustHorizontalScale);

horizontalScaleInput.addEventListener("change", function () {
  horizontalScaleSlider.value = horizontalScaleInput.value * 200;
});

horizontalScaleSlider.addEventListener("change", function () {
  let sliderValue = horizontalScaleSlider.value;
  horizontalScaleInput.value = (sliderValue / 200).toFixed(2);
  adjustHorizontalScale();
});

// Make open icon for span settings modal work
document
  .getElementById("spanSettingsIcon")
  .addEventListener("click", function () {
    document
      .getElementById("spanSettingsModal")
      .classList.toggle("pseudoHidden");
  });

// Make exit icon for span settings modal work
document
  .getElementById("spanSettingsExitIcon")
  .addEventListener("click", function () {
    document
      .getElementById("spanSettingsModal")
      .classList.toggle("pseudoHidden");
  });

document
  .getElementById("manualScaleCheckbox")
  .addEventListener("change", function () {
    document.getElementById("spanScaleSettings").classList.toggle("hidden");
    setSpanLength();
    updateLoadDrawings();
  });

document
  .getElementById("lineLoadsSettingsIcon")
  .addEventListener("click", function () {
    document
      .getElementById("lineLoadsSettingsModal")
      .classList.toggle("pseudoHidden");
  });

document
  .getElementById("lineLoadsSettingsExitIcon")
  .addEventListener("click", function () {
    document
      .getElementById("lineLoadsSettingsModal")
      .classList.toggle("pseudoHidden");
  });

document
  .getElementById("pointLoadsSettingsIcon")
  .addEventListener("click", function () {
    document
      .getElementById("pointLoadsSettingsModal")
      .classList.toggle("pseudoHidden");
  });

document
  .getElementById("pointLoadsSettingsExitIcon")
  .addEventListener("click", function () {
    document
      .getElementById("pointLoadsSettingsModal")
      .classList.toggle("pseudoHidden");
  });

document
  .getElementById("allLineLoadsScaleInput")
  .addEventListener("change", function () {
    const lineloadScaleInputs = document.querySelectorAll(
      "[id*='loadScaleInputLineLoadIndex']"
    );
    const allLineLoadsScale = document.getElementById("allLineLoadsScaleInput")
      .valueAsNumber;
    for (const scaleInput of lineloadScaleInputs) {
      scaleInput.value = allLineLoadsScale;
    }
    updateLoadSizes();
  });

document
  .getElementById("allPointLoadsScaleInput")
  .addEventListener("change", function () {
    const pointloadScaleInputs = document.querySelectorAll(
      "[id*='loadScaleInputPointLoadIndex']"
    );
    const allPointLoadsScale = document.getElementById(
      "allPointLoadsScaleInput"
    ).valueAsNumber;
    for (const scaleInput of pointloadScaleInputs) {
      scaleInput.value = allPointLoadsScale;
    }
    updateLoadSizes();
  });
