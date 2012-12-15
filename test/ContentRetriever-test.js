describe("content is extracted from an external html source", function() {
  var server; 
  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
  });

  it("downloads content", function() {
    server.respondWith([200, 
                       {'Content-Type':'text/html'}, 
                       '<div><div id="divId">The text goes here</div></div>'
    ]);
  
    var callback = sinon.spy();
    var contentRetriever = new russian.ContentRetriever(callback, 'http://www.example.com', 'divId');
    contentRetriever.download();
    server.respond();
  
    expect(callback.calledWithExactly('The text goes here')).toBe(true);
  });
});