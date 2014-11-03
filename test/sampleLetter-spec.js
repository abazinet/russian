"use strict";

var sampleLetter = require('../src/sampleLetter').sampleLetter;
var $ = require('jquery');

describe("a sample letter", function() {
  it("can be printed to html", function() {
    var html = aLetterHtml('a');
    expect(html.text()).toBe('a');
    expect(html.is('button')).toBeTruthy();
  });

  it("supports spaces", function() {
    var html = aLetterHtml(' ');
    expect(html.is('span')).toBeTruthy();
  });

  it("can blink", function() {
    jasmine.clock().install();
    var letter = sampleLetter('a');

    expect(letter._isBlinking()).toBeFalsy();
    letter.startBlinking();
    expect(letter._isBlinking()).toBeTruthy();
    jasmine.clock().tick(501);
    expect(letter._isBlinking()).toBeFalsy();
  });

  var aLetterHtml = function(letter) {
    return $(sampleLetter(letter).toHtml());
  }.bind(this);
});