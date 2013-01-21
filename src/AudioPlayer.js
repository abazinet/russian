(function(ru, $) {
  "use strict";

  ru.AudioPlayer = function(audioElement) {
    this.audioElement = audioElement;
  };

  ru.AudioPlayer.prototype.play = function(word, lang) {
    if(word.length > 1) {
      console.log('playing ' + word);
    }
    if(typeof lang === 'undefined') {
      lang = 'ru';
    }
    word = $.trim(word);
    if(word.length > 0) {
      this.audioElement.src='http://translate.google.com/translate_tts?tl=' + lang + '&q=' + word;
      this.audioElement.load();
      this.audioElement.play();
    }
  };
})(window.ru = window.ru || {}, jQuery);