(function(ru, $) {
  "use strict";

  describe("a russian keyboard", function() {
    it("displays lowercase russian letters", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      var html = keyboard.toHtml();
      var firstKey = firstVisibleKey(html);
      expect(firstKey).toHaveText('\u0451');
    });

    it("displays uppercase russian letters when shift is pressed", function() {
      var html = new ru.Keyboard(ru.RussianLayout).toHtml();
      pressShift();
      expect(firstVisibleKey(html)).toHaveText('\u0401');

      unpressShift();
      expect(firstVisibleKey(html)).toHaveText('\u0451');
    });

    it("says the english translation when ctrl-space is pressed", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      keyboard.toHtml();
      var saySpy = spyOn(keyboard, 'sayTranslation');
      var e = $.Event( 'keypress', {
        which : $.ui.keyCode.SPACE,
        ctrlKey : true
      });
      $('body').trigger(e);
      expect(saySpy).toHaveBeenCalled();
    });

    var firstVisibleKey = function(html) {
      return $('.ui-keyboard-keyset', html).filter(function() {
        return $(this).css('display') !== 'none';
      }).find('span:first');
    };

    var pressShift = function() {
      var e = $.Event( 'keydown', {
        which : 16,
        shiftKey : true
      });
      $('body').trigger(e);
    };

    var unpressShift = function() {
      var e = $.Event( 'keyup', {
        which : 16,
        shiftKey : false
      });
      $('body').trigger(e);
    };

  });
})(window.ru = window.ru || {}, jQuery);