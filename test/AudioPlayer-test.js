(function(russian, $){
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
      var loadStub = sinon.stub(audioElement, 'load');
      var playStub = sinon.stub(audioElement, 'play');

      var player = new russian.AudioPlayer(audioElement);
      player.play('alex');
      server.respond();

      expect(audioElement.src).not.toBe(undefined);
      expect(loadStub.called).toBe(true);
      expect(playStub.called).toBe(true);
      expect(loadStub.calledBefore(playStub)).toBe(true);
    });
  });
})(window.russian = window.russian || {}, jQuery);