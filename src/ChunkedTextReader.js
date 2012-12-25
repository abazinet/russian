(function(russian){
  "use strict";

  russian.ChunkedTextReader = function(chunkSize, text) {
    this.chunkSize = chunkSize;
    this.text = text;
    this.position = 0;
  };

  russian.ChunkedTextReader.prototype.nextChunk = function() {
    var chunk = '';
    for (var i=0; i<this.chunkSize; i++) {
      chunk += this.text.charAt(this.position);
      this.position = (++this.position) % this.text.length;
    }
    return chunk;
  };
})(window.russian = window.russian || {});