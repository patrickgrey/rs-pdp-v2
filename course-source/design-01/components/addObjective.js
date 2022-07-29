// Prevent submit DONE
// Disable button & input DONE
// Emit 'adding' status event
// Send data and await response
//    Settimeout with OK and ID and error responses.
// On error, emit 'error' event
// On OK, clone objective with ID and init
// Emit 'added' event.

import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';


function disableForm() {
  htmlComponents.pdpTitleAdd.disabled = true;
  htmlComponents.pdpTitleAddButton.disabled = true;
}

function enableForm() {
  htmlComponents.pdpTitleAdd.disabled = false;
  htmlComponents.pdpTitleAddButton.disabled = false;
}

function postForm() {
  serverWait();
}

function serverWait() {
  setTimeout(function () {
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: 1 };
    getResponse(response);
  }, 2000);
}

function cloneObjective(id) {
  // clone and add to list
  const clone = document.querySelector(".pdp-objective-clone-daddy details").cloneNode(true);
  document.querySelector("#pdpObjectivesLive").prepend(clone);
  document.querySelector("body").dataset.objectiveCount++;
}

function getResponse(response) {
  if (response.status === "ok") {
    cloneObjective(response.id);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.savedEvent);
    enableForm();
  }
  else {
    errorFeedback.showError(response.message);
    enableForm();
  }
}

function init() {
  htmlComponents.pdpTitleAddButton.addEventListener("click", function (event) {
    event.preventDefault();
    disableForm();
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addingEvent);
    postForm();
  });
}

export { init }