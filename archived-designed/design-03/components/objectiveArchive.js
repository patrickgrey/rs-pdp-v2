import * as htmlComponents from './htmlComponents.js';

function updateCount() {
  document.querySelector(`body`).dataset.objectiveArchiveCount = htmlComponents.pdpObjectivesArchived.querySelectorAll(`li`).length;
}

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
      updateCount();
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
      updateCount();
      htmlComponents.pdpObjectivesLive.querySelectorAll(`input, textarea`).forEach((input) => {
        input.disabled = false;
      })
    }
  });
}

export { init }