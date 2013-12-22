(function(ru, $) {
  "use strict";

  ru.translator = function() {
    return {
      translate: function(callback, word, srcLang, dstLang) {
        $.ajax({
          context: this,
          url: 'https://www.googleapis.com/language/translate/v2',
          dataType: 'json',
          data: {
            key: 'AIzaSyD1GoUR_J0a2wTsazAhadhxf1GFNoTCX8s',
            q: word,
            source: srcLang,
            target: dstLang
          },
          success: function(answer) {
            var translation = answer.data.translations[0].translatedText;
            callback(translation);
          },
          error: function(xhr) {
            console.log(xhr);
            console.log('Translation failed: ' + $.trim($(xhr.responseText).text()));
            callback('Translation failed.');
          }
        });
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);