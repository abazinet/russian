(function(ru, $) {
  "use strict";

  ru.audioPlayer = function(audioE) {
    return {
      play: function(word, lang) {
        lang = ru.isUndefined(lang) ? 'ru' : lang;
        word = $.trim(word);

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