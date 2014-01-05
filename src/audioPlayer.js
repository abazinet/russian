(function(ru, $) {
  "use strict";

  ru.audioPlayer = function(audioE) {

    return {
      play: function(word, lang) {
        word = $.trim(word);
        lang = lang || 'ru';

        if(word.length > 0) {
          console.log('playing ' + word);
          if(word.length > 1) {
            audioE.src = 'http://translate.google.com/translate_tts?tl=' + lang + '&q=' + word;
          } else {
            audioE.src = 'http://ec2-54-213-215-101.us-west-2.compute.amazonaws.com/sounds/' + word + '.mp3';
          }

          audioE.load();
          audioE.play();
        }
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);