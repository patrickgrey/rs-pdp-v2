import Sortable from 'sortablejs';
import * as customEvents from './customEvents.js';
import * as helpers from './helpers.js';
import * as htmlComponents from './htmlComponents.js';

function setHiddenOrder() {
  let orderArray = [];
  document.querySelectorAll("#pdpObjectivesLive > li").forEach(li => {
    orderArray.push(li.dataset.objectiveId);
  });
  if (orderArray.length > 0) htmlComponents.pdpObjLiveOrder.value = orderArray.toString();
}

function init() {
  return sortable = Sortable.create(htmlComponents.pdpObjectivesLive, {
    handle: '.pdp-drag-handle',
    animation: 150,
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