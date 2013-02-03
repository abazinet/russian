(function(ru, $) {
  "use strict";

  ru.audioPlayer = function(audioElement) {
    return {
      play: function(word, lang) {
        if(word.length > 1) {
          console.log('playing ' + word);
        }
        if(typeof lang === 'undefined') {
          lang = 'ru';
        }
        word = $.trim(word);
        if(word.length > 0) {
          audioElement.src = 'http://translate.google.com/translate_tts?tl=' + lang + '&q=' + word;
          audioElement.load();
          audioElement.play();
        }
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);