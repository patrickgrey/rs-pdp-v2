// Prevent submit DONE
// Disable button & input DONE
// Emit 'adding' status event
// Send data and await response
//    Settimeout with OK and ID and error responses.
// On error, emit 'error' event
// On OK, clone objective with ID and init
// Emit 'added' event.

import * as customEvents from './customEvents.js';

const pdpTitleAdd = document.querySelector("#pdpTitleAdd");
const pdpTitleAddButton = document.querySelector("#pdpTitleAddButton");
const pdpFormNew = document.querySelector("#pdpFormNew");

function disableForm() {
  pdpTitleAdd.disabled = true;
  pdpTitleAddButton.disabled = true;
}

function enableForm() {
  pdpTitleAdd.disabled = false;
  pdpTitleAddButton.disabled = false;
}

function postForm() {
  serverWait();
}

function serverWait() {
  setTimeout(function () {
    // const response = { status: "error", message: "It all went horribly wrong!" }
    const response = { status: "ok", id: 1 };
    getResponse(response);
  }, 2000);
}

function getResponse(response) {
  if (response.status === "ok") {
    console.log("It's OK");
    enableForm()
  }
  else {
    console.log("It's error");
    console.log(response.message);
  }
}

function init() {
  pdpTitleAddButton.addEventListener("click", function (event) {
    event.preventDefault();
    disableForm();
    pdpFormNew.dispatchEvent(customEvents.addingEvent);
    postForm();
  });
}

export { init }