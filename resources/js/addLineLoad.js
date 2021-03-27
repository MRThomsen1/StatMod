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
  const headerContainer = document.createElement("div");
  const h6 = document.createElement("h6");

  mainDiv.id = `lineLoadIndex${currentIndex}`;
  mainDiv.classList.add("loadDiv");
  mainDiv.classList.add("lineLoadDiv");

  h6.textContent = `Linjelast #${currentIndex + 1}`;

  headerContainer.classList.add("header-container");
  headerContainer.classList.add("single-line-load-header-container");

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
    } else {
      changeLabelPosition();
    }
  }
  function changeLabelPositionBottom() {
    if (checkboxTrapezoidLoad.checked) {
      radio2.checked = true;
      radio4.checked = true;
      const position = "BOTTOM";
      lineLoadObject.labelPos = position;
      updateLoadDrawings();
    } else {
      changeLabelPosition();
    }
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

  headerContainer.appendChild(h6);
  headerContainer.appendChild(deleteLoadBtn);
  headerContainer.appendChild(settingsIconContainer);

  mainDiv.appendChild(headerContainer);
  mainDiv.appendChild(loadSizeDiv);
  mainDiv.appendChild(labelForCheckbox1);
  mainDiv.appendChild(checkbox1);
  mainDiv.appendChild(div2);

  lineLoadDiv.appendChild(mainDiv);

  lineLoads.push(lineLoadObject);
  console.log(lineLoads);
}