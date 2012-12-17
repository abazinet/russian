russian.SampleText = function(sampleText) {
  this.sampleText = sampleText;
  this.rows = 3;
  this.columns = 20;
  this.currentPosition = 0;
};

russian.SampleText.prototype.toHtml = function() {
    var position = 0;
    var divSelector = '<div />';
    var toReturn = $(divSelector);

    for(var rows=0; rows<this.rows && position<this.sampleText.length; rows++) {
      var row = $(divSelector).addClass('ui-keyboard-sample-wrapper');
      for (var columns=0; columns<this.columns && position<this.sampleText.length; columns++) {
        var letter = new russian.SampleLetter(this.sampleText[position]);
        row.append(letter.toHtml());
        position++;
      }
      toReturn.append(row);
    }
    return toReturn;
};
//
//russian.SampleText.prototype.displayCursor = function() {
//  var pressedButton = base.$keyboard.find('.ui-keyboard-' + k.charCodeAt(0));
//  pressedButton.addClass(o.css.buttonHover);
//  setTimeout(function() {
//    pressedButton.removeClass(o.css.buttonHover);
//  }, 200);
// };