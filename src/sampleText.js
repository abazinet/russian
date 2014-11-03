"use strict";

var $ = require('jquery');

var utils = require('./utils');
var translator = require('./translator');
var textReader = require('./textReader').textReader;
var audioPlayer = require('./audioPlayer').audioPlayer;
var sampleLetter = require('./sampleLetter').sampleLetter;

module.exports = {
  sampleText: function(source) {
    var position = 0;
    var rows = 3;
    var columns = 20;
    var letters = [];
    var lastWord = '';
    var replayLastWord = '';
    var replayLanguage = 'ru';
    var translatedHasChanged = true;
    var translatedReplay = '';
    var html;

    var text = textReader(columns, source);
    var audio = audioPlayer($('<audio controls src="" hidden="hidden"></audio>')[0]);

    var buildLetters = function() {
      letters = [];
      for (var i = 0; i < rows; i++) {
        var line = text.next();
        for (var j = 0; j < line.length; j++) {
          letters.push(sampleLetter(line[j]));
        }
      }
    };

    buildLetters();

    return {
      updateText: function(newText) {
        text = textReader(columns, newText);
        this._clearPreviousHtml();
        buildLetters();
        this.toHtml();
      },

      sayTranslation: function() {
        if (replayLastWord.length > 1) {
          if (translatedHasChanged) {
            translator.translate(function(translatedText) {
                translatedReplay = translatedText;
                translatedHasChanged = false;
                audio.play(translatedReplay, 'en');
              }.bind(this),
              replayLastWord,
              replayLanguage,
              'en'
            );
          } else {
            audio.play(translatedReplay, 'en');
          }
        }
      },

      guessLetter: function(character) {
        var current = this._currentLetter();
        var guessedRight = current.guessLetter(character);
        if (guessedRight) {
          this.cursorRight();
        }

        if (character === ' ' && this._currentLetter().isSpace()) {
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
          if (((position + 1) % columns) === 0 && position < letters.length) {
            position = 0;
            html.append(row.addClass('ui-keyboard-sample-wrapper'));
            row = div.clone();
          }
        }.bind(this));
        html.append(row.addClass('ui-keyboard-sample-wrapper'));

        this._currentLetter().startBlinking();
        return html;
      },

      getLetters: function() {
        return letters;
      },

      getCount: function() {
        return letters.length;
      },

      getAudioPlayer: function() {
        return audio;
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
        if (this._isLastLetter()) {
          this._nextPage();
        } else {
          position += 1;
          this._currentLetter().startBlinking();
        }
      },

      cursorLeft: function() {
        var current = this._currentLetter();
        current.stopBlinking();
        if (this._isFirstLetter()) {
          this._previousPage();
        } else {
          position -= 1;
          this._currentLetter().startBlinking();
        }
      },

      _isLastLetter: function() {
        return position === (letters.length - 2);
      },

      _isFirstLetter: function() {
        return position === 0;
      },

      _clearPreviousHtml: function() {
        if (utils.undef(html)) {
          html = $('<div></div>')
            .addClass('ui-keyboard-sample')
            .css({'margin-bottom': '1em'});
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
        for (var i = 0; i < rows; i++) {
          text.previous();
        }
        buildLetters();
        this.toHtml();
      },

      _playAudio: function(character, guessedRight) {
        if (guessedRight) {
          if (character === ' ') {
            if (lastWord.length > 1) {
              audio.play(lastWord);
            }
            replayLastWord = lastWord;
            translatedHasChanged = true;
            lastWord = '';
          } else {
            lastWord += character;
            audio.play(character);
          }
        } else if (character === ' ' && replayLastWord.length > 1) {
          audio.play(replayLastWord, replayLanguage);
        }
      }
    };
  }
};