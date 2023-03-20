// Date inputs
import { DuetDatePicker } from "@duetds/date-picker/custom-element";
// Competencies trees
import Tree from '@widgetjs/tree';
// Automatically adds animation when elements are added or removed from the DOM.
import autoAnimate from '@formkit/auto-animate'

// Proxy names for HTML elements in case the IDs change in future so they can be changed in one place.
import * as htmlComponents from './components/htmlComponents.js';
// Custom events used to trigger actions and pass data
import * as customEvents from './components/customEvents.js';
// Utility methods
import * as helpers from './components/helpers.js';
// A local model of a users objectives with manipulation methods
import * as objectiveStore from './components/objectiveStore.js';
// UI behaviour for adding a new objective
import * as objectiveAddNew from './components/objectiveAddNew.js';
// UI behaviour for deleting an objective
import * as objectiveDelete from './components/objectiveDelete.js';
// Add dragging behaviour to live objectives
import * as objectiveDrag from './components/objectiveDrag.js';
// UI behaviour for Archived objectives
import * as objectiveArchive from './components/objectiveArchive.js';
// UI behaviour and timings for autosave
import * as autosave from './components/autosave.js';
// UI behaviour for feedback section
import * as activityFeedback from './components/feedbackActions.js';
// Save changes to next meeting date
import * as nextMeetingDate from './components/nextMeetingDate.js';
// Allow coach edit to be saved
import * as editCoach from './components/editCoach.js';
// UI behaviour when an error occurs
import * as errorFeedback from './components/feedbackError.js';
// Deal with printing
import * as print from './components/print.js';

/**
 * ARCHITECTURE:
 * 
 * Components deal with initialising local UI for existing objectives, 
 * this includes dispatching events from the UI. 
 * They listen for confirmations from the objectiveStore that 
 * API calls were successful and update the UI to reflect the new model.
 * 
 * The objectiveStore creates and manages a local model of objectives.
 * It also deals with all API calls and dispatches events relating
 * to model changes.
 */




// TODO
// 
// Animate details: https://codepen.io/stoumann/pen/ExydEYL
// Save state, Open all details before print, reinstate state after:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeprint_event
// Replace components with shoelace: https://shoelace.style/components/input 
// DONE Disable competencies if satisfied
// DONE Add fields for managers 
// DONE on load show date warning
// DONE Date of next meeting not hooked up
// DONE Objs order needs to be filled in if there are already 1+ or 1+ is added.
// DONE See where restored objs come back in. Should it be top?
// REFACTOR
//    The following should use the pattern above:
//        Add new DONE
//        Autosave DONE
//        Delete - delete WORKS! It's just the handler that is tied but
//                 that is OK as it's a shared handler with existing Os.
//                 The handler only dispatches an event.
//        Drag DONE
//        Satisfied on return to LIVE DONE
//  STYLE
//    padding on satisfied no drag
//    Align summary text DONE
// 
// 
// 
// Test on Mac
// Add full comments
// Make ILP header dev only with shortcode
// DONE Add title
// DONE Delete objective button 
// DONE Fade end of summary objective title DONE
// DONE Complete objective and move to another list.
// DONE Start with 0 objectives
//    DONE On add, mock wait, on success build model and clone hidden to list and open DONE
//    DONE serverWait should respond with an id and the title.
// Start with 1 objective server side rendered
//    Archived - action feedback - part of autosve
//    Update satisfied in model on move back
//    Deal with order list when moved
//    DONE Move satisfied to another list
//    DONE Update archived count on add/remove
//    DONE Drag broken - using classes again?
//    DONE Ignore just now. Due date format
//    DONE Update summary on title input 
//    DONE Fix remedial - attach icon to text in header then just use icon
//    DONE Get satisfied updates
//    DONE Get change updates from date
//    DONE Close existing objectives if a new one is added.
//    DONE THIS IS BECAUSE THE ID IS ALWAYS THE SAME!! Delete always seems to remove the first item, not the selected one.
//      This may only apply to dynamically added objs.
//    DONE Trees not working. Maybe use ID instead of class for containers.
//    DONE confirm deletes
//    DONE Delete not working - need to add listener and prevent DONE
//    DONE Build model with IDs.
//    
// Start with 2 objectives server side rendered
//    DONE Extract drag order IDs.
//    DONE Mark an objective Remedial
// Tree
//    Need to add dataset for each tree
//    Toggle all DONE - removed feature
//    DONE On drag, close details DONE
//    DONE Save button align DONE
//    DONE pdp-autosave structure DONE
//    DONE Toggle errors DONE
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

var pageModule = (function () {
  var module = {};
  module.init = async function () {



    // Init date pickers
    customElements.define("duet-date-picker", DuetDatePicker);
    // Init autoAnimate
    autoAnimate(pdpObjectivesLive);

    objectiveAddNew.init();
    activityFeedback.init();
    autosave.init();
    objectiveDrag.init();
    objectiveDelete.init();
    objectiveArchive.init();
    editCoach.init();
    print.init();

    htmlComponents.pdpFormNew.querySelector("input").focus();

    htmlComponents.pdpNextMeetingDate.addEventListener("duetChange", function (event) {
      nextMeetingDate.saveTheDate(event.detail.value);
    });

    document.querySelectorAll("aside ul.pdp-supervision-container button").forEach((button) => {
      button.addEventListener("click", function (event) {
        const input = event.target.parentElement.querySelector("input");
        input.style.display = (input.style.display === 'block') ? 'none' : 'block';
      })
    });

    async function getTreeData() {
      const url = objectiveStore.isDev ? `./data/competency.json` : `/ilp/customs/Reports/PersonalDevelopmentPlan/Home/Competency`;
      const response = await fetch(url);
      return response.ok ? await response.json() : [];
    }

    const jsonData = await getTreeData();
    objectiveAddNew.setTreeData(jsonData);

    // Initialise SSR Objectives
    const objCount = document.querySelector("body").dataset.objectiveCount;
    const objCountSatisfied = document.querySelector("body").dataset.objectiveArchiveCount;
    if (objCount > 0 || objCountSatisfied > 0) {
      // Build model
      objectiveStore.buildModel();

      // Init dates
      // Changes in the component are sent to the associated hidden field
      const liveDates = htmlComponents.pdpFormObjectives.querySelectorAll(".pdp-date-picker-container");
      const archivedDates = htmlComponents.pdpObjectivesArchived.querySelectorAll(".pdp-date-picker-container");
      const mergedDates = new Set([...liveDates, ...archivedDates]);
      mergedDates.forEach((container) => {
        const picker = document.createElement("duet-date-picker");
        // console.log("picker: ", picker);
        container.appendChild(picker);
        const li = picker.closest("li");
        // console.log("li: ", li);
        const dueDateWarn = li.querySelector(`summary > span`);
        // console.log("dueDateWarn: ", dueDateWarn);
        const hidden = li.querySelector(`input[data-objective-type="duedate"]`);
        // console.log("hidden: ", hidden);
        // console.log("hidden.value: ", hidden.value);
        picker.value = hidden.value;
        picker.addEventListener("duetChange", function (event) {
          const today = new Date().toISOString().slice(0, 10);
          if (today > event.detail.value) {
            dueDateWarn.classList.add("pdp-remedial-icon");
          }
          else {
            dueDateWarn.classList.remove("pdp-remedial-icon");
          }
          hidden.value = event.detail.value;
          htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.dueDateChangedEvent(hidden));
        });
      });

      // init trees
      // Changes in the component are sent to the associated hidden field


      const liveContainers = htmlComponents.pdpFormObjectives.querySelectorAll(".pdp-tree-container");
      const archivedContainers = htmlComponents.pdpObjectivesArchived.querySelectorAll(".pdp-tree-container");
      const mergedContainers = new Set([...liveContainers, ...archivedContainers]);
      mergedContainers.forEach(function (container) {
        if (jsonData.length > 0) {
          const li = container.closest("li")
          const id = li.dataset.objectiveId;
          const competencyHidden = li.querySelector(`input[data-objective-type="competency"]`);
          // Bug is calling this class only finds the first one
          // Also Need to deal with archived obs. Get both arrays and merge
          // Same for dates!
          let tree = new Tree(`li[data-objective-id="${id}"] .pdp-tree-container`, {
            data: jsonData,
            closeDepth: 1,
            onChange: function () {
              // console.log("id: ", this.selectedNodes);
              competencyHidden.value = this.values;
              htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.competencyChangedEvent(competencyHidden));
            },
            loaded: function () {
              // Still need to tick values from hidden.
              this.values = competencyHidden.value.split(",");
            }
          });
        }
        else {
          container.textContent = "Sorry, there was a problem loading the competencies."
        }
      });
      objectiveAddNew.treeDisableTopLevel();
    }
    else if (objCount > 1) {
      objectiveDrag.setHiddenOrder();
    }

    document.querySelector("#cvEditOpenCoach")?.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("#cvCoachEditGroup").style.display = "block";
    });


    document.querySelector(".pdp-add-line-manager-edit").addEventListener("click", function (event) {
      event.preventDefault();
    });




    // JUST FOR DEV - automatically add a new objective

    // pdp-build

    if (!document.body.classList.contains('pdp-build')) {
      // do some stuff


      // document.querySelector("#pdpRemedial").addEventListener("click", function (event) {
      //   document.querySelector("body").classList.toggle("pdp-show-remedial");
      // });

      // document.querySelector("#pdpError").addEventListener("click", function (event) {
      //   errorFeedback.toggleError();
      // });

      // for (let index = 0; index < 1; index++) {
      //   setTimeout(function () {
      //     htmlComponents.pdpTitleAdd.value = `This objective is called ${helpers.generateString(5)} and the aim is to ${helpers.generateString(20)}`;
      //     htmlComponents.pdpTitleAddButton.click();
      //   }, (1500 * index));
      // }

    }


    // JUST FOR DEV
  };
  return module;
})();

pageModule.init();
