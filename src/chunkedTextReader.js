(function(ru) {
  "use strict";

  ru.chunkedTextReader = function(chunkSize, text) {
    var position = 0;

    return {
      nextChunk: function() {
        var chunk = '';
        for (var i=0; i<chunkSize; i++) {
          chunk += text.charAt(position);
          position = (++position) % text.length;
        }
        return chunk;
      },

      previousChunk: function() {
        position -= chunkSize * 2;
        if(position < 0) {
          position = 0;
        }
        return this.nextChunk();
      }
    };
  };
})(window.ru = window.ru || {});