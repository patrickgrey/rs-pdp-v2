/**
 * Handle form submit
 * emit events for saved, saving, error
 * prevent overlap
 */

import Sortable from 'sortablejs';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';

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
  if (orderArray.length > 0) document.querySelector(".pd-obj-live-order").value = orderArray.toString();
}

function init() {
  return sortable = Sortable.create(document.getElementById('pdpObjectivesLive'), {
    handle: '.pdp-drag-handle',
    onChoose: function () {
      helpers.closeAllObjectives();
    },
    onEnd: function () {
      setHiddenOrder();
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.objectiveOrderChangedEvent);
    }
  });
}

export { init, setHiddenOrder }