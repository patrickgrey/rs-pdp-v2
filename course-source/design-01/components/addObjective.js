// Prevent submit DONE
// Disable button & input DONE
// Emit 'adding' status event DONE
// Send data and await response DONE
//    Settimeout with OK and ID and error responses. DONE
// On error, emit 'error' event DONE
// On OK, clone objective with ID and init
//    Need to tie in tree and date to hidden fields
// Emit 'added' event.

// For autosave, can we use the id to only update this objective?
// Create a store (modern version of model it seems)
// Using ID, build then update store and send.

import Tree from '@widgetjs/tree';
import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as errorFeedback from './errorFeedback.js';
import * as autosave from './autosave.js';

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
    const response = errorFeedback.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok", id: 22, title: htmlComponents.pdpFormNew.querySelector("input").value };
    getResponse(response);
  }, 50);
}

function getResponse(response) {
  if (response.status === "ok") {
    cloneObjective(response.id, response.title);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.addedEvent(response.id));
    htmlComponents.pdpFormNew.querySelector("input").value = "";
    enableForm();
  }
  else {
    errorFeedback.showError(response.message);
    htmlComponents.pdpFormNew.dispatchEvent(customEvents.errorEvent);
    enableForm();
  }
}

function addDatePicker(container, id) {
  const picker = document.createElement("duet-date-picker");
  picker.identifier = `pdpDatePickerObjective${id}`;
  container.appendChild(picker);
  picker.addEventListener("duetChange", function (event) {
    autosave.startSave(id, "dueDate", event.detail.value);
  });
}

// NEED TO TIE IN HIDDEN INPUT
function addTree(container, id) {
  let tree = new Tree(container, {
    data: [
      {
        id: '-1',
        text: 'root',
        children: pdpTreeData
      }
    ],
    onChange: function (event) {
      autosave.startSave(id, "competencies", this.values);
    }
  });
}

function connectInputAndLabel(clone, selector, id) {
  const label = clone.querySelector(`.pdp-objective-edit-${selector} label`);
  const text = clone.querySelector(`.pdp-objective-edit-${selector} textarea`);
  // Use selector string but with uppercase first letter for id
  text.id = label.htmlFor = `pdp${selector.charAt(0).toUpperCase() + selector.slice(1)}Objective${id}`;
  // This should be moved to autosave. Catch events at a form level.
  // text.addEventListener("keyup", function (event) {
  //   autosave.startSave(id, text.dataset.objectiveType, text.value);
  // })
}

function setLabelsAndIDs(clone, id, title) {
  clone.dataset.objectiveId = id;
  const summary = clone.querySelector("summary span:first-child");
  summary.textContent = title;

  const titleInput = clone.querySelector(".pdp-fieldset-edit-title input");
  const titleLabel = clone.querySelector(".pdp-fieldset-edit-title label");
  titleInput.value = title;
  titleInput.id = titleLabel.htmlFor = `pdpTitleObjective${id}`;
  // THIS MUST BE DESTROYED ON DESTROY :-) 
  titleInput.addEventListener("keyup", function (event) {
    // autosave.startSave(id, titleInput.dataset.objectiveType, titleInput.value);
    // Update summary
    summary.textContent = titleInput.value;
  })

  connectInputAndLabel(clone, "description", id)
  connectInputAndLabel(clone, "actions", id)
  connectInputAndLabel(clone, "insights", id)
}

function cloneObjective(id, title) {
  const clone = htmlComponents.pdpCloneDaddy.querySelector("li").cloneNode(true);

  document.querySelector("#pdpObjectivesLive").prepend(clone);
  addDatePicker(clone.querySelector(".pdp-date-picker-container"), id);
  addTree(".pdp-tree-container", id);
  setLabelsAndIDs(clone, id, title);
  document.querySelector("body").dataset.objectiveCount++;
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