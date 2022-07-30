import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';

let objectives = [];

function getObjectiveIndex(id) {
  return objectives.findIndex(object => {
    return object.id === id;
  });
}

function getObjectiveData(id) {
  // console.log(objectives.find(obj => obj.id.toString() === id.toString()));
  return objectives.find(obj => obj.id.toString() === id.toString())
}

function updateObjective(id, newValue) {
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

function createObjective(id) {
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

  // setTimeout(function () {
  //   updateObjective(
  //     {
  //       id,
  //       title: form.querySelector(".pdp-fieldset-edit-title input").value,
  //       dueDate: "bob",
  //       description: "bob",
  //       actions: "bob",
  //       insights: "bob",
  //       competency: "bob"
  //     }
  //   )

  //   console.log(objectives);
  // }, 100);
}

const init = () => {
  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    createObjective(event.detail.id);
  });
};

export { init, getObjectiveData }