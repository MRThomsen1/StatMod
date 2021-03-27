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
  const h6 = document.createElement("h6");
  const headerContainer = document.createElement("div");

  mainDiv.id = `pointLoadIndex${currentIndex}`;
  mainDiv.classList.add("loadDiv");
  mainDiv.classList.add("pointLoadDiv");

  h6.textContent = `Punktlast #${currentIndex + 1}`;

  headerContainer.classList.add("header-container");
  headerContainer.classList.add("single-point-load-header-container");

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

  headerContainer.appendChild(h6);
  headerContainer.appendChild(deleteLoadBtn);
  headerContainer.appendChild(settingsIconContainer);

  mainDiv.appendChild(headerContainer);
  mainDiv.appendChild(loadSizeDiv);
  mainDiv.appendChild(div2);

  pointLoadDiv.appendChild(mainDiv);

  pointLoads.push(pointLoadObject);
  updatePointLoadY();
}