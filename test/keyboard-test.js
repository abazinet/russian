(function(ru, $) {
  "use strict";

  describe("a russian keyboard", function() {
    it("displays russian letters", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      var html = keyboard.toHtml();
      var firstKey = $('.ui-keyboard-keyset', html).filter(function() {
        return $(this).css('display') !== 'none';
      }).find('span:first');
      expect(firstKey).toHaveText('\u0451');
    });

    it("displays uppercase russian letters when shift is pressed", function() {
      var keyboard = new ru.Keyboard(ru.RussianLayout);
      var html = keyboard.toHtml();
      var pressShift = $.Event( 'keydown', {
        which : 16,
        shiftKey : true
      });
      var body = $('body');
      body.trigger(pressShift);
      var firstKey = $('.ui-keyboard-keyset', html).filter(function() {
        return $(this).css('display') !== 'none';
      }).find('span:first');
      expect(firstKey).toHaveText('\u0401');

      var unpressShift = $.Event( 'keyup', {
        which : 16,
        shiftKey : false
      });
      body.trigger(unpressShift);
      firstKey = $('.ui-keyboard-keyset', html).filter(function() {
        return $(this).css('display') !== 'none';
      }).find('span:first');
      expect(firstKey).toHaveText('\u0451');
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

  });
})(window.ru = window.ru || {}, jQuery);