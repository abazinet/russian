(function(russian, $){
  "use strict";

  describe("a russian keyboard", function() {
    it("exists", function() {
      expect($.keyboard).toBeDefined();
    });
  });
})(window.russian = window.russian || {}, jQuery);