test("download content", function() {
  var server = this.sandbox.useFakeServer();
  server.respondWith([200, 
                     {'Content-Type':'text/html'}, 
                     '<div><div id="divId">The text goes here</div></div>'
  ]);

  var callback = this.spy();
  var contentRetriever = new russian.ContentRetriever(callback, 'http://www.example.com', 'divId');
  contentRetriever.download();
  server.respond();

  ok(callback.calledWithExactly('The text goes here'));
});