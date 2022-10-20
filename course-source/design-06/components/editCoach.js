/**
 * Add or update the next meeting date with the users supervisor.
 */

import * as htmlComponents from './htmlComponents.js';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as feedbackError from './feedbackError.js';

const currentID = 1;

/**
 * Call the API to add / update the next meeting date.
 * 
 * @param {string} date - New odate in yyyy-mm-dd format
 */
async function saveCoachUpdate(coachID) {
  console.log("coachID: ", coachID);
  if (coachID === "none") return;
  htmlComponents.cvEditSaveCoach.dispatchEvent(customEvents.editCoachChangedEvent);
  // Mock send new objective to server
  // await helpers.callServer("Date change API Call", 2000);
  // const response = feedbackError.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok" };

  // let url = `/ilp/customs/Reports/PersonalDevelopmentPlan/Home/Objective`;
  // const response = await fetch(url,
  //   {
  //     method: 'POST',
  //     body: JSON.stringify({ title: title })
  //   });
  // Mock response
  currentID++;
  const response = errorFeedback.isError ? { ok: false, statusText: "It all went horribly wrong!" } : { ok: true, id: currentID };

  if (response.ok) {
    htmlComponents.cvEditSaveCoach.dispatchEvent(customEvents.editCoachSavedEvent);
  }
  else {
    feedbackError.showError(response.message);
    htmlComponents.cvEditSaveCoach.dispatchEvent(customEvents.errorEvent);
  }
}

export { saveCoachUpdate }