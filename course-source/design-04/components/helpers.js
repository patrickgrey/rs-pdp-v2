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
