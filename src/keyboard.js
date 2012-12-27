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
;(function(russian, $){
"use strict";

$.keyboard = function(el, options){
	var base = this;

	// Access to jQuery and DOM versions of element
	base.$el = $(el);
	base.el = el;

	// Add a reverse reference to the DOM object
	base.$el.data("document", base);

	base.init = function(){
		base.options = $.extend(true, {}, $.keyboard.defaultOptions, options);

		// Shift and Alt key toggles, sets is true if a layout has more than one keyset - used for mousewheel message
		base.shiftActive = base.altActive = base.metaActive = base.sets;
		base.lastKeyset = [false, false, false]; // [shift, alt, meta]
		// Class names of the basic key set - meta keysets are handled by the keyname
		base.rows = [ '', '-shift', '-alt', '-alt-shift' ];

		base.reveal();
	};

	base.reveal = function() {
		// build keyboard if it doesn't exist
		if (typeof(base.$keyboard) === 'undefined') { base.startup(); }

		// get single target position || target stored in element data (multiple targets) || default, at the element
		var position = base.options.position;
    position.of = position.of || base.$el.data('keyboardPosition') || base.$el;
		position.collision = position.collision || 'fit fit';

		// show & position keyboard
		base.$keyboard
			// basic positioning before it is set by position utility
			.css({ position: 'absolute', left: 0, top: 0 })
			.addClass('ui-keyboard-has-focus')
			.show();

		return base;
	};

	base.startup = function(){
		base.$keyboard = base.buildKeyboard();

    // kick download of sample text
    var text = new russian.ContentRetriever(base.onSampleSourceChanged, 'kommersant.ru/doc/2009152', 'divLetterBranding');
    text.download();

    base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');
		base.wheel = $.isFunction( $.fn.mousewheel ); // is mousewheel plugin loaded?
		// keyCode of keys always allowed to be typed - caps lock, page up & down, end, home, arrow, insert & delete keys
		base.alwaysAllowed = [20,33,34,35,36,37,38,39,40,45,46];

		$(document)
			.bind('keypress', function(e) {
				var k = String.fromCharCode(e.charCode || e.which);

        if ( (e.ctrlKey || e.metaKey) && (e.which === 97 || e.which === 99 || e.which === 118 || (e.which >= 120 && e.which <=122)) ) {
					// Allow select all (ctrl-a:97), copy (ctrl-c:99), paste (ctrl-v:118) & cut (ctrl-x:120) & redo (ctrl-y:121)& undo (ctrl-z:122); meta key for mac
					return;
				}
				// Mapped Keys - allows typing on a regular keyboard and the mapped key is entered
				// Set up a key in the layout as follows: "m(a):label"; m = key to map, (a) = actual keyboard key to map to (optional), ":label" = title/tooltip (optional)
				// example: \u0391 or \u0391(A) or \u0391:alpha or \u0391(A):alpha
        var mappedKeys = new russian.Key().mappedKeys;
        if (!($.isEmptyObject(mappedKeys))) {
          if (mappedKeys.hasOwnProperty(k)){
            k = mappedKeys[k];
					}
          base.insertText( k );
          e.preventDefault();
        }
	
				var pressedButton = base.$keyboard.find('.ui-keyboard-' + k.charCodeAt(0));
				pressedButton.addClass(base.options.css.buttonHover);
				setTimeout(function() {
					pressedButton.removeClass(base.options.css.buttonHover);
				}, 200);
			})
			.bind('keyup', function(e) {
				if(e.which === 16) {
          base.shiftActive = false;
          base.showKeySet(this);
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
					//var audioPlayer = new russian.AudioPlayer($.find('audio')[0]);
					//audioPlayer.play(base.$preview.val());

          //var content = $.readDocument("http://www.kommersant.ru/doc/2009152");
          //$("#textContainer").html(content);
				}
			});

    base.$el.after( base.$keyboard );

		base.$allKeys
			.bind(base.options.keyBinding.split(' ').join('.keyboard ') + '.keyboard repeater.keyboard', function(e){
				// 'key', { action: doAction, original: n, curTxt : n, curNum: 0 }
				var txt, key = $.data(this, 'key'), action = key.action.split(':')[0];
				if (action.match('meta')) { action = 'meta'; }
				if ($.keyboard.keyaction.hasOwnProperty(action) && $(this).hasClass('ui-keyboard-actionkey')) {
					// stop processing if action returns false (close & cancel)
					if ($.keyboard.keyaction[action](base,this,e) === false) { return; }
				} else if (typeof key.action !== 'undefined') {
					txt = (base.wheel && !$(this).hasClass('ui-keyboard-actionkey')) ? key.curTxt : key.action;
					base.insertText(txt);
					if (!base.options.stickyShift && !e.shiftKey) {
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
						.addClass(base.options.css.buttonHover)
						.attr('title', function(i,t){
							// show mouse wheel message
							return (base.wheel && t === '' && base.sets) ? base.options.wheelMessage : t;
						});
				}
				if (e.type === 'mouseleave'){
					key.curTxt = key.original;
					key.curNum = 0;
					$.data(el, 'key', key);
					$this
						.removeClass( (base.el.type === 'password') ? '' : base.options.css.buttonHover) // needed or IE flickers really bad
						.attr('title', function(i,t){ return (t === base.options.wheelMessage) ? '' : t; })
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
				return false;
			});
  };

    base.showKeySet = function(el){
      var key = '',
      toShow = (base.shiftActive ? 1 : 0) + (base.altActive ? 2 : 0);

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
        if ( (!base.options.stickyShift && base.lastKeyset[2] !== base.metaActive) ||
          ( (base.shiftActive || base.altActive) && !base.$keyboard.find('.ui-keyboard-keyset-' + key + base.rows[toShow]).length) ) {
          base.shiftActive = base.altActive = false;
        }
      } else if (!base.options.stickyShift && base.lastKeyset[2] !== base.metaActive && base.shiftActive) {
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
        .find('.ui-keyboard-alt, .ui-keyboard-shift, .ui-keyboard-actionkey[class*=meta]').removeClass(base.options.css.buttonAction).end()
        .find('.ui-keyboard-alt')[(base.altActive) ? 'addClass' : 'removeClass'](base.options.css.buttonAction).end()
        .find('.ui-keyboard-shift')[(base.shiftActive) ? 'addClass' : 'removeClass'](base.options.css.buttonAction).end()
        .find('.ui-keyboard-keyset').hide().end()
        .find('.ui-keyboard-keyset' + key + base.rows[toShow]).show().end()
        .find('.ui-keyboard-actionkey.ui-keyboard' + key).addClass(base.options.css.buttonAction);
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

    base.buildKeyboard = function(){
      var row, newSet,
        currentSet, key, keys,
        sets = 0,

      container = $('<div></div>')
        .addClass('ui-keyboard ' + base.options.css.container + ' ui-keyboard-always-open')
        .attr({ 'role': 'textbox' })
        .hide();

      // No preview display, use element and reposition the keyboard under it.
      base.options.position.at = base.options.position.at2;

      // verify layout or setup custom keyboard
      if (base.options.layout === 'custom' || !$.keyboard.layouts.hasOwnProperty(base.options.layout)) {
        base.options.layout = 'custom';
        $.keyboard.layouts.custom = { 'default' : ['{cancel}'] };
      }

      // Main keyboard building loop
      $.each($.keyboard.layouts[base.options.layout], function(set, keySet){
        if (set !== "") {
          sets++;
          newSet = $('<div></div>')
            .attr('name', set) // added for typing extension
            .addClass('ui-keyboard-keyset ui-keyboard-keyset-' + set)
            .appendTo(container)[(set === 'default') ? 'show' : 'hide']();

          for ( row = 0; row < keySet.length; row++ ){

            // remove extra spaces before spliting (regex probably could be improved)
            currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,'{$1:$2}');
            keys = currentSet.split(/\s+/);

            for ( key = 0; key < keys.length; key++ ) {
              var keyHtml = new russian.Key();
              keyHtml.toHtml(keys, newSet, row, key);
            }
            newSet.find('.ui-keyboard-button:last').after('<br class="ui-keyboard-button-endrow">');
          }
        }
      });

      var content = new russian.ContentUrlInput();
      container.append(content.toHtml());

      return container;
    };

    base.onSampleSourceChanged = function(text) {
      if(base.sampleText === undefined) {
        base.sampleText = new russian.SampleText(text);
        base.$keyboard.prepend(base.sampleText.toHtml());
      } else {
        base.sampleText.changeText(text);
      }
    };

    base.insertText = function(txt) {
      base.sampleText.guessLetter(txt);
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
		shift : function(base,el){
			base.lastKeyset[0] = base.shiftActive = !base.shiftActive;
			base.showKeySet(el);
		},
		space : function(base){
			base.insertText(' ');
		},
		tab : function(base) {
			base.insertText('\t');
		}
	};

	$.keyboard.layouts = {};
	$.keyboard.defaultOptions = {

		// *** choose layout & positioning ***
		layout       : 'russian-qwerty',

		position     : {
			of : $.find('#inputContainer'), // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
			my : 'center top',
			at : 'center top',
			at2: 'center bottom' // centers the keyboard at the bottom of the input/textarea
		},

		// Message added to the key title while hovering, if the mousewheel plugin exists
		wheelMessage : 'Use mousewheel to see other keys',

		css : {
			container      : 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
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

})(window.russian = window.russian || {}, jQuery);
