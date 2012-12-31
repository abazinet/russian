/* Russian keyboard layouts
 * contains layout: 'russian-qwerty'
 * license for this file: WTFPL, unless the source layout site has a problem with me using them as a reference
 */
(function(ru, $) {
  "use strict";

  /* Thanks to Yury Kotlyarov (https://github.com/yura) */
  $.keyboard.layouts['russian-qwerty'] = {
    'alt' : [
      "` 1 2 3 4 5 6 7 8 9 0 - =",
      "{tab} q w e r t y u i o p [ ] \\",
      "a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      "{alt} {space} {alt}"
    ],
    'alt-shift' : [
      '~ ! @ # $ % ^ & * ( ) _ +',
      "{tab} Q W E R T Y U I O P { } |",
      'A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      "{alt} {space} {alt}"
    ],
    'default' : [
      "\u0451(`) 1 2 3 4 5 6 7 8 9 0 - =",
      "{tab} \u0439(q) \u0446(w) \u0443(e) \u043a(r) \u0435(t) \u043d(y) \u0433(u) \u0448(i) \u0449(o) \u0437(p) \u0445([) \u044a(]) \\",
      "\u0444(a) \u044b(s) \u0432(d) \u0430(f) \u043f(g) \u0440(h) \u043e(j) \u043b(k) \u0434(l) \u0436(;) \u044d(') {enter}",
      "{shift} \u044f(z) \u0447(x) \u0441(c) \u043c(v) \u0438(b) \u0442(n) \u044c(m) \u0431(,) \u044e(.) .(\/) {shift}",
      "{alt} {space} {alt}"
    ],
    'shift' : [
      '\u0401(~) ! " \u2116(\#) ;($) \u20ac(%) :(^) ?(&) * ( ) _ +',
      "{tab} \u0419(Q) \u0426(W) \u0423(E) \u041a(R) \u0415(T) \u041d(Y) \u0413(U) \u0428(I) \u0429(O) \u0417(P) \u0425(\{) \u042a(\}) /(\\)",
      "\u0424(A) \u042b(S) \u0412(D) \u0410(F) \u041f(G) \u0420(H) \u041e(J) \u041b(K) \u0414(L) \u0416(:) \u042d(\") {enter}",
      "{shift} \u042f(Z) \u0427(X) \u0421(C) \u041c(V) \u0418(B) \u0422(N) \u042c(M) \u0411(<) \u042e(>) ,(?) {shift}",
      "{alt} {space} {alt}"
    ]
  };

})(window.ru = window.ru || {}, jQuery);