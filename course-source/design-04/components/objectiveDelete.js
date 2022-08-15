import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';

let isDeleting = false;

const buttonHandler = function (event) {
  event.preventDefault();
  if (isDeleting) return;
  isDeleting = true;
  if (window.confirm("Are you sure you want to delete this objective?")) {
    event.target.disabled = true;
    const id = event.target.closest("li").dataset.objectiveId;
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.deletingEvent(id));
  }
}

const init = () => {

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleted, function (event) {
    const id = event.detail.id;
    // Remove from DOM
    let domElement = htmlComponents.pdpFormObjectives.querySelector(`li[data-objective-id="${id}"]`);
    domElement.remove();
    domElement = null;
    isDeleting = false;
  });

  document.querySelectorAll(`.pdp-delete-objective`).forEach((button) => {
    button.addEventListener("click", buttonHandler);
  });

};

export { init, buttonHandler }