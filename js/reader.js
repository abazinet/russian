(function($) {

$.readDocument = function(url) {
  $.ajax({
    url: "http://query.yahooapis.com/v1/public/yql",
    dataType: "html",
    data: {
      q: "select * from html where url=\"" + url + "\"",
      format: "html"
    },
    success: function(content) {
      return content;
    }
  });
};

})(jQuery);