// Prevent submit DONE
// Disable button & input DONE
// Emit 'adding' status event DONE
// Send data and await response DONE
//    Settimeout with OK and ID and error responses. DONE
// On error, emit 'error' event DONE
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
  const clone = document.querySelector(".pdp-objective-clone-daddy li").cloneNode(true);
  document.querySelector("#pdpObjectivesLive").prepend(clone);
  // Add ids and fors
  // Dynamic date picker?
  document.querySelector("body").dataset.objectiveCount++;
}

function getResponse(response) {
  if (response.status === "ok") {
    cloneObjective(response.id);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addedEvent);
    enableForm();
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.errorEvent);
    enableForm();
  }
}

function init() {
  htmlComponents.pdpTitleAddButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (htmlComponents.pdpFormNew.querySelector("input").value === "") {
      htmlComponents.pdpFormNew.reportValidity()
    }
    else {
      disableForm();
      htmlComponents.pdpFormNew.dispatchEvent(customEvents.addingEvent);
      postForm();
    }
  });
}

export { init }