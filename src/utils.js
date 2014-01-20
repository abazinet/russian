(function(ru) {
  "use strict";

  ru.undef = function(obj) {
    return obj === void 0;
  };

  ru.def = function(obj) {
    return !this.undef(obj);
  };

})(window.ru = window.ru || {});