(function(ru, $) {
  "use strict";

  ru.Key = function(keyDescription, rowId, colId) {
    this.key = keyDescription;
    this.charKey = '';
    this.rowId = rowId;
    this.colId = colId;
    this.keyName = keyDescription;

    if (this.key.length !== 0) {
      if( /^\{\S+\}$/.test(this.key)) {
        // action key
        this.keyName = this.key.match(/^\{(\S+)\}$/)[1].toLowerCase();

        // meta keys
        if (/^meta\d+\:?(\w+)?/.test(this.keyName) ||
            this.keyaction.hasOwnProperty(this.keyName)) {
          this.html = this._buildKey(this.keyName, this.keyName, false);
        }
      } else {
        // regular key
        this.html = this._buildKey(this.key, this.key, true);
      }
    }
  };

  ru.Key.prototype.getDisplay = function() {
    return this.mappedKey || this.charKey;
  };

  ru.Key.prototype.keyPressed = function() {
    var pressedButton = this.html;
    pressedButton.addClass('ui-state-hover');
    setTimeout(function() {
      pressedButton.removeClass('ui-state-hover');
    }, 200);
  };

  ru.Key.prototype.toHtml = function() {
    if(this.html === undefined) {
      this.html = $('<div></div>');
      if (this.key.length !== 0) {
        this.html = this._htmlKey();
      }
    }
    return this.html;
  };

  ru.Key.prototype._htmlKey = function() {
    var displayChar = this.getDisplay();
    if(displayChar === ' ') {
      displayChar = '&nbsp;';
    }
    return this.defaultButton
      .clone()
      .attr({ 'data-value' : this.charKey, 'name': this.keyName, 'data-pos': this.rowId + ',' + this.colId, 'title' : this.title })
      .data('key', this)
      .addClass('ui-keyboard-' + this.keyName + this.keyType + ' ' + 'ui-state-default ui-corner-all')
      .html('<span>' + displayChar + '</span>');
  };

  ru.Key.prototype._buildKey = function(keyName, name, regKey) {
    // keyName = the name of the function called in $.keyboard.keyaction when the button is clicked
    // name = name added to key, or cross-referenced in the display options
    // regKey = true when it is not an action key
    var map, nm, m,
      n = (regKey === true) ? keyName : this.display[name] || keyName;
    this.keyName = (regKey === true) ? keyName.charCodeAt(0) : keyName;
    // map defined keys - format "key(A):Label_for_key"
    // "key" = key that is seen (can any character; but it might need to be escaped using "\" or entered as unicode "\u####"
    // "(A)" = the actual key on the real keyboard to remap, ":Label_for_key" ends up in the title/tooltip
    if (/\(.+\)/.test(n)) { // n = "\u0391(A):alpha"
      map = n.replace(/\(([^()]+)\)/, ''); // remove "(A)", left with "\u0391:alpha"
      m = n.match(/\(([^()]+)\)/)[1]; // extract "A" from "(A)"
      n = map;
      nm = map.split(':');
      map = (nm[0] !== '' && nm.length > 1) ? nm[0] : map; // get "\u0391" from "\u0391:alpha"
      this.mappedKey = map;
      this.charKey = m;
    }

    // find key label
    nm = n.split(':');
    if (nm[0] === '' && nm[1] === '') { n = ':'; } // corner case of ":(:):;" reduced to "::;", split as ["", "", ";"]
    n = (nm[0] !== '' && nm.length > 1) ? $.trim(nm[0]) : n;
    this.title = (nm.length > 1) ? $.trim(nm[1]).replace(/_/g, " ") || '' : ''; // added to title

    // Action keys will have the 'ui-keyboard-actionkey' class
    // '\u2190'.length = 1 because the unicode is converted, so if more than one character, add the wide class
    this.keyType = (n.length > 1) ? ' ui-keyboard-widekey' : '';
    this.keyType += (regKey) ? '' : ' ui-keyboard-actionkey';
    this.charKey = this.charKey || n;

    if(this.charKey === '&nbsp;') {
      this.charKey = ' ';
    }
  };

  ru.Key.prototype.defaultButton =
      $('<button></button>')
          .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex' : '-1' })
          .addClass('ui-keyboard-button');

  ru.Key.prototype.display = {
    'alt'    : 'AltGr:Alternate Graphemes',
    'e'      : '\u21b5:Enter',        // down, then left arrow - enter symbol
    'enter'  : 'Enter:Enter',
    'shift'  : 'Shift:Shift',
    'space'  : '&nbsp;:Space',
    't'      : '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
    'tab'    : '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
  };

  // Action key function list
  ru.Key.prototype.keyaction = {
    alt : function(base,el){
      //base.altActive = !base.altActive;
      //base.showKeySet(el);
    },
    // el is the pressed key (button) object; it is null when the real keyboard enter is pressed
    enter : function(base, el, e) {
      //base.ooKeyboard.insertText('\n');
    },
    shift : function(base,el){
      //base.lastKeyset[0] = base.shiftActive = !base.shiftActive;
      //base.showKeySet(el);
    },
    space : function(base){
      //base.ooKeyboard.insertText(' ');
    },
    tab : function(base) {
      //base.ooKeyboard.insertText('\t');
    }
  };

})(window.ru = window.ru || {}, jQuery);