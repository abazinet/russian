(function(russian, $){
  "use strict";

  russian.SampleText = function(sampleText) {
    this.rowsSize = 3;
    this.columnsSize = 20;
    this.position = 0;
    this.letters = new Array(this.columnsSize * this.rowsSize);
    this.sampleText = new russian.ChunkedTextReader(this.letters.length, sampleText);
    this.lastWord = '';
    this.audioPlayer = new russian.AudioPlayer($.find('audio')[0]);
    this._buildLetters();
  };

  russian.SampleText.prototype.changeText = function(newText) {
    this.sampleText = new russian.ChunkedTextReader(this.letters.length, newText);
    this._clearPreviousHtml();
    this._buildLetters();
    this.toHtml();
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
      if(currentLetter.isSpace()) {
        this.audioPlayer.play(this.lastWord);
        this.lastWord = '';
      } else {
        this.lastWord += currentLetter.getLetter();
      }

      if(this._isLastLetter(this.position)) {
        this.position = 0;
        this._buildLetters();
        this.toHtml();
      } else {
        this.audioPlayer.play(currentLetter.getLetter());
        this.position += 1;
        this.letters[this.position].blink(true);
      }
    }
  };

  russian.SampleText.prototype.toHtml = function() {
    this._clearPreviousHtml();

    var div = $('<div></div>');
    var row = div.clone();
    this.letters.forEach(function(letter, position) {
      row.append(letter.toHtml());

      if(this._isEndOfLine(position)) {
        this.position = 0;
        this.html.append(row.addClass('ui-keyboard-sample-wrapper'));
        row = div.clone();
      }
    }.bind(this));

    this.letters[this.position].blink(true);
    return this.html;
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

  russian.SampleText.prototype._clearPreviousHtml = function() {
    if(this.html === undefined) {
      this.html = $('<div></div>').addClass('ui-keyboard-sample');
    } else {
      $('.ui-keyboard-sample-wrapper', this.html).remove();
    }
  };
})(window.russian = window.russian || {}, jQuery);