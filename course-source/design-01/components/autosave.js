import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';
import * as errorFeedback from './errorFeedback.js';

let isSaving = false;
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
  if (isSaving) return;
  if (!checkValueHasChanged(id, type, newValue)) return;
  console.log("Starting save");
  isSaving = true;
  if (!changedIds.contains(id)) changedIds.push(id);
  startTimer();
}

function startTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
  // Update component to "saving.."
  timer = setTimeout(postData, savingDelay);
}

function postData() {
  // build object array to post as JSON based on array.
  serverWait();
}

function serverWait() {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok" };
  }, 1000);
}

const init = () => {

};

export { init, startSave }