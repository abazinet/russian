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
    base.ooKeyboard = new ru.Keyboard(ru.RussianLayout);
    base.$keyboard = this.ooKeyboard.toHtml();
    base.ooKeyboard.onSourceContentChanged('kommersant.ru/doc/2099157', 'divLetterBranding');

    base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');


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
				}
//				base.$el.trigger( 'change.keyboard', [ base, base.el ] );
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
    this.shiftActive = this.altActive = false;
    this.rows = [ '', '-shift', '-alt', '-alt-shift' ];

    $('body')
      .bind('keypress', function(e) {
        var k = String.fromCharCode(e.charCode || e.which);
        if(e.ctrlKey && k === ' ') {
          this.sayTranslation();
        } else {
          var layoutPos = (this.shiftActive ? 1 : 0) + (this.altActive ? 2 : 0);
          this.keyPressed(layoutPos, k);
        }
      }.bind(this))
      .bind('keyup', function(e) {
        if(e.which === 16) {
          this.shiftActive = false;
          this.refreshKeyset();
        } else if(e.which === 18) {
          this.altActive = false;
          this.refreshKeyset();
        }
      }.bind(this))
      .bind('keydown', function(e) {
        if(e.which === 16) {
          this.shiftActive = true;
          this.refreshKeyset();
        } else if(e.which === 18) {
          this.altActive = true;
          this.refreshKeyset();
        }
      }.bind(this));

      $('.ui-keyboard-source-url').bind('keypress', function(e) {
        e.stopPropagation();
      });

      $('.ui-keyboard-source-divid').bind('keypress', function(e) {
        e.stopPropagation();
      });
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
    if(this.sampleText !== undefined) {
      this.sampleText.sayTranslation();
    }
  };

  ru.Keyboard.prototype.keyPressed = function(layoutPos, key) {
    var k = this.layouts[layoutPos].keyPressed(key);
    if(k !== undefined) {
      console.log('playing');
      this.sampleText.guessLetter(k.getDisplay());
    }
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

  ru.Keyboard.prototype.refreshKeyset = function() {
    var key = '';
    var toShow = (this.shiftActive ? 1 : 0) + (this.altActive ? 2 : 0);
    key = (toShow === 0) ? '-default' : (key === '') ? '' : '-' + key;
    this.toHtml()
        .find('.ui-keyboard-alt, .ui-keyboard-shift').removeClass('ui-state-active').end()
        .find('.ui-keyboard-alt')[(this.altActive) ? 'addClass' : 'removeClass']('ui-state-active').end()
        .find('.ui-keyboard-shift')[(this.shiftActive) ? 'addClass' : 'removeClass']('ui-state-active').end()
        .find('.ui-keyboard-keyset').hide().end()
        .find('.ui-keyboard-keyset' + key + this.rows[toShow]).show().end()
        .find('.ui-keyboard-actionkey.ui-keyboard' + key).addClass('ui-state-active');
  };

})(window.ru = window.ru || {}, jQuery);
