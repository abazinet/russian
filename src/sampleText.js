(function(ru, $) {
  "use strict";

  ru.sampleText = function(text) {
    var rowsSize = 3;
    var columnsSize = 20;
    var count =  columnsSize * rowsSize;
    var position = 0;
    var letters = [];
    var lastWord = '';
    var replayLastWord = '';
    var replayLanguage = 'ru';
    var translatedHasChanged = true;
    var translatedReplay = '';
    var html;

    var sampleText = ru.textReader(count, text);
    var audioPlayer = ru.audioPlayer($.find('audio')[0]);

    var buildLetters = function(chunk) {
      if(chunk === undefined) {
        chunk = sampleText.next();
      }
      for(var i=0; i<count; i++) {
        var pos = i + position;
        var letter = (pos < chunk.length) ?
            chunk[pos] :
            ' ';
        letters[i] = ru.sampleLetter(letter);
      }
    };

    buildLetters();

    return {
      updateText: function(newText) {
        sampleText = ru.textReader(count, newText);
        this._clearPreviousHtml();
        buildLetters();
        this.toHtml();
      },

      sayTranslation: function() {
        if(replayLastWord.length > 1) {
          if(translatedHasChanged) {
            var translator = ru.translator();
            translator.translate(function(translatedText) {
              translatedReplay = translatedText;
              translatedHasChanged = false;
              audioPlayer.play(translatedReplay, 'en');
            }.bind(this),
                replayLastWord,
                replayLanguage,
                'en'
            );
          } else {
            audioPlayer.play(translatedReplay, 'en');
          }
        }
      },

      guessLetter: function(character) {
        var current = this._currentLetter();
        var guessedRight = current.guessLetter(character);
        if(guessedRight) {
          this.cursorRight();
        }

        if(character === ' ' && this._currentLetter().isSpace()) {
          this.guessLetter(' ');
        } else {
          this._playAudio(character, guessedRight);
        }
      },

      toHtml: function() {
        this._clearPreviousHtml();

        var div = $('<div></div>');
        var row = div.clone();
        letters.forEach(function(letter, position) {
          row.append(letter.toHtml());

          if(this._isEndOfLine(position)) {
            position = 0;
            html.append(row.addClass('ui-keyboard-sample-wrapper'));
            row = div.clone();
          }
        }.bind(this));

        this._currentLetter().startBlinking();
        return html;
      },

      getLetters: function() {
        return letters;
      },

      getCount: function() {
        return count;
      },

      getAudioPlayer: function() {
        return audioPlayer;
      },

      scrollDown: function() {
        this._nextPage();
      },

      scrollUp: function() {
        this._previousPage();
      },
      
      cursorRight: function() {
        var current = this._currentLetter();
        current.stopBlinking();
        if(this._isLastLetter()) {
          this._nextPage();
        } else {
          position += 1;
          this._currentLetter().startBlinking();
        }
      },

      cursorLeft: function() {
        var current = this._currentLetter();
        current.stopBlinking();
        if(this._isFirstLetter()) {
          this._previousPage();
        } else {
          position -= 1;
          this._currentLetter().startBlinking();
        }
      },

      _isEndOfLine: function(pos) {
        return (pos % columnsSize) === (columnsSize - 1);
      },

      _isLastLetter: function() {
        return position === count - 1;
      },

      _isFirstLetter: function() {
        return position === 0;
      },

      _clearPreviousHtml: function() {
        if(html === undefined) {
          html = $('<div></div>')
            .addClass('ui-keyboard-sample')
            .css({'margin-bottom' : '1em'});
        } else {
          $('.ui-keyboard-sample-wrapper', html).remove();
        }
      },

      _currentLetter: function() {
        return letters[position];
      },

      _nextPage: function() {
        position = 0;
        buildLetters();
        this.toHtml();
      },

      _previousPage: function() {
        position = 0;
        buildLetters(sampleText.previous());
        this.toHtml();
      },

       _playAudio: function(character, guessedRight) {
        if(guessedRight) {
          if(character === ' ') {
            if(lastWord.length > 1) {
              audioPlayer.play(lastWord);
            }
            replayLastWord = lastWord;
            translatedHasChanged = true;
            lastWord = '';
          } else {
            lastWord += character;
            audioPlayer.play(character);
          }
        } else if(character === ' ' && replayLastWord.length > 1) {
          audioPlayer.play(replayLastWord, replayLanguage);
        }
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);