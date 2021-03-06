"use strict";

var translator = require('../src/translator');

describe("a translator", function() {
  var server;
  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
  });

  it("translates hello world from russian to english", function() {
    server.respondWith([200,
                       {'Content-Type': 'application/json'},
                       '{"data": {"translations": [{"translatedText": "hello world"}]}}']);

    var callbackSpy = jasmine.createSpy('callback');
    translator.translate(callbackSpy, '\u043F\u0440\u0438\u0432\u0435\u0442 \u043C\u0438\u0440', 'ru', 'en');
    server.respond();

    expect(callbackSpy.calls.count()).toEqual(1);
    expect(callbackSpy).toHaveBeenCalledWith('hello world');
  });
});