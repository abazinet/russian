(function(ru, $) {
  "use strict";

  ru.SampleText = function(sampleText) {
    this.rowsSize = 3;
    this.columnsSize = 20;
    this.Count =  this.columnsSize * this.rowsSize;
    this.position = 0;
    this.letters = [];
    this.lastWord = '';
    this.replayLastWord = '';
    this.replayLanguage = 'ru';

    this.sampleText = new ru.ChunkedTextReader(this.Count, sampleText);
    this.audioPlayer = new ru.AudioPlayer($.find('audio')[0]);
    this._buildLetters();
  };

  ru.SampleText.prototype.updateText = function(newText) {
    this.sampleText = new ru.ChunkedTextReader(this.Count, newText);
    this._clearPreviousHtml();
    this._buildLetters();
    this.toHtml();
  };

  ru.SampleText.prototype._buildLetters = function() {
    var text = this.sampleText.nextChunk();
    for(var i=0; i<this.Count; i++) {
      var pos = i + this.position;
      var letter = (pos < text.length) ?
                   text[pos] :
                   ' ';
      this.letters[i] = new ru.SampleLetter(letter);
    }
  };

  ru.SampleText.prototype.guessLetter = function(letter) {
    var currentLetter = this.letters[this.position];
    if(currentLetter.guessLetter(letter)) {
      currentLetter.blink(false);
      if(currentLetter.isSpace()) {
        this.audioPlayer.play(this.lastWord);
        this.replayLastWord = this.lastWord;
        this.lastWord = '';
      } else {
        this.lastWord += currentLetter.getLetter();
      }

      if(this._isLastLetter(this.position)) {
        this.position = 0;
        this._buildLetters();
        this.toHtml();
      } else {
        if(!currentLetter.isSpace()) {
          this.audioPlayer.play(currentLetter.getLetter());
        }
        this.position += 1;
        this.letters[this.position].blink(true);
      }
    } else if(letter === ' ') {
      this.audioPlayer.play(this.replayLastWord, this.replayLanguage);
    }
  };

  ru.SampleText.prototype.toHtml = function() {
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

  ru.SampleText.prototype.getLetters = function() {
    return this.letters;
  };

  ru.SampleText.prototype._isEndOfLine = function(pos) {
    return (pos % this.columnsSize) === (this.columnsSize - 1);
  };

  ru.SampleText.prototype._isLastLetter = function(pos) {
    return pos === this.Count - 1;
  };

  ru.SampleText.prototype._clearPreviousHtml = function() {
    if(this.html === undefined) {
      this.html = $('<div></div>').addClass('ui-keyboard-sample');
    } else {
      $('.ui-keyboard-sample-wrapper', this.html).remove();
    }
  };
})(window.ru = window.ru || {}, jQuery);