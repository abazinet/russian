(function(russian, $){
  "use strict";

  russian.ContentUrlInput = function(onNewUrl) {
    this.onNewUrl = onNewUrl;
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

    var url = input.clone();
    div.append(url
        .css('margin', '1em')
        .attr({'name' : 'url', 'placeholder' : 'www.kommersant.ru', 'class' : 'ui-keyboard-source-url'}));

    div.append($('<br>'));
    div.append(label.clone()
        .css('margin', '0em')
        .attr({'for' : 'class'})
        .text('html id: '));

    var divId = input.clone();
    div.append(divId
        .css('margin', '0em')
        .attr({'name' : 'class', 'placeholder' : "leave empty if unknown", 'class' : 'ui-keyboard-source-divid'}));

    var go = button.clone();
    go.click(function() {
      this.onNewUrl(url.val(), divId.val());
    }.bind(this));

    div.append(go);
    return div;
  };

})(window.russian = window.russian || {}, jQuery);