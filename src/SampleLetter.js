russian.SampleLetter = function(letter) {
  this.letter = letter;
};

russian.SampleLetter.prototype.blink = function(enabled) {
  this.toHtml();
  if(enabled === undefined) {
    enabled = true;
  }
  if(this.blinking === undefined) {
    this.blinking = false;
  }
  var blinker = function() {
    this.blinking ? this.html.removeClass('ui-state-hover') :
                    this.html.addClass('ui-state-hover');
    this.blinking = !this.blinking;

    if(enabled || this.blinking) {
      window.setTimeout(blinker.bind(this), 500);
    }
  }.bind(this);
  blinker();
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
  return $('<span></span>')
      .width('1em')
      .addClass('ui-keyboard-button ui-keyboard-spacer');
};

russian.SampleLetter.prototype._toLetterHtml = function() {
  return $('<button></button>')
      .css('margin', '0em')
      .attr({'disabled': 'disabled', 'aria-disabled': 'false'})
      .html('<span>' + this.letter + '</span>');
};