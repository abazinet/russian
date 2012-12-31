/*
Author: Jeremy Satterfield
Modified: Rob Garrison (Mottie on github)
Heavily modified: Alex Deschamps
-----------------------------------------
Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
-----------------------------------------
*/
;(function(ru, $) {
"use strict";

$.keyboard = function(el, options) {
	var base = this;

	// Access to jQuery and DOM versions of element
	base.$el = $(el);
	base.el = el;

	base.init = function(){
		base.options = $.extend(true, {}, $.keyboard.defaultOptions, options);

		// Shift and Alt key toggles, sets is true if a layout has more than one keyset - used for mousewheel message
		base.shiftActive = base.altActive = base.metaActive = base.sets;
		base.lastKeyset = [false, false, false]; // [shift, alt, meta]
		// Class names of the basic key set - meta keysets are handled by the keyname
		base.rows = [ '', '-shift', '-alt', '-alt-shift' ];

		// build keyboard if it doesn't exist
		if (typeof(base.$keyboard) === 'undefined') {
      base.startup();
    }

		// show & position keyboard
		base.$keyboard
			// basic positioning before it is set by position utility
			.css({ position: 'absolute', left: 0, top: 0 })
			.addClass('ui-keyboard-has-focus')
			.show();

		return base;
	};

	base.startup = function(){
    base.ooKeyboard = new ru.Keyboard($.keyboard.layouts['russian-qwerty']);
    base.$keyboard = this.ooKeyboard.toHtml();
    base.ooKeyboard.onSourceContentChanged('kommersant.ru/doc/2099157', 'divLetterBranding');

    base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');
		base.wheel = $.isFunction( $.fn.mousewheel ); // is mousewheel plugin loaded?

		$(document)
			.bind('keypress', function(e) {
				var k = String.fromCharCode(e.charCode || e.which);
        base.ooKeyboard.keyPressed(k);
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
				}

        $('.ui-keyboard-source-url').bind('keypress', function(e) {
          e.stopPropagation();
        });

        $('.ui-keyboard-source-divid').bind('keypress', function(e) {
          e.stopPropagation();
        });
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
          base.ooKeyboard.insertText(txt);
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
						.addClass('ui-state-hover')
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
						.removeClass( (base.el.type === 'password') ? '' : 'ui-state-hover') // needed or IE flickers really bad
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
        .find('.ui-keyboard-alt, .ui-keyboard-shift, .ui-keyboard-actionkey[class*=meta]').removeClass('ui-state-active').end()
        .find('.ui-keyboard-alt')[(base.altActive) ? 'addClass' : 'removeClass']('ui-state-active').end()
        .find('.ui-keyboard-shift')[(base.shiftActive) ? 'addClass' : 'removeClass']('ui-state-active').end()
        .find('.ui-keyboard-keyset').hide().end()
        .find('.ui-keyboard-keyset' + key + base.rows[toShow]).show().end()
        .find('.ui-keyboard-actionkey.ui-keyboard' + key).addClass('ui-state-active');
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
      base.ooKeyboard.insertText('\n');
		},
		shift : function(base,el){
			base.lastKeyset[0] = base.shiftActive = !base.shiftActive;
			base.showKeySet(el);
		},
		space : function(base){
      base.ooKeyboard.insertText(' ');
		},
		tab : function(base) {
      base.ooKeyboard.insertText('\t');
		}
	};

	$.keyboard.layouts = {};
	$.keyboard.defaultOptions = {

		position     : {
			of : $.find('#inputContainer'), // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
			my : 'center top',
			at : 'center top',
			at2: 'center bottom' // centers the keyboard at the bottom of the input/textarea
		},

		// Message added to the key title while hovering, if the mousewheel plugin exists
		wheelMessage : 'Use mousewheel to see other keys',

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

  ru.Keyboard = function(multiLayout) {
    this.layouts = [];
    this._buildKeys(multiLayout);
  };

  ru.Keyboard.prototype._buildKeys = function(multiLayout) {
    $.each(multiLayout, function(set, keySet) {
      var layout = new ru.Layout(set);
      keySet.forEach(function(row, rowId) {
        // remove extra spaces before spliting (regex probably could be improved)
        var currentSet = $.trim(row).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,'{$1:$2}');
        var keys = currentSet.split(/\s+/);

        keys.forEach(function(key, keyId) {
          layout.addKey(rowId, new ru.Key(key, rowId, keyId));
        });
      });
      this.layouts.push(layout);
    }.bind(this));
  };

  ru.Keyboard.prototype.toHtml = function() {
    if(this.html === undefined) {
      this.html = $('<div></div>')
          .addClass('ui-keyboard ui-widget-content ui-widget ui-corner-all ui-helper-clearfix ui-keyboard-always-open')
          .attr({ 'role': 'textbox' })
          .hide();

      this.layouts.forEach(function(layout){
        layout.toHtml().appendTo(this.html)[layout.isDefault() ? 'show' : 'hide']();
      }.bind(this));

      var content = new ru.ContentUrlInput(this.onSourceContentChanged);
      this.html.append(content.toHtml());
    }
    return this.html;
  };

  ru.Keyboard.prototype.keyPressed = function(key) {
    //key = this._defaultLayout().getMappedKey(key);
    console.log(key);
    var keyPressed;
    this.layouts.forEach(function(layout) {
      keyPressed = layout.keyPressed(key);
      if(keyPressed !== undefined) {
        this.sampleText.guessLetter(keyPressed.getValue());
      }
    }.bind(this));
  };

  ru.Keyboard.prototype.onSourceContentChanged = function(url, divId) {
    var text = new ru.ContentRetriever(this.onSampleSourceChanged.bind(this), url, divId);
    text.download();
  };

  ru.Keyboard.prototype.onSampleSourceChanged = function(text) {
    if(this.sampleText === undefined) {
      this.sampleText = new ru.SampleText(text);
      this.toHtml().prepend(this.sampleText.toHtml());
    } else {
      this.sampleText.updateText(text);
    }
  };

  ru.Keyboard.prototype.insertText = function(txt) {
    this.sampleText.guessLetter(txt);
    console.log(txt);
  };

  ru.Keyboard.prototype._defaultLayout = function() {
    if(this.defaultLayout === undefined) {
      this.layouts.forEach(function(layout) {
        if(layout.isDefault()) {
          this.defaultLayout = layout;
        }
      }.bind(this));
    }
    return this.defaultLayout;
  };

})(window.ru = window.ru || {}, jQuery);
