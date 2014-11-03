"use strict";

var utils = require('./utils');

var $ = require('jquery');

module.exports = {
  key: function(keyDescription, rowId, colId) {
    var charKey = keyDescription;
    var html;
    var mappedKey;
    var keyType;
    var title;

    var defaultButton = $('<button></button>')
      .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex': '-1' })
      .addClass('ui-keyboard-button');

    var display = {
      'alt': 'AltGr:Alternate Graphemes',
      'e': '\u21b5:Enter',        // down, then left arrow - enter symbol
      'enter': 'Enter:Enter',
      'shift': 'Shift:Shift',
      'space': '&nbsp;:Space',
      't': '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
      'tab': '\u21e5 Tab:Tab'
    };

    return {
      getCharKey: function() {
        return charKey;
      },

      getMappedKey: function() {
        return mappedKey;
      },

      keyPressed: function() {
        var pressedButton = html;
        pressedButton.addClass('ui-state-hover');
        setTimeout(function() {
          pressedButton.removeClass('ui-state-hover');
        }, 200);
      },

      toHtml: function() {
        if (utils.undef(html)) {
          html = $('<div></div>');
          this._buildKey();
          if (keyDescription !== 0) {
            html = this._htmlKey();
          }
        }
        return html;
      },

      getDisplay: function() {
        return mappedKey || charKey;
      },

      _isPressed: function() {
        return html.hasClass('ui-state-hover') === true;
      },

      _keyDisplay: function() {
        if (this._actionKey()) {
          return keyDescription.match(/^\{(\S+)\}$/)[1].toLowerCase();
        }
        return keyDescription;
      },

      _actionKey: function() {
        return (/^\{\S+\}$/.test(keyDescription));
      },

      _htmlKey: function() {
        var displayChar = this.getDisplay();
        if (displayChar === ' ') {
          displayChar = '&nbsp;';
        }
        return defaultButton
          .clone()
          .attr({ 'data-value': charKey, 'name': displayChar, 'data-pos': rowId + ',' + colId, 'title': title })
          .data('key', this)
          .addClass('ui-keyboard-' + displayChar + keyType + ' ' + 'ui-state-default ui-corner-all')
          .html('<span>' + displayChar + '</span>');
      },

      _buildKey: function() {
        if (keyDescription.length !== 0) {
          var map, nm, m;
          var a = this._keyDisplay();
          var n = this._actionKey() ? (display[a] || a) : a;

          // map defined keys - format "key(A):Label_for_key"
          // "key" = key that is seen (can any character; but it might need to be escaped using "\" or entered as unicode "\u####"
          // "(A)" = the actual key on the real keyboard to remap, ":Label_for_key" ends up in the title/tooltip
          if (/\(.+\)/.test(n)) { // n = "\u0391(A):alpha"
            map = n.replace(/\(([^()]+)\)/, ''); // remove "(A)", left with "\u0391:alpha"
            m = n.match(/\(([^()]+)\)/)[1]; // extract "A" from "(A)"
            n = map;
            nm = map.split(':');
            map = (nm[0] !== '' && nm.length > 1) ? nm[0] : map; // get "\u0391" from "\u0391:alpha"
            mappedKey = map;
          }

          // find key label
          nm = n.split(':');
          if (nm[0] === '' && nm[1] === '') {
            n = ':';
          } // corner case of ":(:):;" reduced to "::;", split as ["", "", ";"]
          n = (nm[0] !== '' && nm.length > 1) ? $.trim(nm[0]) : n;
          title = (nm.length > 1) ? $.trim(nm[1]).replace(/_/g, " ") || '' : ''; // added to title

          // Action keys will have the 'ui-keyboard-actionkey' class
          // '\u2190'.length = 1 because the unicode is converted, so if more than one character, add the wide class
          keyType = (n.length > 1) ? ' ui-keyboard-widekey' : '';
          keyType += (!this._actionKey()) ? '' : ' ui-keyboard-actionkey';

          charKey = m || n;

          if (charKey === '&nbsp;') {
            charKey = ' ';
          }
        }
      }
    };
  }
};
