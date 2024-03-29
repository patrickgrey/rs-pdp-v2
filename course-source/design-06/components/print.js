import * as htmlComponents from './htmlComponents.js';
import * as objectiveAddNew from './objectiveAddNew.js';

/**
 * Details will have to be opened to print them.
 * Need to remember which were open/closed
 * to restore state after print.
 */

let openObjectives = [];
const pdpPrint = document.querySelector("#pdpPrint");
let printContainer;
let printContainerSatisfied;

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
  // container.append(getPrintElement(li, "competency", "p", "Competencies"));
}

const traverse = function (o, fn, scope = []) {
  for (let i in o) {
    fn.apply(this, [i, o[i], scope]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], fn, scope.concat(i));
    }
  }
};

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else
      //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
      if (i == key && obj[i] == val || i == key && val == '') { //
        objects.push(obj);
      } else if (obj[i] == val && key == '') {
        //only add if the object is not already in the array
        if (objects.lastIndexOf(obj) == -1) {
          objects.push(obj);
        }
      }
  }
  return objects;
}

function handleBeforeprint(event) {
  printContainer = document.createElement("div");
  printContainer.id = "pdpPrintContainer";
  printContainerH2 = document.createElement("h2");
  printContainerH2.textContent = "Current Objectives";
  printContainerH2.classList.add("pdp-print-title");
  printContainer.append(printContainerH2);

  printContainerSatisfied = document.createElement("div");
  printContainerSatisfied.id = "pdpPrintContainerSatisfied";
  printContainerSatisfiedH2 = document.createElement("h2");
  printContainerSatisfiedH2.textContent = "Satisfied Objectives";
  printContainerSatisfiedH2.classList.add("pdp-print-title");
  printContainerSatisfied.append(printContainerSatisfiedH2);

  document.querySelector("main").append(printContainer);
  document.querySelector("main").append(printContainerSatisfied);

  let hasCurrent = false;
  let hasSatisfied = false;
  // htmlComponents.pdpFormObjectives.append(printContainer);
  // const main = document.querySelector("#pdpObjectivesLive");
  // const mergedContainers = new Set([...htmlComponents.pdpObjectivesLive?.querySelectorAll("li[data-objective-id]"), ...htmlComponents.pdpObjectivesArchived?.querySelectorAll("li[data-objective-id]")]);


  const treeData = objectiveAddNew.treeData;
  // mergedContainers.forEach((li) => {
  document.querySelectorAll("li[data-objective-id]").forEach((li) => {
    if (li.dataset.objectiveId != "") {
      // console.log("li: ", li);

      const isSatisfied = li.querySelector(`input[data-objective-type="satisfied"]`).checked;

      const currentContainer = isSatisfied ? printContainerSatisfied : printContainer;

      if (isSatisfied) {
        hasSatisfied = true;
      } else {
        hasCurrent = true;
      }

      createPrintElements(currentContainer, li);
      // Get data model from add objective

      const competenceParagraph = document.createElement("p");
      competenceParagraph.classList.add("pdp-print-break");

      const hiddenCompetency = li.querySelector(`[data-objective-type="competency"]`);

      if (hiddenCompetency.value === "") {
        competenceParagraph.innerHTML = `<strong>Competencies</strong>:`;
        currentContainer.append(competenceParagraph);
        return;
      };

      const ids = hiddenCompetency.value.split(",");

      let competenceString = ``;

      ids.forEach(id => {
        competenceString += getObjects(treeData, 'id', id)[0].text + ", ";
      });
      competenceString = competenceString.slice(0, -2);

      competenceParagraph.innerHTML = `<strong>Competencies</strong>: ${competenceString}`;
      currentContainer.append(competenceParagraph);
    }
  });




  // Printed on 25/08/2022 16:10 by Nadine HENGEN
  // Data Privacy: This document contains personal data, it should be kept private and destroyed
  // once no longer needed.
  const privacyElement = document.createElement("p");
  privacyElement.classList.add("pdp-privacy");
  privacyElement.classList.add("pdp-print-break");
  privacyElement.innerHTML = `<i>Printed on ${new Date()}</i>.</br><strong>Data Privacy: </strong> This document contains personal data, it should be kept private and destroyed once no longer needed.`;

  if (!hasCurrent) {
    printContainer.remove();
    printContainer = null;
    printContainerSatisfied.append(privacyElement);
  }

  if (!hasSatisfied) {
    printContainerSatisfied.remove();
    printContainerSatisfied = null;
    printContainer.append(privacyElement);
  }
}

function handleAfterprint(event) {
  if (printContainer) {
    printContainer.remove();
    printContainer = null;
  }
  if (printContainerSatisfied) {
    printContainerSatisfied.remove();
    printContainerSatisfied = null;
  }
  // const privacy = document.querySelector(".pdp-privacy");
  // privacy.remove();
  // privacy = null;
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