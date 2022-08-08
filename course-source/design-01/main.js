import { DuetDatePicker } from "@duetds/date-picker/custom-element";
import Sortable from 'sortablejs';
import Tree from '@widgetjs/tree';
import autoAnimate from '@formkit/auto-animate'

import * as autosave from './components/autosave.js';
import * as objectiveDrag from './components/objectiveDrag.js';
import * as addObjective from './components/addObjective.js';
import * as deleteObjective from './components/deleteObjective.js';
import * as objectiveStore from './components/objectiveStore.js';
import * as activityFeedback from './components/activityFeedback.js';
import * as errorFeedback from './components/errorFeedback.js';
import * as htmlComponents from './components/htmlComponents.js';
import * as helpers from './components/helpers.js';
import * as customEvents from './components/customEvents.js';


// TODO
// Test on Mac
// DONE Delete objective button 
// DONE Fade end of summary objective title DONE
// Move drag button in on 2+ - Can't get transition to work.
// COmplete objective and move to another list.
// DONE Start with 0 objectives
//    DONE On add, mock wait, on success build model and clone hidden to list and open DONE
//    DONE serverWait should respond with an id and the title. DONE
// Start with 1 objective server side rendered
//    Get change updates from date
//    Get satisfied updates
//    Drag broken - using classes again?
//    Due date format
//    DONE Close existing objectives if a new one is added.
//    DONE THIS IS BECAUSE THE ID IS ALWAYS THE SAME!! Delete always seems to remove the first item, not the selected one.
//      This may only apply to dynamically added objs.
//    DONE Trees not working. Maybe use ID instead of class for containers.
//    DONE confirm deletes
//    DONE Delete not working - need to add listener and prevent DONE
//    DONE Build model with IDs.
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

var pageModule = (function () {
  var module = {};
  module.init = function () {

    customElements.define("duet-date-picker", DuetDatePicker);
    autoAnimate(pdpObjectivesLive);

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

    // If obj count > 0
    //    Build model
    //    Init trees

    addObjective.init();
    activityFeedback.init();
    objectiveStore.init();
    autosave.init();
    objectiveDrag.init();
    deleteObjective.init();

    // JUST FOR DEV
    document.querySelector("#pdpRemedial").addEventListener("click", function (event) {
      document.querySelector("body").classList.toggle("pdp-show-remedial");
    });

    document.querySelector("#pdpError").addEventListener("click", function (event) {
      errorFeedback.toggleError();
    });


    htmlComponents.pdpTitleAdd.value = `This objective is called ${helpers.generateString(5)} and the aim is to ${helpers.generateString(20)}`;

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
