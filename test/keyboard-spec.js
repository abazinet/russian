"use strict";

var kb = require('../src/keyboard');
var russian = require('../src/russian');
var $ = require('jquery');

var keyCode = {
  BACKSPACE: 8,
  COMMA: 188,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  LEFT: 37,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PERIOD: 190,
  RIGHT: 39,
  SPACE: 32,
  TAB: 9,
  UP: 38
};

describe("a russian keyboard", function() {
  var keyboard;
  var html;

  beforeEach(function() {
    keyboard = new kb.keyboard(russian.RussianLayout);
    html = keyboard.toHtml();
  });

  it("displays lowercase russian letters", function() {
    var firstKey = firstVisibleKey(html);
    expect(firstKey).toBe('\u0451');
  });

  it("displays uppercase russian letters when shift is pressed", function() {
    expect(firstVisibleKey(html)).toBe('\u0451');
    shiftDown();
    expect(firstVisibleKey(html)).toBe('\u0401');
    shiftUp();
    expect(firstVisibleKey(html)).toBe('\u0451');
  });

  it("says the english translation when ctrl-space is pressed", function() {
    var saySpy = spyOn(keyboard, 'sayTranslation');
    ctrlSpacePressed();
    expect(saySpy).toHaveBeenCalled();
  });

  it("goes to the next page of sample text when the down arrow is pressed", function() {
    var scrollSpy = spyOn(keyboard, 'nextSampleText');
    downArrowPressed();
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("goes to the previous page of sample text when the up arrow is pressed", function() {
    var scrollSpy = spyOn(keyboard, 'previousSampleText');
    upArrowPressed();
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("moves cursor to the right when the right arrow is pressed", function() {
    var cursorSpy = spyOn(keyboard, 'cursorRight');
    rightArrowPressed();
    expect(cursorSpy).toHaveBeenCalled();
  });

  it("moves cursor to the left when the left arrow is pressed", function() {
    var cursorSpy = spyOn(keyboard, 'cursorLeft');
    leftArrowPressed();
    expect(cursorSpy).toHaveBeenCalled();
  });


  var firstVisibleKey = function(html) {
    return $('.ui-keyboard-keyset', html).filter(function() {
      return $(this).css('display') !== 'none';
    }).find('span:first').text();
  };

  var rightArrowPressed = function() {
    keyEvent('keydown', {
      which : 39
    });
  };

  var leftArrowPressed = function() {
    keyEvent('keydown', {
      which : 37
    });
  };

  var upArrowPressed = function() {
    keyEvent('keydown', {
      which : 38
    });
  };

  var downArrowPressed = function() {
    keyEvent('keydown', {
      which : 40
    });
  };

  var ctrlSpacePressed = function() {
    keyEvent('keypress', {
      which : keyCode.SPACE,
      ctrlKey : true
    });
  };

  var shiftDown = function() {
    keyEvent('keydown', {
      which : 16,
      shiftKey : true
    });
  };

  var shiftUp = function() {
    keyEvent('keyup', {
      which : 16,
      shiftKey : false
    });
  };

 var keyEvent = function(eventName, keyAttr) {
   $('body').trigger($.Event(eventName, keyAttr));
 };

});
