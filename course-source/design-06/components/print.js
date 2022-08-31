import * as htmlComponents from './htmlComponents.js';

/**
 * Details will have to be opened to print them.
 * Need to remember which were open/closed
 * to restore state after print.
 */

let openObjectives = [];
const pdpPrint = document.querySelector("#pdpPrint");
let printContainer;

function getPrintElement(listItem, selector, newElement, label) {
  const input = listItem.querySelector(`[data-objective-type="${selector}"]`);
  const printElement = document.createElement(newElement);
  printElement.classList.add("pdp-print-break");
  printElement.innerHTML = `<strong>${label}</strong>: ${input.value}`;
  return printElement;
}

function createPrintElements(container, li) {
  container.append(li.querySelector(".pdp-date-created").cloneNode(true));
  container.append(getPrintElement(li, "title", "p", "Title"));
  container.append(getPrintElement(li, "duedate", "p", "Due date"));
  container.append(getPrintElement(li, "description", "p", "Description"));
  container.append(getPrintElement(li, "actions", "p", "Actions"));
  container.append(getPrintElement(li, "insights", "p", "Personal Insights"));
  container.append(getPrintElement(li, "feedback", "p", "Feedback"));
  container.append(getPrintElement(li, "competency", "p", "Competencies"));
}

function handleBeforeprint(event) {
  printContainer = document.createElement("div");
  htmlComponents.pdpFormObjectives.append(printContainer);
  const main = document.querySelector("#pdpObjectivesLive");
  main.querySelectorAll("li[data-objective-id]").forEach((li) => {
    createPrintElements(printContainer, li);
  });
  // Printed on 25/08/2022 16:10 by Nadine HENGEN
  // Data Privacy: This document contains personal data, it should be kept private and destroyed
  // once no longer needed.
  const privacyElement = document.createElement("p");
  privacyElement.classList.add("pdp-privacy");
  privacyElement.classList.add("pdp-print-break");
  privacyElement.innerHTML = `<i>Printed on ${new Date()}</i>.</br><strong>Data Privacy: </strong> This document contains personal data, it should be kept private and destroyed once no longer needed.`;
  printContainer.append(privacyElement);
}

function handleAfterprint(event) {
  printContainer.remove();
  printContainer = null;
  pdpPrint.blur();
}

function init() {
  addEventListener('beforeprint', handleBeforeprint);
  addEventListener('afterprint', handleAfterprint);
  pdpPrint.addEventListener("click", function (event) {
    print();
  });
}

export { init }