/**
 * NOTE: "Update" means local copy is changed. "Saved" means objective saved to database.
 * 
 * Trigger, track and complete autosaves. The original idea was to save when a field lost focus but if there was a problem when a large amount of text had been written, or the user forgets to leave the field as they go back to an interview, a lot of input could be lost. Instead, we start the process when any input is detected. Calls to the server are throttled by a timer. Each time a new input event e.g. key press is detected, the timer is reset so saving only actually occurs in a break from adding content.
 * 
 * In this component, for every content change, the local model is updated immediately. Objectives are only saved after the timer when a snapshot of the objectives is taken. Only one save can be done at a time in case there is an error in return.
 */
import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';

// An array of objective objects
let changedIds = [];
let timer = null;
const savingDelay = 1000;
// Flag to prevent new autosave when waiting to hear back from the API.
let isSaving = false;

/**
 * Check whether an input event has actually created any change to save.
 * Tabbing out of a field is an example of an event that creates no change.
 * In this case, autosave shouldn't be triggered.
 *
 * @param {string} id - objective ID
 * @param {string} type - the data property to find e.g. title, description etc.
 * @param {string} newValue - The value to test against
 * @return {boolean} Is it a change?
 */
function checkValueHasChanged(id, type, newValue) {
  return objectiveStore.getObjectiveData(id)[type] != newValue;
}

/**
 * Update the local model of the objective if it's a new value.
 *
 * @param {HTMLElement} target - the element that firec the event.
 */
function updateObjective(target) {
  const id = target.closest("li").dataset.objectiveId;
  const type = target.dataset.objectiveType;
  const newValue = type === "satisfied" ? target.checked : target.value;
  if (!checkValueHasChanged(id, type, newValue)) return;
  if (!changedIds.includes(id)) changedIds.push(id);
  // This should be an event dispatch
  htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);
  // objectiveStore.updateObjective(id, type, newValue);
}


/**
 * Trigger a store save.
 */
function timeoutHander(event) {
  // Check if a save to server is already going on.
  if (isSaving) {
    resetTimer();
    return;
  }
  else {
    isSaving = true;
    // This should be an event dispatch
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.savingEvent(changedIds));
    // objectiveStore.saveObjective(changedIds);
    changedIds = [];
  }
}

/**
 * Start timer to save the objective
 */
function startSave() {
  htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);
  resetTimer();
}


function resetTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(timeoutHander, savingDelay);
}

/**
 * Add listeners
 */
const init = () => {
  // Detect change events from inputs.
  htmlComponents.pdpFormObjectives.addEventListener("input", function (event) {
    const input = event.target;
    if (input.dataset.objectiveType === "title") {
      input.closest(`li`).querySelector(`summary span:first-child`).textContent = input.value;
    }
    updateObjective(input);
    startSave();
  });

  // Prevent the form navigating to the form URL if the enter key is used.
  htmlComponents.pdpFormObjectives.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  // Detect change events from tree.
  htmlComponents.pdpFormObjectives.addEventListener(customEvents.competencyChanged, function (event) {
    updateObjective(event.detail.target);
    startSave();
  });

  // Detect change events from due date.
  htmlComponents.pdpFormObjectives.addEventListener(customEvents.dueDateChanged, function (event) {
    updateObjective(event.detail.target);
    startSave();
  });

  // Reset flag once server visit is done.
  htmlComponents.pdpFormObjectives.addEventListener(customEvents.updated, function (event) {
    isSaving = false;
  });
};

export { init, startSave }