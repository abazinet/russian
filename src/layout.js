(function(ru, $) {
  "use strict";

  ru.Layout = function(name) {
    var rows = [];
    var keyHash = {};
    var mappedKeyHash = {};

    return {
      keyPressed: function(keyPressed) {
        var key = keyHash[keyPressed];
        if(ru.def(key)) {
          key.keyPressed(keyPressed);
        }
        return key;
      },

      isValidCharacter: function(character) {
        return ru.def(keyHash[character]) ||
               ru.def(mappedKeyHash[character]);
      },

      addKey: function(row, key) {
        if(ru.undef(rows[row])) {
          rows[row] = [];
        }
        rows[row].push(key);
        key.toHtml();
        keyHash[key.getCharKey()] = key;
        mappedKeyHash[key.getMappedKey()] = key;
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