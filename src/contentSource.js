
"use strict";

var $ = require('jquery');

module.exports = {
  contentSource: function(onNewUrl) {
    return {
      toHtml: function() {
        var sampleSource = $('<div></div>').addClass('ui-keyboard-sample-source');
        var input = $('<input />');
        var button = $('<button>Go</button>');

        var url = input.clone();
        sampleSource.append(url
          .css('margin', '1em')
          .attr({'name': 'url',
            'placeholder': 'www.example.com/text',
            'class': 'ui-keyboard-source-url'
          }));

        var divId = input.clone();
        sampleSource.append(divId
          .css('margin', '0em')
          .attr({'name': 'class',
            'placeholder': "div or class id",
            'class': 'ui-keyboard-source-divid'
          }));

        var go = button.clone();
        go.click(function() {
          onNewUrl(url.val(), divId.val());
        }.bind(this));

        sampleSource.append(go);
        return sampleSource;
      }
    };
  }
};