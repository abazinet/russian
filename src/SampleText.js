(function(russian, $){
  "use strict";

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
      if(this._isLastLetter(this.position)) {
        // TODO: ALEX: Refresh screen with new letters
        this.position = 0;
        this._buildLetters();
      } else {
        this.position += 1;
      }
      this.letters[this.position].blink(true);
    }
  };

  russian.SampleText.prototype.toHtml = function() {
    var div = $('<div></div>');
    var row = div.clone();
    var html = div.clone();

    this.letters.forEach(function(letter, position) {
      row.append(letter.toHtml());

      if(this._isEndOfLine(position)) {
        html.append(row.addClass('ui-keyboard-sample-wrapper'));
        row = div.clone();
      }
    }.bind(this));

    this.letters[this.position].blink(true);
    return html;
  };

  russian.SampleText.prototype.getLetters = function() {
    return this.letters;
  };

  russian.SampleText.prototype._isEndOfLine = function(pos) {
    return (pos % this.columnsSize) === (this.columnsSize - 1);
  };

  russian.SampleText.prototype._isLastLetter = function(pos) {
    return pos === this.letters.length - 1;
  };
})(window.russian = window.russian || {}, jQuery);