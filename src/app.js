'use strict';

var keyboard = require('./keyboard');
var $ = require('jquery');

var app = {
  keyboard: keyboard,
  init: function() {
    $(document).ready(function() {
      $('#inputContainer').keyboard();
    });
  }
};

module.exports = app;