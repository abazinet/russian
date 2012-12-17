/*!
Version 1.9.15

Author: Jeremy Satterfield
Modified: Rob Garrison (Mottie on github)
-----------------------------------------
Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php

Heavily modified
-----------------------------------------
*/
;var russian = {};
(function($){
$.keyboard = function(el, options){
	var base = this, o;

	// Access to jQuery and DOM versions of element
	base.$el = $(el);
	base.el = el;

	// Add a reverse reference to the DOM object
	base.$el.data("document", base);

	base.init = function(){
		base.options = o = $.extend(true, {}, $.keyboard.defaultOptions, options);

		// Shift and Alt key toggles, sets is true if a layout has more than one keyset - used for mousewheel message
		base.shiftActive = base.altActive = base.metaActive = base.sets = base.capsLock = false;
		base.lastKeyset = [false, false, false]; // [shift, alt, meta]
		// Class names of the basic key set - meta keysets are handled by the keyname
		base.rows = [ '', '-shift', '-alt', '-alt-shift' ];
		base.acceptedKeys = [];
		base.mappedKeys = {}; // for remapping manually typed in keys
		base.inPlaceholder = base.$el.attr('placeholder') || '';
		base.watermark = (typeof(document.createElement('input').placeholder) !== 'undefined' && base.inPlaceholder !== ''); // html 5 placeholder/watermark
		base.repeatTime = 1000/o.repeatRate; // convert mouse repeater rate (characters per second) into a time in milliseconds.
		base.temp = [ '', 0, 0 ]; // used when building the keyboard - [keyset element, row, index]

		// Bind events
		$.each('initialized visible change hidden canceled accepted beforeClose'.split(' '), function(i,f){
			if ($.isFunction(o[f])){
				base.$el.bind(f + '.keyboard', o[f]);
			}
		});

		// Display keyboard on focus
		base.$el
			.addClass('ui-keyboard-input ' + o.css.input)
			.attr({ 'aria-haspopup' : 'true', 'role' : 'textbox' });

		// add disabled/readonly class - dynamically updated on reveal
		if (base.$el.is(':disabled') || base.$el.attr('readonly')) {
			base.$el.addClass('ui-keyboard-nokeyboard');
		}

		// Add placeholder if not supported by the browser
		if (!base.watermark && base.$el.val() === '' && base.inPlaceholder !== '' && base.$el.attr('placeholder') !== '') {
			base.$el
				.addClass('ui-keyboard-placeholder') // css watermark style (darker text)
				.val( base.inPlaceholder );
		}

		base.$el.trigger( 'initialized.keyboard', [ base, base.el ] );
		base.reveal();
	};

	base.reveal = function(){
  	base.$el.removeClass('ui-keyboard-nokeyboard');

		// Unbind focus to prevent recursion - openOn may be empty if keyboard is opened externally
		base.$el.unbind('');

		// build keyboard if it doesn't exist
		if (typeof(base.$keyboard) === 'undefined') { base.startup(); }

		// clear watermark
		if (!base.watermark && base.el.value === base.inPlaceholder) {
			base.$el
				.removeClass('ui-keyboard-placeholder')
				.val('');
		}

		// get single target position || target stored in element data (multiple targets) || default, at the element
		var position = o.position;
    position.of = position.of || base.$el.data('keyboardPosition') || base.$el;
		position.collision = position.collision || 'fit fit';

		// show & position keyboard
		base.$keyboard
			// basic positioning before it is set by position utility
			.css({ position: 'absolute', left: 0, top: 0 })
			.addClass('ui-keyboard-has-focus')
			.show();

		// get preview area line height
		// add roughly 4px to get line height from font height, works well for font-sizes from 14-36px - needed for textareas
		base.lineHeight = parseInt( base.$preview.css('lineHeight'), 10) || parseInt(base.$preview.css('font-size') ,10) + 4;

		base.$el.trigger( 'visible.keyboard', [ base, base.el ] );
		return base;
	};

	base.startup = function(){
		base.$keyboard = base.buildKeyboard();
		base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');
		base.$preview = base.$el;
		base.$decBtn = base.$keyboard.find('.ui-keyboard-dec');
		base.wheel = $.isFunction( $.fn.mousewheel ); // is mousewheel plugin loaded?
		// keyCode of keys always allowed to be typed - caps lock, page up & down, end, home, arrow, insert & delete keys
		base.alwaysAllowed = [20,33,34,35,36,37,38,39,40,45,46];

		$(document)
			.bind('keypress', function(e) {
				var k = String.fromCharCode(e.charCode || e.which);

				// update caps lock - can only do this while typing =(
				base.capsLock = (((k >= 65 && k <= 90) && !e.shiftKey) || ((k >= 97 && k <= 122) && e.shiftKey));

        if ( (e.ctrlKey || e.metaKey) && (e.which === 97 || e.which === 99 || e.which === 118 || (e.which >= 120 && e.which <=122)) ) {
					// Allow select all (ctrl-a:97), copy (ctrl-c:99), paste (ctrl-v:118) & cut (ctrl-x:120) & redo (ctrl-y:121)& undo (ctrl-z:122); meta key for mac
					return;
				}
				// Mapped Keys - allows typing on a regular keyboard and the mapped key is entered
				// Set up a key in the layout as follows: "m(a):label"; m = key to map, (a) = actual keyboard key to map to (optional), ":label" = title/tooltip (optional)
				// example: \u0391 or \u0391(A) or \u0391:alpha or \u0391(A):alpha
        if (base.hasMappedKeys) {
			    if (base.mappedKeys.hasOwnProperty(k)){
					  k = base.mappedKeys[k];
						base.insertText( k );
						e.preventDefault();
					}
				}
	
				var pressedButton = base.$keyboard.find('.ui-keyboard-' + k.charCodeAt(0));
				pressedButton.addClass(o.css.buttonHover);
				setTimeout(function() {
					pressedButton.removeClass(o.css.buttonHover);
				}, 200);
			})
			.bind('keyup', function(e) {
				switch (e.which) {
	    			case 16:
					    base.shiftActive = false;
						  base.showKeySet(this);
						break;						
				}
				base.$el.trigger( 'change.keyboard', [ base, base.el ] );
			})
			.bind('keydown', function(e) {
				switch (e.which) {
					case 13:
						$.keyboard.keyaction.enter(base, null, e);
						break;

					// Show shift keyboard
					case 16:
					    base.shiftActive = true;
						base.showKeySet(this);
						break;						
				
				  case 32:
				    // TODO: ALEX: Space does some stuff
					var audioPlayer = new russian.AudioPlayer($.find('audio')[0]);
					audioPlayer.play(base.$preview.val());

				    //var content = $.readDocument("http://www.kommersant.ru/doc/2009152");
				    //$("#textContainer").html(content);
				}
			});

	  base.$el.after( base.$keyboard );

		base.$allKeys
			.bind(o.keyBinding.split(' ').join('.keyboard ') + '.keyboard repeater.keyboard', function(e){
				// 'key', { action: doAction, original: n, curTxt : n, curNum: 0 }
				var txt, key = $.data(this, 'key'), action = key.action.split(':')[0];
				if (action.match('meta')) { action = 'meta'; }
				if ($.keyboard.keyaction.hasOwnProperty(action) && $(this).hasClass('ui-keyboard-actionkey')) {
					// stop processing if action returns false (close & cancel)
					if ($.keyboard.keyaction[action](base,this,e) === false) { return; }
				} else if (typeof key.action !== 'undefined') {
					txt = (base.wheel && !$(this).hasClass('ui-keyboard-actionkey')) ? key.curTxt : key.action;
					base.insertText(txt);
					if (!base.capsLock && !o.stickyShift && !e.shiftKey) {
						base.shiftActive = false;
						base.showKeySet(this);
					}
				}
				base.$el.trigger( 'change.keyboard', [ base, base.el ] );
				e.preventDefault();
			})
			// Change hover class and tooltip
			.bind('mouseenter.keyboard mouseleave.keyboard', function(e){
				var el = this, $this = $(this),
					// 'key' = { action: doAction, original: n, curTxt : n, curNum: 0 }
					key = $.data(el, 'key');
				if (e.type === 'mouseenter' && base.el.type !== 'password' ){
					$this
						.addClass(o.css.buttonHover)
						.attr('title', function(i,t){
							// show mouse wheel message
							return (base.wheel && t === '' && base.sets) ? o.wheelMessage : t;
						});
				}
				if (e.type === 'mouseleave'){
					key.curTxt = key.original;
					key.curNum = 0;
					$.data(el, 'key', key);
					$this
						.removeClass( (base.el.type === 'password') ? '' : o.css.buttonHover) // needed or IE flickers really bad
						.attr('title', function(i,t){ return (t === o.wheelMessage) ? '' : t; })
						.find('span').text( key.original ); // restore original button text
				}
			})
			// Allow mousewheel to scroll through other key sets of the same key
			.bind('mousewheel.keyboard', function(e, delta){
				if (base.wheel) {
					var txt, $this = $(this), key = $.data(this, 'key');
					txt = key.layers || base.getLayers( $this );
					key.curNum += (delta > 0) ? -1 : 1;
					if (key.curNum > txt.length-1) { key.curNum = 0; }
					if (key.curNum < 0) { key.curNum = txt.length-1; }
					key.layers = txt;
					key.curTxt = txt[key.curNum];
					$.data(this, 'key', key);
					$this.find('span').text( txt[key.curNum] );
					return false;
				}
        return true;
			})
			// using "kb" namespace for mouse repeat functionality to keep it separate
			// I need to trigger a "repeater.keyboard" to make it work
			.bind('mouseup.keyboard mouseleave.kb touchend.kb touchmove.kb touchcancel.kb', function(){
				base.mouseRepeat = [false,''];
				return false;
			})
			// no mouse repeat for action keys (shift, ctrl, alt, meta, etc)
			.filter(':not(.ui-keyboard-actionkey)')
			// mouse repeated action key exceptions
			.add('.ui-keyboard-tab, .ui-keyboard-bksp, .ui-keyboard-space, .ui-keyboard-enter', base.$keyboard)
			.bind('mousedown.kb touchstart.kb', function(){
				var key = $(this);
				base.mouseRepeat = [true, key]; // save the key, make sure we are repeating the right one (fast typers)
				setTimeout(function() {
					if (base.mouseRepeat[0] && base.mouseRepeat[1] === key) { base.repeatKey(key); }
				}, o.repeatDelay);
				return false;
			});

	  };

    // mousedown repeater
    base.repeatKey = function(key){
      key.trigger('repeater.keyboard');
      if (base.mouseRepeat[0]) {
        setTimeout(function() {
          base.repeatKey(key);
        }, base.repeatTime);
      }
    };

    base.showKeySet = function(el){
      var key = '',
      toShow = (base.shiftActive ? 1 : 0) + (base.altActive ? 2 : 0);
      if (!base.shiftActive) { base.capsLock = false; }
      // check meta key set
      if (base.metaActive) {
        // the name attribute contains the meta set # "meta99"
        key = (el && el.name && /meta/.test(el.name)) ? el.name : '';
        // save active meta keyset name
        if (key === '') {
          key = (base.metaActive === true) ? '' : base.metaActive;
        } else {
          base.metaActive = key;
        }
        // if meta keyset doesn't have a shift or alt keyset, then show just the meta key set
        if ( (!o.stickyShift && base.lastKeyset[2] !== base.metaActive) ||
          ( (base.shiftActive || base.altActive) && !base.$keyboard.find('.ui-keyboard-keyset-' + key + base.rows[toShow]).length) ) {
          base.shiftActive = base.altActive = false;
        }
      } else if (!o.stickyShift && base.lastKeyset[2] !== base.metaActive && base.shiftActive) {
        // switching from meta key set back to default, reset shift & alt if using stickyShift
        base.shiftActive = base.altActive = false;
      }
      toShow = (base.shiftActive ? 1 : 0) + (base.altActive ? 2 : 0);
      key = (toShow === 0 && !base.metaActive) ? '-default' : (key === '') ? '' : '-' + key;
      if (!base.$keyboard.find('.ui-keyboard-keyset' + key + base.rows[toShow]).length) {
        // keyset doesn't exist, so restore last keyset settings
        base.shiftActive = base.lastKeyset[0];
        base.altActive = base.lastKeyset[1];
        base.metaActive = base.lastKeyset[2];
        return;
      }
      base.$keyboard
        .find('.ui-keyboard-alt, .ui-keyboard-shift, .ui-keyboard-actionkey[class*=meta]').removeClass(o.css.buttonAction).end()
        .find('.ui-keyboard-alt')[(base.altActive) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
        .find('.ui-keyboard-shift')[(base.shiftActive) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
        .find('.ui-keyboard-lock')[(base.capsLock) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
        .find('.ui-keyboard-keyset').hide().end()
        .find('.ui-keyboard-keyset' + key + base.rows[toShow]).show().end()
        .find('.ui-keyboard-actionkey.ui-keyboard' + key).addClass(o.css.buttonAction);
      base.lastKeyset = [ base.shiftActive, base.altActive, base.metaActive ];
    };


    // get other layer values for a specific key
    base.getLayers = function(el){
      var key, keys;
      key = el.attr('data-pos');
      keys = el.closest('.ui-keyboard').find('button[data-pos="' + key + '"]').map(function(){
        // added '> span' because jQuery mobile adds multiple spans inside the button
        return $(this).find('> span').text();
      }).get();
      return keys;
    };

    // Build default button
    base.keyBtn = $('<button></button>')
      .attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex' : '-1' })
      .addClass('ui-keyboard-button');

    // keyName = the name of the function called in $.keyboard.keyaction when the button is clicked
    // name = name added to key, or cross-referenced in the display options
    // newSet = keyset to attach the new button
    // regKey = true when it is not an action key
    base.addKey = function(keyName, name, regKey){
      var t, keyType, m, map, nm,
        n = (regKey === true) ? keyName : o.display[name] || keyName,
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
        base.mappedKeys[m] = map;
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
      return base.keyBtn
        .clone()
        .attr({ 'data-value' : n, 'name': kn, 'data-pos': base.temp[1] + ',' + base.temp[2], 'title' : t })
        .data('key', { action: keyName, original: n, curTxt : n, curNum: 0 })
        // add "ui-keyboard-" + keyName, if this is an action key (e.g. "Bksp" will have 'ui-keyboard-bskp' class)
        // add "ui-keyboard-" + unicode of 1st character (e.g. "~" is a regular key, class = 'ui-keyboard-126' (126 is the unicode value - same as typing &#126;)
        .addClass('ui-keyboard-' + kn + keyType + ' ' + o.css.buttonDefault)
        .html('<span>' + n + '</span>')
        .appendTo(base.temp[0]);
    };

    base.buildKeyboard = function(){
      var action, row, newSet,
        currentSet, key, keys, margin,
        sets = 0,

      container = $('<div />')
        .addClass('ui-keyboard ' + o.css.container + ' ui-keyboard-always-open')
        .attr({ 'role': 'textbox' })
        .hide();

      // No preview display, use element and reposition the keyboard under it.
      base.$preview = base.$el;
      o.position.at = o.position.at2;

      // build text sample
      var sampleText = new russian.SampleText('кстрадиции которого по обвинению в подготовке покушения на Владимира Путина и Рамзана Кадырова настаивала Ген');
      sampleText.toHtml().appendTo(container);

      // verify layout or setup custom keyboard
      if (o.layout === 'custom' || !$.keyboard.layouts.hasOwnProperty(o.layout)) {
        o.layout = 'custom';
        $.keyboard.layouts.custom = o.customLayout || { 'default' : ['{cancel}'] };
      }

      // Main keyboard building loop
      $.each($.keyboard.layouts[o.layout], function(set, keySet){
        if (set !== "") {
          sets++;
          newSet = $('<div />')
            .attr('name', set) // added for typing extension
            .addClass('ui-keyboard-keyset ui-keyboard-keyset-' + set)
            .appendTo(container)[(set === 'default') ? 'show' : 'hide']();

          for ( row = 0; row < keySet.length; row++ ){

            // remove extra spaces before spliting (regex probably could be improved)
            currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,'{$1:$2}');
            keys = currentSet.split(/\s+/);

            for ( key = 0; key < keys.length; key++ ) {
              // used by addKey function
              base.temp = [ newSet, row, key ];

              // ignore empty keys
              if (keys[key].length === 0) { continue; }

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
                  base.addKey(action, action);
                  continue;
                }

                // switch needed for action keys with multiple names/shortcuts or
                // default will catch all others
                if ($.keyboard.keyaction.hasOwnProperty(action)){
                  // base.acceptedKeys.push(action);
                  base.addKey(action, action);
                }
              } else {

                // regular button (not an action key)
                base.acceptedKeys.push(keys[key].split(':')[0]);
                base.addKey(keys[key], keys[key], true);

              }
            }
            newSet.find('.ui-keyboard-button:last').after('<br class="ui-keyboard-button-endrow">');
          }
        }
      });

      if (sets > 1) { base.sets = true; }
      base.hasMappedKeys = !( $.isEmptyObject(base.mappedKeys) ); // $.isEmptyObject() requires jQuery 1.4+
      return container;
    };

    base.insertText = function(txt) {
      console.log(txt);
    };

		// Run initializer
		base.init();		
	};


	// Action key function list
	$.keyboard.keyaction = {
		alt : function(base,el){
			base.altActive = !base.altActive;
			base.showKeySet(el);
		},
		// el is the pressed key (button) object; it is null when the real keyboard enter is pressed
		enter : function(base, el, e) {
	    base.insertText('\n');
		},
		// caps lock key
		lock : function(base,el){
			base.lastKeyset[0] = base.shiftActive = base.capsLock = !base.capsLock;
			base.showKeySet(el);
		},
		meta : function(base,el){
			base.metaActive = ($(el).hasClass(base.options.css.buttonAction));
			base.showKeySet(el);
		},
		shift : function(base,el){
			base.lastKeyset[0] = base.shiftActive = !base.shiftActive;
			base.showKeySet(el);
		},
		sign : function(base){
			if(/^\-?\d*\.?\d*$/.test( base.$preview.val() )) {
				base.$preview.val( (base.$preview.val() * -1) );
			}
		},
		space : function(base){
			base.insertText(' ');
		},
		tab : function(base) {
			if (base.el.tagName === 'INPUT') { return false; } // ignore tab key in input
			base.insertText('\t');
      return true;
		}
	};

	$.keyboard.layouts = {};
	$.keyboard.defaultOptions = {

		// *** choose layout & positioning ***
		layout       : 'russian-qwerty',
		customLayout : null,

		position     : {
			of : $.find('#inputContainer'), // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
			my : 'center top',
			at : 'center top',
			at2: 'center bottom' // centers the keyboard at the bottom of the input/textarea
		},

		// *** change keyboard language & look ***
		display : {
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
		},

		// Message added to the key title while hovering, if the mousewheel plugin exists
		wheelMessage : 'Use mousewheel to see other keys',

		css : {
			container      : 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
			buttonDefault  : 'ui-state-default ui-corner-all', // default state
			buttonHover    : 'ui-state-hover',  // hovered button
			buttonAction   : 'ui-state-active' // Action keys (e.g. Accept, Cancel, Tab, etc); this replaces "actionClass" option
		},

		// *** Useability ***
		// mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
		enterMod : 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

		// If false, the shift key will remain active until the next key is (mouse) clicked on; if true it will stay active until pressed again
		stickyShift  : true,

		// Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key will start repeating
		repeatDelay  : 500,

		// Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the key is repeated
		// Added to simulate holding down a real keyboard key and having it repeat. I haven't calculated the upper limit of
		// this rate, but it is limited to how fast the javascript can process the keys. And for me, in Firefox, it's around 20.
		repeatRate   : 20,

		// Event (namepaced) for when the character is added to the input (clicking on the keyboard)
		keyBinding   : 'mousedown'
	};

	$.fn.keyboard = function(options){
		return this.each(function(){
			if (!$(this).data('keyboard')) {
				(new $.keyboard(this, options));
			}
		});
	};

	$.fn.getkeyboard = function(){
		return this.data("keyboard");
	};

})(jQuery);
