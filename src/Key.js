(function(ru, $) {
  "use strict";

  ru.Key = function(key, rowId, colId) {
    this.key = key;
    this.charKey = '';
    this.rowId = rowId;
    this.colId = colId;
  };

  ru.Key.prototype.keyPressed = function(key) {
    if(this.charKey === key) {
      var pressedButton = this.html;
      pressedButton.addClass('ui-state-hover');
      setTimeout(function() {
        pressedButton.removeClass('ui-state-hover');
      }, 200);
    }
  };

  ru.Key.prototype.toHtml = function() {
    if(this.html === undefined) {
      var action;
      this.html = $('<div></div>');

      if (this.key.length !== 0) {
        if( /^\{\S+\}$/.test(this.key)) {
          // action key
          action = this.key.match(/^\{(\S+)\}$/)[1].toLowerCase();

          // meta keys
          if (/^meta\d+\:?(\w+)?/.test(action) ||
              $.keyboard.keyaction.hasOwnProperty(action)) {
            this.html = this._buildKey(action, action, false);
          }
        } else {
          // regular key
          this.html = this._buildKey(this.key, this.key, true);
        }
      }
    }
    return this.html;
  };

  ru.Key.prototype._buildKey = function(keyName, name, regKey) {
    // keyName = the name of the function called in $.keyboard.keyaction when the button is clicked
    // name = name added to key, or cross-referenced in the display options
    // regKey = true when it is not an action key
      var t, keyType, m, map, nm,
        n = (regKey === true) ? keyName : this.display[name] || keyName,
        kn = (regKey === true) ? keyName.charCodeAt(0) : keyName;
      // map defined keys - format "key(A):Label_for_key"
      // "key" = key that is seen (can any character; but it might need to be escaped using "\" or entered as unicode "\u####"
      // "(A)" = the actual key on the real keyboard to remap, ":Label_for_key" ends up in the title/tooltip
      if (/\(.+\)/.test(n)) { // n = "\u0391(A):alpha"
        map = n.replace(/\(([^()]+)\)/, ''); // remove "(A)", left with "\u0391:alpha"
        m = n.match(/\(([^()]+)\)/)[1]; // extract "A" from "(A)"
        n = map;
        nm = map.split(':');
        map = (nm[0] !== '' && nm.length > 1) ? nm[0] : map; // get "\u0391" from "\u0391:alpha"
        this.mappedKeys[m] = map;
      }

      // find key label
      nm = n.split(':');
      if (nm[0] === '' && nm[1] === '') { n = ':'; } // corner case of ":(:):;" reduced to "::;", split as ["", "", ";"]
      n = (nm[0] !== '' && nm.length > 1) ? $.trim(nm[0]) : n;
      t = (nm.length > 1) ? $.trim(nm[1]).replace(/_/g, " ") || '' : ''; // added to title

      // Action keys will have the 'ui-keyboard-actionkey' class
      // '\u2190'.length = 1 because the unicode is converted, so if more than one character, add the wide class
      keyType = (n.length > 1) ? ' ui-keyboard-widekey' : '';
      keyType += (regKey) ? '' : ' ui-keyboard-actionkey';
      this.charKey = n;

      return this.defaultButton
        .clone()
        .attr({ 'data-value' : n, 'name': kn, 'data-pos': this.rowId + ',' + this.colId, 'title' : t })
        .data('key', { action: keyName, original: n, curTxt : n, curNum: 0 })
        // add "ui-keyboard-" + keyName, if this is an action key (e.g. "Bksp" will have 'ui-keyboard-bskp' class)
        // add "ui-keyboard-" + unicode of 1st character (e.g. "~" is a regular key, class = 'ui-keyboard-126' (126 is the unicode value - same as typing &#126;)
        .addClass('ui-keyboard-' + kn + keyType + ' ' + 'ui-state-default ui-corner-all') // buttonDefault
        .html('<span>' + n + '</span>');
    };

  ru.Key.prototype.mappedKeys = {}; // for remapping manually typed in keys

  ru.Key.prototype.defaultButton =
      $('<button></button>')
          .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex' : '-1' })
          .addClass('ui-keyboard-button');

  ru.Key.prototype.display = {
    'alt'    : 'AltGr:Alternate Graphemes',
    'b'      : '\u2190:Backspace',    // Left arrow (same as &larr;)
    'bksp'   : 'Bksp:Backspace',
    'c'      : '\u2716:Cancel (Esc)', // big X, close - same action as cancel
    'cancel' : 'Cancel:Cancel (Esc)',
    'clear'  : 'C:Clear',             // clear num pad
    'e'      : '\u21b5:Enter',        // down, then left arrow - enter symbol
    'enter'  : 'Enter:Enter',
    'lock'   : '\u21ea Lock:Caps Lock', // caps lock
    's'      : '\u21e7:Shift',        // thick hollow up arrow
    'shift'  : 'Shift:Shift',
    'sign'   : '\u00b1:Change Sign',  // +/- sign for num pad
    'space'  : '&nbsp;:Space',
    't'      : '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
    'tab'    : '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
  };

})(window.ru = window.ru || {}, jQuery);