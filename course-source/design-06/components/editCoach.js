/**
 * Add or update the next meeting date with the users supervisor.
 */

import * as htmlComponents from './htmlComponents.js';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as feedbackError from './feedbackError.js';
import * as objectiveStore from './objectiveStore.js';

let currentID = 1;
const select = document.querySelector("#cvLMEditSelect");
const teams = document.querySelector("#pdpCoachTeams");
const email = document.querySelector("#pdpCoachEmail");
const tel = document.querySelector("#pdpCoachTel");
const className = "pdp-link-disabled";
const isDev = !document.body.classList.contains('pdp-build');

/**
 * Call the API to add / update the next meeting date.
 * 
 * @param {string} date - New odate in yyyy-mm-dd format
 */
async function saveCoachUpdate(coachID) {
  htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.editCoachChangedEvent);

  const response = await objectiveStore.callAPI(`/ilp/customs/Reports/PersonalDevelopmentPlan/Home/EditCoach`, { coachID: coachID }, {
    ok: true, coachID: currentID,
    person_id: "196197",
    coach_phone: "++ 33 6 5994 7457",
    coach_email: "marinella.leone@eurocontrol.int",
    coach_teams: "https://teams.microsoft.com/l/chat/0/0?users=marinella.leone@eurocontrol.int"
  });

  // console.log("response:", response);

  if (response.ok) {
    htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.editCoachSavedEvent);
    const data = isDev ? response : await response.json();
    teams.href = data.coach_teams;
    tel.href = `tel:${data.coach_phone}`;
    email.href = `mailto:${data.coach_email}`;
  }
  else {
    feedbackError.showError(response.message);
    htmlComponents.cvEditOpenCoach.dispatchEvent(customEvents.errorEvent);
  }
}

function toggleDisabled(isDisabled) {
  if (isDisabled) {
    teams.classList.add(className);
    email.classList.add(className);
    tel.classList.add(className);
  }
  else {
    teams.classList.remove(className);
    email.classList.remove(className);
    tel.classList.remove(className);
  }
}

function clickHandler(event) {
  if (event.target.classList.contains(className)) {
    event.preventDefault();
  }
}

function init() {

  teams.addEventListener("click", function (event) { clickHandler(event) });
  email.addEventListener("click", function (event) { clickHandler(event) });
  tel.addEventListener("click", function (event) { clickHandler(event) });

  toggleDisabled(select.value === "none");

  htmlComponents.cvEditSaveCoach.addEventListener("click", function (event) {
    event.preventDefault();
    saveCoachUpdate(select.value);
    document.querySelector("#cvCoachEditGroup").style.display = "none";
    document.querySelector("#pdpCoachName").textContent = select.options[select.selectedIndex].text;
    toggleDisabled(select.value === "none");
  });
}

export { init, saveCoachUpdate }