(function(ru, $) {
  "use strict";

  ru.audioPlayer = function(audioE) {
    return {
      play: function(word) {
        word = $.trim(word);

        if(word.length > 0) {
          console.log('playing ' + word);
          audioE.src = 'http://translate.google.com/translate_tts?tl=ru&q=' + word;
          audioE.load();
          audioE.play();
        }
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);