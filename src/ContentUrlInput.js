(function(russian, $){
  "use strict";

  russian.ContentUrlInput = function(onNewUrl) {
    this.onNewUrl = onNewUrl;
  };

  russian.ContentUrlInput.prototype.toHtml = function() {
    var sampleSource = $('<div></div>').addClass('ui-keyboard-sample-source');
    var input = $('<input />');
    var button = $('<button>Go</button>');

    var url = input.clone();
    sampleSource.append(url
        .css('margin', '1em')
        .attr({'name' : 'url', 'placeholder' : 'kommersant.ru/doc/2099157', 'class' : 'ui-keyboard-source-url'}));

    var divId = input.clone();
    sampleSource.append(divId
        .css('margin', '0em')
        .attr({'name' : 'class', 'placeholder' : "divLetterBranding", 'class' : 'ui-keyboard-source-divid'}));

    var go = button.clone();
    go.click(function() {
      this.onNewUrl(url.val(), divId.val());
    }.bind(this));

    sampleSource.append(go);
    return sampleSource;
  };

})(window.russian = window.russian || {}, jQuery);