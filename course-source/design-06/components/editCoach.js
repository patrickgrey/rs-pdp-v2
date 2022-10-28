/**
 * Add or update the next meeting date with the users supervisor.
 */

import * as htmlComponents from './htmlComponents.js';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as feedbackError from './feedbackError.js';
import * as objectiveStore from './objectiveStore.js';

let currentID = 1;

/**
 * Call the API to add / update the next meeting date.
 * 
 * @param {string} date - New odate in yyyy-mm-dd format
 */
async function saveCoachUpdate(coachID) {
  htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.editCoachChangedEvent);

  const response = await objectiveStore.callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/EditCoach`, { coachID: coachID }, { ok: true, id: currentID });

  // console.log("response:", response);

  if (response.ok) {
    htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.editCoachSavedEvent);
  }
  else {
    feedbackError.showError(response.message);
    htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.errorEvent);
  }
}

function init() {
  htmlComponents.cvEditSaveCoach.addEventListener("click", function (event) {
    event.preventDefault();
    const select = document.querySelector("#cvLMEditSelect");
    // if (select.value === "none") return;
    saveCoachUpdate(select.value);
    document.querySelector("#cvCoachEditGroup").style.display = "none";
    document.querySelector("#pdpCoachName").textContent = select.options[select.selectedIndex].text;
  });
}

export { init, saveCoachUpdate }