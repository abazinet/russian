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

    // TODO: ALEX: This test fails, functionality is missing, to be implemented
//    it("scrolls the sample text when reaching the end", function() {
//      var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
//      var sampleText = new russian.SampleText(source);
//      var html = sampleText.toHtml();
//      for(var i=0; i<20; i++){
//        sampleText.guessLetter(source[i]);
//      }
//      html = sampleText.toHtml();
//      var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html);
//      var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html);
//      expect(firstLetter).toHaveText('a');
//      expect(lastLetter).toHaveText(' ');
//    });
  });
})(window.russian = window.russian || {}, jQuery);