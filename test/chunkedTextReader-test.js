(function(ru) {
  "use strict";

  describe("a text reader", function() {
    it("wraps around flush", function() {
      var reader = ru.chunkedTextReader(10, '0123456789abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789');
      expect(reader.nextChunk()).toBe('abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789');
    });


    it("wraps around middle", function() {
      var reader = ru.chunkedTextReader(15, '0123456789abcdefghij');
      expect(reader.nextChunk()).toBe('0123456789abcde');
      expect(reader.nextChunk()).toBe('fghij0123456789');
    });

    it("supports empty string", function() {
      var reader = ru.chunkedTextReader(15, '');
      expect(reader.nextChunk()).toBe('');
    });

    it("supports reading backwards", function() {
      var reader = ru.chunkedTextReader(10, '0123456789abcdefghij');
      reader.nextChunk();
      reader.nextChunk();
      expect(reader.previousChunk()).toBe('0123456789');
      expect(reader.previousChunk()).toBe('0123456789');
    });

    it("does not truncate words", function() {
      var reader = ru.chunkedTextReader(3, 'a bc');
      expect(reader.nextChunk()).toBe('a ');
    });

  });
})(window.ru = window.ru || {});