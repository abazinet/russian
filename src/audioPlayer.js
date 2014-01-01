(function(ru, $) {
  "use strict";

  ru.audioPlayer = function(audioE) {
    return {
      play: function(word, lang) {
        word = $.trim(word);
        lang = lang || 'ru';

        if(word.length > 0) {
          console.log('playing ' + word);
          audioE.src = 'http://translate.google.com/translate_tts?tl=' + lang + '&q=' + word;
          audioE.load();
          audioE.play();
        }
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);