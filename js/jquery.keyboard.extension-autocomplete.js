/*
 * jQuery UI Virtual Keyboard Autocomplete v1.3 for Keyboard v1.8+ only
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to get
 * the jQuery UI Autocomplete widget to work seamlessly
 *
 * Requires:
 *  jQuery
 *  jQuery UI & css
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .autocomplete(options)
 *   .addAutoComplete();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .autocomplete(options) // jQuery UI autocomplete
 *   .addAutoComplete();    // this keyboard extension
 * 
 */

(function($){
$.fn.addAutocomplete = function(){
	return this.each(function(){
		// make sure a keyboard is attached
		var base = $(this).data('keyboard');
		if (!base) { return; }

		// Setup
		base.autocomplete_init = function(txt, delay, accept){

			// visible event is fired before this extension is initialized, so check!
			if (base.options.alwaysOpen && base.isVisible) {
				base.autocomplete_setup();
			}

			base.$el
				.bind('visible.keyboard',function(){
					base.autocomplete_setup();
				})
				.bind('change.keyboard',function(e){
					if (base.hasAutocomplete && base.isVisible) {
						base.$el
							.val(base.$preview.val())
							.trigger('keydown.autocomplete');
					}
				})
				.bind('hidden.keyboard', function(e){
					base.$el.autocomplete('close');
				})
				.bind('autocompleteopen', function(e, ui) {
					if (base.hasAutocomplete){
						// reposition autocomplete window next to the keyboard
						base.$el.data('autocomplete').menu.element.position({
							of : base.$keyboard,
							my : 'right top',
							at : 'left top',
							collision: 'flip'
						});
					}
				})
				.bind('autocompleteselect', function(e,ui){
					if (base.hasAutocomplete && ui.item.value !== ''){
						base.$preview
							.val( ui.item.value )
							.focus();
					}
				});
		};

		// set up after keyboard is visible
		base.autocomplete_setup = function(){
			// look for autocomplete
			base.$autocomplete = base.$el.data('autocomplete');
			base.hasAutocomplete = (typeof(base.$autocomplete) === 'undefined') ? false : (base.$autocomplete.options.disabled) ? false : true;
			// only bind to keydown once
			if (base.hasAutocomplete && !base.autocomplete_bind) {
				base.$preview.bind('keydown.keyboard',function(e){
					// send keys to the autocomplete widget (arrow, pageup/down, etc)
					return base.autocomplete_input(e);
				});
				base.autocomplete_bind = true;
			}
		};

		// Navigate and select inside autocomplete popup
		base.autocomplete_input = function(event){
			// copied from jquery ui autocomplete code to include autocomplete navigation
			// there might be a better workaround
			var t, keyCode = $.ui.keyCode;
			switch( event.keyCode ) {
			case keyCode.PAGE_UP:
				base.$autocomplete._move( "previousPage", event );
				break;
			case keyCode.PAGE_DOWN:
				base.$autocomplete._move( "nextPage", event );
				break;
			case keyCode.UP:
				base.$autocomplete._move( "previous", event );
				// prevent moving cursor to beginning of text field in some browsers
				event.preventDefault();
				break;
			case keyCode.DOWN:
				base.$autocomplete._move( "next", event );
				// prevent moving cursor to end of text field in some browsers
				event.preventDefault();
				break;
			case keyCode.ENTER:
			case keyCode.NUMPAD_ENTER:
				t = base.$autocomplete.menu.element.find('#ui-active-menuitem').text() || '';
				if (t !== '') { base.$preview.val(t); }
				break;
			default:
				// keypress is triggered before the input value is changed
				clearTimeout( base.$autocomplete.searching );
				base.$autocomplete.searching = setTimeout(function() {
					// only search if the value has changed
					if ( base.$autocomplete.term != base.$autocomplete.element.val() ) {
						base.$autocomplete.selectedItem = null;
						base.$autocomplete.search( null, event );
					}
				}, base.$autocomplete.options.delay );
				break;
			}
		};

		base.origEscClose = base.escClose;

		// replace original function with this one
		base.escClose = function(e){
			// prevent selecting an item in autocomplete from closing keyboard
			if (base.hasAutocomplete && e.target.id === 'ui-active-menuitem') { return; }
			base.origEscClose(e);
		};

		base.autocomplete_init();

	});
};
})(jQuery);
