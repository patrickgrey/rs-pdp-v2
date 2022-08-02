import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';

let objectives = [];

function getObjectiveIndex(id) {
  return objectives.findIndex(object => {
    return object.id === id;
  });
}

function getObjectiveData(id) {
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, type, newValue) {
  console.log(id);
  // This should be done by getting the fields by ID
  // let objective = objectives[getObjectiveIndex(data.id)];
  // objective.id = data.id;
  // objective.title = data.title;
  // objective.description = data.description || "";
  // objective.actions = data.actions || "";
  // objective.insights = data.insights || "";
  // objective.competency = data.competency || "";
}

function addObjective(id) {
  const form = htmlComponents.pdpObjectivesLive.querySelector(`li[data-objective-id="${id}"]`);
  objectives.push(
    {
      id,
      title: form.querySelector(".pdp-fieldset-edit-title input").value,
      dueDate: "",
      description: "",
      actions: "",
      insights: "",
      competencies: "",
      listPosition: 0
    }
  )
}

function deleteObjective(id) {

}

const init = () => {
  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    addObjective(event.detail.id);
  });
};

export { init, getObjectiveData, updateObjective }