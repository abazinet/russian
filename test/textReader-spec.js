"use strict";

var textReader = require('../src/textReader').textReader;

describe("a text reader", function() {
  it("wraps around flush", function() {
    var reader = textReader(10, '0123456789abcdefghij');
    expect(reader.next()).toBe('0123456789');
    expect(reader.next()).toBe('abcdefghij');
    expect(reader.next()).toBe('0123456789');
  });


  it("wraps around middle", function() {
    var reader = textReader(15, '0123456789abcdefghij');
    expect(reader.next()).toBe('0123456789abcde');
    expect(reader.next()).toBe('fghij0123456789');
  });

  it("supports empty string", function() {
    var reader = textReader(15, '');
    expect(reader.next()).toBe('');
  });

  it("supports reading backwards", function() {
    var reader = textReader(10, '0123456789abcdefghij');
    reader.next();
    reader.next();
    expect(reader.previous()).toBe('0123456789');
    expect(reader.previous()).toBe('0123456789');
  });

  it("does not truncate words", function() {
    var reader = textReader(3, 'a bc');
    expect(reader.next()).toBe('a ');
  });

});
