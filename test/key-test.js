(function(ru) {
  "use strict";

  describe("a keyboard key", function() {
    it("is mapped to a russian character", function() {
      var russianLetter = '\u0444';
      var englishLetter = 'a';
      var key = ru.Key(russianLetter + '(' + englishLetter +')', 0, 0);
      key.toHtml();
      expect(key.getDisplay()).toBe('\u0444');
    });
  });
})(window.ru = window.ru || {});