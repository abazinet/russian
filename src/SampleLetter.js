russian.SampleLetter = function(letter) {
  this.letter = letter;
};

russian.SampleLetter.prototype.blink = function(enabled) {
  if(enabled === undefined) enabled = true;
  this.toHtml();
  var blinking = enabled;
  var blinker = function() {
    blinking ? this.html.addClass('ui-state-hover') :
               this.html.removeClass('ui-state-hover');
    blinking = !blinking;

    if(enabled || blinking) {
      window.setTimeout(blinker.bind(this), 500);
    }
  };
  blinker.bind(this)();
};

russian.SampleLetter.prototype.toHtml = function() {
  return function() {
    if(this.html === undefined) {
       this.html = this._isSpace() ?
                   this._toSpaceHtml() :
                   this._toLetterHtml();
    }
    return this.html;
  }.bind(this);
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