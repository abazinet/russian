(function(russian, $){
  "use strict";

  describe("a sample text", function() {
    it("can be printed to html", function() {
      var text = new russian.SampleText('abcdefghij0123456789');
      var html = text.toHtml();
      var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html);
      var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html);
      expect(firstLetter).toHaveText('a');
      expect(lastLetter).toHaveText('9');
    });

    it("has a blinking first letter", function() {
      var text = new russian.SampleText('abcdefghij0123456789');
      text.toHtml();
      var firstLetter = text.getLetters()[0];
      expect(firstLetter._isBlinking()).toBeTruthy();
    });
  });
})(window.russian = window.russian || {}, jQuery);