(function(ru, $) {
  "use strict";

  ru.ContentRetriever = function(onNewContent, url, divId) {
    console.log('downloading content from ' + url);
    this.url = url;
    this.divId = divId;
    this.onNewContent = onNewContent;
  };

  ru.ContentRetriever.prototype.download = function() {
    var self = this;
    $.ajax({
      url: "http://query.yahooapis.com/v1/public/yql",
      dataType: "html",
      data: {
        q: "select * from html where url=\"" + self.url + "\"",
        format: "html"
      },
      success: function(html) {
        self.fireOnNewContent(html);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log('ContentRetriever:download failed with ' + textStatus + ' ' + xhr + errorThrown);
      }
    });
  };

  ru.ContentRetriever.prototype.extractText = function(html) {
    if(typeof this.divId !== 'undefined') {
      html = $(html).find('#' + this.divId);
    }
    return $.trim(jQuery(html).text());
  };

  ru.ContentRetriever.prototype.fireOnNewContent = function(html) {
    var text = this.extractText(html);
    this.onNewContent(text);
  };
})(window.ru = window.ru || {}, jQuery);