var connect = require('connect'),
    http = require('http');

connect()
    .use(connect.static('../'))
    .listen(3000);