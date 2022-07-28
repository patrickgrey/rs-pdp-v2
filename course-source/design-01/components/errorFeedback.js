import * as htmlComponents from './htmlComponents.js';

export const showError = function (message) {
  const pdpErrorFeedbackSpan = htmlComponents.pdpErrorFeedback.querySelector("span");
  pdpErrorFeedbackSpan.textContent = message;
  document.querySelector("body").classList.toggle("pdp-show-error");
}
