(function(ru, $) {
  "use strict";

  ru.contentRetriever = function(onNewContent, url, divId, isValidCharacter) {
    return {
      download: function() {
        console.log('downloading content from ' + url);
        $.ajax({
          context: this,
          url: "http://query.yahooapis.com/v1/public/yql",
          dataType: "html",
          data: {
            q: "select * from html where url=\"" + url + "\"",
            format: "html"
          },
          success: function(html) {
            this._fireOnNewContent(html);
          },
          error: function(xhr) {
            console.log(xhr);
            console.log('Content retrieval failed: ' + this._htmlToText(xhr.responseText));
            onNewContent('Content retrieval failed.');
          }
        });
      },

      _htmlToText: function(html) {
        return $.trim($(html).text());
      },

      _extractText: function(html) {
        if(ru.isDefined(divId)) {
          html = $(html).find('#' + divId + ',.' + divId);
        }

        var text = this._htmlToText(html);
        text = this._changeNonBreakingSpace(text);
        text = this._changeInvalidQuotes(text);
        text = this._removeInvalidCharacters(text);
        return text;
      },

      _changeNonBreakingSpace: function(text) {
        return text.replace(/[\s\xA0]+/g, ' ');
      },

      _changeInvalidQuotes: function(text) {
        text = text.replace(/[\u2018\u2019\u201C\u201D]/g, '"');
        return text.replace(/[`]/g, "'");
      },

      _removeInvalidCharacters: function(text) {
        if(ru.isDefined(isValidCharacter)) {
          for(var i=0; i<text.length; i++) {
            if(!isValidCharacter(text[i])) {
              text = text.substr(0, i) + ' ' + text.substr(i + 2);
            }
          }
        }
        return text;
      },

      _fireOnNewContent: function(html) {
        var text = this._extractText(html);
        onNewContent(text);
      }
    };
  };

})(window.ru = window.ru || {}, jQuery);