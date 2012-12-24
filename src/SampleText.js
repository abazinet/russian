russian.SampleText = function(sampleText) {
  this.rowsSize = 3;
  this.columnsSize = 20;
  this.position = 0;
  this.letters = new Array(this.columnsSize * this.rowsSize);
  this.sampleText = new russian.ChunkedTextReader(this.letters.length, sampleText);
  this._buildLetters();
};

russian.SampleText.prototype._buildLetters = function() {
  var text = this.sampleText.nextChunk();
  for(var i=0; i<this.letters.length; i++) {
    var pos = i + this.position;
    var letter = (pos < text.length) ?
                 text[pos] :
                 ' ';
    this.letters[i] = new russian.SampleLetter(letter);
  }
};

russian.SampleText.prototype.guessLetter = function(letter) {
  var currentLetter = this.letters[this.position];
  if(currentLetter.guessLetter(letter)) {
    currentLetter.blink(false);
    this.position += 1;
    this.letters[this.position].blink();
  }
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

  self.letters[this.position].blink(true);

  return html;
};