(function(ru) {
  "use strict";

  describe("a text reader", function() {
    it("wraps around flush", function() {
      var reader = new ru.ChunkedTextReader(10, '0123456789abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789');
      expect(reader.nextChunk()).toBe('abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789');
    });


    it("wraps around middle", function() {
      var reader = new ru.ChunkedTextReader(15, '0123456789abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789abcde');
      expect(reader.nextChunk()).toBe('fghij0123456789');
    });

    it("supports empty string", function() {
      var reader = new ru.ChunkedTextReader(15, '');
      expect(reader.nextChunk()).toBe('');
    });
  });
})(window.ru = window.ru || {});