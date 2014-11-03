"use strict";

var $ = require('jquery');

module.exports = {
  translate: function(callback, word, srcLang, dstLang) {
    return $.ajax({
      context: this,
      url: 'https://www.googleapis.com/language/translate/v2',
      dataType: 'json',
      data: {
        key: 'AIzaSyB9P1cq1-6OYzDbNHq_LAlj2dVtzMp3GRs',
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