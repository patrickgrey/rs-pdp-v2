import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';

let objectives = [];
let objectivesOrder = [];
const serverDelay = 100;

function postToNewServer(title) {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: 22, title: title };
    getNewResponse(response);
  }, serverDelay);
}

function getNewResponse(response) {
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

function postUpdateToServer(objective) {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: 22 };
    getUpdateResponse(response);
  }, serverDelay);
}

function getUpdateResponse(response) {
  if (response.status === "ok") {
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatedEvent);
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.errorEvent);
  }
}

function getObjectiveIndex(id) {
  return objectives.findIndex(object => {
    return object.id === id;
  });
}

function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, type, newValue) {
  getObjectiveData(id)[type] = newValue;
  console.table(objectives[0]);
}

function saveObjective(changedIds) {

}

function addObjective(title) {
  htmlComponents.pdpFormNew.dispatchEvent(customEvents.addingEvent);
  postToNewServer(htmlComponents.pdpFormNew.querySelector("input").value);

}

function deleteObjective(id) {

}

const init = () => {
  // htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
  //   addObjective(event.detail.id);
  // });

  pdpObjectivesLive.addEventListener(customEvents.objectiveOrderChanged, function (event) {
    // Update hidden text field
    // htmlComponents.pdpObjLiveOrder
  });
};

export { init, addObjective, updateObjective, saveObjective, deleteObjective, getObjectiveData }