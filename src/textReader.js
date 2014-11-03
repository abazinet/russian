"use strict";

module.exports = {
  textReader: function(chunkSize, text) {
    var position = 0;

    return {
      next: function() {
        var chunk = '';
        for (var i = 0; i < chunkSize; i++) {
          chunk += text.charAt(position);
          position = (++position) % text.length;
        }

        while (chunk.indexOf(' ') !== -1 &&
          chunk.slice(-1) !== ' ') {
          position--;
          chunk = chunk.slice(0, -1);
        }
        return chunk;
      },

      previous: function() {
        position -= chunkSize * 2;
        if (position < 0) {
          position = 0;
        }
        return this.next();
      }
    };
  }
};
