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
import * as objectiveStore from './objectiveStore.js';
import * as helpers from './helpers.js';

function disableForm() {
  htmlComponents.pdpTitleAdd.disabled = true;
  htmlComponents.pdpTitleAddButton.disabled = true;
}

function enableForm() {
  htmlComponents.pdpTitleAdd.disabled = false;
  htmlComponents.pdpTitleAddButton.disabled = false;
}

function addDatePicker(container, id, hidden) {
  const picker = document.createElement("duet-date-picker");

  // picker.localization = {
  //   buttonLabel: 'Choose date',
  //   placeholder: 'DD/MM/YYYY',
  //   selectedDateMessage: 'Selected date is',
  //   prevMonthLabel: 'Previous month',
  //   nextMonthLabel: 'Next month',
  //   monthSelectLabel: 'Month',
  //   yearSelectLabel: 'Year',
  //   closeLabel: 'Close window',
  //   calendarHeading: 'Choose a date',
  //   dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  //   monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  //   monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //   locale: "en-GB",
  // }

  // const DATE_FORMAT = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/

  // picker.dateAdapter = {
  //   parse(value = "", createDate) {
  //     const matches = value.match(DATE_FORMAT)

  //     if (matches) {
  //       return createDate(matches[3], matches[2], matches[1])
  //     }
  //   },
  //   format(date) {
  //     return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  //   },
  // }

  picker.identifier = `pdpDatePickerObjective${id}`;
  picker.expand = true;
  picker.direction = "left";
  container.appendChild(picker);
  picker.addEventListener("duetChange", function (event) {
    hidden.value = event.detail.value;
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.dueDateChangedEvent(hidden));
  });
}

function addTree(container, id, competencyHidden) {
  let tree = new Tree(container, {
    data: [
      {
        id: '-1',
        text: 'root',
        children: pdpTreeData
      }
    ],
    onChange: function (event) {
      competencyHidden.value = this.values;
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.competencyChangedEvent(competencyHidden));
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
  // summary.textContent = title;

  const titleInput = clone.querySelector(".pdp-edit-title input");
  const titleLabel = clone.querySelector(".pdp-edit-title label");
  // titleInput.value = summary.textContent = `${title}: This objective is called ${helpers.generateString(5)} and the aim is to ${helpers.generateString(20)}`;
  titleInput.value = summary.textContent = title;
  titleInput.id = titleLabel.htmlFor = `pdpTitleObjective${id}`;

  const satisfiedLabel = clone.querySelector(".pdp-objective-satisfied");
  const satisfiedCheckbox = satisfiedLabel.querySelector("input");
  satisfiedCheckbox.id = satisfiedLabel.htmlFor = `pdpSatisfiedObjective${id}`;

  connectInputAndLabel(clone, "description", id)
  connectInputAndLabel(clone, "actions", id)
  connectInputAndLabel(clone, "insights", id)

  clone.querySelector(".pdp-tree-container").id = `pdpCompetencyObjective${id}`;
  const competencyHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  competencyHidden.id = `pdpCompetencyHiddenObjective${id}`;

  const dueDateHidden = clone.querySelector(`input[data-objective-type="duedate"]`);
  dueDateHidden.id = `pdpdueDateHiddenObjective${id}`;
}

function cloneObjective(id, title) {
  const clone = htmlComponents.pdpCloneDaddy.querySelector("li").cloneNode(true);
  document.querySelector("#pdpObjectivesLive").prepend(clone);
  const dueDateHidden = clone.querySelector(`input[data-objective-type="duedate"]`);
  addDatePicker(clone.querySelector(".pdp-date-picker-container"), id, dueDateHidden);
  const deleteObjectiveButton = clone.querySelector(`.pdp-delete-objective`);
  deleteObjectiveButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this objective?")) {
      deleteObjectiveButton.disabled = true;
      const id = event.target.closest("li").dataset.objectiveId;
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.deletingEvent(id));
    }
  })
  const competencyHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  addTree(".pdp-tree-container", id, competencyHidden);
  setLabelsAndIDs(clone, id, title);
}

function init() {
  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    // helpers.closeAllObjectives();
    cloneObjective(event.detail.id, event.detail.title);
    htmlComponents.pdpFormNew.querySelector("input").value = "";
    enableForm();
    htmlComponents.pdpFormNew.querySelector("input").focus();
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