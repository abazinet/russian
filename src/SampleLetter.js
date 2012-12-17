russian.SampleLetter = function(letter) {
  this.letter = letter;
};

russian.SampleLetter.prototype.toHtml = function() {
  if(this.letter === ' ') {
    return $('<span>&nbsp;</span>')
        .width('1em')
        .addClass('ui-keyboard-button ui-keyboard-spacer');
  } else {
    return $('<button></button>')
      .css('margin', '0em')
      .attr({'disabled': 'disabled', 'aria-disabled': 'false'})
      .html('<span>' + this.letter + '</span>');
  }
};