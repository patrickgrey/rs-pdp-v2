import { DuetDatePicker } from "@duetds/date-picker/custom-element";
import Tree from '@widgetjs/tree';
import autoAnimate from '@formkit/auto-animate'

import * as autosave from './components/autosave.js';
import * as objectiveDrag from './components/objectiveDrag.js';
import * as addObjective from './components/objectiveAddNew.js';
import * as deleteObjective from './components/objectiveDelete.js';
import * as objectiveStore from './components/objectiveStore.js';
import * as activityFeedback from './components/feedbackActions.js';
import * as errorFeedback from './components/feedbackError.js';
import * as htmlComponents from './components/htmlComponents.js';
import * as helpers from './components/helpers.js';
import * as customEvents from './components/customEvents.js';
import * as objectiveArchive from './components/objectiveArchive.js';




// TODO
// Test on Mac
// Add full comments
// DONE Delete objective button 
// DONE Fade end of summary objective title DONE
// Move drag button in on 2+ - Can't get transition to work.
// COmplete objective and move to another list.
// DONE Start with 0 objectives
//    DONE On add, mock wait, on success build model and clone hidden to list and open DONE
//    DONE serverWait should respond with an id and the title. DONE
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
  module.init = function () {

    customElements.define("duet-date-picker", DuetDatePicker);
    autoAnimate(pdpObjectivesLive);

    // Objectives already on the page from the server so need to 
    // be initialised.
    if (document.querySelector("body").dataset.objectiveCount > 0) {
      // Build model
      objectiveStore.buildModel();

      // Init dates
      htmlComponents.pdpFormObjectives.querySelectorAll(".pdp-date-picker-container duet-date-picker").forEach((picker) => {
        picker.addEventListener("duetChange", function (event) {
          const li = picker.closest("li");
          const hidden = li.querySelector(`input[data-objective-type="duedate"]`);
          hidden.value = event.detail.value;
          htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.dueDateChangedEvent(hidden));
        });
      });

      // init trees
      htmlComponents.pdpFormObjectives.querySelectorAll(".pdp-tree-container").forEach(function (container) {
        const li = container.closest("li")
        const id = li.dataset.objectiveId;
        const competencyHidden = li.querySelector(`input[data-objective-type="competency"]`);
        let tree = new Tree(".pdp-tree-container", {
          data: [
            {
              id: '-1',
              text: 'root',
              children: pdpTreeData
            }
          ],
          onChange: function () {
            competencyHidden.value = this.values;
            htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.competencyChangedEvent(competencyHidden));
          }
        });
      })
    }

    addObjective.init();
    activityFeedback.init();
    objectiveStore.init();
    autosave.init();
    objectiveDrag.init();
    deleteObjective.init();
    objectiveArchive.init();

    // JUST FOR DEV
    document.querySelector("#pdpRemedial").addEventListener("click", function (event) {
      document.querySelector("body").classList.toggle("pdp-show-remedial");
    });

    document.querySelector("#pdpError").addEventListener("click", function (event) {
      errorFeedback.toggleError();
    });


    // htmlComponents.pdpTitleAdd.value = `This objective is called ${helpers.generateString(5)} and the aim is to ${helpers.generateString(20)}`;

    // htmlComponents.pdpTitleAddButton.click();
    // JUST FOR DEV
  };
  return module;
})();

pageModule.init();
