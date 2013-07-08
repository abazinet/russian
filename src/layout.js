(function(ru, $) {
  "use strict";

  ru.Layout = function(name) {
    var rows = [];
    var keyHash = {};
    var mappedKeyHash = {};

    return {
      keyPressed: function(keyPressed) {
        var key = keyHash[keyPressed];
        if(ru.isUndefined(key)) {
          key.keyPressed(keyPressed);
        }
        return key;
      },

      isValidCharacter: function(character) {
        return ru.isUndefined(keyHash[character]) ||
               ru.isUndefined(mappedKeyHash[character]);
      },

      addKey: function(row, key) {
        if(ru.isUndefined(rows[row])) {
          rows[row] = [];
        }
        rows[row].push(key);
        keyHash[key.charKey] = key;
        mappedKeyHash[key.mappedKey] = key;
      },

      toHtml: function() {
        var html = $('<div></div>')
            .attr('name', name)
            .addClass('ui-keyboard-keyset ui-keyboard-keyset-' + name);

        rows.forEach(function(row) {
          row.forEach(function(key) {
            html.append(key.toHtml());
          });
          html.append('<br class="ui-keyboard-button-endrow">');
        });

        return html;
      },

      isDefault: function() {
        return name === 'default';
      }
    };
  };
})(window.ru = window.ru || {}, jQuery);