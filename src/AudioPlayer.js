russian.AudioPlayer = function(audioElement) {
  this.audioElement = audioElement;
};

russian.AudioPlayer.prototype.play = function(word) {
  console.log('playing ' + word);
  word = $.trim(word);
  if(word.length > 0) {
    this.audioElement.src='http://translate.google.com/translate_tts?tl=ru&q=' + word;
    this.audioElement.load();
    this.audioElement.play();
  }
};