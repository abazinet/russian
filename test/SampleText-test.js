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

    it("scrolls when reaching the end", function() {
      var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
      var sampleText = new russian.SampleText(source);
      var html = sampleText.toHtml();
      for(var i=0; i<20*3; i++){
        sampleText.guessLetter(source[i]);
      }

      var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html);
      var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html);
      expect(firstLetter).toHaveText('a');
      expect(lastLetter).toHaveClass('ui-keyboard-spacer');
    });
  });
})(window.russian = window.russian || {}, jQuery);