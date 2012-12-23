describe("a sample letter", function() {
  it("can be printed to html", function() {
    var html = aLetterHtml('a');
    expect(html).toHaveText('a');
    expect(html).toBe('button');
  });

  it("supports spaces", function() {
    var html = aLetterHtml(' ');
    expect(html).toBe('span');
    expect(html).not.toBe('button');
    expect(html).toHaveClass('ui-keyboard-spacer');
  });

  it("blinks", function() {
    jasmine.Clock.useMock();
    var letter = new russian.SampleLetter('a');
    var html = letter.toHtml();

    expect(html).not.toHaveClass('ui-state-hover');
    letter.blink(true);
    expect(html).toHaveClass('ui-state-hover');
    jasmine.Clock.tick(501);
    expect(html).not.toHaveClass('ui-state-hover');
  });

  it("stops blinking", function() {
    jasmine.Clock.useMock();
    var letter = new russian.SampleLetter('a');
    var html = letter.toHtml();

    expect(html).not.toHaveClass('ui-state-hover');
    letter.blink(true);
    expect(html).toHaveClass('ui-state-hover');
    letter.blink(false);
    jasmine.Clock.tick(501);
    expect(html).toHaveClass('ui-state-hover');
    jasmine.Clock.tick(501);
    expect(html).not.toHaveClass('ui-state-hover');
  });

  var aLetterHtml = function(letter) {
    return new russian.SampleLetter(letter).toHtml();
  }.bind(this);
});