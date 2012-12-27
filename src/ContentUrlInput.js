(function(russian, $){
  "use strict";

  russian.ContentUrlInput = function() {
  };

  russian.ContentUrlInput.prototype.toHtml = function() {
    var div = $('<div></div>');
    var input = $('<input />');
    var button = $('<button>Go</button>');
    var label = $('<label></label>');

    div.append(label.clone()
        .css({'margin' : '0em'})
        .attr({'for' : 'url'})
        .text('url: '));
    div.append(input.clone()
        .css('margin', '1em')
        .attr({'name' : 'url', 'placeholder' : 'www.kommersant.ru'}));

    div.append($('<br>'));
    div.append(label.clone()
        .css('margin', '0em')
        .attr({'for' : 'class'})
        .text('html id: '));
    div.append(input.clone()
        .css('margin', '0em')
        .attr({'name' : 'class', 'placeholder' : "leave empty if unknown"}));

    div.append(button.clone());
    return div;
  };

})(window.russian = window.russian || {}, jQuery);