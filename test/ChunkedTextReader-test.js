describe("the reader wraps around", function() {
  it("wrap around flush", function() {
    var reader = new russian.ChunkedTextReader(10, '0123456789abcdefghij');
    expect(reader.nextChunk()).toBe('0123456789');
    expect(reader.nextChunk()).toBe('abcdefghij');
    expect(reader.nextChunk()).toBe('0123456789');
  });
  

  it("wrap around middle", function() {
    var reader = new russian.ChunkedTextReader(15, '0123456789abcdefghij');
    expect(reader.nextChunk()).toBe('0123456789abcde');
    expect(reader.nextChunk()).toBe('fghij0123456789');
  });

  it("supports empty string", function() {
    var reader = new russian.ChunkedTextReader(15, '');
    expect(reader.nextChunk()).toBe('');
  });
});