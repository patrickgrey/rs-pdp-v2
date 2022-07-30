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

// declare all characters
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateString = length => {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
