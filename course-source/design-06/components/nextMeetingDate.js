/**
 * Add or update the next meeting date with the users supervisor.
 */

import * as htmlComponents from './htmlComponents.js';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as feedbackError from './feedbackError.js';
import * as objectiveStore from './objectiveStore.js';

/**
 * Call the API to add / update the next meeting date.
 * 
 * @param {string} date - New odate in yyyy-mm-dd format
 */
async function saveTheDate(date) {
  htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.nextMeetingChangedEvent);

  const response = await objectiveStore.callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/UpdateNextMeeting`, { date: date }, { ok: true, date: date });

  if (response.ok) {
    htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.nextMeetingSavedEvent);
  }
  else {
    feedbackError.showError(response.message);
    htmlComponents.pdpNextMeetingDate.dispatchEvent(customEvents.errorEvent);
  }
}

export { saveTheDate }