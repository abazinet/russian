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

    it("keeps the original letter blinking when guessed incorrectly", function() {
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
      expectBlinkingPosition(sample.getLetters(), 0);
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

    it("says the letter out loud when guessed correctly", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      sample.toHtml();
      var playSpy = spyOn(sample.audioPlayer, 'play');
      sample.guessLetter('a');
      expect(playSpy.calls.length).toEqual(1);
      expect(playSpy).toHaveBeenCalledWith('a');
    });

    it("keeps quiet when a letter is guessed incorrectly", function() {
      var sample = new ru.SampleText('abcdefghij0123456789');
      sample.toHtml();
      var playSpy = spyOn(sample.audioPlayer, 'play');
      sample.guessLetter('b');
      sample.guessLetter('9');
      expect(playSpy).not.toHaveBeenCalled();
    });

    it("says the last word when the space key is pressed", function() {
      var source = 'this is a word in the middle';
      var sample = new ru.SampleText(source);
      sample.toHtml();
      for(var i=0; i<'this is a word'.length; i++) {
        sample.guessLetter(source[i]);
      }
      var playSpy = spyOn(sample.audioPlayer, 'play');
      sample.guessLetter(' ');
      expect(playSpy.calls.length).toEqual(1);
      expect(playSpy).toHaveBeenCalledWith('word');
    });

    it("only says words longer than two characters", function() {
      var source = 'long long s long long';
      var sample = new ru.SampleText(source);
      sample.toHtml();
      for(var i=0; i<'long long s'.length; i++) {
        sample.guessLetter(source[i]);
      }
      var playSpy = spyOn(sample.audioPlayer, 'play');
      sample.guessLetter(' ');
      sample.guessLetter(' ');
      sample.guessLetter('s');
      expect(playSpy).not.toHaveBeenCalled();
    });

    it("says the english translation when ctrl-space is pressed", function() {
//
    });


      xit("does not truncate the last word", function() {
    });

    xit("scrolls to the right when the right arrow is pressed", function() {
    });

    xit("scrolls to the left when the left arrow is pressed", function() {
    });

    xit("disables a letter once it has been guessed successfully", function() {
    });

    xit("highlights the key to press when too much time has elapsed", function() {
    });

  });
})(window.ru = window.ru || {}, jQuery);