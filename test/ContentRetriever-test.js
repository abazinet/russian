asyncTest("download text", 1, function() {
  var contentRetriever = new russian.ContentRetriever(function(text) {
    equal(text, 'stub' ); // TODO: ALEX: Stub the network
    start();
  },
  'http://www.kommersant.ru/doc/2009152',
  'divLetterBranding');

  contentRetriever.download();
});