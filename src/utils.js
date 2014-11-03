"use strict";

module.exports = {
  undef: function(obj) {
    return obj === void 0;
  },

  def: function(obj) {
    return !this.undef(obj);
  }
};
