import * as htmlComponents from './htmlComponents.js';

const init = () => {
  htmlComponents.pdpFormObjectives.addEventListener("input", function (event) {
    const input = event.target;
    if (input.dataset.objectiveType === "satisfied") {
      const li = input.closest(`li`);
      const details = li.querySelector(`details`);
      details.open = false;
      const date = li.querySelector(`duet-date-picker`);
      date.disabled = true;
      htmlComponents.pdpObjectivesArchived.appendChild(li);
      // Need to remove from order list
      htmlComponents.pdpObjectivesArchived.querySelectorAll(`input, textarea`).forEach((input) => {
        if (input.dataset.objectiveType != "satisfied") {
          input.disabled = true;
        }
      });
    }
  });

  htmlComponents.pdpObjectivesArchived.addEventListener("input", function (event) {
    const input = event.target;
    if (input.dataset.objectiveType === "satisfied") {
      const li = input.closest(`li`);
      const details = li.querySelector(`details`);
      details.open = false;
      const date = li.querySelector(`duet-date-picker`);
      date.disabled = false;
      htmlComponents.pdpObjectivesLive.appendChild(li);
      htmlComponents.pdpObjectivesLive.querySelectorAll(`input, textarea`).forEach((input) => {
        input.disabled = false;
      })
    }
  });
}

export { init }