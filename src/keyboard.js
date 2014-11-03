"use strict";

var utils = require('./utils');
var layout = require('./layout');
var russian = require('./russian');
var keyboardKey = require('./key');
var source = require('./contentSource');
var content = require('./contentRetriever');
var sampleText = require('./sampleText');

var $ = require('jquery');

$.fn.keyboard = function() {
  $.keyboard(this);
};

$.keyboard = function(el) {
  var base = this;
  base.$el = $(el);
  base.el = el;

  base.ooKeyboard = new keyboard(russian.RussianLayout);
  base.$keyboard = this.ooKeyboard.toHtml();
  base.ooKeyboard.onSourceContentChanged('www.kommersant.ru/doc/2375142', 'divLetterBranding');

  base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');
  base.$allKeys
    .bind('mousedown.keyboard .keyboard', function(e) {
      var txt,
          key = $.data(this, 'key');

      if (key.keyaction.hasOwnProperty(key.keyName) &&
          $(this).hasClass('ui-keyboard-actionkey')) {
        key.keyaction[key.keyName](base, this, e);
      } else if (utils.def(key.key)) {
        txt = key.getDisplay();
        base.ooKeyboard.insertText(txt);
      }
      e.preventDefault();
    })
    // Change hover class and tooltip
    .bind('mouseenter.keyboard', function() {
      $(this).addClass('ui-state-hover');
    })
    .bind('mouseleave.keyboard', function() {
      $(this).removeClass('ui-state-hover');
    });

  base.$el.after(base.$keyboard);
  base.$keyboard
    .css({ position: 'absolute', left: 0, top: 0 })
    .addClass('ui-keyboard-has-focus')
    .show();
};

function keyboard(multiLayout) {

  var kb = {
    _buildKeys: function (multiLayout) {
      $.each(multiLayout, function(set, keySet) {
        var aLayout = new layout.Layout(set);
        keySet.forEach(function(row, rowId) {
          // remove extra spaces before spliting (regex probably could be improved)
          var currentSet = $.trim(row).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g, '{$1:$2}');
          var keys = currentSet.split(/\s+/);

          keys.forEach(function(key, keyId) {
            aLayout.addKey(rowId, keyboardKey.key(key, rowId, keyId));
          });
        });
        this.layouts.push(aLayout);
      }.bind(this));
    },

    toHtml: function() {
      if (utils.undef(this.html)) {
        this.html = $('<div></div>')
          .addClass('ui-keyboard ui-widget-content ui-widget ui-corner-all ui-helper-clearfix ui-keyboard-always-open')
          .attr({ 'role': 'textbox' })
          .hide();

        this.layouts.forEach(function(layout) {
          layout.toHtml().appendTo(this.html)[layout.isDefault() ? 'show' : 'hide']();
        }.bind(this));

        var content = source.contentSource(this.onSourceContentChanged.bind(this));
        this.html.append(content.toHtml());
      }
      return this.html;
    },

    sayTranslation: function() {
      this.sampleText.sayTranslation();
    },

    keyPressed: function(layoutPos, key) {
      var k = this.layouts[layoutPos].keyPressed(key);
      if (utils.def(k)) {
        this.sampleText.guessLetter(k.getDisplay());
      }
    },

    onSampleSourceChanged: function(text) {
      if (utils.undef(this.sampleText)) {
        this.sampleText = sampleText.sampleText(text);
        this.toHtml().prepend(this.sampleText.toHtml());
      } else {
        this.sampleText.updateText(text);
      }
    },

    onSourceContentChanged: function(url, divId) {
      var text = content.contentRetriever(this.onSampleSourceChanged.bind(this),
        url,
        divId,
        this.isValidCharacter.bind(this));
      text.download();
    },

    isValidCharacter: function(character) {
      return this.layouts.some(function(layout) {
        return layout.isValidCharacter(character);
      }.bind(this));
    },

    insertText: function(txt) {
      this.sampleText.guessLetter(txt);
      console.log(txt);
    },

    refreshKeyset: function() {
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
    },

    nextSampleText: function() {
      this.sampleText.scrollDown();
    },

    previousSampleText: function() {
      this.sampleText.scrollUp();
    },

    cursorRight: function() {
      this.sampleText.cursorRight();
    },

    cursorLeft: function() {
      this.sampleText.cursorLeft();
    }
  };

  kb.layouts = [];
  kb._buildKeys(multiLayout);
  kb.onSampleSourceChanged('Loading...                                              ');
  kb.shiftActive = kb.altActive = false;
  kb.rows = [ '', '-shift', '-alt', '-alt-shift' ];

  $('body')
    .bind('keypress', function(e) {
      var k = String.fromCharCode(e.charCode || e.which);
      if (e.ctrlKey && k === ' ') {
        kb.sayTranslation();
      } else {
        var layoutPos = (this.shiftActive ? 1 : 0) + (this.altActive ? 2 : 0);
        kb.keyPressed(layoutPos, k);
      }
    }.bind(kb))
    .bind('keyup', function(e) {
      if (e.which === 16) {
        kb.shiftActive = false;
        this.refreshKeyset();
      } else if (e.which === 18) {
        kb.altActive = false;
        kb.refreshKeyset();
      }
    }.bind(kb))
    .bind('keydown', function(e) {
      if (e.which === 16) {
        kb.shiftActive = true;
        kb.refreshKeyset();
      } else if (e.which === 18) {
        kb.altActive = true;
        kb.refreshKeyset();
      } else if (e.which === 40) {
        kb.nextSampleText();
      } else if (e.which === 38) {
        kb.previousSampleText();
      } else if (e.which === 39) {
        kb.cursorRight();
      } else if (e.which === 37) {
        kb.cursorLeft();
      }
    }.bind(kb));

  $('.ui-keyboard-source-url').bind('keypress', function(e) {
    e.stopPropagation();
  });

  $('.ui-keyboard-source-divid').bind('keypress', function(e) {
    e.stopPropagation();
  });

  return kb;
}

module.exports = {
  keyboard: keyboard
};
