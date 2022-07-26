import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';

let changedIds = [];
let timer = null;
const savingDelay = 1000;
let isSaving = false;

// Only want to save if targeted elements AND there has been a change.
// Can I do this efficiently

// What if the user starts on another objective while the current one is still
// saving?
// Focus is starting to look good but  textareas then become a concern 
// only saving once for a possibly large amount of text.
// Could save an array of objective IDs then build an object containing more
// than one objective to update server side?


function checkValueHasChanged(id, type, newValue) {
  return objectiveStore.getObjectiveData(id)[type] != newValue;
}

function updateObjective(target) {
  const id = target.closest("li").dataset.objectiveId;
  const type = target.dataset.objectiveType;
  const newValue = type === "satisfied" ? target.checked : target.value;
  if (!checkValueHasChanged(id, type, newValue)) return;
  if (!changedIds.includes(id)) changedIds.push(id);
  objectiveStore.updateObjective(id, type, newValue);
}

function startSave() {
  // if (!checkValueHasChanged(id, type, newValue)) return;
  htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);
  resetTimer();
}

// DO WE WANT TO TRIGGER ANOTHER SAVE WHILE WAITING FOR SUCCESS OF THE LAST ONE?
// NO, WHAT IF ERROR.
function timeoutHander(event) {
  // Check if a save to server is already going on.
  if (isSaving) {
    resetTimer();
    return;
  }
  else {
    isSaving = true;
    objectiveStore.saveObjective(changedIds);
    changedIds = [];
  }
}

function resetTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(timeoutHander, savingDelay);
}

const init = () => {
  htmlComponents.pdpFormObjectives.addEventListener("input", function (event) {
    const input = event.target;
    if (input.dataset.objectiveType === "title") {
      console.log("hi");
      input.closest(`li`).querySelector(`summary span:first-child`).textContent = input.value;
    }
    updateObjective(input);
    startSave();
  });

  htmlComponents.pdpFormObjectives.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.competencyChanged, function (event) {
    updateObjective(event.detail.target);
    startSave();
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.dueDateChanged, function (event) {
    updateObjective(event.detail.target);
    startSave();
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.updated, function (event) {
    isSaving = false;
  });
};

export { init, startSave }