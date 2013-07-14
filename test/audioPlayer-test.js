(function(ru, $) {
  "use strict";

  describe("an audio player", function() {
    it("plays a word", function() {
      var server = sinon.fakeServer.create();
      server.respondWith([200, {}, '']);

      var audioElement = $.find('audio')[0];
      var loadSpy = spyOn(audioElement, 'load');
      var playSpy = spyOn(audioElement, 'play');

      var player = ru.audioPlayer(audioElement);
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