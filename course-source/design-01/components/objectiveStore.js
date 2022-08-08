import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';
import * as helpers from './helpers.js';

let objectives = [];
let objectivesOrder = [];
const serverDelay = 1000;
let currentID = 1;

function buildModel() {
  // Loop through list and extract data
  // const objectiveList = 
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

async function callServer(url, serverDelay) {
  await helpers.asyncTimeout(serverDelay);
  return true;
}

function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, type, newValue) {
  console.log(objectives);
  getObjectiveData(id)[type] = newValue;
  console.log(objectives);
}

function updateObjectiveCount() {
  document.querySelector("body").dataset.objectiveCount = objectives.length.toString();
}

async function saveObjective(changedIds) {

  htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);

  let dataToSend = [];

  for (let index = 0; index < changedIds.length; index++) {
    const id = changedIds[index];
    dataToSend.push(getObjectiveData(id));
  }

  // console.log(JSON.stringify(dataToSend));

  // Mock send update objective to server
  await callServer("API Call", serverDelay);
  // await helpers.asyncTimeout(serverDelay);
  // Mock response
  const response = errorFeedback.isError ? { status: "error", message: "Update when wrong!" } : { status: "ok" };

  if (response.status === "ok") {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

async function addObjective(title) {
  htmlComponents.pdpFormNew.dispatchEvent(customEvents.addingEvent);
  // Mock send new objective to server
  await callServer("API Call", serverDelay);
  // await helpers.asyncTimeout(serverDelay);
  // Mock response
  currentID++;
  const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: currentID, title: title };

  if (response.status === "ok") {
    objectives.push({
      id: response.id.toString(),
      title: response.title,
      satisfied: false,
      duedate: "",
      description: "",
      actions: "",
      insights: "",
      competency: ""
    });
    updateObjectiveCount();
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addedEvent(response.id, response.title));
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.errorEvent);
  }
}

async function deleteObjective(id) {
  await callServer("Delete API Call", serverDelay);
  const response = errorFeedback.isError ? { status: "error", message: "Delete went horribly wrong!" } : { status: "ok", id: 22 };
  // Remove from local

  // Update objectives count.
  if (response.status === "ok") {
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

const init = () => {

  pdpObjectivesLive.addEventListener(customEvents.objectiveOrderChanged, function (event) {
    // Update hidden text field
    // htmlComponents.pdpObjLiveOrder
  });
};

// https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    if (responseData.success) setSavingState(savingOptions.saved);
    // console.table({ responseData });
  } catch (error) {
    console.error(error);
    setSavingState(savingOptions.error);
  }
}

export { init, addObjective, updateObjective, saveObjective, deleteObjective, getObjectiveData, buildModel }