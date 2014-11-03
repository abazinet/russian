"use strict";

var audioPlayer = require('../src/audioPlayer').audioPlayer;
var $ = require('jquery');

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
    expect(url).toContain('q=aWord');
  });

  it("defaults to the Russian language", function() {
    var url = expectAudioToPlay(['aWord']);
    expect(url).toContain('tl=ru');
  });

  it("supports a different language when specified", function() {
    var url = expectAudioToPlay(['aWord', 'en']);
    expect(url).toContain('tl=en');
  });

  it("plays single letters using custom sounds from ec2", function() {
    var url = expectAudioToPlay(['a']);
    expect(url).toContain('ec2-');
  });

  it("converts russian characters to lowercase before playing", function() {
    var url = expectAudioToPlay(['\u0401']);
    expect(url).toContain('%D1%91.mp3');
  });

  var expectAudioToPlay = function(playArgs) {
    server.respondWith([200, {}, '']);

    var audioElement = $('<audio controls src="" hidden="hidden"></audio>')[0];
    var playSpy = spyOn(audioElement, 'play');

    var player = audioPlayer(audioElement);
    player.play.apply(player, playArgs);
    server.respond();

    expect(playSpy).toHaveBeenCalled();
    return audioElement.src;
  };
});
