(function(ru) {
  "use strict";

  describe("a sample letter", function() {
    it("can be printed to html", function() {
      var html = aLetterHtml('a');
      expect(html).toHaveText('a');
      expect(html).toBe('button');
    });

    it("supports spaces", function() {
      var html = aLetterHtml(' ');
      expect(html).toBe('span');
      expect(html).not.toBe('button');
      expect(html).toHaveClass('ui-keyboard-spacer');
    });

    it("can blink", function() {
      jasmine.Clock.useMock();
      var letter = ru.sampleLetter('a');

      expect(letter._isBlinking()).toBeFalsy();
      letter.startBlinking();
      expect(letter._isBlinking()).toBeTruthy();
      jasmine.Clock.tick(501);
      expect(letter._isBlinking()).toBeFalsy();
    });

    var aLetterHtml = function(letter) {
      return ru.sampleLetter(letter).toHtml();
    }.bind(this);
  });
})(window.ru = window.ru || {});