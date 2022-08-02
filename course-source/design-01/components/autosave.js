import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';
import * as errorFeedback from './errorFeedback.js';

// let isSaving = false;
let changedIds = [];
let timer = null;
const savingDelay = 100;


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

function startSave(id, type, newValue) {
  // if (isSaving) return;
  if (!checkValueHasChanged(id, type, newValue)) return;
  console.log("Starting save");
  // htmlComponents.pdpFormObjectives
  htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);
  // isSaving = true;
  console.log(changedIds);
  if (!changedIds.includes(id)) changedIds.push(id);
  resetTimer();
}

function resetTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(postData, savingDelay);
}

function getObjective(data) {

}

function postData() {
  console.log("posting");
  // build object array to post as JSON based on array.
  // Or can I get this from the store?
  // Do we need the store? All data is stored as is on the page and at DB
  // after save.
  // It does take some code out of other components.
  // If more than one component depends on store, it is worth it?
  // We need to add, update and delete objectives. Should server call
  // be with objectives too?
  // If we need to add new features in future or other tools need
  // more features based on this code, it is probably worth extracting objectives.
  // When should the store be updated?
  // Need to refactor to take post code out of here.
  let postJSON = [];
  changedIds.forEach(id => {
    const objective = document.querySelector(`li[data-objective-id="${id}"]`);
    console.log(objective);

  })
  serverWait();
}

function serverWait() {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok" };
    getResponse(response);
  }, 1000);
}

function getResponse(response) {
  if (response.status === "ok") {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

const init = () => {
  htmlComponents.pdpFormObjectives.addEventListener("input", function (event) {
    console.log("input: ", event.target);
  })
};

export { init, startSave }