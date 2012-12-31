(function(ru, $) {
  "use strict";

  ru.Layout = function(name) {
    this.name = name;
    this.rows = [];
  };

  ru.Layout.prototype.keyPressed = function(k) {
    this.rows.forEach(function(row) {
      row.forEach(function(key) {
        key.keyPressed(k);
      });
    });
  };

  ru.Layout.prototype.getMappedKey = function(key) {
    // To up a mapped key "m(a):label"; m = key to map, (a) = actual keyboard key to map to (optional), ":label" = title/tooltip (optional)
    // example: \u0391 or \u0391(A) or \u0391:alpha or \u0391(A):alpha
    var mappedKeys = new ru.Key().mappedKeys;
    if (!($.isEmptyObject(mappedKeys))) {
      if (mappedKeys.hasOwnProperty(key)){
        return mappedKeys[key];
      }
    }
    return key;
  };

  ru.Layout.prototype.addKey = function(row, key) {
    if(this.rows[row] === undefined) {
      this.rows[row] = [];
    }
    this.rows[row].push(key);
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