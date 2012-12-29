(function(ru, $) {
  "use strict";

  describe("a russian keyboard", function() {
    it("exists", function() {
      expect($.keyboard).toBeDefined();
    });
  });
})(window.ru = window.ru || {}, jQuery);