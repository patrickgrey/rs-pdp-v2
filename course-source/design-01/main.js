import { DuetDatePicker } from "@duetds/date-picker/custom-element";
import Sortable from 'sortablejs';

import * as autosave from './components/autosave.js';
import * as objectiveDrag from './components/objectiveDrag.js';
import * as addObjective from './components/addObjective.js';
import * as objectiveStore from './components/objectiveStore.js';
import * as activityFeedback from './components/activityFeedback.js';
import * as errorFeedback from './components/errorFeedback.js';
import * as htmlComponents from './components/htmlComponents.js';
import * as helpers from './components/helpers.js';
import * as customEvents from './components/customEvents.js';


// TODO
// Delete objective button
// Fade end of summary objective title
// COmplete objective and move to another list.
// Start with 0 objectives
//    On add, mock wait, on success build model and clone hidden to list and open DONE
//    serverWait should respond with an id and the title. DONE
// Start with 1 objective server side rendered
//    Build model with IDs.
//    Get change updates from date and tree
//    
// Start with 2 objectives server side rendered
//    Extract drag order IDs.
// Mark an objective Remedial
// Tree
//    Need to add dataset for each tree
//    Toggle all DONE - removed feature
// On drag, close details DONE
// Save button align DONE
// pdp-autosave structure DONE
// Toggle errors DONE
// -Page closes before saved?
// --Warn user to press save button if not saved yet.


// AUTOSAVE
// How should it function?
// -On leave focus? Brittle.
// -Trigger save start on key up or drag drop
// ---Show saving info
// --Wait a few seconds before sending
// --Save the whole form data
// --If another trigger occurs, reset wait
// --Need to get notification back from server to confirm.
// ---on Fail, ask user to press save button or allow to submit?

// Sanitize input client or server? Server. textContent 



// https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    if (responseData.success) setSavingState(savingOptions.saved);
    // console.table({ responseData });
  } catch (error) {
    console.error(error);
    setSavingState(savingOptions.error);
  }
}

var pageModule = (function () {
  var module = {};
  module.init = function () {

    customElements.define("duet-date-picker", DuetDatePicker);

    addObjective.init();
    activityFeedback.init();
    objectiveStore.init();
    autosave.init();
    objectiveDrag.init();


    // JUST FOR DEV
    document.querySelector("#pdpRemedial").addEventListener("click", function (event) {
      document.querySelector("body").classList.toggle("pdp-show-remedial");
    });

    document.querySelector("#pdpError").addEventListener("click", function (event) {
      errorFeedback.toggleError();
    });


    htmlComponents.pdpTitleAdd.value = helpers.generateString(5);

    htmlComponents.pdpTitleAddButton.click();
    // JUST FOR DEV




    // Init form
    // pdpFormNew.addEventListener("submit", handleFormSubmit);
    // // Init date input
    // // https://www.duetds.com/components/collapsible/
    // // Init sortable objectives, setting order and triggering save
    // // var sortable = Sortable.create(document.getElementById('pdpObjectivesLive'), {
    // //   handle: '.pdp-drag-handle',
    // //   onChoose: function () {
    // //     closeAllObjectives();
    // //   },
    // //   onEnd: function () {
    // //     setHiddenOrder();
    // //     timerStart();
    // //   }
    // // });
    // objectiveDrag.init(timerStart);
    // // Record objectives order
    // objectiveDrag.setHiddenOrder();
    // // Capture key up to trigger save
    // document.addEventListener("keyup", event => {
    //   timerStart();
    // });
  };
  return module;
})();

pageModule.init();
