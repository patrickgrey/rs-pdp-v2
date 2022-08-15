export const delegate = (el, selector, event, handler) => {
  el.addEventListener(event, e => {
    if (e.target.matches(selector)) handler(e, el);
  });
}

export const insertHTML = (el, markup) => {
  el.insertAdjacentHTML('afterbegin', markup);
}

export const emptyElement = el => {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

// Mock server wait
export const asyncTimeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Use:
// async function doStuff() {
//   // doing stuff up here...
//   await asyncTimeout(1000);
//   // After waiting a second, continues doing stuff.
//   }

// declare all characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';

export const generateString = length => {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const closeAllObjectives = function () {
  document.querySelectorAll("#pdpObjectivesLive li details[open]").forEach(detail => {
    detail.open = false;
  });
}
