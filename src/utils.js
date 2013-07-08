(function(ru) {
  "use strict";

  ru.isUndefined = function(obj) {
    return obj === void 0;
  };

  ru.isDefined = function(obj) {
    return !this.isUndefined(obj);
  };

})(window.ru = window.ru || {});