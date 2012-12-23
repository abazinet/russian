/* Russian keyboard layouts
 * contains layout: 'russian-qwerty'
 *
 * To use:
 *  Point to this js file into your page header: <script src="layouts/russian.js" type="text/javascript"></script>
 *  Initialize the keyboard using: $('input').keyboard({ layout: 'russian-qwerty' });
 *
 * license for this file: WTFPL, unless the source layout site has a problem with me using them as a reference
 */

/* Thanks to Yury Kotlyarov (https://github.com/yura) */
$.keyboard.layouts['russian-qwerty'] = {
	'alt' : [
		"` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
		"{tab} q w e r t y u i o p [ ] \\",
		"a s d f g h j k l ; ' {enter}",
		"{shift} z x c v b n m , . / {shift}",
		"{accept} {alt} {space} {alt} {cancel}"
	],
	'alt-shift' : [
		'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
		"{tab} Q W E R T Y U I O P { } |",
		'A S D F G H J K L : " {enter}',
		"{shift} Z X C V B N M < > ? {shift}",
		"{accept} {alt} {space} {alt} {cancel}"
	],
	'default' : [
		"\u0451(`) 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
		"{tab} \u0439(q) \u0446(w) \u0443(e) \u043a(r) \u0435(t) \u043d(y) \u0433(u) \u0448(i) \u0449(o) \u0437(p) \u0445([) \u044a(]) \\",
		"\u0444(a) \u044b(s) \u0432(d) \u0430(f) \u043f(g) \u0440(h) \u043e(j) \u043b(k) \u0434(l) \u0436(;) \u044d(') {enter}",	
		"{shift} \u044f(z) \u0447(x) \u0441(c) \u043c(v) \u0438(b) \u0442(n) \u044c(m) \u0431(,) \u044e(.) .(\/) {shift}",
		"{alt} {space} {alt}"
	],
	'shift' : [
		'\u0401(~) ! " \u2116(\#) ;($) \u20ac(%) :(^) ?(&) * ( ) _ + {bksp}',
		"{tab} \u0419(Q) \u0426(W) \u0423(E) \u041a(R) \u0415(T) \u041d(Y) \u0413(U) \u0428(I) \u0429(O) \u0417(P) \u0425(\{) \u042a(\}) /(\\)",
		"\u0424(A) \u042b(S) \u0412(D) \u0410(F) \u041f(G) \u0420(H) \u041e(J) \u041b(K) \u0414(L) \u0416(:) \u042d(\") {enter}",
		"{shift} \u042f(Z) \u0427(X) \u0421(C) \u041c(V) \u0418(B) \u0422(N) \u042c(M) \u0411(<) \u042e(>) ,(?) {shift}",
		"{alt} {space} {alt}"
	]
};

// Keyboard Language
// please update this section to match this language and email me with corrections!
// ***********************
if (typeof(language) === 'undefined') { var language = {}; };
language.russian = {
	display : {
		'a'      : '\u2714:Accept (Shift-Enter)', // check mark - same action as accept
		'accept' : 'Accept:Accept (Shift-Enter)',
		'alt'    : 'AltGr:Alternate Graphemes',
		'b'      : '\u2190:Backspace',    // Left arrow (same as &larr;)
		'bksp'   : 'Bksp:Backspace',
		'c'      : '\u2716:Cancel (Esc)', // big X, close - same action as cancel
		'cancel' : 'Cancel:Cancel (Esc)',
		'clear'  : 'C:Clear',             // clear num pad
		'combo'  : '\u00f6:Toggle Combo Keys',
		'dec'    : '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
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
	wheelMessage : 'Use mousewheel to see other keys'
};

// This will replace all default language options with these language options.
// it is separated out here so the layout demo will work properly.
$.extend(true, $.keyboard.defaultOptions, language.russian);
