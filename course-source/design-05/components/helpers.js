/**
 * Utility methods.
 */

/**
 * Mocking API call delay
 *
 * @param {Integer} ms - milliseconds to delay
 * @return {Promise} - A resolved promise
 * @use 
 *  async function callServer(url, serverDelay) {
      // Do stuff
      await helpers.asyncTimeout(serverDelay);
      // This code delayed until after the helper.
    }
 */
export const asyncTimeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const callServer = async function (url, serverDelay) {
  await asyncTimeout(serverDelay);
  return true;
}


// declare all characters that generated string can use
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
/**
 * Generate random strings with set length
 *
 * @param {Integer} length - Length of returned string
 * @return {String} - Random string
 */
export const generateString = length => {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/**
 * Close all details elements
 */
export const closeAllObjectives = function () {
  document.querySelectorAll("#pdpObjectivesLive li details[open]").forEach(detail => {
    detail.open = false;
  });
}



// https://simonplend.com/how-to-use-fetch-to-post-form-data-as-json-to-your-api/
/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    if (responseData.success) setSavingState(savingOptions.saved);
    // console.table({ responseData });
  } catch (error) {
    console.error(error);
    setSavingState(savingOptions.error);
  }
}