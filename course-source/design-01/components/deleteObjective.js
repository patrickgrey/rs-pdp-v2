import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';

const init = () => {

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleted, function (event) {
    const id = event.detail.id;
    // Remove from DOM
    let domElement = htmlComponents.pdpFormObjectives.querySelector(`li[data-objective-id="${id}"]`);
    domElement.remove();
    domElement = null;
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleting, function (event) {
    const id = event.detail.id;
    console.log(id);
    objectiveStore.deleteObjective(id);
  });

};

export { init }