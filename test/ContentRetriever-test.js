(function(ru) {
  "use strict";

  describe("the content retriever", function() {
    var server;
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function () {
      server.restore();
    });

    it("is extracted from an external html source", function() {
      expectContent('<div><div id="divId">The text goes here</div></div>',
                    'The text goes here');
    });

    it("has non breaking spaces replaced with regular spaces", function() {
      expectContent('<div><div id="divId">The text&nbsp;goes here</div></div>',
                    'The text goes here');
    });

    it("has curly quotes replaced with regular quote", function() {
      expectContent('<div><div id="divId">`The\' \'text\' "goes" \u201Chere\u201D</div></div>',
                    '\'The\' \'text\' "goes" "here"');
    });

    it("has any other invalid character replaced by '_'", function() {
      expectContent('<div><div id="divId">âll the invalid châraçtàrs (including multibyte \uD834\uDF06) are gönë</div></div>',
                    ' ll the invalid ch ra t rs (including multibyte  ) are g n ');
    });

    var expectContent = function(sourceHtml, expectedText) {
      server.respondWith([200,
        {'Content-Type':'text/html'},
        sourceHtml
      ]);

      var charFilterStub = function(c) {
        var invalid = /[\uD800-\uDFFF]/.test(c);
        var match = 'âçàöë'.indexOf(c);
        return (!invalid && match === -1);
      };
      var spy = jasmine.createSpy('contentRetrieverSpy');
      var contentRetriever = new ru.ContentRetriever(spy,
                                                     'http://www.example.com',
                                                     'divId',
                                                     charFilterStub);
      contentRetriever.download();
      server.respond();

      expect(spy).toHaveBeenCalledWith(expectedText);
    };
  });
})(window.ru = window.ru || {});