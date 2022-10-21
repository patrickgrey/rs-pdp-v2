/**
 * Create and manage a local model of all objectives. 
 * All server API calls are made from here.
 */

import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './feedbackError.js';
import * as helpers from './helpers.js';

// An array of objective objects
let objectives = [];
// The current order of objectives by ID
let objectivesOrder = [];
const serverDelay = 2000;
// Temporary variable to ID objectives until I get IDs back from API
let currentID = 1;

const isDev = true;

/**
 * Build the local model in memory based on SSR objectives on page.
 */
function buildModel() {
  document.querySelectorAll("#pdpObjectivesLive li").forEach((li) => {
    objectives.push({
      id: li.dataset.objectiveId,
      title: "" || li.querySelector(`input[data-objective-type="title"]`).value,
      satisfied: li.querySelector(`input[data-objective-type="satisfied"]`).checked,
      duedate: "" || li.querySelector(`input[data-objective-type="duedate"]`).value,
      description: "" || li.querySelector(`textarea[data-objective-type="description"]`).value,
      actions: "" || li.querySelector(`textarea[data-objective-type="actions"]`).value,
      insights: "" || li.querySelector(`textarea[data-objective-type="insights"]`).value,
      competency: "" || li.querySelector(`input[data-objective-type="competency"]`).value
    });
  });
}

/**
 * Mock a server call.
 */
async function callServer(url, serverDelay) {
  await helpers.asyncTimeout(serverDelay);
  return true;
}

/**
 * Find an objective in the model by ID
 * 
 * @param {string} id - objective ID
 */
function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

/**
 * Update an objective property
 * 
 * @param {string} id - objective ID
 * @param {string} type - objective property to update
 * @param {string} newValue - the new value
 */
function updateObjective(id, type, newValue) {
  // console.log(objectives);
  getObjectiveData(id)[type] = newValue;
  console.log(objectives);
}

/**
 * Call an API and return the response
 * @return response
 * 
 * @param {string} URL - API URL
 * @param {object} data - The POST body
 * @param {object} devResponse - A mock object for use in dev testing
 */
async function callAPI(URL, data, devResponse = {}) {
  let response;
  if (!isDev) {
    return await fetch(URL,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  }
  else {
    // Mock response
    await callServer("API Call", serverDelay);
    currentID++;
    return errorFeedback.isError ? { ok: false, statusText: "It all went horribly wrong!" } : devResponse;
  }
}

/**
 * Triggered by the autosave component.
 * Once the set delay time is reached, a snapshot of the objectives
 * that have changed is sent to the server to be updated.
 * On successful reply, trigger custom event to let observers know.
 * 
 * @param {array} changedIds - a list of objective IDs that have changed while autosave is throttling calls.
 */
async function saveObjective(changedIds) {

  let dataToSend = [];

  for (let index = 0; index < changedIds.length; index++) {
    const id = changedIds[index];
    dataToSend.push(getObjectiveData(id));
  }

  // Call server or mock if dev
  const response = await callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/UpdateObjective`, dataToSend, { ok: true, id: currentID });
  console.log("response:", response);

  if (response.ok) {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.savedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

/**
 * Update the dataset attribute on the body tag to show the objective count.
 */
function updateObjectiveCount() {
  document.querySelector("body").dataset.objectiveCount = objectives.length.toString();
}

/**
 * Call the API to add a new objective. If successful, add the objective to the model then dispatch events to update the UI.
 * 
 * @param {string} title - New objectile added by user.
 */
async function addObjective(title) {

  const response = await callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/Objective`, { title: title }, { ok: true, id: currentID });
  console.log("response:", response);

  if (response.ok) {
    const data = isDev ? response : await response.json();
    objectives.push({
      id: data.id.toString(),
      title: title,
      satisfied: false,
      duedate: "",
      description: "",
      actions: "",
      insights: "",
      competency: ""
    });
    updateObjectiveCount();
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addedEvent(response.id, title));
  }
  else {
    errorFeedback.showError(`Failed to add objective:` + response.statusText);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.errorEvent);
  }
}

/**
 * Call the API to delete an objective. If successful, remove the objective from the model then dispatch events to update the UI.
 * 
 * @param {string} id - ID of objective to be deleted
 */
async function deleteObjective(id) {
  const response = await callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/DeleteObjective`, { id: id }, { ok: true, id: id });

  if (response.ok) {
    for (let index = 0; index < objectives.length; index++) {
      const element = objectives[index];
      if (element.id.toString() === id.toString()) {
        objectives.splice(index, 1);
        break;
      }
    }
    updateObjectiveCount();
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.deletedEvent(id));
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

/**
 * Update the order of the objectives
 * 
 * @param {string} order - array of IDs in order
 */
async function updateOrder(order) {
  const response = await callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/UpdateOrder`, { order: order }, { ok: true, id: currentID });
  console.log("response:", response);

  if (response.status === "ok") {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.objectiveOrderChangedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

export { callAPI, addObjective, updateObjective, saveObjective, deleteObjective, updateOrder, getObjectiveData, buildModel, updateObjectiveCount, isDev }