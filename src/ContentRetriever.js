(function(russian, $){
  "use strict";

  russian.ContentRetriever = function(onNewContent, url, divId) {
    this.url = url;
    this.divId = divId;
    this.onNewContent = onNewContent;
  };

  russian.ContentRetriever.prototype.download = function() {
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

  russian.ContentRetriever.prototype.extractText = function(html) {
    if(!(typeof this.divId === "undefined")) {
      html = $(html).find('#' + this.divId);
    }
    return jQuery(html).text();
  };

  russian.ContentRetriever.prototype.fireOnNewContent = function(html) {
    var text = this.extractText(html);
     this.onNewContent(text);
  };
})(window.russian = window.russian || {}, jQuery);