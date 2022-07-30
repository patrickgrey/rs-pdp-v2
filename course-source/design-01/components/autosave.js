import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';
import * as errorFeedback from './errorFeedback.js';

// let isSaving = false;
let changedIds = [];
let timer = null;
const savingDelay = 3000;


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

function postData() {
  console.log("posting");
  // build object array to post as JSON based on array.
  serverWait();
}

function serverWait() {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok" };
    getResponse(response);
  }, 1000);
}

function getResponse(response) {
  console.log(response);
  if (response.status === "ok") {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
    enableForm();
  }
}

const init = () => {

};

export { init, startSave }