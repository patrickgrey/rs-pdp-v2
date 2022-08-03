import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';
import * as helpers from './helpers.js';

let objectives = [];
let objectivesOrder = [];
const serverDelay = 1000;

function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, type, newValue) {
  getObjectiveData(id)[type] = newValue;
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
  await helpers.asyncTimeout(serverDelay);
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
  await helpers.asyncTimeout(serverDelay);
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
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addedEvent(response.id, response.title));
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.errorEvent);
  }
}

function deleteObjective(id) {

}

const init = () => {

  pdpObjectivesLive.addEventListener(customEvents.objectiveOrderChanged, function (event) {
    // Update hidden text field
    // htmlComponents.pdpObjLiveOrder
  });
};

export { init, addObjective, updateObjective, saveObjective, deleteObjective, getObjectiveData }