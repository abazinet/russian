(function(ru, $) {
  "use strict";

  ru.ContentRetriever = function(onNewContent, url, divId) {
    this.url = url;
    this.divId = divId;
    this.onNewContent = onNewContent;
  };

  ru.ContentRetriever.prototype.download = function() {
    console.log('downloading content from ' + this.url);
    $.ajax({
      context: this,
      url: "http://query.yahooapis.com/v1/public/yql",
      dataType: "html",
      data: {
        q: "select * from html where url=\"" + this.url + "\"",
        format: "html"
      },
      success: function(html) {
        this._fireOnNewContent(html);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log('ContentRetriever:download failed with ' + textStatus + ' ' + xhr + errorThrown);
        throw errorThrown;
      }
    });
  };

  ru.ContentRetriever.prototype._extractText = function(html) {
    if(typeof this.divId !== 'undefined') {
      html = $(html).find('#' + this.divId);
    }
    return $.trim(jQuery(html).text());
  };

  ru.ContentRetriever.prototype._fireOnNewContent = function(html) {
    var text = this._extractText(html);
    this.onNewContent(text);
  };

})(window.ru = window.ru || {}, jQuery);