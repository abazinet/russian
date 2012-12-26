(function(russian, $){
  "use strict";

  russian.Key = function() {
  };

  russian.Key.prototype.toHtml = function(keys, newSet, row, key) {
    var action,
        margin,
        rv;

    this.temp = [ newSet, row, key ];

    // ignore empty keys
    if (keys[key].length === 0) { return $('<div></div>'); }

    // process here if it's an action key
    if( /^\{\S+\}$/.test(keys[key])){
      action = keys[key].match(/^\{(\S+)\}$/)[1].toLowerCase();

      // add empty space
      if (/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/.test(action)) {
        // not perfect globalization, but allows you to use {sp:1,1em}, {sp:1.2em} or {sp:15px}
        margin = parseFloat( action.replace(/,/,'.').match(/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/)[1] || 0 );
        $('<span>&nbsp;</span>')
          // previously {sp:1} would add 1em margin to each side of a 0 width span
          // now Firefox doesn't seem to render 0px dimensions, so now we set the
          // 1em margin x 2 for the width
            .width( (action.match('px') ? margin + 'px' : (margin * 2) + 'em') )
            .addClass('ui-keyboard-button ui-keyboard-spacer')
            .appendTo(newSet);
      }

      // meta keys
      if (/^meta\d+\:?(\w+)?/.test(action)){
        rv = this.addKey(action, action);
      }

      // switch needed for action keys with multiple names/shortcuts or
      // default will catch all others
      if ($.keyboard.keyaction.hasOwnProperty(action)){
        rv = this.addKey(action, action);
      }
    } else {
      // regular button (not an action key)
      rv = this.addKey(keys[key], keys[key], true);
    }

    return rv;
  };

  russian.Key.prototype.addKey = function(keyName, name, regKey) {
    // keyName = the name of the function called in $.keyboard.keyaction when the button is clicked
    // name = name added to key, or cross-referenced in the display options
    // newSet = keyset to attach the new button
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
      return this.defaultButton
        .clone()
        .attr({ 'data-value' : n, 'name': kn, 'data-pos': this.temp[1] + ',' + this.temp[2], 'title' : t })
        .data('key', { action: keyName, original: n, curTxt : n, curNum: 0 })
        // add "ui-keyboard-" + keyName, if this is an action key (e.g. "Bksp" will have 'ui-keyboard-bskp' class)
        // add "ui-keyboard-" + unicode of 1st character (e.g. "~" is a regular key, class = 'ui-keyboard-126' (126 is the unicode value - same as typing &#126;)
        .addClass('ui-keyboard-' + kn + keyType + ' ' + 'ui-state-default ui-corner-all') // buttonDefault
        .html('<span>' + n + '</span>')
        .appendTo(this.temp[0]);
    };

  russian.Key.prototype.mappedKeys = {}; // for remapping manually typed in keys

  russian.Key.prototype.temp = [ '', 0, 0 ]; // used when building the keyboard - [keyset element, row, index]

  russian.Key.prototype.defaultButton =
      $('<button></button>')
          .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex' : '-1' })
          .addClass('ui-keyboard-button');

  russian.Key.prototype.display = {
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

})(window.russian = window.russian || {}, jQuery);