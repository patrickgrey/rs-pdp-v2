/**
 * Listen for various events and show user feedback.
 */
import * as customEvents from './customEvents.js';
import * as htmlComponents from './htmlComponents.js';

function removeShowClassFromAll() {
  htmlComponents.pdpActivityFeedback.querySelectorAll("img").forEach(img => {
    img.classList.remove("pdp-activity-feedback-show");
  });
}

function setText(message) {
  htmlComponents.pdpSaveMessage.textContent = message;
}

function init() {
  htmlComponents.pdpFormNew.addEventListener(customEvents.adding, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveSaving.classList.add("pdp-activity-feedback-show");
    setText("Adding objective");
  });

  htmlComponents.pdpFormNew.addEventListener(customEvents.added, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("Objective has been added");
  });

  htmlComponents.pdpFormNew.addEventListener(customEvents.error, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveError.classList.add("pdp-activity-feedback-show");
    setText("Error");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.updating, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveSaving.classList.add("pdp-activity-feedback-show");
    setText("Saving update");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.saved, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("Update saved");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.objectiveOrderChanged, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("Order change saved");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleting, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveSaving.classList.add("pdp-activity-feedback-show");
    setText("Deleting objective");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.deleted, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("Objective deleted");
  });

  htmlComponents.pdpFormObjectives.addEventListener(customEvents.error, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveError.classList.add("pdp-activity-feedback-show");
    setText("Error");
  });

  htmlComponents.pdpNextMeetingDate.addEventListener(customEvents.nextMeetingChanged, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveSaving.classList.add("pdp-activity-feedback-show");
    setText("Saving next meeting date");
  });

  htmlComponents.pdpNextMeetingDate.addEventListener(customEvents.nextMeetingSaved, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("Next meeting date saved");
  });

  htmlComponents.pdpNextMeetingDate.addEventListener(customEvents.error, function (event) {
    removeShowClassFromAll();
    htmlComponents.pdpSaveError.classList.add("pdp-activity-feedback-show");
    setText("Error saving date.");
  });

  htmlComponents.cvEditOpenCoach.addEventListener(customEvents.editCoachChangedEvent, function (event) {
    // console.log("editCoachChangedEvent: ", customEvents.editCoachChangedEvent);
    removeShowClassFromAll();
    htmlComponents.pdpSaveSaving.classList.add("pdp-activity-feedback-show");
    setText("Saving coach edit");
  });

  htmlComponents.cvEditOpenCoach.addEventListener(customEvents.editCoachSavedEvent, function (event) {
    // console.log("editCoachSavedEvent: ", customEvents.editCoachSavedEvent);
    removeShowClassFromAll();
    htmlComponents.pdpSaveTick.classList.add("pdp-activity-feedback-show");
    setText("New coach saved");
  });
}

export { init }