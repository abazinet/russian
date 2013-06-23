(function(ru, $) {
  "use strict";

  describe("a russian keyboard", function() {
    xit("displays lowercase russian letters", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      var html = keyboard.toHtml();
      var firstKey = firstVisibleKey(html);
      expect(firstKey).toHaveText('\u0451');
    });

    xit("displays uppercase russian letters when shift is pressed", function() {
      var html = new ru.Keyboard(ru.RussianLayout).toHtml();
      expect(firstVisibleKey(html)).toHaveText('\u0451');
      shiftDown();
      expect(firstVisibleKey(html)).toHaveText('\u0401');
      shiftUp();
      expect(firstVisibleKey(html)).toHaveText('\u0451');
    });

    it("says the english translation when ctrl-space is pressed", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      keyboard.toHtml();
      var saySpy = spyOn(keyboard, 'sayTranslation');
      ctrlSpacePressed();
      expect(saySpy).toHaveBeenCalled();
    });

    it("goes to the next page of sample text when the right arrow is pressed", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      keyboard.toHtml();
      var scrollSpy = spyOn(keyboard, 'nextSampleText');
      rightArrowPressed();
      expect(scrollSpy).toHaveBeenCalled();
    });

    var firstVisibleKey = function(html) {
      return $('.ui-keyboard-keyset', html).filter(function() {
        return $(this).css('display') !== 'none';
      }).find('span:first');
    };

    var rightArrowPressed = function() {
      keyEvent('keydown', {
        which : 39
      });
    };

    var ctrlSpacePressed = function() {
      keyEvent('keypress', {
        which : $.ui.keyCode.SPACE,
        ctrlKey : true
      });
    };

    var shiftDown = function() {
      keyEvent('keydown', {
        which : 16,
        shiftKey : true
      });
    };

    var shiftUp = function() {
      keyEvent('keyup', {
        which : 16,
        shiftKey : false
      });
    };

   var keyEvent = function(eventName, keyAttr) {
     $('body').trigger($.Event(eventName, keyAttr));
   };

  });
})(window.ru = window.ru || {}, jQuery);