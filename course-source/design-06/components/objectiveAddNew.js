/**
 * Clone objective template, add values and IDs and add to DOM.
 */

import Tree from '@widgetjs/tree';
import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveDelete from './objectiveDelete.js';
import * as objectiveDrag from './objectiveDrag.js';
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

/**
 * Initialise a dynamically added date picker for the clone.
 * 
 * @param {HTMLElement} container - Container for the date picker
 * @param {string} id - Objective ID
 * @param {HTMLElement} hidden - The hidden input associated with this picker that should update on date picker change.
 */
function addDatePicker(container, id, hidden, dueDateWarn) {
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
  picker.value = `2022-08-17`;
  picker.expand = true;
  picker.direction = "left";
  container.appendChild(picker);
  picker.addEventListener("duetChange", function (event) {
    hidden.value = event.detail.value;
    const today = new Date().toISOString().slice(0, 10);
    dueDateWarn.style.display = today > event.detail.value ? "inline-block" : "none";
    htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.dueDateChangedEvent(hidden));
  });
}

/**
 * Initialise a dynamically added competency tree to the clone.
 * 
 * @param {HTMLElement} container - Container for the tree
 * @param {string} id - Objective ID
 * @param {HTMLElement} competencyHidden - The hidden input associated with this tree that should update on tree change.
 */
function addTree(container, id, competencyHidden) {
  let tree = new Tree(container, {
    data: [
      {
        id: '-1',
        text: 'Competencies',
        children: pdpTreeData
      }
    ],
    closeDepth: 2,
    onChange: function (event) {
      competencyHidden.value = this.values;
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.competencyChangedEvent(competencyHidden));
    }
  });
}

/**
 * Utility method to set text area labels and IDs.
 * 
 * @param {HTMLElement} clone - Copy of the template <li> tag
 * @param {string} selector - String to identify the element type
 * @param {string} id - Objective ID
 */
function connectInputAndLabel(clone, selector, id) {
  const label = clone.querySelector(`.pdp-objective-edit-${selector} label`);
  const text = clone.querySelector(`.pdp-objective-edit-${selector} textarea`);
  // Use selector string but with uppercase first letter for id
  text.id = label.htmlFor = `pdp${selector.charAt(0).toUpperCase() + selector.slice(1)}Objective${id}`;
}

/**
 * Set the IDs on all clone elements.
 * 
 * @param {HTMLElement} clone - Copy of the template <li> tag
 * @param {string} id - Objective ID
 * @param {string} title - The objective title
 */
function setLabelsAndIDs(clone, id, title) {
  clone.dataset.objectiveId = id;
  const summary = clone.querySelector("summary span:first-child");

  const titleInput = clone.querySelector(".pdp-edit-title input");
  const titleLabel = clone.querySelector(".pdp-edit-title label");

  titleInput.value = summary.textContent = title;
  titleInput.id = titleLabel.htmlFor = `pdpTitleObjective${id}`;

  const satisfiedLabel = clone.querySelector(".pdp-objective-satisfied");
  const satisfiedCheckbox = satisfiedLabel.querySelector("input");
  satisfiedCheckbox.id = satisfiedLabel.htmlFor = `pdpSatisfiedObjective${id}`;

  connectInputAndLabel(clone, "description", id)
  connectInputAndLabel(clone, "actions", id)
  connectInputAndLabel(clone, "insights", id)
  connectInputAndLabel(clone, "feedback", id)

  clone.querySelector(".pdp-tree-container").id = `pdpCompetencyObjective${id}`;
  const competencyHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  competencyHidden.id = `pdpCompetencyHiddenObjective${id}`;

  const dueDateHidden = clone.querySelector(`input[data-objective-type="duedate"]`);
  dueDateHidden.id = `pdpdueDateHiddenObjective${id}`;

  const dueDateWarn = clone.querySelector(`.pdp-dates-container > div:last-child > label svg`);
  dueDateWarn.id = `pdpdueDateWarnObjective${id}`;
}

/**
 * Clone the template element adding IDs and listeners.
 * 
 * @param {string} id - Objective ID
 * @param {string} title - The objective title
 */
function cloneObjective(id, title) {
  const clone = htmlComponents.pdpCloneDaddy.querySelector("li").cloneNode(true);
  // Design decision. Close the existing objectives on adding new as it makes it more obvious that it's an orderable list.
  helpers.closeAllObjectives();

  document.querySelector("#pdpObjectivesLive").prepend(clone);

  const dueDateHidden = clone.querySelector(`input[data-objective-type="duedate"]`);
  const dueDateWarn = clone.querySelector(`.pdp-dates-container > div:last-child > label svg`);
  addDatePicker(clone.querySelector(".pdp-date-picker-container"), id, dueDateHidden, dueDateWarn);

  const deleteObjectiveButton = clone.querySelector(`.pdp-delete-objective`);
  deleteObjectiveButton.addEventListener("click", objectiveDelete.buttonHandler);

  const competencyHidden = clone.querySelector(`input[data-objective-type="competency"]`);
  addTree(".pdp-tree-container", id, competencyHidden);
  setLabelsAndIDs(clone, id, title);
}

/**
 * Add listeners
 */
function init() {
  // Detect submit from new objective form
  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    cloneObjective(event.detail.id, event.detail.title);
    objectiveDrag.setHiddenOrder();
    htmlComponents.pdpFormNew.querySelector("input").value = "";
    enableForm();
    htmlComponents.pdpFormNew.querySelector("input").focus();
  });

  // Re-enable form so user can try again.
  htmlComponents.pdpFormNew.addEventListener(customEvents.error, function (event) {
    enableForm();
  });

  // New objective submitted
  htmlComponents.pdpTitleAddButton.addEventListener("click", function (event) {
    event.preventDefault();
    // Force show validation message.
    if (htmlComponents.pdpFormNew.querySelector("input").value === "") {
      htmlComponents.pdpFormNew.reportValidity();
    }
    else {
      disableForm();
      const title = htmlComponents.pdpFormNew.querySelector("input").value;
      objectiveStore.addObjective(title);
      htmlComponents.pdpFormNew.dispatchEvent(customEvents.addingEvent);
    }
  });
}

export { init }