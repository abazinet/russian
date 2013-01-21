(function(ru, $) {
  "use strict";

  ru.SampleText = function(sampleText) {
    this.rowsSize = 3;
    this.columnsSize = 20;
    this.count =  this.columnsSize * this.rowsSize;
    this.position = 0;
    this.letters = [];
    this.lastWord = '';
    this.replayLastWord = '';
    this.replayLanguage = 'ru';

    this.sampleText = new ru.ChunkedTextReader(this.count, sampleText);
    this.audioPlayer = new ru.AudioPlayer($.find('audio')[0]);
    this._buildLetters();
  };

  ru.SampleText.prototype.updateText = function(newText) {
    this.sampleText = new ru.ChunkedTextReader(this.count, newText);
    this._clearPreviousHtml();
    this._buildLetters();
    this.toHtml();
  };

  ru.SampleText.prototype._buildLetters = function() {
    var text = this.sampleText.nextChunk();
    for(var i=0; i<this.count; i++) {
      var pos = i + this.position;
      var letter = (pos < text.length) ?
                   text[pos] :
                   ' ';
      this.letters[i] = new ru.SampleLetter(letter);
    }
  };

  ru.SampleText.prototype.sayTranslation = function() {
    if(this.replayLastWord.length > 1) {
      if(this.translatedHasChanged) {
        var translator = new ru.Translator();
        translator.translate(function(translatedText) {
            this.translatedReplay = translatedText;
            this.translatedHasChanged = false;
            this.audioPlayer.play(this.translatedReplay, 'en');
          }.bind(this),
          this.replayLastWord,
          this.replayLanguage,
          'en'
        );
      } else {
        this.audioPlayer.play(this.translatedReplay, 'en');
      }
    }
  };

  ru.SampleText.prototype.guessLetter = function(character) {
    var current = this._currentLetter();
    var guessedRight = current.guessLetter(character);
    if(guessedRight) {
      current.stopBlinking();
      if(this._isLastLetter()) {
        this._nextPage();
      } else {
        this.position += 1;
        this._currentLetter().startBlinking();
      }
    }
    this._playAudio(character, guessedRight);
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

    this._currentLetter().startBlinking();
    return this.html;
  };

  ru.SampleText.prototype.getLetters = function() {
    return this.letters;
  };

  ru.SampleText.prototype._isEndOfLine = function(pos) {
    return (pos % this.columnsSize) === (this.columnsSize - 1);
  };

  ru.SampleText.prototype._isLastLetter = function() {
    return this.position === this.count - 1;
  };

  ru.SampleText.prototype._clearPreviousHtml = function() {
    if(this.html === undefined) {
      this.html = $('<div></div>')
        .addClass('ui-keyboard-sample')
        .css({'margin-bottom' : '1em'});
    } else {
      $('.ui-keyboard-sample-wrapper', this.html).remove();
    }
  };

  ru.SampleText.prototype._currentLetter = function() {
    return this.letters[this.position];
  };

  ru.SampleText.prototype._nextPage = function() {
    this.position = 0;
    this._buildLetters();
    this.toHtml();
  };

  ru.SampleText.prototype._playAudio = function(character, guessedRight) {
    if(guessedRight) {
      if(character === ' ') {
        if(this.lastWord.length > 1) {
          this.audioPlayer.play(this.lastWord);
        }
        this.replayLastWord = this.lastWord;
        this.translatedHasChanged = true;
        this.lastWord = '';
      } else {
        this.lastWord += character;
        this.audioPlayer.play(character);
      }
    } else if(character === ' ' && this.replayLastWord.length > 1) {
      this.audioPlayer.play(this.replayLastWord, this.replayLanguage);
    }
  };
})(window.ru = window.ru || {}, jQuery);