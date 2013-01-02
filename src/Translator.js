(function(ru, $) {
  "use strict";

  ru.Translator = function() {
  };

  ru.Translator.prototype.translate = function(callback, word, srcLang, dstLang) {
    $.ajax({
      context: this,
      url: 'https://www.googleapis.com/language/translate/v2',
      dataType: 'json',
      data: {
        key: 'AIzaSyA3sreLMMlzhHp9EPeLINNbpfkVAnZklFM',
        q: word,
        source: srcLang,
        target: dstLang
      },
      success: function(answer) {
        var translation = answer.data.translations[0].translatedText;
        callback(translation);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.log('Translator:translate failed with ' + textStatus + ' ' + xhr + errorThrown);
        throw errorThrown;
      }
    });
  };
})(window.ru = window.ru || {}, jQuery);