/**
 * Remove an objective from the database and then the DOM if that's successful.
 */
import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';
import * as objectiveDrag from './objectiveDrag.js';

let isDeleting = false;

/**
 * Handler for dynamic and already in DOM objectives
 * 
 * @param {event} event - click event
 */
const buttonHandler = function (event) {
  event.preventDefault();
  if (isDeleting) return;
  isDeleting = true;
  if (window.confirm("Are you sure you want to delete this objective?")) {
    event.target.disabled = true;
    const li = event.target.closest("li");
    const id = li.dataset.objectiveId;
    li.style.display = "none";
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.deletingEvent);
    objectiveStore.deleteObjective(id);
  }
  else {
    isDeleting = false;
  }
}

const init = () => {

  // Objs store confirms delete so remove from DOM.
  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleted, function (event) {
    const id = event.detail.id;
    // Remove from DOM
    let domElement = htmlComponents.pdpFormObjectives.querySelector(`li[data-objective-id="${id}"]`);
    domElement.remove();
    domElement = null;
    isDeleting = false;
    objectiveDrag.setHiddenOrder();
  });

  // Add event listeners to obs already in DOM.
  document.querySelectorAll(`.pdp-delete-objective`).forEach((button) => {
    button?.addEventListener("click", buttonHandler);
  });

};

export { init, buttonHandler }