(function(ru, $) {
  "use strict";

  ru.Layout = function(name) {
    this.name = name;
    this.rows = [];
    this.keyHash = {};
  };

  ru.Layout.prototype.keyPressed = function(k) {
    var key = this.keyHash[k];
    if(typeof key !== 'undefined') {
      key.keyPressed(k);
    }
    return key;
//    this.rows.forEach(function(row) {
//      row.forEach(function(key) {
//        key.keyPressed(k);
//      });
//    });
  };

  ru.Layout.prototype.addKey = function(row, key) {
    if(this.rows[row] === undefined) {
      this.rows[row] = [];
    }
    this.rows[row].push(key);
    this.keyHash[key.charKey] = key;
  };

  ru.Layout.prototype.toHtml = function() {
    var html = $('<div></div>')
        .attr('name', this.name)
        .addClass('ui-keyboard-keyset ui-keyboard-keyset-' + this.name);

    this.rows.forEach(function(row) {
      row.forEach(function(key) {
        html.append(key.toHtml());
      });
      html.append('<br class="ui-keyboard-button-endrow">');
    });

    return html;
  };

  ru.Layout.prototype.isDefault = function() {
    return this.name === 'default';
  };
})(window.ru = window.ru || {}, jQuery);