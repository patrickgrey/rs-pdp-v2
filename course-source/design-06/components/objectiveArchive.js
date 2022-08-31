/**
 * When an object is marked as satisfied, it is moved to the archived list.
 */
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';
import * as objectiveDrag from './objectiveDrag.js';

/**
 * Update the count attributes for each list in the body tag.
 */
function updateCount() {
  document.querySelector(`body`).dataset.objectiveArchiveCount = htmlComponents.pdpObjectivesArchived.querySelectorAll(`li`).length;
  objectiveStore.updateObjectiveCount();
}

const init = () => {
  htmlComponents.pdpFormObjectives.addEventListener("input", function (event) {
    const input = event.target;
    /**
     * If satisfied click for a live objective, 
     * set all fields to disabled except for satisfied
     * so it can be undone.
     */
    if (input.dataset.objectiveType === "satisfied") {
      const li = input.closest(`li`);
      const details = li.querySelector(`details`);
      details.open = false;
      const date = li.querySelector(`duet-date-picker`);
      date.disabled = true;
      htmlComponents.pdpObjectivesArchived.appendChild(li);
      updateCount();
      objectiveDrag.setHiddenOrder();
      htmlComponents.pdpObjectivesArchived.querySelectorAll(`input, textarea`).forEach((input) => {
        if (input.dataset.objectiveType != "satisfied") {
          input.disabled = true;
        }
      });
    }
  });

  /**
     * Move an objective back to the live list.
     */
  htmlComponents.pdpObjectivesArchived.addEventListener("input", function (event) {
    const input = event.target;
    if (input.dataset.objectiveType === "satisfied") {
      const li = input.closest(`li`);
      const details = li.querySelector(`details`);
      details.open = false;
      const date = li.querySelector(`duet-date-picker`);
      date.disabled = false;
      htmlComponents.pdpObjectivesLive.prepend(li);
      updateCount();
      objectiveDrag.setHiddenOrder();
      htmlComponents.pdpObjectivesLive.querySelectorAll(`input, textarea`).forEach((input) => {
        input.disabled = false;
      })
    }
  });
}

export { init }