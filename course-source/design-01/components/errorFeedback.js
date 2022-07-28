import * as htmlComponents from './htmlComponents.js';

export const showError = function (message) {
  const pdpErrorFeedbackSpan = htmlComponents.pdpErrorFeedback.querySelector("span");
  pdpErrorFeedbackSpan.textContent = message;
  document.querySelector("body").classList.add("pdp-show-error");
}

htmlComponents.pdpErrorFeedback.querySelector("button").addEventListener("click", function (event) {
  document.querySelector("body").classList.remove("pdp-show-error");
});
