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

		// Shift and Alt key toggles
		base.shiftActive = base.altActive = base.metaActive;
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

		$(document)
			.bind('keypress', function(e) {
				var k = String.fromCharCode(e.charCode || e.which);
        if(e.ctrlKey && k === ' ') {
          base.ooKeyboard.sayTranslation();
        } else {
          base.ooKeyboard.keyPressed(k);
        }
			})
			.bind('keyup', function(e) {
				if(e.which === 16) {
          base.shiftActive = false;
          base.showKeySet(this);
				}
				base.$el.trigger( 'change.keyboard', [ base, base.el ] );
			})
			.bind('keydown', function(e) {
				if(e.which === 16) {
          base.shiftActive = true;
          base.showKeySet(this);
				}

        $('.ui-keyboard-source-url').bind('keypress', function(e) {
          e.stopPropagation();
        });

        $('.ui-keyboard-source-divid').bind('keypress', function(e) {
          e.stopPropagation();
        });
			});

    base.$el.after(base.$keyboard);
		base.$allKeys
			.bind('mousedown.keyboard .keyboard', function(e) {
				var txt,
            key = $.data(this, 'key');

        if (key.keyaction.hasOwnProperty(key.keyName) &&
            $(this).hasClass('ui-keyboard-actionkey')) {
					key.keyaction[key.keyName](base, this, e);
				} else if (typeof key.key !== 'undefined') {
					txt = key.getDisplay();
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
			.bind('mouseenter.keyboard', function() {
        $(this).addClass('ui-state-hover');
			})
      .bind('mouseleave.keyboard', function() {
        $(this).removeClass('ui-state-hover');
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



	$.keyboard.layouts = {};
	$.keyboard.defaultOptions = {

		position     : {
			of : $.find('#inputContainer'), // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
			my : 'center top',
			at : 'center top',
			at2: 'center bottom' // centers the keyboard at the bottom of the input/textarea
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

      var content = new ru.ContentUrlInput(this.onSourceContentChanged.bind(this));
      this.html.append(content.toHtml());
    }
    return this.html;
  };

  ru.Keyboard.prototype.sayTranslation = function() {
    this.sampleText.sayTranslation();
  };

  ru.Keyboard.prototype.keyPressed = function(key) {
    var keyPressed;
    this.layouts.forEach(function(layout) {
      keyPressed = layout.keyPressed(key);
      if(keyPressed !== undefined) {
        this.sampleText.guessLetter(keyPressed.getDisplay());
        return false;
      }
      return true;
    }.bind(this));
  };

  ru.Keyboard.prototype.onSampleSourceChanged = function(text) {
    if(this.sampleText === undefined) {
      this.sampleText = new ru.SampleText(text);
      this.toHtml().prepend(this.sampleText.toHtml());
    } else {
      this.sampleText.updateText(text);
    }
  };

  ru.Keyboard.prototype.onSourceContentChanged = function(url, divId) {
    var text = new ru.ContentRetriever(this.onSampleSourceChanged.bind(this), url, divId);
    text.download();
  };

  ru.Keyboard.prototype.insertText = function(txt) {
    this.sampleText.guessLetter(txt);
    console.log(txt);
  };

})(window.ru = window.ru || {}, jQuery);
