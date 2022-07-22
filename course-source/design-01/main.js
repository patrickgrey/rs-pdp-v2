import { DuetDatePicker } from "@duetds/date-picker/custom-element";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    customElements.define("duet-date-picker", DuetDatePicker);
  };
  return module;
})();

pageModule.init();
