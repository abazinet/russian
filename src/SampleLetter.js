(function(ru, $) {
  "use strict";

  ru.SampleLetter = function(letter) {
    this.letter = letter;
  };

  ru.SampleLetter.prototype.getLetter = function() {
    return this.letter;
  };

  ru.SampleLetter.prototype.blink = function(enabled) {
    this.toHtml();
    this.blinking = (enabled === undefined ? true : enabled);

    var blinker = function() {
      this._toggleBlinking();
      if(this.blinking) {
        window.setTimeout(blinker.bind(this), 500);
      } else {
        this.html.removeClass('ui-state-hover');
      }
    }.bind(this);
    blinker();
  };

  ru.SampleLetter.prototype.guessLetter = function(letter) {
    return this.letter === letter;
  };

  ru.SampleLetter.prototype.toHtml = function() {
    if(this.html === undefined) {
       this.html = this.isSpace() ?
                   this._toSpaceHtml() :
                   this._toLetterHtml();
    }
    return this.html;
  };

  ru.SampleLetter.prototype.isSpace = function() {
    return this.letter === ' ';
  };

  ru.SampleLetter.prototype._toSpaceHtml = function() {
    return $('<span>&nbsp;</span>')
        .width('1em')
        .addClass('ui-keyboard-button ui-keyboard-spacer');
  };

  ru.SampleLetter.prototype._toLetterHtml = function() {
    return $('<button></button>')
        .css('margin', '0em')
        .attr({'disabled': 'disabled', 'aria-disabled': 'false'})
        .html('<span>' + this.letter + '</span>');
  };

  ru.SampleLetter.prototype._toggleBlinking = function() {
    if(this.html.hasClass('ui-state-hover')) {
      this.html.removeClass('ui-state-hover');
    } else {
      this.html.addClass('ui-state-hover');
    }
  };

  ru.SampleLetter.prototype._isBlinking = function() {
    return (this.blinking &&
            this.html.hasClass('ui-state-hover')) === true;
  };

})(window.ru = window.ru || {}, jQuery);