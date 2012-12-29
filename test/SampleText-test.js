(function(ru, $) {
  "use strict";

  describe("a sample text", function() {
    it("can be printed to html", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      var html = sample.toHtml();
      var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html);
      var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html);
      expect(firstLetter).toHaveText('a');
      expect(lastLetter).toHaveText('9');
    });

    it("has a blinking first letter", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      sample.toHtml();
      expectBlinkingPosition(sample.getLetters(), 0);
    });

    it("moves the blinking letter forward when guessed correctly", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      sample.toHtml();
      sample.guessLetter('a');
      expectBlinkingPosition(sample.getLetters(), 1);
    });

    it("keeps the original blinking letter when guessed incorrectly", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      sample.toHtml();
      sample.guessLetter('b');
      sample.guessLetter('9');
      sample.guessLetter(' ');
      expectBlinkingPosition(sample.getLetters(), 0);
    });

    it("scrolls when reaching the end", function() {
      var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
      var sample = new ru.SampleText(source);
      var html = sample.toHtml();
      for(var i=0; i<sample.Count; i++){
        sample.guessLetter(source[i]);
      }

      var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html);
      var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html);
      expect(firstLetter).toHaveText('a');
      expect(lastLetter).toHaveClass('ui-keyboard-spacer');
    });

    var expectBlinkingPosition = function(letters, expectedPosition) {
      letters.forEach(function(letter, pos) {
        if(pos === expectedPosition) {
          expect(letter._isBlinking()).toBeTruthy();
        } else {
          expect(letter._isBlinking()).toBeFalsy();
        }
      });
    };
  });
})(window.ru = window.ru || {}, jQuery);