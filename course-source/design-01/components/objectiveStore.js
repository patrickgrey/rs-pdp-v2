import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';
import * as helpers from './helpers.js';

let objectives = [];
let objectivesOrder = [];
const serverDelay = 1000;

async function callServer(url, serverDelay) {
  await helpers.asyncTimeout(serverDelay);
  return true;
}

function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, type, newValue) {
  getObjectiveData(id)[type] = newValue;
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

  console.log(JSON.stringify(dataToSend));

  // Mock send update objective to server
  callServer("API Call", serverDelay);
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
  const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: 22, title: title };

  if (response.status === "ok") {
    objectives.push({
      id: response.id,
      title: response.title,
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
    console.log(objectives);
    for (let index = 0; index < objectives.length; index++) {
      const element = objectives[index];
      if (element.id.toString() === id.toString()) {
        objectives.splice(index, 1);
        break;
      }
    }
    console.log(objectives);
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

export { init, addObjective, updateObjective, saveObjective, deleteObjective, getObjectiveData }