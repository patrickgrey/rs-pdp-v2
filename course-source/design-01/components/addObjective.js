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
import * as objectiveStore from './objectiveStore.js';

function disableForm() {
  htmlComponents.pdpTitleAdd.disabled = true;
  htmlComponents.pdpTitleAddButton.disabled = true;
}

function enableForm() {
  htmlComponents.pdpTitleAdd.disabled = false;
  htmlComponents.pdpTitleAddButton.disabled = false;
}

function addDatePicker(container, id) {
  const picker = document.createElement("duet-date-picker");
  picker.identifier = `pdpDatePickerObjective${id}`;
  picker.expand = true;
  container.appendChild(picker);
  picker.addEventListener("duetChange", function (event) {
    // This should be an event dispatch
    // autosave.startSave(id, "dueDate", event.detail.value);
  });
}

// NEED TO TIE IN HIDDEN INPUT
function addTree(container, id, dateHidden) {
  let tree = new Tree(container, {
    data: [
      {
        id: '-1',
        text: 'root',
        children: pdpTreeData
      }
    ],
    onChange: function (event) {
      // This should be an event dispatch
      // autosave.startSave(id, "competencies", this.values);
      dateHidden.value = this.values;
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.competencyChangedEvent(dateHidden));
    }
  });
}

function connectInputAndLabel(clone, selector, id) {
  const label = clone.querySelector(`.pdp-objective-edit-${selector} label`);
  const text = clone.querySelector(`.pdp-objective-edit-${selector} textarea`);
  // Use selector string but with uppercase first letter for id
  text.id = label.htmlFor = `pdp${selector.charAt(0).toUpperCase() + selector.slice(1)}Objective${id}`;
}

function setLabelsAndIDs(clone, id, title) {
  clone.dataset.objectiveId = id;
  const summary = clone.querySelector("summary span:first-child");
  summary.textContent = title;

  const titleInput = clone.querySelector(".pdp-fieldset-edit-title input");
  const titleLabel = clone.querySelector(".pdp-fieldset-edit-title label");
  titleInput.value = title;
  titleInput.id = titleLabel.htmlFor = `pdpTitleObjective${id}`;

  const satisfiedLabel = clone.querySelector(".pdp-objective-satisfied");
  const satisfiedCheckbox = satisfiedLabel.querySelector("input");
  satisfiedCheckbox.id = satisfiedLabel.htmlFor = `pdpSatisfiedObjective${id}`;
  // THIS MUST BE DESTROYED ON DESTROY :-) 
  titleInput.addEventListener("keyup", function (event) {
    summary.textContent = titleInput.value;
  })

  connectInputAndLabel(clone, "description", id)
  connectInputAndLabel(clone, "actions", id)
  connectInputAndLabel(clone, "insights", id)

  clone.querySelector(".pdp-tree-container").id = `pdpCompetencyObjective${id}`;
  const dateHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  dateHidden.id = `pdpCompetencyHiddenObjective${id}`;
}

function cloneObjective(id, title) {
  const clone = htmlComponents.pdpCloneDaddy.querySelector("li").cloneNode(true);
  document.querySelector("#pdpObjectivesLive").prepend(clone);
  addDatePicker(clone.querySelector(".pdp-date-picker-container"), id);
  const dateHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  addTree(".pdp-tree-container", id, dateHidden);
  setLabelsAndIDs(clone, id, title);
  document.querySelector("body").dataset.objectiveCount++;
}

function init() {
  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    cloneObjective(event.detail.id, event.detail.title);
    htmlComponents.pdpFormNew.querySelector("input").value = "";
    enableForm();
  });

  htmlComponents.pdpFormNew.addEventListener(customEvents.error, function (event) {
    enableForm();
  })

  htmlComponents.pdpTitleAddButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (htmlComponents.pdpFormNew.querySelector("input").value === "") {
      htmlComponents.pdpFormNew.reportValidity();
    }
    else {
      disableForm();
      objectiveStore.addObjective(htmlComponents.pdpFormNew.querySelector("input").value);
    }
  });
}

export { init }