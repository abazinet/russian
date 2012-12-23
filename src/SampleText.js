russian.SampleText = function(sampleText) {
  this.sampleText = sampleText;
  this.rowsSize = 3;
  this.columnsSize = 20;
  this.position = 0;
  this.letters = new Array(this.columnsSize * this.rowsSize);
  this._buildLetters();
};

russian.SampleText.prototype._buildLetters = function() {
  for(var i=0; i<this.letters.length; i++) {
    var textPosition = i + this.position;
    var letter = textPosition < this.sampleText.length ?
                 this.sampleText[textPosition] :
                 ' ';
    this.letters[i] = new russian.SampleLetter(letter);
  }
  this.position += this.letters.length;
};

russian.SampleText.prototype.toHtml = function() {
  var self = this;
  var div = $('<div />');
  var row = div.clone();
  var html = div.clone();

  self.letters.forEach(function(letter, position) {
    if((position % self.columnsSize) == (self.columnsSize - 1)) {
      html.append(row.addClass('ui-keyboard-sample-wrapper'));
      row = div.clone();
    }
    row.append(letter.toHtml());
  });

  self.letters[0].blink(true);

  return html;
};