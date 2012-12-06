test("play word in audio", function() {
  var server = this.sandbox.useFakeServer();
  server.respondWith([200, {}, '']);

  var audioElement = $.find('audio')[0];
  var loadStub = sinon.stub(audioElement, 'load');
  var playStub = sinon.stub(audioElement, 'play');

  var player = new russian.AudioPlayer(audioElement);
  player.play('alex')
  server.respond();

  ok(loadStub.called);
  ok(playStub.called);
  ok(loadStub.calledBefore(playStub));
});