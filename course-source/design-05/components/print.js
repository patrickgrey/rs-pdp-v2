/**
 * Details will have to be opened to print them.
 * Need to remember which were open/closed
 * to restore state after print.
 */

let openObjectives = [];

function handleBeforeprint(event) {
  const main = document.querySelector("main");
  main.querySelectorAll("li[data-objective-id]").forEach((li) => {
    const detail = li.querySelector("details");
    detail.querySelector(".pdp-tree-container").style.display = "none";
    detail.querySelector(".pdp-competencies-print").style.setProperty("display", "block", "important");
    if (!detail.open) {
      openObjectives.push(detail);
      detail.open = true;
    }
  });

}

function handleAfterprint(event) {
  for (let index = 0; index < openObjectives.length; index++) {
    const detail = openObjectives[index];
    detail.open = false;
  }
  openObjectives = [];
  const main = document.querySelector("main");
  main.querySelectorAll("li[data-objective-id]").forEach((li) => {
    const detail = li.querySelector("details");
    detail.querySelector(".pdp-tree-container").style.display = "block";
    detail.querySelector(".pdp-competencies-print").style.setProperty("display", "none", "important");
  })
}

function init() {
  addEventListener('beforeprint', handleBeforeprint);
  addEventListener('afterprint', handleAfterprint);
  const pdpPrint = document.querySelector("#pdpPrint");
  pdpPrint.addEventListener("click", function (event) {
    print();
  });
}

export { init }