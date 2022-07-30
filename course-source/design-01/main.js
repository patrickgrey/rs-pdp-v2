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


// TODO
// Mock autosave properly
//    *Something* triggers a call to save
//    Start a timer running
//    If timer not reset, send data and await response
//        Response is timeout function
//        Set flag so function can't be called again until response.
// Start with 0 objectives
//    On add, mock wait, on success build model and clone hidden to list and open
//    serverWait should respond with an id and the title.
// Start with 1 objective server side rendered
//    Build model with IDs. Show only selected tree items.
// Start with 2 objectives server side rendered
//    Extract drag order IDs.
// On drag, close details DONE
// Mark an objective Remedial
// Tree
//    Need to add dataset for each tree
//    Toggle all DONE - removed feature
// Save button align DONE
// pdp-autosave structure DONE
// Toggle errors DONE

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


// What if...
// -Page closes before saved?
// --Warn user to press save button if not saved yet.

// const savingDelay = 2000;
// const pdpFormNew = document.querySelector("#pdpFormNew");
// const pdpFormObjectives = document.querySelector("#pdpFormObjectives");
// let objectiveCount = 0;

// const savingOptions = {
//   saved: "saved",
//   saving: "saving",
//   error: "error"
// }

// These should be put into an array or add button function on tree creation?
// function initTree() {
//   // let tree = new Tree('.pdp-tree-container', {
//   //   data: [
//   //     {
//   //       id: '-1',
//   //       text: 'root',
//   //       children: data
//   //     }
//   //   ],
//   //   // closeDepth: 3,
//   //   loaded: function () {
//   //     this.values = ['0-0-0', '0-1-1'];
//   //     setTreeValue(this.values);
//   //   },
//   //   onChange: function () {
//   //     setTreeValue(this.values);
//   //   }
//   // });

//   // tree.disables = ['0-1'];

//   // tree.expandAll();

//   // function handleTreeToggle(event) {
//   //   // console.log(event.target.closest(".pdp-tree-container"));
//   //   console.log(event.target.parentElement.querySelector(".pdp-tree-container"));
//   // }

//   // document.querySelectorAll(".pdp-tree-toggle").forEach(button => {
//   //   button.addEventListener("click", handleTreeToggle)
//   // })

// }

// function setTreeValue(data) {
//   // const pdpTreeData = document.querySelector("#pdpTreeData");
//   // pdpTreeData.value = data.toString();
// }

// function setSavingState(state) {
//   if (state === savingOptions.saved) {
//     // Tick
//     console.log(savingOptions.saved);
//   }
//   else if (state === savingOptions.saving) {
//     // Rotate
//     console.log(savingOptions.saving);
//   }
//   else if (state === savingOptions.error) {
//     // Warn and instruct
//     console.log(savingOptions.error);
//   }
// }

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

// function saveForm() {
//   // NEED TO PREVENT OVERLAPPING SAVES!!
//   // document.querySelector("#pdpSubmitButton").click();
// }

// let timer = null;

// function timerStart() {
//   setSavingState(savingOptions.saving);
//   if (timer != null) {
//     clearTimeout(timer);
//     timer = null;
//   }
//   // Update component to "saving.."
//   timer = setTimeout(saveForm, savingDelay);
// }



// function setHiddenOrder() {
//   let orderArray = [];
//   document.querySelectorAll("#pdpObjectivesLive > li").forEach(li => {
//     orderArray.push(li.dataset.order);
//   });
//   document.querySelector(".pd-obj-live-order").value = orderArray.toString();
// }

var pageModule = (function () {
  var module = {};
  module.init = function () {
    // JUST FOR DEV
    htmlComponents.pdpTitleAdd.value = helpers.generateString(5);

    customElements.define("duet-date-picker", DuetDatePicker);

    addObjective.init();
    activityFeedback.init();
    objectiveStore.init();
    autosave.init();

    document.querySelector("#pdpRemedial").addEventListener("click", function (event) {
      document.querySelector("body").classList.toggle("pdp-show-remedial");
    });

    document.querySelector("#pdpError").addEventListener("click", function (event) {
      // document.querySelector("body").classList.toggle("pdp-show-error");
      errorFeedback.toggleError();
    });

    // JUST FOR DEV
    htmlComponents.pdpTitleAddButton.click();

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

    // initTree();


  };
  return module;
})();

pageModule.init();
