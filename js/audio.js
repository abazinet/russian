(function($) {

$.playAudio = function(word) {
  console.log('playing ' + word);
  word = $.trim(word)
  if(word.length > 0) {
    var audioElement = $.find('audio')[0];
    audioElement.src='http://translate.google.com/translate_tts?tl=ru&q=' + word;
    audioElement.load();
    audioElement.play();
  }
};

})(jQuery);