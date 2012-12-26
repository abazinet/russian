(function(russian, $){
  "use strict";

  russian.SampleLetter = function(letter) {
    this.letter = letter;
  };

  russian.SampleLetter.prototype.blink = function(enabled) {
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

  russian.SampleLetter.prototype.guessLetter = function(letter) {
    return this.letter === letter;
  };

  russian.SampleLetter.prototype.toHtml = function() {
    if(this.html === undefined) {
       this.html = this._isSpace() ?
                   this._toSpaceHtml() :
                   this._toLetterHtml();
    }
    return this.html;
  };

  russian.SampleLetter.prototype._isSpace = function() {
    return this.letter === ' ';
  };

  russian.SampleLetter.prototype._toSpaceHtml = function() {
    return $('<span>&nbsp;</span>')
        .width('1em')
        .addClass('ui-keyboard-button ui-keyboard-spacer');
  };

  russian.SampleLetter.prototype._toLetterHtml = function() {
    return $('<button></button>')
        .css('margin', '0em')
        .attr({'disabled': 'disabled', 'aria-disabled': 'false'})
        .html('<span>' + this.letter + '</span>');
  };

  russian.SampleLetter.prototype._toggleBlinking = function() {
    if(this.html.hasClass('ui-state-hover')) {
      this.html.removeClass('ui-state-hover');
    } else {
      this.html.addClass('ui-state-hover');
    }
  };

  russian.SampleLetter.prototype._isBlinking = function() {
    return (this.blinking &&
            this.html.hasClass('ui-state-hover')) === true;
  };

})(window.russian = window.russian || {}, jQuery);