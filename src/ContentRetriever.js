(function(ru, $) {
  "use strict";

  ru.ContentRetriever = function(onNewContent, url, divId, isValidCharacter) {
    this.url = url;
    this.divId = divId;
    this.onNewContent = onNewContent;
    this.isValidCharacter = isValidCharacter;
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
      html = $(html).find('#' + this.divId + ',.' + this.divId);
    }

    var text = $.trim(jQuery(html).text());

    text = this._changeNonBreakingSpace(text);
    text = this._changeInvalidQuotes(text);
    text = this._removeInvalidCharacters(text);
    return text;
  };

  ru.ContentRetriever.prototype._changeNonBreakingSpace = function(text) {
    return text.replace(/[\s\xA0]+/g, ' ');
  };

  ru.ContentRetriever.prototype._changeInvalidQuotes = function(text) {
    text = text.replace(/[\u2018\u2019\u201C\u201D]/g, '"');
    return text.replace(/[`]/g, "'");
  };

  ru.ContentRetriever.prototype._removeInvalidCharacters = function(text) {
    if(this.isValidCharacter !== undefined) {
      for(var i=0; i<text.length; i++) {
        if(!this.isValidCharacter(text[i])) {
          text = text.substr(0, i) + ' ' + text.substr(i + 2);
        }
      }
    }
    return text;
  };

  ru.ContentRetriever.prototype._fireOnNewContent = function(html) {
    var text = this._extractText(html);
    this.onNewContent(text);
  };

})(window.ru = window.ru || {}, jQuery);