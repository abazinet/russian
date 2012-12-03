test("wrap around flush", function() {
  var reader = new russian.ChunkedTextReader(10, '0123456789abcdefghij')
  equal(reader.nextChunk(), '0123456789');
  equal(reader.nextChunk(), 'abcdefghij');
  equal(reader.nextChunk(), '0123456789');
});

test("wrap around middle", function() {
  var reader = new russian.ChunkedTextReader(15, '0123456789abcdefghij')
  equal(reader.nextChunk(), '0123456789abcde');
  equal(reader.nextChunk(), 'fghij0123456789');
});