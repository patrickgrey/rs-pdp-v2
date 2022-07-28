import * as customEvents from './customEvents.js';

const pdpFormNew = document.querySelector("#pdpFormNew");
const pdpActivityFeedback = document.querySelector("#pdpActivityFeedback");


function init() {
  pdpFormNew.addEventListener(customEvents.adding, function (event) {
    console.log("show adding");
  });
}

export { init }