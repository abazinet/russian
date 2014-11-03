"use strict";

var sampleText = require('../src/sampleText').sampleText;
var $ = require('jquery');

describe("a sample text", function() {
  it("can be printed to html", function() {
    var sample = sampleText('abcdefghij0123456789');
    var html = sample.toHtml();
    var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html).text();
    var lastLetter = $('#ui-keyboard-sample-wrapper,span:last', html).text();
    expect(firstLetter).toBe('a');
    expect(lastLetter).toBe('9');
  });

  it("has a blinking first letter", function() {
    var sample = sampleText('abcdefghij0123456789');
    sample.toHtml();
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  it("moves the blinking letter forward when guessed correctly", function() {
    var sample = sampleText('abcdefghij0123456789');
    sample.toHtml();
    sample.guessLetter('a');
    expectBlinkingPosition(sample.getLetters(), 1);
  });

  it("keeps the original letter blinking when guessed incorrectly", function() {
    var sample = sampleText('abcdefghij0123456789');
    sample.toHtml();
    sample.guessLetter('b');
    sample.guessLetter('9');
    sample.guessLetter(' ');
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  it("scrolls when reaching the end", function() {
    var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
    var sample = sampleText(source);
    var html = sample.toHtml();
    for(var i=0; i<sample.getCount(); i++){
      sample.guessLetter(source[i]);
    }

    var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html).text();
    expect(firstLetter).toBe('a');
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  var expectBlinkingPosition = function(letters, expectedPosition) {
    letters.forEach(function(letter, pos) {
      if(pos === expectedPosition) {
        expect(letter._isBlinking()).toBeTruthy();
      } else {
        expect(letter._isBlinking()).toBeFalsy();
      }
    });
  };

  it("says the letter out loud when guessed correctly", function() {
    var sample = sampleText('abcdefghij0123456789');
    sample.toHtml();
    var playSpy = spyOn(sample.getAudioPlayer(), 'play');
    sample.guessLetter('a');
    expect(playSpy.calls.count()).toEqual(1);
    expect(playSpy).toHaveBeenCalledWith('a');
  });

  it("keeps quiet when a letter is guessed incorrectly", function() {
    var sample = sampleText('abcdefghij0123456789');
    sample.toHtml();
    var playSpy = spyOn(sample.getAudioPlayer(), 'play');
    sample.guessLetter('b');
    sample.guessLetter('9');
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("says the last word when the space key is pressed", function() {
    var source = 'this is a word in the middle';
    var sample = sampleText(source);
    sample.toHtml();
    for(var i=0; i<'this is a word'.length; i++) {
      sample.guessLetter(source[i]);
    }
    var playSpy = spyOn(sample.getAudioPlayer(), 'play');
    sample.guessLetter(' ');
    expect(playSpy.calls.count()).toEqual(1);
    expect(playSpy).toHaveBeenCalledWith('word');
  });

  it("only says words longer than one character", function() {
    var source = 'long long s long long';
    var sample = sampleText(source);
    sample.toHtml();
    for(var i=0; i<'long long s'.length; i++) {
      sample.guessLetter(source[i]);
    }
    var playSpy = spyOn(sample.getAudioPlayer(), 'play');
    sample.guessLetter(' ');
    sample.guessLetter(' ');
    sample.guessLetter('s');
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("scrolls text down", function() {
    var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
    var sample = sampleText(source);
    var html = sample.toHtml();
    sample.scrollDown();

    var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html).text();
    expect(firstLetter).toBe('a');
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  it("scrolls text up", function() {
    var source = '123456789 123456789 123456789 123456789 123456789 123456789 abcdefghi abcdefghi ';
    var sample = sampleText(source);
    var html = sample.toHtml();
    for(var i=0; i<60; i++) {
      sample.guessLetter(source[i]);
    }
    sample.scrollUp();

    var firstLetter = $('#ui-keyboard-sample-wrapper,span:first', html).text();
    expect(firstLetter).toBe('1');
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  it("scrolls cursor right", function() {
    var source = 'abdc';
    var sample = sampleText(source);
    sample.toHtml();
    sample.cursorRight();
    expectBlinkingPosition(sample.getLetters(), 1);
  });

  it("scrolls cursor left", function() {
    var source = 'abdc';
    var sample = sampleText(source);
    sample.toHtml();
    sample.guessLetter('a');
    sample.cursorLeft();
    expectBlinkingPosition(sample.getLetters(), 0);
  });

  it("one space eats x number of consecutive spaces", function() {
    var source = 'a         b';
    var sample = sampleText(source);
    sample.toHtml();
    sample.guessLetter('a');
    sample.guessLetter(' ');
    expectBlinkingPosition(sample.getLetters(), 10);
  });


  xit("keeps track of most often english translated words and displays them as a learning exercise", function() {
  });

  xit("disables a letter once it has been guessed successfully", function() {
  });

  xit("highlights the key to press when too much time has elapsed", function() {
  });

  xit("never have words wrap around", function() {

  });

});