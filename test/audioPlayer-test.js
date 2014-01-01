(function(ru, $) {
  "use strict";

  describe("an audio player", function() {
    var server;
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function () {
      server.restore();
    });

    it("plays a word", function() {
      var url = expectAudioToPlay(['aWord']);
      expect(url.indexOf('q=aWord') !== -1).toBeTruthy();
    });

    it("defaults to the Russian language", function() {
      var url = expectAudioToPlay(['aWord']);
      expect(url.indexOf('tl=ru') !== -1).toBeTruthy();
    });

    it("supports a different language", function() {
      var url = expectAudioToPlay(['aWord', 'en']);
      expect(url.indexOf('tl=en') !== -1).toBeTruthy();
    });

    var expectAudioToPlay = function(playArgs) {
      server.respondWith([200, {}, '']);

      var audioElement = $.find('audio')[0];
      var playSpy = spyOn(audioElement, 'play');

      var player = ru.audioPlayer(audioElement);
      player.play.apply(player, playArgs);
      server.respond();

      expect(playSpy).toHaveBeenCalled();
      return audioElement.src;
    };
  });
})(window.ru = window.ru || {}, jQuery);