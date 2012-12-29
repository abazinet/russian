(function(ru, $) {
  "use strict";

  describe("audio player goes to network", function() {
    var server;
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function () {
      server.restore();
    });

    it("html 5 audio plays", function() {
      server.respondWith([200, {}, '']);

      var audioElement = $.find('audio')[0];
      var loadSpy = spyOn(audioElement, 'load');
      var playSpy = spyOn(audioElement, 'play');

      var player = new ru.AudioPlayer(audioElement);
      player.play('alex');
      server.respond();

      expect(audioElement.src).not.toBe(undefined);

      expect(playSpy.calls.length).toEqual(1);
      expect(loadSpy).toHaveBeenCalled();

      expect(loadSpy.calls.length).toEqual(1);
      expect(playSpy).toHaveBeenCalled();
    });
  });
})(window.ru = window.ru || {}, jQuery);