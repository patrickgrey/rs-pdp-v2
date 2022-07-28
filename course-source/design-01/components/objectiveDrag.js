/**
 * Handle form submit
 * emit events for saved, saving, error
 * prevent overlap
 */

import Sortable from 'sortablejs';

function closeAllObjectives() {
  document.querySelectorAll("#pdpObjectivesLive li details[open]").forEach(detail => {
    detail.open = false;
  });
}

function setHiddenOrder() {
  let orderArray = [];
  document.querySelectorAll("#pdpObjectivesLive > li").forEach(li => {
    orderArray.push(li.dataset.order);
  });
  document.querySelector(".pd-obj-live-order").value = orderArray.toString();
}

function init(timerStart) {
  return sortable = Sortable.create(document.getElementById('pdpObjectivesLive'), {
    handle: '.pdp-drag-handle',
    onChoose: function () {
      closeAllObjectives();
    },
    onEnd: function () {
      setHiddenOrder();
      timerStart();
    }
  });
}

export { init, setHiddenOrder }