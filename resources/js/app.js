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
let numOfDecimals = 1;

let lineLength = setLineCoordinates(scale);
let lineClearCoordinates = {};
let loadRectanglesX = [];
let loadRectanglesY = [];
let loadRectanglesW = [];
let loadRectanglesH = [];

let lineLoads = [];

let fullLoadCheckboxClass;

const spanLengthInput = document.getElementById("spanLengthId");

const addLineLoadButton = document.getElementById("addLineLoadBtn");
const addPointLoadButton = document.getElementById("addPointLoadBtn");

const lineLoadDiv = document.getElementById("lineLoadDiv");
const pointLoadDiv = document.getElementById("pointLoadDiv");

const clearButton = document.getElementById("clearBtn");

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
  updateLineLoadLengthPlaceholder();
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
  horizontalScaleSlider.value = scale * INITIALSCALE/200;
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

function drawLineLoad(start, length, size, yPosition, color) {
  // const unscaledLength = length;
  // length = length * scale;
  const lineLoadCoordinates = [
    start,
    yPosition,
    start,
    yPosition - size,
    start + length,
    yPosition - size,
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
  loadRectanglesX.push(start - 1);
  loadRectanglesY.push(yPosition - size - 1);
  loadRectanglesW.push(length + 2);
  loadRectanglesH.push(size + 2);

  const INITIALDISTANCE = 25;
  const density = 1;
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

  /*
  if (scale <= INITIALSCALE) {
    arrowXCoordinatesLeft = [centerXCoordinate - (0.0625 / density) * scale];
    arrowXCoordinatesRight = [centerXCoordinate + (0.0625 / density) * scale];
  } else if (lineLength + 0.1 > MINIMUMLINELENGTH) {
    if (
      length >= lineLength ||
      (length < MINIMUMLINELENGTH && length > MINIMUMLINELENGTH / 3)
    ) {
      arrowXCoordinatesLeft = [centerXCoordinate - length / (8 * density)];
      arrowXCoordinatesRight = [centerXCoordinate + length / (8 * density)];
    } else {
      arrowXCoordinatesLeft = [centerXCoordinate];
    }
  }

  for (let i = 0; i < (numberOfArrows - 2) / 2; i++) {
    arrowXCoordinatesLeft.push(
      arrowXCoordinatesLeft[i] - (0.125 / density) * scale
    );
    arrowXCoordinatesRight.push(
      arrowXCoordinatesRight[i] + (0.125 / density) * scale
    );
  }
*/

  for (let i = 0; i < arrowXCoordinatesLeft.length; i++) {
    drawArrowForLoad(arrowXCoordinatesLeft[i], yPosition, size, color);
  }
  for (let i = 0; i < arrowXCoordinatesRight.length; i++) {
    drawArrowForLoad(arrowXCoordinatesRight[i], yPosition, size, color);
  }
  /*console.log(
    lineCoorLeftX,
    lineCoorRightX,
    arrowXCoordinatesLeft,
    arrowXCoordinatesRight
  );*/
}

function clearLoads() {
  ctx.clearRect(0, 0, canvas.width, lineCoorY - 5);
  /*for (let i = 0; i < loadRectanglesX.length; i++) {
    ctx.clearRect(
      loadRectanglesX[i],
      loadRectanglesY[i],
      loadRectanglesW[i],
      loadRectanglesH[i]
    );
  }*/
  loadRectanglesX = [];
  loadRectanglesY = [];
  loadRectanglesW = [];
  loadRectanglesH = [];
}

function isOdd(x) {
  if (+x % 2 === 1) {
    return true;
  } else {
    return false;
  }
}

function addLineLoad() {
  const lineLoadObject = {
    startX: lineCoorLeftX,
    length: lineLength,
    size: null,
    startY: null,
    color: "black",
    labelPlace: "top_right",
  };
  if (lineLoads.length === 0) {
    lineLoadObject.startY = lineCoorY - 15;
  } else {
    lineLoadObject.startY =
      lineLoads[lineLoads.length - 1].startY -
      lineLoads[lineLoads.length - 1].size -
      10;
  }
  const mainDiv = document.createElement("div");
  const h5 = document.createElement("h5");
  const form = document.createElement("form");

  const label1 = document.createElement("label");
  const checkbox1 = document.createElement("input");
  const subDiv1 = document.createElement("div");
  const paragraph1 = document.createElement("p");
  const label2 = document.createElement("label");
  const numInput2 = document.createElement("input");
  const label3 = document.createElement("label");
  const numInput3 = document.createElement("input");

  mainDiv.id = `lineLoadIndex${lineLoads.length}`;
  mainDiv.classList.add("lineLoadDiv");

  h5.textContent = `Linjelast #${lineLoads.length + 1}`;
  mainDiv.appendChild(h5);

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
  mainDiv.appendChild(settingsIconContainer);

  // start and length inputs of load being added
  checkbox1.id = `checkbox1ForLineLoadIndex${lineLoads.length}`;
  checkbox1.type = "checkbox";
  // checkbox1.classList.add("fullLoadCheckbox");
  checkbox1.checked = true;
  checkbox1.addEventListener("change", fullLoadCheckboxChangeHandler);

  label1.htmlFor = `checkbox1ForLineLoadIndex${lineLoads.length}`;
  label1.textContent = "Last over hele modellens længde?";

  subDiv1.id = `subDiv1Index${lineLoads.length}`;
  subDiv1.classList.add("hidden");

  numInput2.id = `numInput2ForLineLoadIndex${lineLoads.length}`;
  numInput2.type = "number";
  numInput2.placeholder = "0,0";
  numInput2.classList.add("numInput");
  numInput2.classList.add("loadInput");
  numInput2.classList.add("noSpinners");
  numInput2.addEventListener("change", updateLineLoadStart);

  label2.htmlFor = `numInput2ForLineLoadIndex${lineLoads.length}`;
  label2.textContent = "Start: ";

  numInput3.id = `numInput3ForLineLoadIndex${lineLoads.length}`;
  numInput3.type = "number";
  numInput3.placeholder = `${spanLengthDecimal}`;
  numInput3.classList.add("numInput");
  numInput3.classList.add("loadInput");
  numInput3.classList.add("noSpinners");
  numInput3.addEventListener("change", updateLineLoadLength);

  label3.htmlFor = `numInput3ForLineLoadIndex${lineLoads.length}`;
  label3.textContent = "Udbredelse: ";

  paragraph1.classList.add("smallFont");
  paragraph1.classList.add("whiteSpacePre");

  paragraph1.appendChild(label2);
  paragraph1.appendChild(numInput2);
  paragraph1.insertAdjacentHTML("beforeend", "m  ");
  paragraph1.appendChild(label3);
  paragraph1.appendChild(numInput3);
  paragraph1.insertAdjacentHTML("beforeend", "m");
  subDiv1.appendChild(paragraph1);

  form.appendChild(label1);
  form.appendChild(checkbox1);
  form.appendChild(subDiv1);
  // start and length inputs of load added

  // adding input for size of load
  const paragraph2 = document.createElement("p");
  const label4 = document.createElement("label");
  const loadSizeInput = document.createElement("input");
  // const numOfDecimalsOnLoad = document.createElement("input");

  paragraph2.classList = "whiteSpacePre";

  loadSizeInput.id = `loadSizeInputIndex${lineLoads.length}`;
  loadSizeInput.type = "number";
  // loadSizeInput.placeholder = `${spanLengthDecimal}`;
  loadSizeInput.classList.add("numInput");
  loadSizeInput.classList.add("loadInput");
  loadSizeInput.classList.add("noSpinners");

  label4.htmlFor = loadSizeInput;
  label4.textContent = "Størrelse: ";

  loadSizeInput.addEventListener("change", updateLoadSizes);

  const loadScaleInput = document.createElement("input");
  loadScaleInput.id = `loadScaleInputIndex${lineLoads.length}`;
  loadScaleInput.type = "number";
  if (lineLoads.length === 0) {
    loadScaleInput.valueAsNumber = 10;
  } else {
    loadScaleInput.valueAsNumber = document.getElementById(
      `loadScaleInputIndex${lineLoads.length - 1}`
    ).valueAsNumber;
  }
  loadScaleInput.classList.add("numInput");
  loadScaleInput.classList.add("scaleSpinner");
  loadScaleInput.classList.add("spinnerOpacity1");
  loadScaleInput.addEventListener("change", updateLoadSizes);

  // numOfDecimalsOnLoad.id = `numOfDecimalsOnLoadIndex${lineLoads.length}`;
  // numOfDecimalsOnLoad.type = "number";
  // numOfDecimalsOnLoad.classList.add("decimalSpinner");
  // numOfDecimalsOnLoad.value = 1;

  // numOfDecimalsOnLoad.addEventListener("change", changeDecimals(loadSizeInput, numOfDecimalsOnLoad.valueAsNumber));

  paragraph2.classList.add("smallFont");

  paragraph2.appendChild(label4);
  paragraph2.appendChild(loadSizeInput);
  paragraph2.insertAdjacentHTML("beforeend", " kN/m   ");
  paragraph2.insertAdjacentHTML("beforeend", "Skala");
  paragraph2.appendChild(loadScaleInput);

  // paragraph2.appendChild(changeLoadScaleBtn);
  // paragraph2.appendChild(numOfDecimalsOnLoad);
  // paragraph2.insertAdjacentHTML("beforeend", " (antal decimaler)")

  form.appendChild(paragraph2);

  // input for size of load added

  const paragraph3 = document.createElement("p");
  const loadColorPicker = document.createElement("input");
  const loadColorPickerWrapper = document.createElement("p");
  const loadColorPickerLabel = document.createElement("label");

  loadColorPicker.type = "color";
  loadColorPicker.id = `loadColorIndex${lineLoads.length}`;
  loadColorPicker.classList.add("colorPicker");
  loadColorPicker.value = "black";
  loadColorPicker.style.backgroundColor = loadColorPicker.value;
  loadColorPicker.addEventListener("change", updateLoadColor);

  loadColorPickerWrapper.id = `loadColorPickerWrapperIndex${lineLoads.length}`;
  loadColorPickerWrapper.classList.add("colorPickerWrapper");
  loadColorPickerWrapper.style.backgroundColor = loadColorPicker.value;

  loadColorPickerLabel.htmlFor = loadColorPickerWrapper;
  loadColorPickerLabel.textContent = "Farve på last:";

  loadColorPickerWrapper.appendChild(loadColorPicker);
  paragraph3.appendChild(loadColorPickerLabel);
  paragraph3.appendChild(loadColorPickerWrapper);
  form.appendChild(paragraph3);

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

  settingsModal.id = `settingsModalIndex${lineLoads.length}`;
  settingsModal.classList.add("settingsModal");
  settingsModal.classList.add("pseudoHidden");
  labelPlacementText.textContent = "Placering af label";
  labelPlacementSettings.classList.add("labelPlacementSettings");
  staticModelSprite.src = "./resources/data/images/Statisk model2.png";
  radio1.type = "radio";
  radio1.name = "position";
  radio1.classList.add("radio1");
  radio1.addEventListener("change", changeLabelPosition);
  radio2.type = "radio";
  radio2.name = "position";
  radio2.classList.add("radio2");
  radio2.addEventListener("change", changeLabelPosition);
  radio3.type = "radio";
  radio3.name = "position";
  radio3.classList.add("radio3");
  radio3.checked = true;
  radio3.addEventListener("change", changeLabelPosition);
  radio4.type = "radio";
  radio4.name = "position";
  radio4.classList.add("radio4");
  radio4.addEventListener("change", changeLabelPosition);
  exitIconContainer.classList.add("exitIconContainer");
  exitIcon.src = "./resources/data/images/crossiconblack.png";

  function changeLabelPosition() {
    let position;
    if (radio1.checked) {
      position = "top_left";
    } else if (radio2.checked) {
      position = "bottom_left";
    } else if (radio3.checked) {
      position = "top_right";
    } else if (radio4.checked) {
      position = "bottom_right";
    }
    lineLoadObject.labelPlace = position;

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

  // adding button for drawing loads

  mainDiv.appendChild(form);

  lineLoadDiv.appendChild(mainDiv);

  lineLoads.push(lineLoadObject);
  console.log(lineLoads);
}

function updateLoadDrawings() {
  clearLoads();
  for (let i = 0; i < lineLoads.length; i++) {
    if (
      isNaN(document.getElementById(`loadSizeInputIndex${i}`).valueAsNumber)
    ) {
      continue;
    }
    drawLineLoad(
      lineLoads[i].startX,
      lineLoads[i].length,
      lineLoads[i].size,
      lineLoads[i].startY,
      lineLoads[i].color
    );
  }
  addLineLoadLabel();
}

function updateLoadSizes() {
  for (let i = 0; i < lineLoads.length; i++) {
    lineLoads[i].size =
      document.getElementById(`loadSizeInputIndex${i}`).valueAsNumber *
      document.getElementById(`loadScaleInputIndex${i}`).valueAsNumber *
      1.5;
    if (i !== 0 && lineLoads[i - 1].size !== 0) {
      lineLoads[i].startY =
        lineLoads[i - 1].startY - lineLoads[i - 1].size - 10;
    }
  }
  updateLoadDrawings();
}

function fullLoadCheckboxChangeHandler() {
  for (let i = 0; i < lineLoads.length; i++) {
    if (document.getElementById(`checkbox1ForLineLoadIndex${i}`).checked) {
      lineLoads[i].startX = lineCoorLeftX;
      lineLoads[i].length = lineLength;
      document.getElementById(`subDiv1Index${i}`).classList.add("hidden");
    } else {
      document.getElementById(`subDiv1Index${i}`).classList.remove("hidden");
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
      lineLoads[i].startX =
        lineCoorLeftX +
        document.getElementById(`numInput2ForLineLoadIndex${i}`).valueAsNumber *
          scale;
    }
  }
  updateLoadDrawings();
}

function updateLineLoadLength() {
  for (let i = 0; i < lineLoads.length; i++) {
    if (document.getElementById(`checkbox1ForLineLoadIndex${i}`).checked) {
      continue;
    } else {
      lineLoads[i].length =
        document.getElementById(`numInput3ForLineLoadIndex${i}`).valueAsNumber *
        scale;
    }
  }
  updateLoadDrawings();
  updateLineLoadLengthPlaceholder();
}

function updateLoadColor() {
  for (let i = 0; i < lineLoads.length; i++) {
    lineLoads[i].color = document.getElementById(`loadColorIndex${i}`).value;
    document.getElementById(
      `loadColorPickerWrapperIndex${i}`
    ).style.backgroundColor = document.getElementById(
      `loadColorIndex${i}`
    ).value;
  }
  updateLoadDrawings();
}

function addLineLoadLabel() {
  for (let i = 0; i < lineLoads.length; i++) {
    numberOfDecimals = 1;
    const loadInput = document.getElementById(`loadSizeInputIndex${i}`)
      .valueAsNumber;
    if (isNaN(loadInput)) {
      continue;
    }
    loadSizeDecimal = parseFloat(loadInput).toFixed(numOfDecimals);
    loadSizeDecimal = loadSizeDecimal.replace(".", ",");
    ctx.font = "14px Arial";
    ctx.fillStyle = lineLoads[i].color;
    let x;
    let y;
    let alignment;
    const xOffset = 5;
    const yOffset = 10;
    if (lineLoads[i].labelPlace === "top_right") {
      x = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y = lineLoads[i].startY - lineLoads[i].size + yOffset;
      alignment = "left";
    } else if (lineLoads[i].labelPlace === "bottom_right") {
      x = lineLoads[i].startX + lineLoads[i].length + xOffset;
      y = lineLoads[i].startY - yOffset / 2;
      alignment = "left";
    } else if (lineLoads[i].labelPlace === "top_left") {
      x = lineLoads[i].startX - xOffset;
      y = lineLoads[i].startY - lineLoads[i].size + yOffset;
      alignment = "right";
    } else if (lineLoads[i].labelPlace === "bottom_left") {
      x = lineLoads[i].startX - xOffset;
      y = lineLoads[i].startY - yOffset / 2;
      alignment = "right";
    }
    ctx.textAlign = alignment;
    ctx.fillText(`${loadSizeDecimal} kN/m`, x, y);
  }
}

function adjustHorizontalScale() {
  scale = horizontalScaleInput.valueAsNumber * INITIALSCALE;
  setSpanLength();
  updateLoadDrawings();
}

function reduceIndexInLineLoads (deletedIndex) {

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

window.addEventListener("resize", resizeCanvas);

clearButton.addEventListener("click", clearLoads);

// Funktionen setSpanLenght kaldes, når tegn-knappen trykkes på. "Enter" gør det samme som knap-tryk
$("#spanLengthId").keypress(function (event) {
  if (event.keyCode === 13) {
    $("#tegnBtn").click();
  }
});
$("#tegnBtn").click(function () {
  if (
    isNaN(spanLengthInput.valueAsNumber) ||
    spanLengthInput.valueAsNumber === 0
  ) {
    return;
  }
  setSpanLength();
  event.preventDefault();
});

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
  });
