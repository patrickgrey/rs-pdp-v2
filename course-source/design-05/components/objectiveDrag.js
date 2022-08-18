/**
 * Add drag to objectives list and dispatch event that order has changed.
 */
import Sortable from 'sortablejs';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as htmlComponents from './htmlComponents.js';
import * as objectiveStore from './objectiveStore.js';

/**
 * Get an ordered array of IDs from the list.
 */
function setHiddenOrder() {
  let orderArray = [];
  document.querySelectorAll("#pdpObjectivesLive > li").forEach(li => {
    orderArray.push(li.dataset.objectiveId);
  });
  if (orderArray.length > 0) htmlComponents.pdpObjLiveOrder.value = orderArray.toString();
  return orderArray.toString();
}

/**
 * Add drag functionality.
 */
function init() {
  return sortable = Sortable.create(htmlComponents.pdpObjectivesLive, {
    handle: '.pdp-drag-handle',
    animation: 150,
    onChoose: function () {
      helpers.closeAllObjectives();
      htmlComponents.pdpFormObjectives.dispatchEvent(customEvents.updatingEvent);
    },
    onEnd: function () {
      const order = setHiddenOrder();
      objectiveStore.updateOrder(order);
    }
  });
}

export { init, setHiddenOrder }