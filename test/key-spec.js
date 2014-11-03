"use strict";

var keyCreate = require('../src/key').key;

describe("a keyboard key", function() {
  it("maps to a russian character", function() {
    var key = aKey('\u0444', 'a');
    expect(key.getDisplay()).toBe('\u0444');
  });

  it("becomes blue when pressed", function() {
    var key = aKey('\u0444', 'a');

    jasmine.clock().install();
    expect(key._isPressed()).toBeFalsy();

    key.keyPressed();
    expect(key._isPressed()).toBeTruthy();

    jasmine.clock().tick(201);
    expect(key._isPressed()).toBeFalsy();
  });

  var aKey = function(russianLetter, englishLetter) {
    var key = keyCreate(russianLetter + '(' + englishLetter +')', 0, 0);
    key.toHtml();
    return key;
  };

});
