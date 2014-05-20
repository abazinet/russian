(function(ru, $) {
  "use strict";

  ru.sampleLetter = function(letter) {
    var html;
    var blinking = false;

    return {
      stopBlinking: function() {
        this._blink(false);
      },

      startBlinking: function() {
        console.log('blink: ');
        this._blink(true);
      },

      guessLetter: function(guess) {
        return letter === guess;
      },

      toHtml: function() {
        if(ru.undef(html)) {
          html = this.isSpace() ?
                 this._toSpaceHtml() :
                 this._toLetterHtml();
        }
        return html;
      },

      isSpace: function() {
        return letter === ' ';
      },

      _toSpaceHtml: function() {
        return $('<span>&nbsp;</span>')
            .width('1em')
            .addClass('ui-keyboard-button ui-keyboard-spacer');
      },

      _toLetterHtml: function() {
        return $('<button></button>')
            .css({'margin' : '0em', 'border' : '0em'})
            .attr({'disabled': 'disabled', 'aria-disabled': 'true'})
            .html('<span>' + letter + '</span>');
      },

      _toggleBlinking: function() {
        if(html.hasClass('ui-state-hover')) {
          html.removeClass('ui-state-hover');
        } else {
          html.addClass('ui-state-hover');
        }
      },

      _isBlinking: function() {
        return (blinking && html.hasClass('ui-state-hover')) === true;
      },

      _blink: function(enabled) {
        this.toHtml();
        blinking = ru.undef(enabled) || enabled;

        var blinker = function() {
          this._toggleBlinking();
          if(blinking) {
            window.setTimeout(blinker.bind(this), 500);
          } else {
            html.removeClass('ui-state-hover');
          }
        }.bind(this);
        blinker();
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);