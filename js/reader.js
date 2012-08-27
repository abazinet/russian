(function($) {

$.readDocument = function(url) {
  $.ajax({
    type:"GET",
    url: url,
    success: function(html){
      console.log(html);
      $("#textContainer").html(html);
    }
  });
};

})(jQuery);