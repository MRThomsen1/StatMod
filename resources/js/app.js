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

function updateLineLoadStartY() {
  for (let j = 0; j < lineLoads.length; j++) {
    if (j === 0) {
      lineLoads[j].startY = lineCoorY - 15;
    } else if (
      document.getElementById(`checkbox2ForLineLoadIndex${j}`).checked
    ) {
      lineLoads[j].startY = lineLoads[j - 1].startY;
    } else {
      const previousMaxSize = Math.max(
        lineLoads[j - 1].sizeLeft,
        lineLoads[j - 1].sizeRight
      );
      lineLoads[j].startY = lineLoads[j - 1].startY - previousMaxSize - 10;
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
      let newLength = document.getElementById(`numInput3ForLineLoadIndex${i}`)
        .valueAsNumber;
      if (isNaN(newLength)) {
        continue;
      } else {
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
            const lineLoadSize =
              y1 + ((y2 - y1) / (x2 - x1)) * (pointLoadX - x1);
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

function adjustNumberOfSpanDecimals() {
  const chosenValue = document.getElementById("decimalsSpanInput").value;
  numOfDecimals = chosenValue;
  labelSpan();
  updateLoadDrawings();
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
  .getElementById("decimalsSpanInput")
  .addEventListener("change", adjustNumberOfSpanDecimals);

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
