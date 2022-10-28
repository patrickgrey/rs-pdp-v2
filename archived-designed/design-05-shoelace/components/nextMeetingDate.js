/**
 * Add or update the next meeting date with the users supervisor.
 */

import * as htmlComponents from './htmlComponents.js';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as feedbackError from './feedbackError.js';

/**
 * Call the API to add / update the next meeting date.
 * 
 * @param {string} date - New odate in yyyy-mm-dd format
 */
async function saveTheDate(date) {
  htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.nextMeetingChangedEvent);
  // Mock send new objective to server
  await helpers.callServer("Date change API Call", 2000);
  const response = feedbackError.isError ? { status: "error", message: "It all went horribly wrong!" } : { status: "ok" };

  if (response.status === "ok") {
    htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.nextMeetingSavedEvent);
  }
  else {
    feedbackError.showError(response.message);
    htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.errorEvent);
  }
}

export { saveTheDate }