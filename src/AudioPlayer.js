(function(russian, $){
  "use strict";

  russian.AudioPlayer = function(audioElement) {
    this.audioElement = audioElement;
  };

  russian.AudioPlayer.prototype.play = function(word, lang) {
    console.log('playing ' + word);
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
})(window.russian = window.russian || {}, jQuery);