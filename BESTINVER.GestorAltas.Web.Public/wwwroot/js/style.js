(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
    1: [function (require, module, exports) {
        (function (a) { if (typeof define === "function" && define.amd && define.amd.jQuery) { define(["jquery"], a) } else { a(jQuery) } }(function (f) { var p = "left", o = "right", e = "up", x = "down", c = "in", z = "out", m = "none", s = "auto", l = "swipe", t = "pinch", A = "tap", j = "doubletap", b = "longtap", y = "hold", D = "horizontal", u = "vertical", i = "all", r = 10, g = "start", k = "move", h = "end", q = "cancel", a = "ontouchstart" in window, v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled, d = window.navigator.pointerEnabled || window.navigator.msPointerEnabled, B = "TouchSwipe"; var n = { fingers: 1, threshold: 75, cancelThreshold: null, pinchThreshold: 20, maxTimeThreshold: null, fingerReleaseThreshold: 250, longTapThreshold: 500, doubleTapThreshold: 200, swipe: null, swipeLeft: null, swipeRight: null, swipeUp: null, swipeDown: null, swipeStatus: null, pinchIn: null, pinchOut: null, pinchStatus: null, click: null, tap: null, doubleTap: null, longTap: null, hold: null, triggerOnTouchEnd: true, triggerOnTouchLeave: false, allowPageScroll: "auto", fallbackToMouseEvents: true, excludedElements: "label, button, input, select, textarea, a, .noSwipe", preventDefaultEvents: true }; f.fn.swipe = function (G) { var F = f(this), E = F.data(B); if (E && typeof G === "string") { if (E[G]) { return E[G].apply(this, Array.prototype.slice.call(arguments, 1)) } else { f.error("Method " + G + " does not exist on jQuery.swipe") } } else { if (!E && (typeof G === "object" || !G)) { return w.apply(this, arguments) } } return F }; f.fn.swipe.defaults = n; f.fn.swipe.phases = { PHASE_START: g, PHASE_MOVE: k, PHASE_END: h, PHASE_CANCEL: q }; f.fn.swipe.directions = { LEFT: p, RIGHT: o, UP: e, DOWN: x, IN: c, OUT: z }; f.fn.swipe.pageScroll = { NONE: m, HORIZONTAL: D, VERTICAL: u, AUTO: s }; f.fn.swipe.fingers = { ONE: 1, TWO: 2, THREE: 3, ALL: i }; function w(E) { if (E && (E.allowPageScroll === undefined && (E.swipe !== undefined || E.swipeStatus !== undefined))) { E.allowPageScroll = m } if (E.click !== undefined && E.tap === undefined) { E.tap = E.click } if (!E) { E = {} } E = f.extend({}, f.fn.swipe.defaults, E); return this.each(function () { var G = f(this); var F = G.data(B); if (!F) { F = new C(this, E); G.data(B, F) } }) } function C(a4, av) { var az = (a || d || !av.fallbackToMouseEvents), J = az ? (d ? (v ? "MSPointerDown" : "pointerdown") : "touchstart") : "mousedown", ay = az ? (d ? (v ? "MSPointerMove" : "pointermove") : "touchmove") : "mousemove", U = az ? (d ? (v ? "MSPointerUp" : "pointerup") : "touchend") : "mouseup", S = az ? null : "mouseleave", aD = (d ? (v ? "MSPointerCancel" : "pointercancel") : "touchcancel"); var ag = 0, aP = null, ab = 0, a1 = 0, aZ = 0, G = 1, aq = 0, aJ = 0, M = null; var aR = f(a4); var Z = "start"; var W = 0; var aQ = null; var T = 0, a2 = 0, a5 = 0, ad = 0, N = 0; var aW = null, af = null; try { aR.bind(J, aN); aR.bind(aD, a9) } catch (ak) { f.error("events not supported " + J + "," + aD + " on jQuery.swipe") } this.enable = function () { aR.bind(J, aN); aR.bind(aD, a9); return aR }; this.disable = function () { aK(); return aR }; this.destroy = function () { aK(); aR.data(B, null); aR = null }; this.option = function (bc, bb) { if (av[bc] !== undefined) { if (bb === undefined) { return av[bc] } else { av[bc] = bb } } else { f.error("Option " + bc + " does not exist on jQuery.swipe.options") } return null }; function aN(bd) { if (aB()) { return } if (f(bd.target).closest(av.excludedElements, aR).length > 0) { return } var be = bd.originalEvent ? bd.originalEvent : bd; var bc, bb = a ? be.touches[0] : be; Z = g; if (a) { W = be.touches.length } else { bd.preventDefault() } ag = 0; aP = null; aJ = null; ab = 0; a1 = 0; aZ = 0; G = 1; aq = 0; aQ = aj(); M = aa(); R(); if (!a || (W === av.fingers || av.fingers === i) || aX()) { ai(0, bb); T = at(); if (W == 2) { ai(1, be.touches[1]); a1 = aZ = au(aQ[0].start, aQ[1].start) } if (av.swipeStatus || av.pinchStatus) { bc = O(be, Z) } } else { bc = false } if (bc === false) { Z = q; O(be, Z); return bc } else { if (av.hold) { af = setTimeout(f.proxy(function () { aR.trigger("hold", [be.target]); if (av.hold) { bc = av.hold.call(aR, be, be.target) } }, this), av.longTapThreshold) } ao(true) } return null } function a3(be) { var bh = be.originalEvent ? be.originalEvent : be; if (Z === h || Z === q || am()) { return } var bd, bc = a ? bh.touches[0] : bh; var bf = aH(bc); a2 = at(); if (a) { W = bh.touches.length } if (av.hold) { clearTimeout(af) } Z = k; if (W == 2) { if (a1 == 0) { ai(1, bh.touches[1]); a1 = aZ = au(aQ[0].start, aQ[1].start) } else { aH(bh.touches[1]); aZ = au(aQ[0].end, aQ[1].end); aJ = ar(aQ[0].end, aQ[1].end) } G = a7(a1, aZ); aq = Math.abs(a1 - aZ) } if ((W === av.fingers || av.fingers === i) || !a || aX()) { aP = aL(bf.start, bf.end); al(be, aP); ag = aS(bf.start, bf.end); ab = aM(); aI(aP, ag); if (av.swipeStatus || av.pinchStatus) { bd = O(bh, Z) } if (!av.triggerOnTouchEnd || av.triggerOnTouchLeave) { var bb = true; if (av.triggerOnTouchLeave) { var bg = aY(this); bb = E(bf.end, bg) } if (!av.triggerOnTouchEnd && bb) { Z = aC(k) } else { if (av.triggerOnTouchLeave && !bb) { Z = aC(h) } } if (Z == q || Z == h) { O(bh, Z) } } } else { Z = q; O(bh, Z) } if (bd === false) { Z = q; O(bh, Z) } } function L(bb) { var bc = bb.originalEvent; if (a) { if (bc.touches.length > 0) { F(); return true } } if (am()) { W = ad } a2 = at(); ab = aM(); if (ba() || !an()) { Z = q; O(bc, Z) } else { if (av.triggerOnTouchEnd || (av.triggerOnTouchEnd == false && Z === k)) { bb.preventDefault(); Z = h; O(bc, Z) } else { if (!av.triggerOnTouchEnd && a6()) { Z = h; aF(bc, Z, A) } else { if (Z === k) { Z = q; O(bc, Z) } } } } ao(false); return null } function a9() { W = 0; a2 = 0; T = 0; a1 = 0; aZ = 0; G = 1; R(); ao(false) } function K(bb) { var bc = bb.originalEvent; if (av.triggerOnTouchLeave) { Z = aC(h); O(bc, Z) } } function aK() { aR.unbind(J, aN); aR.unbind(aD, a9); aR.unbind(ay, a3); aR.unbind(U, L); if (S) { aR.unbind(S, K) } ao(false) } function aC(bf) { var be = bf; var bd = aA(); var bc = an(); var bb = ba(); if (!bd || bb) { be = q } else { if (bc && bf == k && (!av.triggerOnTouchEnd || av.triggerOnTouchLeave)) { be = h } else { if (!bc && bf == h && av.triggerOnTouchLeave) { be = q } } } return be } function O(bd, bb) { var bc = undefined; if ((I() || V()) || (P() || aX())) { if (I() || V()) { bc = aF(bd, bb, l) } if ((P() || aX()) && bc !== false) { bc = aF(bd, bb, t) } } else { if (aG() && bc !== false) { bc = aF(bd, bb, j) } else { if (ap() && bc !== false) { bc = aF(bd, bb, b) } else { if (ah() && bc !== false) { bc = aF(bd, bb, A) } } } } if (bb === q) { a9(bd) } if (bb === h) { if (a) { if (bd.touches.length == 0) { a9(bd) } } else { a9(bd) } } return bc } function aF(be, bb, bd) { var bc = undefined; if (bd == l) { aR.trigger("swipeStatus", [bb, aP || null, ag || 0, ab || 0, W, aQ]); if (av.swipeStatus) { bc = av.swipeStatus.call(aR, be, bb, aP || null, ag || 0, ab || 0, W, aQ); if (bc === false) { return false } } if (bb == h && aV()) { aR.trigger("swipe", [aP, ag, ab, W, aQ]); if (av.swipe) { bc = av.swipe.call(aR, be, aP, ag, ab, W, aQ); if (bc === false) { return false } } switch (aP) { case p: aR.trigger("swipeLeft", [aP, ag, ab, W, aQ]); if (av.swipeLeft) { bc = av.swipeLeft.call(aR, be, aP, ag, ab, W, aQ) } break; case o: aR.trigger("swipeRight", [aP, ag, ab, W, aQ]); if (av.swipeRight) { bc = av.swipeRight.call(aR, be, aP, ag, ab, W, aQ) } break; case e: aR.trigger("swipeUp", [aP, ag, ab, W, aQ]); if (av.swipeUp) { bc = av.swipeUp.call(aR, be, aP, ag, ab, W, aQ) } break; case x: aR.trigger("swipeDown", [aP, ag, ab, W, aQ]); if (av.swipeDown) { bc = av.swipeDown.call(aR, be, aP, ag, ab, W, aQ) } break } } } if (bd == t) { aR.trigger("pinchStatus", [bb, aJ || null, aq || 0, ab || 0, W, G, aQ]); if (av.pinchStatus) { bc = av.pinchStatus.call(aR, be, bb, aJ || null, aq || 0, ab || 0, W, G, aQ); if (bc === false) { return false } } if (bb == h && a8()) { switch (aJ) { case c: aR.trigger("pinchIn", [aJ || null, aq || 0, ab || 0, W, G, aQ]); if (av.pinchIn) { bc = av.pinchIn.call(aR, be, aJ || null, aq || 0, ab || 0, W, G, aQ) } break; case z: aR.trigger("pinchOut", [aJ || null, aq || 0, ab || 0, W, G, aQ]); if (av.pinchOut) { bc = av.pinchOut.call(aR, be, aJ || null, aq || 0, ab || 0, W, G, aQ) } break } } } if (bd == A) { if (bb === q || bb === h) { clearTimeout(aW); clearTimeout(af); if (Y() && !H()) { N = at(); aW = setTimeout(f.proxy(function () { N = null; aR.trigger("tap", [be.target]); if (av.tap) { bc = av.tap.call(aR, be, be.target) } }, this), av.doubleTapThreshold) } else { N = null; aR.trigger("tap", [be.target]); if (av.tap) { bc = av.tap.call(aR, be, be.target) } } } } else { if (bd == j) { if (bb === q || bb === h) { clearTimeout(aW); N = null; aR.trigger("doubletap", [be.target]); if (av.doubleTap) { bc = av.doubleTap.call(aR, be, be.target) } } } else { if (bd == b) { if (bb === q || bb === h) { clearTimeout(aW); N = null; aR.trigger("longtap", [be.target]); if (av.longTap) { bc = av.longTap.call(aR, be, be.target) } } } } } return bc } function an() { var bb = true; if (av.threshold !== null) { bb = ag >= av.threshold } return bb } function ba() { var bb = false; if (av.cancelThreshold !== null && aP !== null) { bb = (aT(aP) - ag) >= av.cancelThreshold } return bb } function ae() { if (av.pinchThreshold !== null) { return aq >= av.pinchThreshold } return true } function aA() { var bb; if (av.maxTimeThreshold) { if (ab >= av.maxTimeThreshold) { bb = false } else { bb = true } } else { bb = true } return bb } function al(bb, bc) { if (av.preventDefaultEvents === false) { return } if (av.allowPageScroll === m) { bb.preventDefault() } else { var bd = av.allowPageScroll === s; switch (bc) { case p: if ((av.swipeLeft && bd) || (!bd && av.allowPageScroll != D)) { bb.preventDefault() } break; case o: if ((av.swipeRight && bd) || (!bd && av.allowPageScroll != D)) { bb.preventDefault() } break; case e: if ((av.swipeUp && bd) || (!bd && av.allowPageScroll != u)) { bb.preventDefault() } break; case x: if ((av.swipeDown && bd) || (!bd && av.allowPageScroll != u)) { bb.preventDefault() } break } } } function a8() { var bc = aO(); var bb = X(); var bd = ae(); return bc && bb && bd } function aX() { return !!(av.pinchStatus || av.pinchIn || av.pinchOut) } function P() { return !!(a8() && aX()) } function aV() { var be = aA(); var bg = an(); var bd = aO(); var bb = X(); var bc = ba(); var bf = !bc && bb && bd && bg && be; return bf } function V() { return !!(av.swipe || av.swipeStatus || av.swipeLeft || av.swipeRight || av.swipeUp || av.swipeDown) } function I() { return !!(aV() && V()) } function aO() { return ((W === av.fingers || av.fingers === i) || !a) } function X() { return aQ[0].end.x !== 0 } function a6() { return !!(av.tap) } function Y() { return !!(av.doubleTap) } function aU() { return !!(av.longTap) } function Q() { if (N == null) { return false } var bb = at(); return (Y() && ((bb - N) <= av.doubleTapThreshold)) } function H() { return Q() } function ax() { return ((W === 1 || !a) && (isNaN(ag) || ag < av.threshold)) } function a0() { return ((ab > av.longTapThreshold) && (ag < r)) } function ah() { return !!(ax() && a6()) } function aG() { return !!(Q() && Y()) } function ap() { return !!(a0() && aU()) } function F() { a5 = at(); ad = event.touches.length + 1 } function R() { a5 = 0; ad = 0 } function am() { var bb = false; if (a5) { var bc = at() - a5; if (bc <= av.fingerReleaseThreshold) { bb = true } } return bb } function aB() { return !!(aR.data(B + "_intouch") === true) } function ao(bb) { if (bb === true) { aR.bind(ay, a3); aR.bind(U, L); if (S) { aR.bind(S, K) } } else { aR.unbind(ay, a3, false); aR.unbind(U, L, false); if (S) { aR.unbind(S, K, false) } } aR.data(B + "_intouch", bb === true) } function ai(bc, bb) { var bd = bb.identifier !== undefined ? bb.identifier : 0; aQ[bc].identifier = bd; aQ[bc].start.x = aQ[bc].end.x = bb.pageX || bb.clientX; aQ[bc].start.y = aQ[bc].end.y = bb.pageY || bb.clientY; return aQ[bc] } function aH(bb) { var bd = bb.identifier !== undefined ? bb.identifier : 0; var bc = ac(bd); bc.end.x = bb.pageX || bb.clientX; bc.end.y = bb.pageY || bb.clientY; return bc } function ac(bc) { for (var bb = 0; bb < aQ.length; bb++) { if (aQ[bb].identifier == bc) { return aQ[bb] } } } function aj() { var bb = []; for (var bc = 0; bc <= 5; bc++) { bb.push({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, identifier: 0 }) } return bb } function aI(bb, bc) { bc = Math.max(bc, aT(bb)); M[bb].distance = bc } function aT(bb) { if (M[bb]) { return M[bb].distance } return undefined } function aa() { var bb = {}; bb[p] = aw(p); bb[o] = aw(o); bb[e] = aw(e); bb[x] = aw(x); return bb } function aw(bb) { return { direction: bb, distance: 0 } } function aM() { return a2 - T } function au(be, bd) { var bc = Math.abs(be.x - bd.x); var bb = Math.abs(be.y - bd.y); return Math.round(Math.sqrt(bc * bc + bb * bb)) } function a7(bb, bc) { var bd = (bc / bb) * 1; return bd.toFixed(2) } function ar() { if (G < 1) { return z } else { return c } } function aS(bc, bb) { return Math.round(Math.sqrt(Math.pow(bb.x - bc.x, 2) + Math.pow(bb.y - bc.y, 2))) } function aE(be, bc) { var bb = be.x - bc.x; var bg = bc.y - be.y; var bd = Math.atan2(bg, bb); var bf = Math.round(bd * 180 / Math.PI); if (bf < 0) { bf = 360 - Math.abs(bf) } return bf } function aL(bc, bb) { var bd = aE(bc, bb); if ((bd <= 45) && (bd >= 0)) { return p } else { if ((bd <= 360) && (bd >= 315)) { return p } else { if ((bd >= 135) && (bd <= 225)) { return o } else { if ((bd > 45) && (bd < 135)) { return x } else { return e } } } } } function at() { var bb = new Date(); return bb.getTime() } function aY(bb) { bb = f(bb); var bd = bb.offset(); var bc = { left: bd.left, right: bd.left + bb.outerWidth(), top: bd.top, bottom: bd.top + bb.outerHeight() }; return bc } function E(bb, bc) { return (bb.x > bc.left && bb.x < bc.right && bb.y > bc.top && bb.y < bc.bottom) } } }));
    }, {}], 2: [function (require, module, exports) {
        /*======================================================================*/
        /* DEPENDENCIAS                                                         */
        /*======================================================================*/
        var onResize = require('./partials/onResize'),
            onReady = require('./partials/onReady'),
            onLoad = require('./partials/onLoad'),
            onScroll = require('./partials/onScroll'),
            grid = require('./modules/grid'),
            detectBrowser = require('./modules/detectBrowser'),
            detectBreakpoint = require('./modules/detectBreakpoint'),
            detectTouchDevice = require('./modules/detectTouchDevice'),
            lightbox = require('./modules/lightbox'),
            slider = require('./modules/slider'),
            header = require('./modules/header'),
            footer = require('./modules/footer'),
            tooltips = require('./modules/tooltips'),
            forms = require('./modules/forms'),
            moduleRegistrationHeader = require('./modules/module-registration-header'),
            popupGeneralCtaAccess = require('./modules/popup-general-cta-access'),
            commons = require('./modules/commons'),
            moduleGraphics = require('./modules/module-graphics'),
            moduleProductDistributor = require('./modules/module-product-distributor'),
            moduleArticlesDistributor = require('./modules/module-articlesDistributor'),
            moduleHomeHeader = require('./modules/module-home-header'),
            moduleHeader = require('./modules/module-header'),
            moduleMediaDistributor = require('./modules/module-mediaDistributor'),
            moduleTeamDistributor = require('./modules/module-team-distributor'),
            moduleHightlightedAdvantagesDistributor = require('./modules/module-highlighted-advantages-distributor'),
            moduleTable = require('./modules/module-table'),
            moduleProductMenu = require('./modules/module-product-menu'),
            moduleListDistributor = require('./modules/module-list-distributor'),
            modulePagination = require('./modules/module-pagination'),
            moduleProductResume = require('./modules/module-product-resume'),
            moduleAccordion = require('./modules/module-accordion');
        moduleTeam = require('./modules/module-team'),
            moduleHistoryPagination = require('./modules/module-history-pagination'),
            moduleContactMap = require('./modules/module-contact-map'),
            moduleGlossaryTerms = require('./modules/module-glossary-terms'),
            moduleSearch = require('./modules/module-search'),
            moduleContactForm = require('./modules/module-contact-form'),
            moduleTeamDetail = require('./modules/module-team-detail'),
            popupHelp = require('./modules/popup-help');

        /*======================================================================*/
        /* ON READY                                                             */
        /*======================================================================*/
        function onReadyFunctions() {

            // Basics
            grid.paintGrid();
            detectBrowser.detect();
            detectTouchDevice.detect();

            // Lightbox
            lightbox.init();
            lightbox.ajax('.ajaxLightbox');
            lightbox.iframe('.iframeLightbox');
            lightbox.image('.imageLightbox');
            lightbox.team('.teamLightbox');

            // Common
            header.init();
            footer.init();
            tooltips.init();
            forms.init();
            commons.init();

            // Modules
            moduleRegistrationHeader.init();
            moduleProductDistributor.init();
            moduleArticlesDistributor.init();
            moduleMediaDistributor.init();
            moduleGraphics.init();
            moduleHomeHeader.init();
            moduleHeader.init();
            moduleTeamDistributor.init();
            moduleHightlightedAdvantagesDistributor.init();
            moduleTable.init();
            moduleProductMenu.init();
            moduleListDistributor.init();
            modulePagination.init();
            moduleProductResume.init();
            moduleAccordion.init();
            moduleTeam.init();
            moduleHistoryPagination.init();
            moduleContactMap.init();
            moduleGlossaryTerms.init();
            moduleSearch.init();
            moduleContactForm.init();
            moduleTeamDetail.init();

            // Popups
            popupGeneralCtaAccess.init();
            popupHelp.init();

        }
        onReady(onReadyFunctions);

        /*======================================================================*/
        /* ON LOAD                                                              */
        /*======================================================================*/
        function onLoadFunctions() {

        }
        onLoad(onLoadFunctions);

        /*======================================================================*/
        /* ON RESIZE                                                            */
        /*======================================================================*/
        function onResizeFunctions() {

            // Common
            header.resize();
            forms.resize();
            commons.resizePath();

            // Lightbox

            // Modules
            moduleProductDistributor.resize();
            moduleArticlesDistributor.resize();
            moduleHomeHeader.resize();
            moduleHeader.resize();
            moduleMediaDistributor.resize();
            moduleListDistributor.resize();
            moduleAccordion.resize();
            moduleProductResume.resize();
            moduleTeamDistributor.resize();

            // Popups

        }
        onResize(onResizeFunctions);


        /*======================================================================*/
        /* ON SCROLL                                                            */
        /*======================================================================*/
        function onScrollFunctions() {

            // Common
            header.scroll();
            commons.scroller();

            // Modules
            moduleRegistrationHeader.scroller();
            moduleHomeHeader.scroller();
            moduleHeader.scroller();
            moduleProductMenu.scroller();
            moduleGlossaryTerms.scroller();

            // Animations

        }
        onScroll(onScrollFunctions);

    }, { "./modules/commons": 3, "./modules/detectBreakpoint": 4, "./modules/detectBrowser": 5, "./modules/detectTouchDevice": 6, "./modules/footer": 7, "./modules/forms": 8, "./modules/grid": 9, "./modules/header": 10, "./modules/lightbox": 11, "./modules/module-accordion": 12, "./modules/module-articlesDistributor": 13, "./modules/module-contact-form": 14, "./modules/module-contact-map": 15, "./modules/module-glossary-terms": 16, "./modules/module-graphics": 17, "./modules/module-header": 18, "./modules/module-highlighted-advantages-distributor": 19, "./modules/module-history-pagination": 20, "./modules/module-home-header": 21, "./modules/module-list-distributor": 22, "./modules/module-mediaDistributor": 23, "./modules/module-pagination": 24, "./modules/module-product-distributor": 25, "./modules/module-product-menu": 26, "./modules/module-product-resume": 27, "./modules/module-registration-header": 28, "./modules/module-search": 29, "./modules/module-table": 30, "./modules/module-team": 33, "./modules/module-team-detail": 31, "./modules/module-team-distributor": 32, "./modules/popup-general-cta-access": 34, "./modules/popup-help": 35, "./modules/slider": 36, "./modules/tooltips": 37, "./partials/onLoad": 38, "./partials/onReady": 39, "./partials/onResize": 40, "./partials/onScroll": 41 }], 3: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Commons
        
        --------------------------------------------------------------------------- */
        var $button,
            $close,
            $headerModules,
            timer;

        var commons = new function () {

            return {
                init: function () {
                    $headerModules = jQuery('.module-home-header, .module-header');

                    commons.setMainButtons();
                },

                // get max height elements
                getMaxHeight: function (obj) {
                    var heights = obj.map(function () {
                        return jQuery(this).outerHeight(true);
                    }).get(),
                        maxHeight = Math.max.apply(null, heights);
                    return maxHeight
                },

                // destroy carousel
                deleteCarousel: function (obj) {
                    var $objCarousel = obj
                    if ($objCarousel.length) {
                        $objCarousel.slick('unslick');
                    }
                },

                // get current grid data
                getGrid: function (contentWidth, cols) {
                    var column = document.querySelector('.grid .grid_wrapper > span:nth-child(2)');
                    var columnStyle = window.getComputedStyle(column);

                    return {
                        width: column.clientWidth,
                        margin: parseFloat(columnStyle.getPropertyValue('margin-left'))
                    }
                },

                setCarouselGrid: function (module) {
                    var modules = document.querySelectorAll(module);

                    [].forEach.call(modules, function (object) {
                        var list = object.querySelector('.slick-list');
                        var carousel = object.querySelector('.module_carousel');

                        if (modules != null) {
                            var items = carousel.querySelectorAll('.module_carousel_item');

                            [].forEach.call(items, function (item) {
                                item.style.marginRight = commons.getGrid().margin / 2 + 'px';
                                item.style.marginLeft = commons.getGrid().margin / 2 + 'px';
                            });

                            list.style.marginRight = -commons.getGrid().margin / 2 + 'px';
                            list.style.marginLeft = -commons.getGrid().margin / 2 + 'px';

                            jQuery(carousel).slick('setPosition');
                        }
                    });
                },
                resizePath: function () {

                    clearTimeout(timer);

                    // Para los módulos cabecera y cabecera home, calculamos la altura y margen del path y lo aplicamos como margen negativo al módulo
                    if ($headerModules.length > 0) {

                        timer = setTimeout(function () {

                            var $path = jQuery('.page_head'),
                                margin = -($path.outerHeight() + parseInt($path.css('margin-top')));

                            $path
                                .next('.module-home-header, .module-header')
                                .css('margin-top', margin);

                        }, 200);

                    }

                },
                setMainButtons: function () {

                    // Gestionamos el comportamiento de los botones que aparecen fijos de la web de c2c y chat
                    $button = jQuery('#phone-button');
                    $close = $button
                        .siblings('.button-list')
                        .find('.button-close_main');

                    $button.on('click', function () {

                        $button.toggleClass('open');

                    });

                    $close.on('click', function () {

                        $button.removeClass('open');

                    });

                    jQuery('body').on('click', function (e) {

                        var $target = jQuery(e.target),
                            $buttons = $target.closest('.main-buttons');

                        if ($buttons.length <= 0) {

                            $button.removeClass('open');

                        }

                    });

                },
                scroller: function () {

                    // Al hacer scroll cerramos los botones fijos
                    if ($button === undefined || $button.length <= 0) {
                        return false;
                    }

                    $button.removeClass('open');

                }
            };
        }

        module.exports = commons;

    }, {}], 4: [function (require, module, exports) {
        /* -------------------------------------------------------
        
        Este módulo se encarga de detectar el ancho de la pantalla 
        y añadir ciertas clases en los breakpoint que definamos
        
        ------------------------------------------------------- */

        var detectBreakpoint = new function () {
            /*------------------ RWD Breakpoints ------------------*/

            var phone_max_width = 580;
            var tablet_max_width = 768;

            /*------------------ Constants ------------------*/

            var isPhoneDevice = false;
            var isTabletDevice = false;
            var isDesktopDevice = false;

            return {
                detect: function () {
                    /*------------------ Window dimensions ------------------*/

                    var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                    if (window_width <= phone_max_width) {
                        if (jQuery('body').hasClass('tabletDevice')) {
                            jQuery('body').removeClass('tabletDevice');
                        }
                        jQuery('body').addClass('phoneDevice');
                        isPhoneDevice = true;
                        isTabletDevice = false;
                        isDesktopDevice = false;
                    } else {
                        if (window_width <= tablet_max_width) {
                            if (jQuery('body').hasClass('desktopDevice') || jQuery('body').hasClass('phoneDevice')) {
                                jQuery('body').removeClass('desktopDevice phoneDevice');
                            }
                            jQuery('body').addClass('tabletDevice');
                            isPhoneDevice = false;
                            isTabletDevice = true;
                            isDesktopDevice = false;
                        } else {
                            if (jQuery('body').hasClass('tabletDevice')) {
                                jQuery('body').removeClass('tabletDevice');
                            }
                            jQuery('body').addClass('desktopDevice');
                            isPhoneDevice = false;
                            isTabletDevice = false;
                            isDesktopDevice = true;
                        }
                    }
                }
            };
        }

        module.exports = detectBreakpoint;
    }, {}], 5: [function (require, module, exports) {
        /* -------------------------------------------------------
        
        Este módulo se encarga de detectar con que explorador se
        está visualizando y se añaden clases específicas:
        
        - "ie8" para Internet explorer 8
        - "ie9" para Internet explorer 9
        - "ff" para Firefox
        - "iOS" para safari de iOS
        - "criOS" para chrome de iOS
        
        ------------------------------------------------------- */

        var detectBrowser = new function () {
            return {
                detect: function () {
                    // IE11
                    if (navigator.appVersion.indexOf('Trident/') > 0) {
                        jQuery('body').addClass('ie11');
                    }

                    // Microsoft surface
                    if (navigator.userAgent.indexOf('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586') > -1) {
                        jQuery('body').addClass('ms');
                    }

                    // Microsoft surface
                    if (window.navigator.userAgent.indexOf("Edge") > -1) {
                        jQuery('body').addClass('edge');
                    }

                    // Firefox
                    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                        jQuery('body').addClass('ff');
                    }

                    // Android
                    var android = navigator.userAgent.toLowerCase().match(/android\s([1-4\.]*)/);
                    if (android) {
                        jQuery('body').addClass('android');
                    }

                    // Windows phone
                    var iePhone = navigator.userAgent.match(/Windows Phone/i) || navigator.userAgent.match(/iemobile/i);
                    if (iePhone) {
                        jQuery('body').addClass('iePhone');
                    }

                    // Safari
                    var safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
                    if (safari) {
                        if (navigator.userAgent.toLowerCase().indexOf('chrome') <= -1) {
                            jQuery('body').addClass('safari');
                        }
                    }

                    // Remove min-height on iOS after slideshow initialization
                    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
                    if (iOS) {
                        jQuery('body').addClass('iOS');
                    }

                    // Chrome iOS
                    var criOS = (navigator.userAgent.match('CriOS') ? true : false);
                    if (criOS) {
                        jQuery('body').addClass('criOS');
                    }
                }
            };
        }

        module.exports = detectBrowser;
    }, {}], 6: [function (require, module, exports) {
        /* -------------------------------------------------------
        
        Este módulo se encarga de detectar si el dispositivo en el
        que estamos cargando la web dispone de una pantalla tátil
        
        ------------------------------------------------------- */
        var body,
            is_touch_device;

        var detectTouchDevice = new function () {
            return {
                detect: function () {

                    body = jQuery('body');

                    is_touch_device = 'ontouchstart' in document.documentElement;

                    if (is_touch_device === true) {

                        body.addClass('touchDevice');

                    } else {

                        body.addClass('noTouchDevice');

                    }

                    detectTouchDevice.mouseStart();
                    detectTouchDevice.touchStart();

                },
                removeTouchClass: function () {

                    if (body.hasClass('noTouchDevice') === false) {
                        body.addClass('noTouchDevice');
                        body.removeClass('touchDevice');
                    }

                },
                addTouchClass: function () {

                    if (body.hasClass('touchDevice') === false) {
                        body.addClass('touchDevice');
                        body.removeClass('noTouchDevice');
                    }

                },
                mouseStart: function () {

                    body.preventMouseMove = false;

                    body.on('touchstart', function (e) {
                        return body.preventMouseMove = true;
                    });

                    body.on('mousemove', function (e) {
                        if (body.preventMouseMove === false) {
                            detectTouchDevice.removeTouchClass();
                        }
                    });

                    body.on('click', function (e) {
                        body.preventMouseMove = false;
                    });

                },
                touchStart: function () {

                    body.on('touchstart', function () {
                        detectTouchDevice.addTouchClass();
                    });

                }
            };
        }

        module.exports = detectTouchDevice;
    }, {}], 7: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Footer
        
        --------------------------------------------------------------------------- */
        var $footer,
            $help,
            $offices,
            timer,
            $subcontent,
            subcontentHeight;

        var footer = new function () {

            return {
                init: function () {

                    $footer = jQuery('#footer');
                    $help = $footer.find('.help');
                    $offices = $footer.find('.footer_offices .footer_inner');

                    footer.cloneElements();

                },
                cloneElements: function () {

                    // Clonamos la lista de links de oficinas y la pegamos en las columnas de enlaces de encima
                    var $newOffices = $offices
                        .clone()
                        .attr('class', 'footer_links-column cloned')
                        .insertBefore($help)
                        .find('.footer_offices-title')
                        .attr('class', 'footer_links-title')
                        .next('.footer_offices-list')
                        .attr('class', 'footer_links-list')
                        .find('.footer_offices-list_element')
                        .attr('class', 'footer_links-list_element');

                    // Asignamos las funcionalidades de cada botón
                    footer.setElements();

                },
                setElements: function () {

                    var $dropdown_buttons = $footer.find('.footer_links-title');

                    $dropdown_buttons.on('click', function () {

                        if (window.window_width > 1023) {
                            return false;
                        }

                        clearTimeout(timer);

                        var $button = jQuery(this),
                            $el = $button.closest('.footer_links-column');

                        if ($el.hasClass('open') === true) {
                            footer.closeDropdown($el);
                        } else {
                            footer.openDropdown($el);
                        }

                    });

                },
                openDropdown: function ($el) {

                    $el.addClass('open');

                    $subcontent = $el.find('.footer_links-list'),
                        subcontentHeight = $subcontent[0].scrollHeight;

                    $subcontent.css('height', subcontentHeight);

                    timer = setTimeout(function () {

                        $subcontent.css('height', 'auto');

                    }, 550);

                },
                closeDropdown: function ($el) {

                    $el.removeClass('open');

                    $subcontent = $el.find('.footer_links-list'),
                        subcontentHeight = $subcontent[0].scrollHeight;

                    $subcontent.css('height', subcontentHeight);

                    timer = setTimeout(function () {

                        $subcontent.css('height', 0);

                    }, 10);

                },
            };
        }

        module.exports = footer;
    }, {}], 8: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Forms
        
        --------------------------------------------------------------------------- */
        var $header,
            $footer,
            $form,
            $login,
            $resume,
            $boxes,
            $checkRadio,
            $buttons,
            $selects,
            $files,
            $removeFiles,
            $steps,
            $landing,
            timeoutDNI;

        var forms = new function () {

            return {
                init: function () {

                    $header = jQuery('#header'),
                        $footer = jQuery('#footer'),
                        $form = jQuery('.registration_form');
                    $landing = jQuery('#landing_page');
                    $login = jQuery('.module-login-cri');
                    $resume = jQuery('.registration_resume');
                    $boxes = $form.find('.form_block.boxes');
                    $checkRadio = $form.find('input[type="checkbox"], input[type="radio"]');
                    $buttons = $form.find('button');
                    $selects = $form.find('select');
                    $files = $form.find('input[type="file"]');
                    $removeFiles = $form.find('.remove_upload');
                    $steps = jQuery('.module-registration-header');
                    $epsvButton = jQuery('.showEpsvCustomResult')

                    // Radios y checkbuttons
                    forms.setChecksRadios();

                    // Botones
                    forms.setButtons();

                    // Select
                    forms.setSelects();

                    // FILES
                    forms.setFiles();

                    // Cajas de formularios
                    forms.setBoxes();

                    // open epsv content
                    $epsvButton.on('click', function () {
                        forms.getRelativeContent($(this))
                    })

                    // Creamos función para forzar resize del formulario
                    window.resizeResume = function () {
                        forms.resizeForm();
                    }

                    // Creamos función para hacer scroll a la ID recibida
                    window.scrollWindow = function (id) {

                        var $element = jQuery('#' + id),
                            $header = jQuery('.module-registration-header.fixed'),
                            headerHeight = 0;

                        if ($header !== undefined && $header.length > 0) {
                            headerHeight = $header.height();
                        }

                        var posY = $element.offset().top - headerHeight - 50;

                        jQuery('html, body').animate({
                            scrollTop: posY
                        }, 400);
                    }

                    // Creamos función para hacer scroll al primer error que se muestra en elementos la clase 'error_message' y que esté en display: block
                    window.scrollError = function () {

                        var $elements = jQuery('.error_message'),
                            $header = jQuery('.module-registration-header.fixed'),
                            headerHeight = 0,
                            $element = undefined;

                        if ($elements === undefined || $elements.length <= 0) {
                            return false;
                        }

                        $elements.each(function (key, val) {

                            var $el = jQuery(val);

                            if ($el.css('display') === 'block' && $element === undefined) {
                                $element = $el;

                                return false;
                            }

                        });

                        if ($header !== undefined && $header.length > 0) {
                            headerHeight = $header.height();
                        }

                        var $parent = $element.closest('.form_block-content'),
                            posY = $parent.offset().top - headerHeight - 20 - 80;

                        jQuery('html, body').animate({
                            scrollTop: posY
                        }, 400);
                    }

                    // Esta función aplica el hide de jquery todos los elementos con clase 'error_message'
                    window.clearScrollError = function () {

                        var $elements = jQuery("span[class='error_message']"),
                            $element = undefined;

                        if ($elements === undefined || $elements.length <= 0) {
                            return false;
                        }

                        $elements.each(function (key, val) {
                            var $el = jQuery(val);
                            $el.hide();
                        });
                    }

                    // Esta función realiza un scroll automático de la página a la ID recibida en el tiempo que se recibe
                    // Se utiliza para la funcionalidad de scan del DNI, en ocasiones tarda demasiado y desde el cliente quieren
                    // poder mover al usuario a otras opciones si el tiempo que estimen se prolonga demasiado
                    window.timerDNI = function (time, id) {
                        timeoutDNI = setTimeout(function () {
                            window.scrollWindow(id);
                        }, time);
                    }

                    // Función para limpiar el timer anterior
                    window.clearTimerDNI = function () {
                        clearInterval(timeoutDNI);
                    }

                    function onElementHeightChange(elm, callback) {
                        var lastHeight = elm.innerHeight(),
                            newHeight;

                        (function run() {
                            newHeight = elm.innerHeight();

                            if (lastHeight != newHeight) {
                                callback();
                                lastHeight = newHeight;
                            }

                            if (elm.onElementHeightChangeTimer) {
                                clearTimeout(elm.onElementHeightChangeTimer);
                            }

                            elm.onElementHeightChangeTimer = setTimeout(run, 200);
                        })();
                    }

                    // Cuando se modifica el tamaño del formulario de registro (porque se añadan nuevos elementos por ejemplo), se llama a la función resize del reusmen de formulario
                    onElementHeightChange(jQuery('.registration_form'), function () {
                        window.resizeResume();
                    });

                },
                resize: function () {

                    // Capa global del formulario
                    forms.resizeForm();

                    // Formularios con cajas
                    forms.resizeBoxes();

                },
                setChecksRadios: function () {

                    // Para cada chechbox/radio comprobamos si tienen el atributo data-relative
                    // $checkRadio.each(function() {

                    // 	var $input 		= jQuery(this),
                    // 		relative 	= $input.attr('data-relative');

                    // 	// Si no lo tiene, lo igualamos a un campo vacío
                    // 	if (relative === undefined) {
                    // 		relative = '';
                    // 	}

                    // 	// Al ser seleccionado mostramos el relativo y hacemos scroll a su posición si existe, ocultamos los demás
                    // 	$input.on('change', function() {

                    // 		forms.checkRelatives($input, relative);

                    // 	});

                    // });

                    // Para cada chechbox/radio comprobamos si tienen el atributo data-relative
                    jQuery('html').on('change', 'input[type="checkbox"], input[type="radio"]', function () {

                        var $input = jQuery(this),
                            relative = $input.attr('data-relative');

                        // Si no lo tiene, lo igualamos a un campo vacío
                        if (relative === undefined) {
                            relative = '';
                        }

                        forms.checkRelatives($input, relative);

                    });

                },
                setButtons: function () {

                    // Para cada botón comprobamos si tienen el atributo data-relative y data-hide
                    $buttons.each(function () {

                        var $button = jQuery(this),
                            relative = $button.attr('data-relative'),
                            hide = $button.attr('data-hide');

                        if (relative !== undefined) {

                            $button.on('click', function () {
                                // Si lo tiene, al ser seleccionado mostramos el relativo y hacemos scroll a su posición
                                forms.checkRelatives($button, relative, hide);

                            });

                        }

                    });

                },
                setSelects: function () {

                    // Para cada select comprobamos si la opción seleccionada tiene el atributo data-relative
                    $selects.each(function () {

                        var $select = jQuery(this);

                        $select.on('change', function () {

                            var $option = jQuery('option:selected', this),
                                relative = $option.attr('data-relative');

                            // Si no lo tiene, lo igualamos a un campo vacío
                            if (relative === undefined) {
                                relative = '';
                            }

                            // Al ser seleccionado mostramos el relativo y hacemos scroll a su posición
                            forms.checkRelatives($select, relative);

                        });

                    });

                },
                setFiles: function () {

                    // Gestionamos los input file para mostrar los archivos subidos
                    jQuery('html').on('change', 'input[type="file"]', function () {

                        var $input = jQuery(this),
                            relative = $input.attr('data-relative'),
                            length = this.files.length,
                            id = $input.attr('id'),
                            $label = jQuery('label[for="' + id + '"]'),
                            $block = $input.closest('.form_block-content'),
                            $list = $block.find('.upload_list'),
                            inputsIds = $block.attr('data-extrainputs'),
                            inputsLength;

                        // Si no hay contenido en el input ocultamos la información del mismo
                        if (length === 0) {
                            return false;

                        }

                        if (inputsIds !== undefined) {

                            // Dividimos las id de los demás inputs que se generan dinámicamente
                            inputsIds = inputsIds.split(',');
                            inputsLength = inputsIds.length;

                            jQuery.each(inputsIds, function (key, val) {

                                // buscamos el input dinámico con esta ID
                                var $dynamicInput = jQuery('#' + val);

                                // Si el campo existe pero está vacío, salimos del bucle
                                if ($dynamicInput.length !== 0 && $dynamicInput.val() === '') {

                                    $label.attr('for', val);

                                    return false;
                                }

                                // Si no existe, lo creamos, y le damos la id como parámetro for al label
                                if ($dynamicInput.length <= 0) {

                                    var $fileInput

                                    if (val.includes('custom')) {
                                        $fileInput = "<input type='file' id='" + val + "' name='" + val + "' accept='image/*' capture='camera'/>";
                                    } else {
                                        $fileInput = "<input type='file' id='" + val + "' name='" + val + "' accept='image/*' />";
                                    }

                                    $block.append($fileInput);

                                    $label.attr('for', val);

                                    return false;

                                } else {
                                    if (inputsLength === (key + 1)) {
                                        $label.addClass('hidden');
                                    }
                                }

                            });

                        } else {
                            $label.addClass('hidden');

                        }

                        // En caso contrario añadimos un li con el nombre correspondiente por cada archivo
                        var name = this.files[0].name,
                            $li = '<li><span>' + name + '</span><button class="remove_file" data-id="' + id + '""></button></li>';

                        $list.append($li);

                    });

                    // Para borrar los archivos subidos
                    jQuery('html').on('click', '.remove_file', function () {

                        var $button = jQuery(this),
                            $li = $button.closest('li'),
                            $block = $button.closest('.form_block-content'),
                            id = $button.attr('data-id'),
                            $input = $block.find('#' + id),
                            $label = $block.find('.upload_label'),
                            $inputFile1 = '',
                            $inputFile2 = '';

                        // Eliminamos el elemento de la lista
                        $li.remove();

                        // Vaciamos el input
                        $input.val('');

                        // Quitamos la clase hidden al label ya que siempre se va a volver a mostrar pues queda un hueco libre y le asignamos la id que ha quedado al atributo for del label
                        $label.removeClass('hidden');
                        if (id.includes('documentationdelivery-idfiles02')) {
                            if (id.includes('custom')) {
                                $inputFile1 = $block.find('#documentationdelivery-idfiles01-custom');
                            } else {
                                $inputFile1 = $block.find('#documentationdelivery-idfiles01');
                            }

                            if ($inputFile1.val() != '') {
                                $label.attr('for', id);
                            } else {
                                $label.attr('for', $inputFile1.attr('id'));
                            }
                        } else {
                            $label.attr('for', id);
                        }
                    });

                },
                checkRelatives: function ($element, relative, hide) {

                    var relatives = relative.split(' '),
                        name = $element.attr('name');

                    // Realizamos un split de un espacio a relative por si existen varios parámetros a mostrar en este atributo
                    if (name !== undefined && name !== null) {

                        if ($element.is('input[type="checkbox"]') !== true) {

                            // Recorremos todos los input correspondientes al modificado, buscamos su contenido relativo y lo ocultamos
                            jQuery('input[name="' + name + '"]').each(function () {

                                var $el = jQuery(this),
                                    relatives = $el.attr('data-relative');

                                if (relatives !== undefined) {

                                    relatives = relatives.split(' ');

                                    $.each(relatives, function (key, val) {

                                        var $relative = jQuery('#' + val);

                                        $relative.css('display', 'none');

                                    });

                                }

                            });

                        }

                    }

                    $.each(relatives, function (key, val) {

                        // Buscamos el elemento relativo mediante la ID ('#' + nombre relativo)
                        var $relative = jQuery('#' + val);

                        if (hide === 'true') {
                            hide = true;
                        }

                        // En caso que sea un select, buscamos el relativo de la option
                        if ($element.is('select') === true) {

                            var $options = $element.find('option');

                            $options.each(function (key, val) {

                                var $option = jQuery(val),
                                    relative = $option.attr('data-relative');

                                if (relative !== undefined && relative !== null) {

                                    var $relative = jQuery('#' + relative);

                                    $relative.css('display', 'none');

                                }

                            });

                        }

                        // Si el input es el activo y existe su relacionado, mostramos su contenido por fadeIn y hacemos scroll del site a la posición del contenido relacionado
                        if (($element.is(':checked') === true || $element.is('button') === true || $element.is('select') === true) && $relative.length > 0) {

                            $relative.fadeIn(500);
                            $relative.removeClass('hidden');

                            var fixedHeader = jQuery('.module-registration-header.fixed'),
                                fixedHeaderHeight = fixedHeader.height();

                            setTimeout(function () {

                                var actualPosition = $element.offset().top,
                                    position = $relative.offset().top - fixedHeaderHeight - 149;

                                // Si la posición del elemento relacionado respecto a la actual es mayor a 80 píxeles, movemos la pantalla a dicho punto. Si no lo mantenemos en el actual
                                if ((position - actualPosition) > 0 && key === 0) {

                                    jQuery('html, body').animate({
                                        scrollTop: position
                                    });

                                }

                                // Si recibimos el atributo hide del elemento, lo ocultamos
                                if (hide === true) {

                                    var $content = $element.closest('.form_block-content');

                                    $content.addClass('hidden');

                                }

                                // Redimensionamos para que los elementos cojan la altura correcta
                                forms.resizeForm();
                                forms.resizeBoxes();

                            }, 20);

                            // Si el elemento es un checkbox, pero no esta seleccionado, ocultamos su relacionado
                        } else if ($element.is('input[type="checkbox"]') && $element.is(':checked') === false) {

                            $relative.fadeOut(0);
                            $relative.addClass('hidden');

                        }

                    });

                },

                // open relative by button
                getRelativeContent: function (obj) {
                    var relative = obj.data('relative')
                    var fixedHeader = jQuery('.module-registration-header.fixed'),
                        fixedHeaderHeight = fixedHeader.height();

                    $('#' + relative)
                        .fadeIn(500)
                        .removeClass('hidden');


                    setTimeout(function () {

                        var position = $('#' + relative).offset().top - fixedHeaderHeight - 149;

                        // Si la posición del elemento relacionado respecto a la actual es mayor a 80 píxeles, movemos la pantalla a dicho punto. Si no lo mantenemos en el actual
                        jQuery('html, body').animate({
                            scrollTop: position
                        });

                    }, 20);
                },

                setBoxes: function () {

                    $boxes.each(function () {

                        var $box = jQuery(this),
                            $inputs = $box.find('input[type="radio"]'),
                            $labels = $box.find('.radio_box-label'),
                            timer;

                        // Comprobamos cada label para ver si tiene footer y modificar el padding inferior
                        $labels.each(function () {

                            var $label = jQuery(this),
                                $footer = $label.find('.footer');

                            if ($footer.length > 0) {

                                clearTimeout(timer);

                                $label.addClass('hasFooter');

                                timer = setTimeout(function () {
                                    forms.resizeBoxes();
                                }, 200);

                            }

                        });

                        // Comprobamos si ha de convertirse en select en smartphone
                        if ($box.hasClass('toSelect') === true) {

                            var $select = $('<select class="boxes_select" />'),
                                selectInit,
                                name;

                            seletTitle = $box.attr('data-selecttitle');

                            // Creamos la primera opción con el título del atributo data-selecttitle
                            $('<option />', { text: seletTitle })
                                .appendTo($select);

                            // Por cada input creamos un option con valor el índice+1 y texto el título
                            $inputs.each(function (key, val) {

                                var $input = jQuery(this),
                                    title = $input
                                        .next('label')
                                        .find('.title')
                                        .text();

                                name = $input.attr('name');

                                $('<option />', { value: key, text: title })
                                    .appendTo($select);

                            });

                            // Damos de atributo nombre al selet el mismo que los radio con el sufijo -select
                            $select.attr('name', name + '-select');
                            $select
                                .find('option:not([value])')
                                .attr('disabled', 'disabled');
                            $select.appendTo($box);

                            // Al cambiar de input seleccionado, cambiamos el select al valor correspondiente
                            $inputs.on('change', function () {

                                var $input = jQuery(this);

                                $select
                                    .find('option')
                                    .removeAttr('selected')
                                    .prop('selected', false);

                                if ($input.is(':checked') === true) {

                                    var $block = $input.closest('.form_block-content'),
                                        index = $block.index();

                                    $select
                                        .find('option[value="' + index + '"]')
                                        .attr('selected', 'selected')
                                        .prop('selected', true);

                                }

                            });

                            // Al cambiar el valor del select, marcamos el input seleccionado
                            $select.on('change', function () {

                                var $el = jQuery(this),
                                    value = parseInt($el.val());

                                $inputs.each(function () {

                                    var $input = jQuery(this),
                                        $block = $input.closest('.form_block-content'),
                                        index = $block.index();

                                    if (index === value) {

                                        $input
                                            .attr('checked', 'checked')
                                            .prop('checked', true);

                                        $input.trigger('change');

                                    } else {

                                        $input
                                            .removeAttr('checked')
                                            .prop('checked', false);

                                    }

                                });

                            });

                        }

                        // Cuando seleccionamos una input, damos la clase selected al contenedor de todos para quitar opacidad a los no seleccionados
                        $inputs.on('change', function () {

                            var $input = jQuery(this),
                                $box = $input.closest('.boxes');

                            $box.addClass('selected');

                        });

                    });

                },
                resizeForm: function () {

                    var stepsHeight;

                    // Si existe la cabecera de pasos, calculamos su altura, sino la valoramos como 0
                    if ($steps.length > 0) {
                        stepsHeight = $steps.outerHeight();
                    } else {
                        stepsHeight = 0;
                    }

                    var headerHeight = $header.outerHeight(),
                        footerHeight = $footer.outerHeight(),
                        formPadding = parseInt($form.css('padding-top')) + parseInt($form.css('padding-bottom')),
                        loginPadding = parseInt($login.css('padding-top')) + parseInt($login.css('padding-bottom')),
                        minHeight = window.window_height - headerHeight - footerHeight - stepsHeight - formPadding;
                        minLandingHeight = window.window_height - headerHeight - footerHeight;
                    loginMinHeight = window.window_height - headerHeight - footerHeight - loginPadding;

                    $form.css('min-height', minHeight);
                    $landing.css('min-height', minLandingHeight);
                    $login.css('min-height', loginMinHeight);

                    setTimeout(function () {

                        var formHeight = $form.outerHeight();

                        $resume.css('height', formHeight);

                    }, 10);

                },
                resizeBoxes: function () {

                    // $boxes.each(function() {

                    // 	var $box 		= jQuery(this),
                    // 		$labels 	= $box.find('.radio_box-label'),
                    // 		minHeight 	= 0;

                    // 	// Reseteamos las alturas a automáticas para que todos tengan el tamaño de su contenido
                    // 	$labels.css('min-height', 'auto');

                    // 	$labels.each(function() {

                    // 		var $label 		= jQuery(this),
                    // 			labelHeight = $label[0].scrollHeight,
                    // 			borderWidth = parseInt($label.css('border-top-width'));

                    // 		// El tamaño mínimo de cada elemento es el alto de su contenido mas su borde superior e inferior
                    // 		minHeight = Math.max(minHeight, labelHeight + (borderWidth * 2));

                    // 	});

                    // 	// Damos la altura definitivamente a todos los label
                    // 	$labels.css('min-height', minHeight);

                    // });

                }
            };
        }

        module.exports = forms;

    }, {}], 9: [function (require, module, exports) {
        /* -------------------------------------------------------
        
        Este módulo se encarga de pintar la retícula con barras de
        color.
        
        ------------------------------------------------------- */

        var grid = new function () {
            return {
                paintGrid: function () {
                    var gridHTML = jQuery('\n\
									<div class="grid">\n\
										<div class="grid_wrapper">\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
											<span class="col1-xd col1-ld col1-md col1-sd col1-lt col1-st col1-sm"></span>\n\
										</div>\n\
									</div>\n\
									');
                    jQuery('#general').append(gridHTML);
                }
            };
        }

        module.exports = grid;
    }, {}], 10: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Header
        
        --------------------------------------------------------------------------- */
        var $html,
            $header,
            $headerBar,
            $headerTop,
            $headerBottom,
            $logo,
            $linksList,
            $phone,
            $featuredLink,
            $buttonsList,
            $button,
            $buttonArea,
            $menuButton,
            $list,
            $subcontentLink,
            $dropdownButton,
            $search_button,
            $searchContent,
            $search_submit,
            $search_input,
            $close_search,
            $language_link,
            $close_menu,
            $subcontentContainer,
            timer,
            resizeTimer,
            lastPos = 0,
            scrollPos = 0,
            lastScroll,
            navPosition,
            scrollTop,
            lastWidth = 0;

        var header = new function () {

            return {
                init: function () {

                    $html = jQuery('html'),
                        $header = jQuery('#header'),
                        $headerBar = $header.find('.header_bar .header_inner'),
                        $headerTop = $header.find('.header_top .header_inner'),
                        $headerBottom = $header.find('.header_bottom .header_inner'),
                        $logo = $headerTop.find('.header_top-logo'),
                        $linksList = $headerTop.find('.header_top-links_list'),
                        $phone = $headerTop.find('.phone'),
                        $featuredLink = $headerTop.find('.featured_link .link'),
                        $buttonsList = $headerTop.find('.header_top-buttons_list'),
                        $button = $headerTop.find('.header_top-call_to_action'),
                        $buttonArea = $headerTop.find('.header_top-private_area'),
                        $menuButton = $headerTop.find('.header_top-menu_button'),
                        $list = $headerBottom.find('.header_bottom-dropdown_list'),
                        $dropdownButton = $headerBottom.find('.header_bottom-dropdown_list-button'),
                        $search_button = $headerTop.find('.search_button'),
                        $searchContent = $headerBar.find('.header_bar-searcher'),
                        $search_submit = $headerBar.find('.header_searcher-button'),
                        $search_input = $headerBar.find('.header_searcher-input'),
                        $close_search = $headerBar.find('#header_searcher-close_button'),
                        $language_link = $headerTop.find('.language_link'),
                        $close_menu = $header.find('.header_bottom-close_button'),
                        lastScroll = jQuery(window).scrollTop();

                    header.cloneElements();

                },
                cloneElements: function () {

                    // Clonamos la lista de links de la cabecera superior y la pegamos en la barra de tablet/smartphone
                    $linksList
                        .clone()
                        .appendTo($headerBar);

                    // Clonamos la lista de botones de la cabecera superior y la pegamos en la barra inferior
                    $buttonsList
                        .clone()
                        .prependTo($headerBottom);

                    // Clonamos la lista de botones de la cabecera superior y la pegamos en la barra de tablet/smartphone
                    $buttonsList
                        .clone()
                        .prependTo($headerBar);

                    // Clonamos el link destacado de la cabecera superior y la pegamos en la barra inferior
                    $featuredLink
                        .clone()
                        .prependTo($headerBottom);

                    // Clonamos el link del teléfono de la cabecera superior y la pegamos en la barra inferior
                    $phone
                        .clone()
                        .prependTo($headerBottom);

                    // Clonamos el logo y el botón de hazte inversor para pegarlo en la barra inferior y que aparezca al hacer scroll
                    $logo
                        .clone()
                        .attr('class', 'header_bottom-logo')
                        .prependTo($headerBottom);

                    // Clonamos el botón de área privada y lo pegamos en la barra inferior
                    $buttonArea
                        .clone()
                        .removeClass('header_top-button header_top-private_area')
                        .addClass('header_bottom-button header_bottom-private_area')
                        .appendTo($headerBottom);

                    // Clonamos el botón de cta y lo pegamos en la barra inferior
                    $button
                        .clone()
                        .removeClass('header_top-button header_top-call_to_action')
                        .addClass('header_bottom-button header_bottom-call_to_action')
                        .appendTo($headerBottom);

                    // Clonamos la lista de enlaces de la cabecera inferior para pegarla en la superior
                    $list
                        .clone()
                        .attr('class', 'header_top-dropdown_list')
                        .insertAfter($logo)
                        .find('.header_bottom-dropdown_list-element')
                        .removeClass('header_bottom-dropdown_list-element')
                        .addClass('header_top-dropdown_list-element')
                        .find('.header_bottom-link')
                        .removeClass('header_bottom-link')
                        .addClass('header_top-dropdown_list-link');

                    // En la versión inglesa incialmente no tienen buscador, por lo que tenemos que comprobar si existe o no para crear una capa vacía con las clases del buscador
                    if ($searchContent.length > 0) {

                        // Duplicamos el buscado y lo pegamos en la inferior
                        $clonedSearch = $searchContent
                            .clone()
                            .appendTo($headerBottom);

                        // Eliminamos el botón de cerrar del buscador clonado
                        $clonedSearch
                            .find('#header_searcher-close_button')
                            .remove();

                        $language_link
                            .clone()
                            .appendTo($clonedSearch);

                    } else {

                        var $container = '<div class="header_bar-searcher"></div>',
                            $clonedLang = $language_link.clone();

                        $headerBottom.append($container);

                        // Duplicamos el enlace de idioma y lo pegamos en el buscador clonado
                        $headerBottom
                            .find('.header_bar-searcher')
                            .append($clonedLang);

                    }

                    // Asignamos las funcionalidades de cada botón
                    header.setElements();

                },
                setElements: function () {

                    $subcontents = $header.find('.subcontent-container');

                    $subcontents.on('click', function (e) {

                        e.stopPropagation();

                    });

                    var menu_timeout = ''

                    $subcontentLink = $header.find('.dropdown_subcontent-link');

                    $subcontentLink.on('click', function (e) {

                        if (window.window_width > 1023) {

                            clearTimeout(timer);

                            var $el = jQuery(this);

                            if (jQuery('body').hasClass('touchDevice') === true) {
                                e.preventDefault();
                            }

                            if ($el.hasClass('open') === true) {
                                header.closeLayer($el);
                            } else {
                                header.openLayer($el);
                            }

                        } else {

                            var $el = jQuery(this)
                            $link = $el.find('.header_bottom-link'),
                                url = $link.attr('href');

                            window.location.href = url;

                        }

                    }).on('mouseover', function (e) {
                        if (jQuery('body').hasClass('touchDevice') === true) {
                            return false;
                        }

                        if (window.window_width <= 1023) {
                            return false;
                        }

                        clearTimeout(timer);

                        var $el = jQuery(this);

                        menu_timeout = setTimeout(function () {
                            header.openLayer($el);
                        }, 600)



                    }).on('mouseout', function () {

                        if (jQuery('body').hasClass('touchDevice') === true) {
                            return false;
                        }

                        if (window.window_width <= 1023) {
                            return false;
                        }

                        clearTimeout(timer);
                        clearTimeout(menu_timeout)

                        var $el = jQuery(this);

                        header.closeLayer($el);

                    });

                    $dropdownButton.on('click', function (e) {
                        e.preventDefault();
                        clearTimeout(timer);

                        var $button = jQuery(this),
                            $el = $button.closest('.dropdown_subcontent-link');

                        if ($el.hasClass('open') === true) {
                            header.closeLayer($el);
                        } else {
                            header.openLayer($el);
                        }

                        return false;
                    });

                    $menuButton.on('click', function () {

                        scrollTop = jQuery(window).scrollTop();
                        jQuery('#general > .content').css({
                            'overflow': 'hidden',
                            'margin-top': -scrollTop + 'px'
                        });

                        $header.addClass('open');
                        $html.addClass('lock');

                    });

                    $search_button = $header.find('.search_button')

                    $search_button.on('click', function () {

                        $header.toggleClass('search');
                        $search_input.focus();

                    });

                    $search_input.on('keyup', function () {

                        if ($search_input.val().length > 0) {

                            $search_submit.addClass('active');

                        } else {

                            $search_submit.removeClass('active');

                        }

                    });

                    $close_search.on('click', function () {

                        $header.removeClass('search');

                    });

                    $close_menu.on('click', function () {

                        $header.addClass('lock');
                        $header.removeClass('open');

                        setTimeout(function () {

                            $html.removeClass('lock');

                            jQuery('#general > .content').css('margin-top', '0px');
                            jQuery('body, html').scrollTop(scrollTop);

                            setTimeout(function () {

                                $header.removeClass('lock');
                                navPosition = 0;

                            }, 500);

                        }, 500);


                    });

                    header.setHeader();

                },
                setHeader: function () {

                    $headerBottom
                        .find('.dropdown_subcontent-link')
                        .each(function () {

                            var $el = jQuery(this);

                            if ($el.hasClass('active') === true && window.window_width <= 1023) {

                                header.openLayer($el, true);

                            }

                        });

                    $subcontentLink.each(function () {

                        var $el = jQuery(this),
                            $subsection = $el.find('.active');

                        if ($el.hasClass('active') === true) {

                            var total_subsection = $subsection.length;

                            if (total_subsection <= 0) {

                                $el.addClass('disabled');

                            }

                        }

                    });

                },
                openLayer: function ($el, initial) {

                    if ($el.hasClass('open') === true) {
                        return false;
                    }

                    $subcontentContainer = $header.find('.subcontent-container');
                    $subcontentContainer.css('height', 0);
                    $subcontentContainer
                        .closest('.dropdown_subcontent-link')
                        .removeClass('open');

                    $el.addClass('open');

                    $subcontent = $el.find('.subcontent-container'),
                        subcontentHeight = $subcontent.find('.subcontent').outerHeight();

                    $subcontent.css('height', 'auto');

                    if (window.window_width <= 930 && initial !== true) {

                        var $bottom = $header.find('.header_bottom'),
                            top = $el.position().top;

                        $bottom.animate({
                            scrollTop: top
                        }, 0);

                    }

                },
                closeLayer: function ($el) {

                    timer = setTimeout(function () {
                        $el.removeClass('open');

                        $subcontent = $el.find('.subcontent-container'),
                            subcontentHeight = $subcontent.find('.subcontent').outerHeight();

                        $subcontent.css('height', subcontentHeight);

                        $subcontent.css('height', 0);

                    }, 50);

                },
                resize: function () {

                    clearTimeout(resizeTimer);

                    resizeTimer = setTimeout(function () {

                        if (lastWidth < 1023 && window.window_width >= 1023) {

                            // Cambiamos de escritorio a tablet o viceversa
                            var $subcontentContainer = $header.find('.subcontent-container');
                            $subcontentContainer.css({
                                'height': 0,
                                '-webkit-transition': 'none',
                                'transition': 'none'
                            });
                            $subcontentContainer
                                .closest('.dropdown_subcontent-link')
                                .removeClass('open');

                            $html.removeClass('lock');
                            $header.removeClass('open');

                            setTimeout(function () {
                                $subcontentContainer.css({
                                    '-webkit-transition': '',
                                    'transition': ''
                                });
                            }, 10);

                        }

                        lastWidth = window.window_width;

                    }, 10);
                },
                scroll: function () {

                    if (jQuery('html').hasClass('lock') === true) {
                        return false;
                    }

                    var scrollPos = jQuery(window).scrollTop(),
                        $header = jQuery('#header:not(.top)'),
                        $headerTop = $header.find('.header_top'),
                        headerTopHeight = $headerTop.outerHeight(),
                        $headerBottom = $header.find('.header_bottom'),
                        headerHeight = $header.outerHeight(),
                        translate = 0;

                    // Comprobamos si la cabecera página está arriba del todo
                    if (scrollPos <= headerTopHeight) {

                        // Eliminamos la clase scrolled de la cabecera
                        $header.removeClass('scrolled');

                        translate = 0;
                        navPosition = 0;

                    } else {

                        // Añadimos la clase scrolled a la cabecera
                        $header.addClass('scrolled');

                        //Calculamos la posición actual de la cabecera
                        navPosition += lastScroll - scrollPos;
                        navPosition = Math.max(-headerHeight, navPosition);
                        navPosition = Math.min(0, navPosition);

                        translate = navPosition.toFixed(0);
                    }

                    if ($header.hasClass('lock') === false) {

                        $header.css({
                            '-webkit-transform': 'translateY(' + translate + 'px) translateZ(0)',
                            'transform': 'translateY(' + translate + 'px) translateZ(0)'
                        });

                    }

                    lastScroll = scrollPos;
                }
            };
        }

        module.exports = header;
    }, {}], 11: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Lightboxes
        
        --------------------------------------------------------------------------- */
        var popupGeneralCtaAccess = require('../modules/popup-general-cta-access');

        var lightbox = new function () {
            return {
                init: function (popupUrl) {

                    window.launchAjax = function (url, element) {

                        $.magnificPopup.open({
                            items: {
                                src: url,
                                type: 'ajax'
                            },
                            removalDelay: 700,
                            closeOnContentClick: false,
                            closeMarkup: '<button title="%title%" class="mfp-close"><span></span></button>',
                            fixedContentPos: true,
                            callbacks: {
                                beforeOpen: function () {

                                    scrollTop = jQuery(window).scrollTop();
                                    var content = this.contentContainer;

                                    var registration = false;

                                    if (jQuery('#header').hasClass('registration') === true) {
                                        registration = true;
                                    }

                                    if (registration === true) {
                                        jQuery('#header').addClass('lightbox');
                                        jQuery('#header').css({
                                            '-webkit-transform': 'translateY(-' + scrollTop + 'px)',
                                            'transform': 'translateY(-' + scrollTop + 'px)'
                                        });
                                    }

                                    jQuery('html').addClass('lock');
                                    // jQuery('#general').css({ 'overflow' : 'hidden' }).scrollTop(scrollTop);
                                    jQuery('#general').css({
                                        'overflow': 'hidden'
                                    });

                                    if (registration === true) {

                                        jQuery('.content').css({
                                            'margin-top': '-' + scrollTop + 'px'
                                        });

                                    } else {

                                        jQuery('.content').css({
                                            '-webkit-transform': 'translateY(-' + scrollTop + 'px)',
                                            'transform': 'translateY(-' + scrollTop + 'px)'
                                        });

                                    }

                                    setTimeout(function () {
                                        jQuery(window).trigger('resize');
                                        content.css('overflow', 'hidden');
                                    }, 720);

                                },
                                ajaxContentAdded: function () {

                                    // Comprobamos si lanzamos el popup de acceso al alta y llamamos las funciones necesarias de dicho popup
                                    if (jQuery(element) !== undefined && jQuery(element).attr('data-registerFormCta') === 'true') {

                                        popupGeneralCtaAccess.setButtons();

                                    }

                                },
                                afterClose: function () {

                                    var registration = false;

                                    if (jQuery('#header').hasClass('registration') === true) {
                                        registration = true;
                                    }

                                    if (registration === true) {
                                        jQuery('#header').removeClass('lightbox');
                                        jQuery('#header').css({
                                            '-webkit-transform': 'none',
                                            'transform': 'none'
                                        });
                                    }

                                    this.contentContainer.css('overflow', '');
                                    // jQuery('#general').css({ 'overflow' : '' });
                                    jQuery('#general').css({
                                        'overflow': ''
                                    });

                                    if (registration === true) {

                                        jQuery('.content').css({
                                            'margin-top': '0px'
                                        });

                                    } else {
                                        jQuery('.content').css({
                                            '-webkit-transform': 'none',
                                            'transform': 'none'
                                        });
                                    }

                                    jQuery('html').removeClass('lock');
                                    jQuery('body, html').scrollTop(scrollTop);

                                }
                            },
                        });

                    }

                    window.launchIframe = function (url) {

                        $.magnificPopup.open({
                            items: {
                                src: url,
                                type: 'iframe'
                            },
                            removalDelay: 700,
                            closeOnContentClick: false,
                            closeMarkup: '<button title="%title%" class="mfp-close"><span></span></button>',
                            fixedContentPos: true,
                            callbacks: {
                                beforeOpen: function () {

                                    scrollTop = jQuery(window).scrollTop();
                                    var content = this.contentContainer;

                                    jQuery('html').addClass('lock');
                                    // jQuery('#general').css({ 'overflow' : 'hidden' }).scrollTop(scrollTop);
                                    jQuery('#general').css({
                                        'overflow': 'hidden'
                                    });
                                    jQuery('.content').css({
                                        '-webkit-transform': 'translateY(-' + scrollTop + 'px)',
                                        'transform': 'translateY(-' + scrollTop + 'px)'
                                    });

                                    setTimeout(function () {
                                        jQuery(window).trigger('resize');
                                        content.css('overflow', 'hidden');
                                    }, 720);

                                },
                                afterClose: function () {

                                    this.contentContainer.css('overflow', '');
                                    // jQuery('#general').css({ 'overflow' : '' });
                                    jQuery('#general').css({
                                        'overflow': ''
                                    });
                                    jQuery('.content').css({
                                        '-webkit-transform': 'none',
                                        'transform': 'none'
                                    });
                                    jQuery('html').removeClass('lock');
                                    jQuery('body, html').scrollTop(scrollTop);

                                }
                            }
                        });

                    }

                    window.launchAlert = function (url) {

                        $.magnificPopup.open({
                            items: {
                                src: url,
                                type: 'ajax'
                            },
                            modal: true,
                            mainClass: 'alert',
                            removalDelay: 700,
                            closeOnContentClick: false,
                            closeMarkup: '<button title="%title%" class="mfp-close"><span></span></button>',
                            fixedContentPos: true,
                            callbacks: {
                                beforeOpen: function () {

                                    scrollTop = jQuery(window).scrollTop();
                                    var content = this.contentContainer;

                                    jQuery('html').addClass('lock');
                                    // jQuery('#general').css({ 'overflow' : 'hidden' }).scrollTop(scrollTop);
                                    jQuery('#general').css({
                                        'overflow': 'hidden'
                                    });
                                    jQuery('.content').css({
                                        '-webkit-transform': 'translateY(-' + scrollTop + 'px)',
                                        'transform': 'translateY(-' + scrollTop + 'px)'
                                    });

                                    setTimeout(function () {
                                        jQuery(window).trigger('resize');
                                        content.css('overflow', 'hidden');
                                    }, 720);

                                },
                                afterClose: function () {

                                    this.contentContainer.css('overflow', '');
                                    // jQuery('#general').css({ 'overflow' : '' });
                                    jQuery('#general').css({
                                        'overflow': ''
                                    });
                                    jQuery('.content').css({
                                        '-webkit-transform': 'none',
                                        'transform': 'none'
                                    });
                                    jQuery('html').removeClass('lock');
                                    jQuery('body, html').scrollTop(scrollTop);

                                }
                            }
                        });

                    }

                    window.launchTeam = function (url, element, $link) {

                        var itemsArray = [],
                            itemIndex;

                        jQuery('.module-list_image').each(function (key, val) {

                            var obj = {},
                                $el = jQuery(val);

                            if ($el[0] == $link[0]) {
                                itemIndex = key;
                            }

                            obj.src = $el.attr('href');
                            obj.type = 'ajax';

                            itemsArray.push(obj);

                        });

                        $.magnificPopup.open({
                            gallery: {
                                enabled: true,
                            },
                            items: itemsArray,
                            mainClass: 'team',
                            removalDelay: 700,
                            closeOnContentClick: false,
                            closeMarkup: '<button title="%title%" class="mfp-close"><span></span></button>',
                            fixedContentPos: true,
                            callbacks: {
                                beforeOpen: function () {

                                    scrollTop = jQuery(window).scrollTop();
                                    var content = this.contentContainer;

                                    jQuery('html').addClass('lock');
                                    jQuery('body').css({
                                        'transform': 'translate3d(0,0,0)'
                                    });
                                    jQuery('#general').css({ 'overflow': 'hidden' }).scrollTop(scrollTop);

                                    setTimeout(function () {
                                        jQuery(window).trigger('resize');
                                        content.css('overflow', 'hidden');
                                    }, 720);

                                },
                                ajaxContentAdded: function () {

                                    // Comprobamos si lanzamos el popup de acceso al alta y llamamos las funciones necesarias de dicho popup
                                    if (jQuery($link) !== undefined && jQuery($link).attr('data-registerFormCta') === 'true') {

                                        popupGeneralCtaAccess.setButtons();

                                    }

                                    $('.popup-team_prev').on('click', function () {
                                        $('.popup-gallery').magnificPopup('prev');
                                    });
                                    $('.popup-team_next').on('click', function () {
                                        $('.popup-gallery').magnificPopup('next');
                                    });
                                    $('.popup-team_close').on('click', function () {
                                        $('.popup-gallery').magnificPopup('close');
                                    });

                                },
                                afterClose: function () {

                                    this.contentContainer.css('overflow', '');
                                    jQuery('#general').css({ 'overflow': '' });
                                    jQuery('html').removeClass('lock');
                                    jQuery('body, html').scrollTop(scrollTop);
                                    jQuery('body').css({
                                        'transform': ''
                                    });

                                }
                            }
                        }, itemIndex);

                    }

                    window.launchImage = function (url) {

                        $.magnificPopup.open({
                            items: {
                                src: url,
                                type: 'image'
                            },
                            removalDelay: 700,
                            closeOnContentClick: false,
                            closeMarkup: '<button title="%title%" class="mfp-close"><span></span></button>',
                            fixedContentPos: true,
                            closeOnBgClick: false,
                            callbacks: {
                                beforeOpen: function () {

                                    scrollTop = jQuery(window).scrollTop();
                                    var content = this.contentContainer;

                                    jQuery('html').addClass('lock');
                                    jQuery('#general').css({ 'overflow': 'hidden' }).scrollTop(scrollTop);

                                    setTimeout(function () {
                                        jQuery(window).trigger('resize');
                                        content.css('overflow', 'hidden');
                                    }, 720);

                                },
                                afterClose: function () {

                                    this.contentContainer.css('overflow', '');
                                    jQuery('#general').css({ 'overflow': '' });
                                    jQuery('html').removeClass('lock');
                                    jQuery('body, html').scrollTop(scrollTop);

                                },
                                open: function () {

                                    // Definimos la functión para activar el plugin de zoom
                                    var reloadZoomFuncionality = function () {

                                        var $figure = jQuery('.mfp-figure figure'),
                                            $parent = $figure.parent(),
                                            $bar = jQuery('.mfp-bottom-bar');

                                        if (!$parent.hasClass('onPan')) {

                                            // Ocultamos el título de imagen cuando se realiza zoom en dispositivos móviles
                                            if (!jQuery('body').hasClass('noTouchDevice')) {

                                                $bar.addClass('hidden');

                                            }

                                            if (!$parent.hasClass('onZoom')) {

                                                $parent.addClass('onZoom');
                                                $figure.panzoom('enable');
                                                $figure.panzoom('zoom', 3);
                                                $bar.addClass('hidden');

                                            } else {

                                                $parent.removeClass('onZoom');
                                                $figure.panzoom('zoom', 1);
                                                $figure.panzoom('pan', 0, 0);
                                                $figure.panzoom('disable');
                                                $bar.removeClass('hidden');

                                            }

                                        }

                                    };

                                    // Funcionalidad que aplica el zoom a aquellas imágenes
                                    // que el usuario ha decidido que lo tengan
                                    var hasZoom = function () {

                                        jQuery('body').off('click').on('click', '.mfp-content img', function (e) {

                                            e.stopImmediatePropagation();

                                            reloadZoomFuncionality();

                                        });

                                    };

                                    hasZoom();

                                },
                                imageLoadComplete: function () {

                                    var $img = jQuery('.mfp-content img'),
                                        maxScale = $img[0].naturalWidth / $img.width();
                                    _w = $img.width(),
                                        $figure = jQuery('.mfp-figure figure'),
                                        $parent = $figure.parent();


                                    $figure.panzoom({
                                        increment: 0.4,
                                        duration: 500,
                                        disablePan: true,
                                        contain: 'invert',
                                        minScale: 1,
                                        maxScale: maxScale,
                                        cursor: '',
                                        onPan: function () {

                                            $parent.addClass('onPan');

                                        },
                                        onEnd: function () {

                                            setTimeout(function () {

                                                $parent.removeClass('onPan');

                                            }, 100);

                                            if ($figure.panzoom("getMatrix")[0] <= 1) {

                                                $figure.panzoom('zoom', 1);
                                                $figure.panzoom('pan', 0, 0);
                                                $figure.panzoom('option', {
                                                    disablePan: true,
                                                });
                                            }

                                        },
                                        onZoom: function () {

                                            $figure.panzoom('option', {
                                                disablePan: false,
                                            });

                                            jQuery('.mfp-figure').css({
                                                'overflow': 'visible !important'
                                            });

                                        }
                                    });

                                    if (jQuery('body').hasClass('noTouchDevice')) {

                                        jQuery('.mfp-img').panzoom('disable');

                                    }

                                }
                            }
                        });

                    }

                },
                ajax: function (element) {

                    jQuery('html').on('click', element, function (e) {

                        // Evitamos el enlace
                        e.preventDefault();

                        // Cogemos la url del enlace y lanzamos el popup
                        var url = jQuery(e.currentTarget).attr('href');

                        window.launchAjax(url, element);

                    });

                },
                iframe: function (element) {

                    jQuery('html').on('click', element, function (e) {

                        var $element = jQuery(this),
                            url = $element.attr('href');

                        if ($element.hasClass('pdf') === true) {

                            // Si es un pdf, comprobamos si es dispositivo móvil o no
                            var $body = jQuery('body');

                            // Si es móvil salimos de la comprobación y dejamos lanzar el enlace
                            if ($body.hasClass('android') === true || $body.hasClass('iePhone') === true || $body.hasClass('iOS') === true || $body.hasClass('criOS') === true) {

                                window.open(url);

                                return false;

                            } else {

                                // Si no lo es, prevenimos el enlace
                                e.preventDefault();

                            }

                        } else {

                            // Si no es un pdf evitamos siempre el enlace
                            e.preventDefault();

                        }

                        window.launchIframe(url);

                    });

                },
                image: function (element) {

                    jQuery('html').on('click', element, function (e) {

                        // Evitamos el enlace
                        e.preventDefault();

                        // Cogemos la url del enlace y lanzamos el popup
                        var url = jQuery(element).attr('href');

                        window.launchImage(url, element);

                    });

                },

                team: function (element) {

                    jQuery('html').on('click', element, function (e) {

                        // Evitamos el enlace
                        e.preventDefault();

                        // Cogemos la url del enlace y lanzamos el popup
                        var $link = jQuery(this),
                            url = $link.attr('href');

                        window.launchTeam(url, element, $link);

                    });

                }
            };
        }

        module.exports = lightbox;
    }, { "../modules/popup-general-cta-access": 34 }], 12: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Pagination
        
        --------------------------------------------------------------------------- */

        var moduleAccordion = new function () {
            return {
                init: function () {
                    moduleAccordion.accordionBuild();
                },

                resize: function () {
                    var modules = document.querySelectorAll('.module-accordion');

                    [].forEach.call(modules, function (module) {
                        var layers = module.querySelectorAll('.accordion_list dd');

                        [].forEach.call(layers, function (layer) {
                            if (layer.classList.contains('open')) {
                                layer.style.height = '';
                                layer.style.transition = 'none';
                                layer.style.height = layer.scrollHeight + 'px';
                                setTimeout(function () {
                                    layer.style.transition = '';
                                }, 100);
                            }
                        });
                    });
                },

                accordionBuild: function () {
                    var modules = document.querySelectorAll('.module-accordion');

                    [].forEach.call(modules, function (module) {
                        var buttons = module.querySelectorAll('.accordion_list dt');

                        [].forEach.call(buttons, function (button) {
                            var layer = button.nextElementSibling;
                            var icon = button.querySelector('.icon');

                            button.addEventListener('click', function () {
                                if (!layer.classList.contains('open')) {
                                    icon.classList.add('open');
                                    layer.classList.add('open');
                                    layer.style.height = layer.scrollHeight + 'px';
                                } else {
                                    icon.classList.remove('open');
                                    layer.classList.remove('open');
                                    layer.style.height = '';
                                }
                            });
                        });
                    });
                }
            };
        }

        module.exports = moduleAccordion;

    }, {}], 13: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Article distributor
        
        --------------------------------------------------------------------------- */

        var $html,
            $module,
            $circles,
            $button,
            $layerButton,
            resizeInterval,
            commons = require('./commons');

        var moduleArticlesDistributor = new function () {
            return {
                init: function () {
                    moduleArticlesDistributor.createCarousel();
                    commons.setCarouselGrid('.module-articlesDistributor');
                },

                resize: function () {
                    clearTimeout(resizeInterval);

                    commons.setCarouselGrid('.module-articlesDistributor');

                    resizeInterval = setTimeout(function () {
                        commons.setCarouselGrid('.module-articlesDistributor');
                    }, 100);
                },

                createCarousel: function () {
                    var $module = jQuery('.module-articlesDistributor');
                    var $carousel = $module.find('.module_carousel');

                    $module.on('init', function (slick) {
                        $module.removeClass('hidden');
                    });

                    var autoplay = false;

                    if ($module.attr('data-autoplay') === 'true') {
                        autoplay = true;
                    }

                    $carouselOptions = {
                        dots: true,
                        speed: 400,
                        slidesToShow: 2,
                        infinite: true,
                        // arrows: false,
                        responsive: [
                            {
                                breakpoint: 680,
                                settings: {
                                    slidesToShow: 1
                                }
                            }
                        ],
                        autoplay: autoplay,
                        slidesToScroll: 1,
                        autoplaySpeed: 3500
                    };

                    $carousel.slick($carouselOptions);
                }
            };
        }

        module.exports = moduleArticlesDistributor;

    }, { "./commons": 3 }], 14: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Footer
        
        --------------------------------------------------------------------------- */
        var $module,
            $inner,
            $form,
            $confirmation;

        var moduleContactForm = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-contact-form');
                    $inner = $module.find('.module_inner');
                    $form = $module.find('.module-form');
                    $confirmation = $module.find('.module-confirmation');

                    window.contactFormConfirmation = function () {

                        var initHeight = $form[0].scrollHeight,
                            lastHeight = $confirmation[0].scrollHeight;

                        $inner.css('height', initHeight);

                        $module.addClass('confirmation');

                        setTimeout(function () {
                            $inner.css('height', lastHeight);
                        }, 5);

                        setTimeout(function () {
                            $inner.css('height', '');
                        }, 1505);

                    }

                }
            };
        }

        module.exports = moduleContactForm;
    }, {}], 15: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Contact Map
        
        --------------------------------------------------------------------------- */

        var $module,
            $images,
            api_key,
            url_init = '//maps.googleapis.com/maps/api/staticmap?zoom=16&size=640x640&scale=1&center=',
            url_marker = '&markers=color:0xb6996f|',
            url_style = '&style=feature%3Awater%7Celement%3Ageometry.fill%7Ccolor%3A0xd3d3d3%7C&style=feature%3Atransit%7Celement%3Aall%7Ccolor%3A0x808080%7Cvisibility%3Aoff%7C&style=feature%3Aroad.highway%7Celement%3Ageometry.stroke%7Cvisibility%3Aon%7Ccolor%3A0xb3b3b3%7C&style=feature%3Aroad.highway%7Celement%3Ageometry.fill%7Ccolor%3A0xffffff%7C&style=feature%3Aroad.local%7Celement%3Ageometry.fill%7Cvisibility%3Aon%7Ccolor%3A0xffffff%7Cweight%3A1.8%7C&style=feature%3Aroad.local%7Celement%3Ageometry.stroke%7Ccolor%3A0xd7d7d7%7C&style=feature%3Apoi%7Celement%3Ageometry.fill%7Cvisibility%3Aon%7Ccolor%3A0xebebeb%7C&style=feature%3Aadministrative%7Celement%3Ageometry%7Ccolor%3A0xa7a7a7%7C&style=feature%3Aroad.arterial%7Celement%3Ageometry.fill%7Ccolor%3A0xffffff%7C&style=feature%3Aroad.arterial%7Celement%3Ageometry.fill%7Ccolor%3A0xffffff%7C&style=feature%3Alandscape%7Celement%3Ageometry.fill%7Cvisibility%3Aon%7Ccolor%3A0xefefef%7C&style=feature%3Aroad%7Celement%3Alabels.text.fill%7Ccolor%3A0x696969%7C&style=feature%3Aadministrative%7Celement%3Alabels.text.fill%7Cvisibility%3Aon%7Ccolor%3A0x737373%7C&style=feature%3Apoi%7Celement%3Alabels.icon%7Cvisibility%3Aoff%7C&style=feature%3Apoi%7Celement%3Alabels%7Cvisibility%3Aoff%7C&style=feature%3Aroad.arterial%7Celement%3Ageometry.stroke%7Ccolor%3A0xd6d6d6%7C&style=feature%3Aroad%7Celement%3Alabels.icon%7Cvisibility%3Aoff%7C&style=&style=feature%3Apoi%7Celement%3Ageometry.fill%7Ccolor%3A0xdadada%7C',
            url_key = '&key=';

        var moduleContactMap = new function () {
            return {
                init: function () {

                    // Para cada elemento, cargamos una imagen desde el api de google con la latitud y longitud de cada uno
                    $module = jQuery('.module-contact-maps');
                    $images = $module.find('.module-image');
                    api_key = $module.attr('data-key');

                    $images.each(function (key, val) {

                        var $image = jQuery(val),
                            lat = $image.attr('data-lat'),
                            length = $image.attr('data-length'),
                            image_url;

                        image_url = url_init + lat + ',' + length;
                        image_url += url_marker + lat + ',' + length;
                        image_url += url_style;

                        if (api_key !== '' && api_key !== undefined) {
                            image_url += url_key + api_key;
                        }

                        $image.attr('src', image_url);

                    });

                }
            };
        }

        module.exports = moduleContactMap;

    }, {}], 16: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Glossary Terms
        
        --------------------------------------------------------------------------- */
        var $body,
            $general,
            $module,
            $selects,
            $moduleFixed;

        var moduleGlossaryTerms = new function () {

            return {
                init: function () {

                    $body = jQuery('body');
                    $general = jQuery('#general');
                    $module = jQuery('.module-glossary-terms-alphabet');

                    moduleGlossaryTerms.cloneElements();

                },
                cloneElements: function () {

                    $moduleFixed = $module
                        .clone()
                        .addClass('cloned')
                        .appendTo($general);

                    moduleGlossaryTerms.setLinks();

                },
                setLinks: function () {

                    jQuery('html').on('click', '.module-glossary-terms-alphabet .module-link', function (e) {

                        e.preventDefault();

                        var $el = jQuery(this),
                            id = $el.attr('href');

                        moduleGlossaryTerms.scrollLetter(id);

                    });

                    jQuery('html').on('change', '.module-glossary-terms-alphabet .module-select', function (e) {

                        e.preventDefault();

                        var $el = jQuery(this),
                            id = $el.val();

                        moduleGlossaryTerms.scrollLetter(id);

                    });

                },
                scrollLetter: function (id) {

                    var $letter = jQuery(id);
                    posY = $letter.offset().top - 20,
                        index = 1;

                    // Si lanza el evento en el módulo inicial no clonado aplciamos el doble del tamaño de la capa clonada para el correcto posicionamiento
                    if ($moduleFixed.hasClass('visible') === false) {

                        index = 2;

                    }

                    posY -= ($moduleFixed.outerHeight() * index);

                    jQuery('html, body').animate({
                        scrollTop: posY
                    }, 300);

                },
                scroller: function () {

                    if ($module === undefined || $module.length <= 0) {
                        return false;
                    }

                    var posY = $body.scrollTop() || document.documentElement.scrollTop,
                        modulePos = $module.offset().top,
                        moduleHei = $module.outerHeight();

                    if (posY > (modulePos + moduleHei)) {

                        $moduleFixed.addClass('visible');

                    } else {

                        $moduleFixed.removeClass('visible');

                    }

                }
            };
        }

        module.exports = moduleGlossaryTerms;
    }, {}], 17: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module graphics
        
        --------------------------------------------------------------------------- */
        var $modules,
            $container,
            $selects,
            containersArray = [],
            chartsArray = [],
            colors = ['#b59971', '#575757', '#a3a1a1', '#a27d5c', '#785d47', '#cecfd4'];

        var moduleGraphics = new function () {

            return {
                init: function () {

                    $modules = jQuery('.module-graphics, .module-product-resume');
                    $container = $modules.find('.chart-container');
                    $selects = $modules.find('.module-graphic_select');

                    $container.each(function (key, val) {

                        var $container = jQuery(val),
                            url = $container.attr('data-info'),
                            type = $container.attr('data-type');

                        moduleGraphics.readData(url, type, $container);

                    });

                    moduleGraphics.setSelects();

                },
                setSelects: function () {

                    // Función para gestionar el comportamiento de los select para seleccionar el rango de las gráficas
                    $selects.each(function (key, val) {

                        var $select = jQuery(val),
                            $parent = $select.closest('.chart-block_container'),
                            $wrapper = $parent.find('.chart-container_wrapper'),
                            $container = $wrapper.find('.chart-container'),
                            type = $container.attr('data-type');

                        $select.on('change', function () {

                            var $option = jQuery('option:selected', this),
                                url = $option.attr('data-info'),
                                index = containersArray.indexOf($container[0]),
                                $chart = chartsArray[index];

                            $chart.destroy();
                            $wrapper.addClass('loading');

                            setTimeout(function () {
                                moduleGraphics.readData(url, type, $container);
                            }, 200);

                        });

                    });

                },
                readData: function (url, type, $container) {

                    // Función que lee el JSON y discrimina el tipo de gráfica
                    $.getJSON(url, function (obj) {

                        switch (type) {
                            case 'line':
                                moduleGraphics.setLineGraph(obj, $container);
                                break;
                            case 'pie':
                                moduleGraphics.setPieGraph(obj, $container);
                                break;
                            case 'bars':
                                moduleGraphics.setBarsGraph(obj, $container);
                                break;
                            case 'product line':
                                moduleGraphics.setLineGraph(obj, $container, false);
                                break;
                        }

                    });

                },
                setLineGraph: function (obj, $container, showYAxis) {

                    var labels = [],
                        valuesX = [],
                        valuesY = [],
                        labelsX,
                        data,
                        options,
                        chart,
                        myChart,
                        yAxis = true,
                        xLines = false,
                        tooltipUnit = $container.attr('data-unit'),
                        maxTicks = 10,
                        scaleLabelDisplay = false,
                        scaleLabelTitle = '',
                        scaleLabelXDisplay = false,
                        scaleLabelXTitle = '',
                        scaleLabelSeparator = '.',
                        ticksOptions = {},
                        showTooltip = true;

                    // Si no existe el parámetro data-unit las unidades del tooltip quedan como una cadena vacía
                    if (tooltipUnit === undefined) {
                        tooltipUnit = '';
                    }

                    // En las gráficas de producto, recibimos showYAxis como false y no lo mostramos. En caso contrario se muestra dicho eje
                    if (showYAxis !== undefined) {
                        yAxis = showYAxis;
                        xLines = true;
                    }

                    // El parámetro data-maxticks define el número máximo de valores que se muestran en el eje X si existe dicho atributo
                    if ($container.attr('data-maxticks') !== undefined && $container.attr('data-maxticks') !== null && $container.attr('data-maxticks') !== '') {
                        maxTicks = parseInt($container.attr('data-maxticks'));
                    }

                    // El parámetro data-axistitle define el título del eje Y si existe dicho atributo
                    if ($container.attr('data-axistitle') !== undefined && $container.attr('data-axistitle') !== null && $container.attr('data-axistitle') !== '') {
                        scaleLabelDisplay = true,
                            scaleLabelTitle = $container.attr('data-axistitle');
                    }

                    // El parámetro data-axisXtitle define el título del eje X si existe dicho atributo
                    if ($container.attr('data-axisXtitle') !== undefined && $container.attr('data-axisXtitle') !== null && $container.attr('data-axisXtitle') !== '') {
                        scaleLabelXDisplay = true,
                            scaleLabelXTitle = $container.attr('data-axisXtitle');
                    }

                    // El parámetro data-decimalseparator define el tipo de separador para los decimales (normalmente , o . que depende de cada país)
                    if ($container.attr('data-decimalseparator') !== undefined && $container.attr('data-decimalseparator') !== null && $container.attr('data-decimalseparator') !== '') {
                        scaleLabelSeparator = $container.attr('data-decimalseparator');
                    }

                    // El parámetro data-axisYrange sirve para definir el valor por el que se separaran los elementos del eje Y
                    if ($container.attr('data-axisYrange') !== undefined && $container.attr('data-axisYrange') !== null && $container.attr('data-axisYrange') !== '') {
                        ticksOptions = { stepSize: parseInt($container.attr('data-axisYrange')) };
                    }

                    // El parámetro data-tooltip sirve para definir si se muestra o no el tooltip en una gráfica ('true' / 'false' respectivamente)
                    if ($container.attr('data-tooltip') !== undefined && $container.attr('data-tooltip') !== null && $container.attr('data-tooltip') !== '') {
                        if ($container.attr('data-tooltip') === 'false') {
                            showTooltip = false;
                        }
                    }

                    // Recorremos el objeto para dar los valores X e Y
                    jQuery.each(obj, function (key, val) {

                        var value = val;

                        jQuery.each(value, function (key, val) {

                            var value = val,
                                axisX = [],
                                axisY = [];

                            // Guardamos cada label en el array de labels
                            labels.push(key);

                            jQuery.each(val, function (key, val) {

                                axisX.push(val.x);

                                var valY = val.y.replace(',', '.');

                                axisY.push(valY);

                            });

                            valuesX.push(axisX);
                            valuesY.push(axisY);

                        });

                    });

                    var dataSets = [];

                    // Gestionamos los datos que recibimos en el json independientemente si los decimales vienen marcados con . o ,
                    jQuery.each(valuesX, function (key, val) {

                        var obj = {},
                            value = val,
                            dataArray = [],
                            arrayY = valuesY[key];

                        obj.label = labels[key];
                        obj.backgroundColor = colors[key];
                        obj.borderColor = colors[key];
                        obj.pointBorderColor = colors[key];

                        jQuery.each(value, function (key, val) {

                            var obj = {};

                            obj.x = val;
                            obj.y = parseFloat(arrayY[key].replace(',', '.').replace(' ', ''));

                            dataArray.push(obj);

                        });

                        obj.data = dataArray;
                        dataSets.push(obj);

                    });

                    var totalLabels = valuesX[0].length,
                        isPrimeLabels = false,
                        initialMaxTicks = maxTicks,
                        index = 1,
                        indexSign = 'positive',
                        labelsIndex,
                        ticksXOptions;


                    // En esta función comprobamos si el número de elementos es primo. Si es así, aplicamos la división original del plugin
                    // En caso contrario, buscamos el número más cercano al valor recibido en data-maxticks por el que es divisible el total de elementos
                    // En último caso, si dicho valor es mayor por más de 15 o menor por menos de 15 del valor data-maxticks, utilizamos la división original del plugin
                    if (moduleGraphics.isPrime(totalLabels) === false) {

                        maxTicks -= 2;

                        if (totalLabels > maxTicks) {

                            while (totalLabels % (maxTicks - 1) !== 0) {

                                if (indexSign === 'positive') {

                                    maxTicks += index;
                                    indexSign = 'negative';

                                } else {

                                    maxTicks -= index;
                                    indexSign = 'positive';

                                }

                                index++;

                            }

                        }

                        if (maxTicks > initialMaxTicks + 15 || maxTicks < initialMaxTicks - 15) {

                            maxTicks = initialMaxTicks;

                            isPrimeLabels = true;

                            ticksXOptions = {
                                autoSkip: true,
                                maxTicksLimit: maxTicks
                            };

                        } else {

                            labelsIndex = totalLabels / (maxTicks - 1);

                            ticksXOptions = {
                                autoSkip: false
                            };

                        }

                    } else {

                        isPrimeLabels = true;

                        ticksXOptions = {
                            autoSkip: true,
                            maxTicksLimit: maxTicks
                        };

                    }

                    data = {
                        labels: valuesX[0],
                        datasets: dataSets
                    }

                    options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                lineColor: '#e7e7e7',
                                ticks: ticksXOptions,
                                gridLines: {
                                    display: xLines,
                                    zeroLineColor: '#e7e7e7',
                                    color: '#e7e7e7'
                                },
                                scaleLabel: {
                                    display: scaleLabelXDisplay,
                                    labelString: scaleLabelXTitle
                                },
                                afterTickToLabelConversion: function (data) {

                                    if (isPrimeLabels === true) {
                                        return false;
                                    }

                                    var xLabels = data.ticks;

                                    xLabels.forEach(function (labels, i) {
                                        // El módulo de i y el máximo de ticks es distinto de 0
                                        // El total de elementos es mayor que maxTicks
                                        // No se trata del primer elemento
                                        // No se trata del último elemento
                                        // Si se cumplen estas condiciones "ocultamos" el label

                                        if (((i + 1) % labelsIndex) !== 0 && totalLabels > maxTicks && i !== 0 && i !== (totalLabels - 1)) {
                                            xLabels[i] = '';
                                        }

                                    });
                                },
                                type: 'category'
                            }],
                            yAxes: [{
                                lineColor: '#e7e7e7',
                                display: yAxis,
                                gridLines: {
                                    drawBorder: false,
                                    zeroLineColor: '#e7e7e7',
                                    color: '#e7e7e7'
                                },
                                scaleLabel: {
                                    display: scaleLabelDisplay,
                                    labelString: scaleLabelTitle
                                },
                                ticks: ticksOptions
                            }]
                        },
                        elements: {
                            point: {
                                radius: 1,
                                hitRadius: 10
                            },
                            line: {
                                fill: false,
                                tension: 0,
                                borderWidth: 2
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            enabled: showTooltip,
                            xPadding: 15,
                            yPadding: 15,
                            cornerRadius: 0,
                            titleMarginBottom: 15,
                            callbacks: {
                                label: function (tooltipItems, data) {

                                    var yVal = tooltipItems.yLabel.toString();

                                    var value = Number(yVal),
                                        res = yVal.split('.');

                                    if (yVal.indexOf('.') === -1) {

                                        value = value.toFixed(2);
                                        yVal = value.toString();

                                    } else if (res[1].length < 3) {

                                        value = value.toFixed(2);
                                        yVal = value.toString();

                                    }

                                    yVal = yVal.replace('.', scaleLabelSeparator);

                                    return yVal + tooltipUnit;

                                }
                            }
                        },
                        animation: {
                            onProgress: function (e) {

                                var $wrapper = $container.closest('.chart-container_wrapper');

                                $wrapper.removeClass('loading');

                            }
                        }
                    }

                    chart = {
                        type: 'line',
                        data: data,
                        options: options
                    }

                    myChart = new Chart($container, chart);

                    if (containersArray.indexOf($container[0]) === -1) {

                        containersArray.push($container[0]);
                        chartsArray.push(myChart);

                    } else {

                        var index = containersArray.indexOf($container[0]);

                        chartsArray[index] = myChart;

                    }

                    moduleGraphics.setLegend(labels, $container);

                },
                setPieGraph: function (obj, $container) {

                    var labels = [],
                        dataArray = [],
                        dataSets = [],
                        object = {},
                        tooltipUnit = $container.attr('data-unit'),
                        scaleLabelSeparator = '.',
                        showTooltip = true;

                    // Si no existe el parámetro data-unit las unidades del tooltip quedan como una cadena vacía
                    if (tooltipUnit === undefined) {
                        tooltipUnit = '';
                    }

                    // El parámetro data-axistitle define el título del eje Y si existe dicho atributo
                    if ($container.attr('data-axistitle') !== undefined && $container.attr('data-axistitle') !== null && $container.attr('data-axistitle') !== '') {
                        scaleLabelDisplay = true,
                            scaleLabelTitle = $container.attr('data-axistitle');
                    }

                    // El parámetro data-decimalseparator define el tipo de separador para los decimales (normalmente , o . que depende de cada país)
                    if ($container.attr('data-decimalseparator') !== undefined && $container.attr('data-decimalseparator') !== null && $container.attr('data-decimalseparator') !== '') {
                        scaleLabelSeparator = $container.attr('data-decimalseparator');
                    }

                    // El parámetro data-tooltip sirve para definir si se muestra o no el tooltip en una gráfica ('true' / 'false' respectivamente)
                    if ($container.attr('data-tooltip') !== undefined && $container.attr('data-tooltip') !== null && $container.attr('data-tooltip') !== '') {
                        if ($container.attr('data-tooltip') === 'false') {
                            showTooltip = false;
                        }
                    }

                    // Gestionamos los datos que recibimos en el json independientemente si los decimales vienen marcados con . o ,
                    jQuery.each(obj, function (key, val) {

                        var value = val;

                        jQuery.each(value, function (key, val) {

                            labels.push(key);

                            var val = val.replace(',', '.');

                            dataArray.push(val);

                        });

                    });

                    // Valores para los estilos de la gráfica
                    object.data = dataArray;
                    object.backgroundColor = colors;
                    object.borderWidth = 2;
                    object.borderColor = '#ffffff';
                    object.hoverBorderWidth = 0;
                    object.hoverBorderColor = 'rgba(255 ,255 ,255 , .1)';

                    dataSets.push(object);

                    data = {
                        labels: labels,
                        datasets: dataSets
                    }

                    options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        cutoutPercentage: 85,
                        tooltips: {
                            enabled: showTooltip,
                            xPadding: 15,
                            yPadding: 15,
                            cornerRadius: 0,
                            titleMarginBottom: 15,
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                                    var tooltipLabel = data.labels[tooltipItem.index];
                                    var tooltipData = allData[tooltipItem.index];
                                    var total = 0;
                                    for (var i in allData) {
                                        total += parseFloat(allData[i]);
                                    }
                                    var tooltipPercentage = Math.round((tooltipData / total) * 100).toString();
                                    return tooltipLabel + ': ' + tooltipPercentage.replace('.', scaleLabelSeparator) + '%';
                                }
                            }
                        },
                        animation: {
                            onProgress: function (e) {

                                var $wrapper = $container.closest('.chart-container_wrapper');

                                $wrapper.removeClass('loading');

                            }
                        }
                    }

                    chart = {
                        type: 'doughnut',
                        data: data,
                        options: options
                    }

                    myChart = new Chart($container, chart);

                    if (containersArray.indexOf($container[0]) === -1) {

                        containersArray.push($container[0]);
                        chartsArray.push(myChart);

                    } else {

                        var index = containersArray.indexOf($container[0]);

                        chartsArray[index] = myChart;

                    }

                    moduleGraphics.setLegend(labels, $container);

                },
                setBarsGraph: function (obj, $container) {

                    var labels = [],
                        valuesY = [],
                        labelsX = [],
                        data,
                        options,
                        chart,
                        myChart,
                        tooltipUnit = $container.attr('data-unit'),
                        maxTicks,
                        scaleLabelDisplay = false,
                        scaleLabelTitle = '',
                        scaleLabelXDisplay = false,
                        scaleLabelXTitle = '',
                        scaleLabelSeparator = '.',
                        ticksOptions = { beginAtZero: true },
                        showTooltip = true,
                        chartType = 'bar',
                        stackedYAxis = false;

                    // Si no existe el parámetro data-unit las unidades del tooltip quedan como una cadena vacía
                    if (tooltipUnit === undefined) {
                        tooltipUnit = '';
                    }

                    // El parámetro data-axistitle define el título del eje Y si existe dicho atributo
                    if ($container.attr('data-axistitle') !== undefined && $container.attr('data-axistitle') !== null && $container.attr('data-axistitle') !== '') {
                        scaleLabelDisplay = true,
                            scaleLabelTitle = $container.attr('data-axistitle');
                    }

                    // El parámetro data-axisXtitle define el título del eje X si existe dicho atributo
                    if ($container.attr('data-axisXtitle') !== undefined && $container.attr('data-axisXtitle') !== null && $container.attr('data-axisXtitle') !== '') {
                        scaleLabelXDisplay = true,
                            scaleLabelXTitle = $container.attr('data-axisXtitle');
                    }

                    // El parámetro data-decimalseparator define el tipo de separador para los decimales (normalmente , o . que depende de cada país)
                    if ($container.attr('data-decimalseparator') !== undefined && $container.attr('data-decimalseparator') !== null && $container.attr('data-decimalseparator') !== '') {
                        scaleLabelSeparator = $container.attr('data-decimalseparator');
                    }

                    // El parámetro data-axisYrange sirve para definir el valor por el que se separaran los elementos del eje Y
                    if ($container.attr('data-axisYrange') !== undefined && $container.attr('data-axisYrange') !== null && $container.attr('data-axisYrange') !== '') {
                        ticksOptions = { beginAtZero: true, stepSize: parseInt($container.attr('data-axisYrange')) };
                    }

                    // El parámetro data-tooltip sirve para definir si se muestra o no el tooltip en una gráfica ('true' / 'false' respectivamente)
                    if ($container.attr('data-tooltip') !== undefined && $container.attr('data-tooltip') !== null && $container.attr('data-tooltip') !== '') {
                        if ($container.attr('data-tooltip') === 'false') {
                            showTooltip = false;
                        }
                    }

                    // El parámetro data-tooltip sirve para definir la orientación de las barras. Horizontal si recibe 'horizontalBar' horizontales, cualquier otro caso verticales
                    if ($container.attr('data-orientation') !== undefined && $container.attr('data-orientation') !== null && $container.attr('data-orientation') === 'horizontal') {
                        chartType = 'horizontalBar';
                        stackedYAxis = true;
                    }

                    // Recorremos el objeto para dar los valores X e Y
                    jQuery.each(obj, function (key, val) {

                        var value = val,
                            barNumber = key;

                        jQuery.each(value, function (key, val) {

                            var value = val,
                                axisY = [];

                            // Guardamos cada labels en el array de labels si no está ya en el mismo
                            if (labelsX.indexOf(key) === -1) {
                                labelsX.push(key);
                            }

                            jQuery.each(val, function (key, val) {

                                // Guardamos cada labels en el array de labels si no está ya en el mismo
                                if (labels.indexOf(val.x) === -1) {
                                    labels.push(val.x);
                                }

                                var valY = val.y.replace(',', '.');

                                if (chartType === 'horizontalBar' && barNumber === 0) {
                                    valY = -Number(valY);
                                }

                                axisY.push(valY);

                            });

                            valuesY.push(axisY);

                        });

                    });

                    var dataSets = [];

                    jQuery.each(valuesY, function (key, val) {

                        var obj = {};

                        obj.label = labelsX[key];
                        obj.backgroundColor = colors[key];
                        obj.data = valuesY[key];

                        dataSets.push(obj);

                    });

                    var totalLabels = labels.length,
                        labelsIndex;

                    // El parámetro data-maxticks define el número máximo de valores que se muestran en el eje X si existe dicho atributo
                    if ($container.attr('data-maxticks') !== undefined && $container.attr('data-maxticks') !== null && $container.attr('data-maxticks') !== '') {
                        maxTicks = parseInt($container.attr('data-maxticks'));
                    } else {
                        maxTicks = totalLabels;
                    }

                    while (totalLabels % maxTicks !== 0) {
                        maxTicks--;
                    }

                    labelsIndex = totalLabels / maxTicks - 1;

                    data = {
                        labels: labels,
                        datasets: dataSets
                    }

                    options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    autoSkip: false,
                                    // maxTicksLimit: maxTicks
                                },
                                afterTickToLabelConversion: function (data) {
                                    var xLabels = data.ticks;

                                    xLabels.forEach(function (labels, i) {
                                        // El módulo de i y el máximo de ticks es distinto de 0
                                        // El total de elementos es mayor que maxTicks
                                        // No se trata del primer elemento
                                        // No se trata del último elemento

                                        if (((i + 1) % labelsIndex) !== 0 && totalLabels > maxTicks && i !== 0 && i !== (totalLabels - 1)) {
                                            xLabels[i] = '';
                                        }

                                        // Si las barras son horizontales, el valor del label siempre es positivo
                                        if (chartType === 'horizontalBar') {
                                            xLabels[i] = Math.abs(Number(labels));
                                        }

                                    });
                                },
                                barPercentage: .6,
                                categorySpacing: .4,
                                categoryPercentage: .85,
                                lineColor: '#e7e7e7',
                                gridLines: {
                                    drawBorder: false,
                                    display: false,
                                    zeroLineColor: '#e7e7e7',
                                    color: '#e7e7e7'
                                },
                                scaleLabel: {
                                    display: scaleLabelXDisplay,
                                    labelString: scaleLabelXTitle
                                }
                            }],
                            yAxes: [{
                                lineColor: '#e7e7e7',
                                ticks: ticksOptions,
                                gridLines: {
                                    drawBorder: false,
                                    zeroLineColor: '#e7e7e7',
                                    color: '#e7e7e7'
                                },
                                barPercentage: .3,
                                categorySpacing: .4,
                                categoryPercentage: .7,
                                stacked: stackedYAxis,
                                scaleLabel: {
                                    display: scaleLabelDisplay,
                                    labelString: scaleLabelTitle
                                }
                            }]
                        },
                        elements: {
                            point: {
                                radius: 1
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            enabled: showTooltip,
                            xPadding: 15,
                            yPadding: 15,
                            cornerRadius: 0,
                            titleMarginBottom: 15,
                            callbacks: {
                                label: function (tooltipItems, data) {

                                    var yVal;

                                    if (chartType === 'horizontalBar') {

                                        yVal = (Math.abs(tooltipItems.xLabel)).toString();

                                    } else {

                                        yVal = tooltipItems.yLabel.toString();

                                    }

                                    var value = Number(yVal),
                                        res = yVal.split('.');

                                    if (yVal.indexOf('.') === -1) {

                                        value = value.toFixed(2);
                                        yVal = value.toString();

                                    } else if (res[1].length < 3) {

                                        value = value.toFixed(2);
                                        yVal = value.toString();

                                    }

                                    yVal = yVal.replace('.', scaleLabelSeparator);

                                    return yVal + tooltipUnit;

                                }
                            }
                        },
                        animation: {
                            onProgress: function (e) {

                                var $wrapper = $container.closest('.chart-container_wrapper');

                                $wrapper.removeClass('loading');

                            }
                        }
                    }

                    chart = {
                        type: chartType,
                        data: data,
                        options: options
                    }

                    myChart = new Chart($container, chart);

                    if (containersArray.indexOf($container[0]) === -1) {

                        containersArray.push($container[0]);
                        chartsArray.push(myChart);

                    } else {

                        var index = containersArray.indexOf($container[0]);

                        chartsArray[index] = myChart;

                    }

                    moduleGraphics.setLegend(labelsX, $container);

                },
                setLegend: function (labels, $container) {

                    // Esta función genera una leyenda para las gráficas y lo añade a la capa con clase 'chart-legend'
                    var $wrapper = $container.closest('.chart-container_wrapper'),
                        $legend = $wrapper.siblings('.chart-legend');

                    if ($legend.length <= 0) {
                        return false;
                    }

                    $legend.empty();

                    jQuery.each(labels, function (key, val) {

                        var $li = '<li class="chart-legend_element"><span class="chart-legend_color" style="background-color: ' + colors[key] + '"></span><span class="chart-legend_name">' + val + '</span></li>';

                        $legend.append($li);

                    });

                    $legend.removeClass('hidden');

                },
                isPrime: function (num) {

                    for (var i = 2; i < num; i++) {
                        if (num % i === 0) {
                            return false;
                        }
                    }

                    return num !== 1;

                }
            };
        }

        module.exports = moduleGraphics;

    }, {}], 18: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module header
        
        --------------------------------------------------------------------------- */
        var $module,
            $veils,
            $header;

        var moduleHeader = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-header');
                    $veils = $module.find('.module-veil');
                    $header = jQuery('#header');

                },
                resize: function () {

                    var header_h = $header.outerHeight(),
                        index = 1;

                    if ($module.hasClass('interior') === true) {

                        index = .6;

                    }

                    $module.css('min-height', (window.window_height - header_h) * index);

                },
                scroller: function () {

                    if ($module === undefined) {
                        return false;
                    }

                    if ($module.length <= 0 || $module.hasClass('product') === true) {
                        return false;
                    }

                    var $body = jQuery('body'),
                        posY = $body.scrollTop() || document.documentElement.scrollTop,
                        minY = $module.outerHeight() * .12,
                        maxY = $module.outerHeight() - minY,
                        opacity;

                    // Empezamos a mostrar el velo blanco progresivamente a partir de la mitad de altura del módulo
                    opacity = (posY * 100 / maxY) / 100;

                    $veils.css('opacity', opacity);

                }
            };
        }

        module.exports = moduleHeader;
    }, {}], 19: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Hightlighted Advantages Distributor
        
        --------------------------------------------------------------------------- */
        var $modules;

        var moduleHightlightedAdvantagesDistributor = new function () {

            return {
                init: function () {

                    $modules = jQuery('.module-highlighted-advantages-distributor');

                    $modules.each(function (key, val) {

                        var $module = jQuery(val),
                            $list = $module.find('.module-slider');
                        $container = $module.find('.module-container');
                        $image = $module.find('.module-image_container:first-child');

                        var autoplay = false;

                        if ($module.attr('data-autoplay') === 'true') {
                            autoplay = true;
                        }

                        // Creamos el slider
                        $list.slick({
                            dots: true,
                            speed: 400,
                            slidesToShow: 1,
                            infinite: true,
                            // arrows: false,
                            autoplay: autoplay,
                            slidesToScroll: 1,
                            autoplaySpeed: 3500
                        });

                        // Si la imagen esta al principio, la duplicamos y la colocamos al final
                        if ($image.length > 0) {

                            var $newImage = $image
                                .clone()
                                .addClass('cloned');

                            $container.append($newImage);

                        }

                    });

                }
            };
        }

        module.exports = moduleHightlightedAdvantagesDistributor;
    }, {}], 20: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module history pagination
        
        --------------------------------------------------------------------------- */

        var moduleHistoryPagination = new function () {

            return {
                init: function () {
                    moduleHistoryPagination.clickHandle();
                },

                clickHandle: function () {
                    var modules = document.querySelectorAll('.module-history-pagination');

                    [].forEach.call(modules, function (module) {
                        var buttons = module.querySelectorAll('.history-pagination_list li button');
                        var select = module.querySelector('.history-pagination_select select');

                        [].forEach.call(buttons, function (button, index) {
                            option = module.querySelector('.history-pagination_select option:nth-child(' + (index + 1) + ')');

                            button.addEventListener('click', function () {
                                $('html, body').animate({
                                    scrollTop: $(document.getElementById(this.getAttribute('data-ref'))).offset().top
                                }, 800);
                            });
                        });

                        select.addEventListener('change', function () {
                            module.querySelector('button[data-ref="' + this.value + '"]').click();
                        });
                    });
                },
            };
        }

        module.exports = moduleHistoryPagination;
    }, {}], 21: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Home Header
        
        --------------------------------------------------------------------------- */
        var slider = require('../modules/slider'),
            $module,
            $controls,
            $pagination,
            $veils,
            $images,
            $titles,
            initialOpacity,
            timeDuration = 10000;

        var moduleHomeHeader = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-home-header');
                    $headerTop = jQuery('.header_top');
                    $controls = $module.find('.module-controls');
                    $paginationWrap = $module.find('.module-pagination_wrap')
                    $pagination = $module.find('.module-pagination');
                    $veils = $module.find('.module-veil, .image-veil');
                    $images = $module.find('.module-list_image');
                    $titles = $module.find('.module-title_container');

                    // Si recibimos el parámetro data-duration lo tomamos como la duración del slider en lugar de los 10000 por defecto
                    if ($module.attr('data-duration') !== undefined && $module.attr('data-duration') !== null) {
                        timeDuration = parseInt($module.attr('data-duration'));
                    }

                    // Creamos el slider principal
                    slider.slider({
                        element: $module,
                        controls: false,
                        controlsContent: $controls,
                        pagination: true,
                        paginationContent: $pagination,
                        autoPlay: false,
                        animation: 'fxCustom',
                        loop: true,
                        overlay: true,
                        interval: timeDuration
                    });

                    // Recorremos todas las imágenes del módulo y se las asignamos como imagen de fondo a los contenedores de los títulos para smartphone
                    $images.each(function (key, val) {

                        var $image = jQuery(val),
                            $parent = $image.closest('.module-list_element'),
                            $title = $parent.find('.module-title_container'),
                            src;

                        src = $image.css('background-image');

                        $title.css('background-image', src);

                    });

                },
                resize: function () {

                    var _minH = 0;
                    var headerHeight = $headerTop.outerHeight();
                    var winWidth = window.innerWidth;

                    // Hacemos que todos los títulos tengan como mínimo el alto de los demás títulos para smartphone
                    $titles.each(function (key, val) {

                        var $title = jQuery(this);

                        _minH = Math.max(_minH, $title.outerHeight());

                    });

                    //$titles.css('min-height', _minH);

                    // if(winWidth <= 930) {
                    // 	$paginationWrap
                    // 			.delay(500)
                    // 			.queue(function (next) { 
                    // 				$(this).css('top', ((_minH - headerHeight)))
                    // 			})
                    // }else{
                    // 	$paginationWrap.removeAttr('style')
                    // }

                    moduleHomeHeader.cutTitle()

                },

                cutTitle: function () {
                    var winWidth = window.innerWidth;

                    if (winWidth <= 930) {
                        $(".module-list_element").each(function () {
                            var title = $(this).find('.module-title')
                            var content = $(this).find('.module-list_container .module-content')

                            if (!($(this).find('.module-list_container .module-content .module-title').length)) {
                                title.clone().prependTo(content)
                            }

                        })
                    } else {
                        $('.module-list_container .module-content .module-title').remove()
                    }
                },

                scroller: function () {

                    if ($module === undefined || $module.length <= 0) {
                        return false;
                    }

                    var $body = jQuery('body'),
                        posY = $body.scrollTop() || document.documentElement.scrollTop,
                        minY = $module.outerHeight() * .3,
                        maxY = $module.outerHeight() - minY,
                        opacity;

                    // Empezamos a mostrar el velo blanco progresivamente a partir de la mitad de altura del módulo
                    opacity = (posY * 100 / maxY) / 100;

                    $veils.css('opacity', opacity);

                }
            };
        }

        module.exports = moduleHomeHeader;
    }, { "../modules/slider": 36 }], 22: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module header
        
        --------------------------------------------------------------------------- */
        var $module,
            $list;

        var moduleListDistributor = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-list-distributor');
                    $list = $module.find('.module-list');

                },
                resize: function () {

                    if ($list === undefined || $list.length <= 0) {
                        return false;
                    }

                    if (window.window_width <= 680) {

                        if ($list.hasClass('slick-initialized') === false) {

                            var autoplay = false;

                            if ($module.attr('data-autoplay') === 'true') {
                                autoplay = true;
                            }

                            $list.slick({
                                dots: true,
                                speed: 400,
                                slidesToShow: 1,
                                infinite: true,
                                autoplay: autoplay,
                                slidesToScroll: 1,
                                autoplaySpeed: 3500
                            });

                        }


                    } else {

                        if ($list.hasClass('slick-initialized') === true) {

                            $list.slick('unslick');

                        }

                    }

                }
            };
        }

        module.exports = moduleListDistributor;
    }, {}], 23: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Registration Header
        
        --------------------------------------------------------------------------- */
        var $html,
            $module,
            $circles,
            $button,
            $layerButton,
            resizeInterval,
            autoplay = false,
            commons = require('./commons');

        var moduleMediaDistributor = new function () {
            return {
                init: function () {

                    var $module = jQuery('.module-mediaDistributor');

                    if ($module.attr('data-autoplay') === 'true') {
                        autoplay = true;
                    }

                    $carouselOptions = {
                        dots: true,
                        speed: 400,
                        slidesToShow: 3,
                        infinite: true,
                        // arrows: false,
                        responsive: [
                            {
                                breakpoint: 680,
                                settings: {
                                    slidesToShow: 1
                                }
                            },
                            {
                                breakpoint: 930,
                                settings: {
                                    slidesToShow: 2
                                }
                            }
                        ],
                        autoplay: autoplay,
                        slidesToScroll: 1,
                        autoplaySpeed: 3500
                    }

                    moduleMediaDistributor.createCarousel();
                },

                resize: function () {
                    setTimeout(function () {
                        moduleMediaDistributor.setDescriptionHeight();
                    }, 200);
                },

                createCarousel: function () {
                    var $module = jQuery('.module-mediaDistributor');
                    var $carousel = $module.find('.mediaDistributor_carousel:not(.disabled)');

                    $module.on('init', function (slick) {
                        $module.removeClass('hidden');
                    });

                    if ($module.find('.mediaDistributor_carousel').hasClass('disabled')) {
                        $module.removeClass('hidden');
                    }

                    $module.on('setPosition', function (slick) {
                        setTimeout(function () {
                            moduleMediaDistributor.setDescriptionHeight();
                        }, 200);
                    });

                    $carousel.slick($carouselOptions);
                },

                setDescriptionHeight: function () {
                    var modules = document.querySelectorAll('.module-mediaDistributor');
                    var itemPrev;
                    var itemsRows = {};

                    [].forEach.call(modules, function (module) {
                        var moduleItems = module.querySelectorAll('.mediaDistributor_item');

                        [].forEach.call(moduleItems, function (item) {
                            if (item.style.height != null) {
                                item.style.height = '';
                            }

                            var itemTop = item.getBoundingClientRect().top;
                            var itemHeight = item.getBoundingClientRect().height;

                            if (itemPrev !== undefined) {
                                var itemPrevTop = itemPrev.getBoundingClientRect().top;
                                var itemPrevHeight = itemPrev.getBoundingClientRect().height;

                                if (itemPrevTop === itemTop) {

                                    if (itemPrevHeight > itemHeight) {
                                        item.style.height = itemPrevHeight + 'px';
                                    } else if (itemPrevHeight < itemHeight) {
                                        itemPrev.style.height = itemHeight + 'px';
                                    }
                                }
                            }

                            itemPrev = item;
                        });
                    });
                },

                getGrid: function (contentWidth, cols) {
                    var column = document.querySelector('.grid .grid_wrapper > span:nth-child(2)');
                    columnStyle = window.getComputedStyle(column);

                    return {
                        width: column.clientWidth,
                        margin: parseFloat(columnStyle.getPropertyValue('margin-left'))
                    }
                }
            };
        }

        module.exports = moduleMediaDistributor;
    }, { "./commons": 3 }], 24: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Pagination
        
        --------------------------------------------------------------------------- */

        var modulePagination = new function () {
            return {
                init: function () {
                    modulePagination.setClasses();
                },

                setClasses: function () {
                    var modules = document.querySelectorAll('.module-pagination');

                    if (modules.length == 0)
                        return false;

                    [].forEach.call(modules, function (module) {
                        var list = module.querySelector('.module-pagination_list');

                        if (list != undefined) {
                            var firstButton = list.querySelector('li:nth-child(1)');
                            var secondButton = list.querySelector('li:nth-child(2)');
                            var thirdButton = list.querySelector('li:nth-child(3)');
                            var fourthButton = list.querySelector('li:nth-child(4)');
                            var fifthButton = list.querySelector('li:nth-child(5)');
                            var sixthButton = list.querySelector('li:nth-child(6)');
                            var secondEndButton = list.querySelector('li:nth-last-child(2)');

                            // Si la página actual está entre las 3 primeras
                            if (secondEndButton != undefined) {
                                if (secondEndButton.classList.contains('module-pagination_list_dots') && list.querySelectorAll('.module-pagination_list_dots').length == 1) {
                                    module.classList.add('first-pages');

                                    // Si la página actual es la primera
                                    if (firstButton != undefined) {
                                        if (firstButton.classList.contains('currentItem')) {
                                            if (thirdButton != undefined)
                                                thirdButton.classList.add('onlyDesktop');
                                            if (fourthButton != undefined)
                                                fourthButton.classList.add('onlyDesktop');
                                        }
                                    }
                                    // Si la página actual es la segunda
                                    if (secondButton != undefined) {
                                        if (secondButton.classList.contains('currentItem')) {
                                            if (thirdButton != undefined)
                                                thirdButton.classList.add('onlyDesktop');
                                            if (fourthButton != undefined)
                                                fourthButton.classList.add('onlyDesktop');
                                        }
                                    }
                                    // Si la página actual es la tercera
                                    if (thirdButton != undefined) {
                                        if (thirdButton.classList.contains('currentItem')) {
                                            if (firstButton != undefined)
                                                firstButton.classList.add('onlyDesktop');
                                            if (fourthButton != undefined)
                                                fourthButton.classList.add('onlyDesktop');
                                        }
                                    }
                                }
                            }

                            // Si la página actual está entre las 3 últimas
                            if (secondButton != undefined) {
                                if (secondButton.classList.contains('module-pagination_list_dots') && list.querySelectorAll('.module-pagination_list_dots').length == 1) {
                                    module.classList.add('last-pages');

                                    // Si la página actual es el tercer item
                                    if (thirdButton != undefined) {
                                        if (thirdButton.classList.contains('currentItem')) {
                                            if (fifthButton != undefined)
                                                fifthButton.classList.add('onlyDesktop');
                                            if (sixthButton != undefined)
                                                sixthButton.classList.add('onlyDesktop');
                                        }
                                    }
                                    // Si la página actual es el cuarto item
                                    if (fourthButton != undefined) {
                                        if (fourthButton.classList.contains('currentItem')) {
                                            if (list.querySelectorAll('li').length > 4) {
                                                if (thirdButton != undefined)
                                                    thirdButton.classList.add('onlyDesktop');
                                                if (sixthButton != undefined)
                                                    sixthButton.classList.add('onlyDesktop');
                                            }
                                        }
                                    }
                                    // Si la página actual es el quinto item
                                    if (fifthButton != undefined) {
                                        if (fifthButton.classList.contains('currentItem')) {
                                            if (list.querySelectorAll('li').length > 5) {
                                                if (thirdButton != undefined)
                                                    thirdButton.classList.add('onlyDesktop');
                                                if (fourthButton != undefined)
                                                    fourthButton.classList.add('onlyDesktop');
                                            }
                                            if (list.querySelectorAll('li').length == 5) {
                                                if (thirdButton != undefined)
                                                    thirdButton.classList.add('onlyDesktop');
                                            }
                                        }
                                    }
                                }
                            }

                            // Si la página actual está en las páginas centrales
                            if (list.querySelectorAll('.module-pagination_list_dots').length === 2) {
                                module.classList.add('middle-pages');

                                if (thirdButton != undefined)
                                    thirdButton.classList.add('onlyDesktop');
                                if (fifthButton != undefined)
                                    fifthButton.classList.add('onlyDesktop');
                            }

                            // Si la páginas totales son menores a 6
                            if (list.querySelectorAll('.module-pagination_list_dots').length === 0) {
                                module.classList.add('few-pages');

                                // Si la página actual es la primera, segunda o tercera
                                if (firstButton != undefined) {
                                    if (firstButton.classList.contains('currentItem')) {
                                        if (fifthButton != undefined)
                                            fifthButton.classList.add('onlyDesktop');
                                    }
                                }
                                if (secondButton != undefined) {
                                    if (secondButton.classList.contains('currentItem')) {
                                        if (fifthButton != undefined)
                                            fifthButton.classList.add('onlyDesktop');
                                    }
                                }
                                if (thirdButton != undefined) {
                                    if (thirdButton.classList.contains('currentItem')) {
                                        if (fifthButton != undefined)
                                            fifthButton.classList.add('onlyDesktop');
                                    }
                                }
                            }
                        }

                        module.style.display = 'block';
                    });
                }
            };
        }

        module.exports = modulePagination;

    }, {}], 25: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Product Distributor
        
        --------------------------------------------------------------------------- */
        var commons = require('../modules/commons'),
            resizeInterval,
            timer;

        var moduleProductDistributor = new function () {

            return {
                init: function () {
                    moduleProductDistributor.createCarousel($('.module-product-distributor-slider .module-product-distributor_items'));
                    commons.setCarouselGrid('.module-product-distributor-slider');
                },

                resize: function () {
                    clearTimeout(resizeInterval);

                    moduleProductDistributor.setItemHeight();
                    commons.setCarouselGrid('.module-product-distributor-slider');

                    resizeInterval = setTimeout(function () {
                        commons.setCarouselGrid('.module-product-distributor-slider');
                    }, 100);
                },

                setItemHeight: function () {
                    var $module = jQuery('.module-product-distributor');

                    clearTimeout(timer);

                    $module.each(function (index, el) {
                        $this = jQuery(el).find('.module-content');

                        // case normal layout
                        if ($this.hasClass('style01')) {
                            var $itemRow = $this.find('.module-product-distributor_items_row');
                            $itemRow.each(function (index, el) {
                                $this = jQuery(el)
                                $child = $this.find('.module-product-distributor_item')

                                if (window.window_width >= 675) {
                                    $child.removeAttr('style');
                                    $child.css({ 'height': commons.getMaxHeight($child) })
                                } else {
                                    $child.removeAttr('style')
                                }
                            });
                        } else {
                            // case slider layout
                            $child = $this.find('.module-product-distributor_item');

                            var $contents = $child.find('.module_carousel_item_list_content'),
                                _h = 0;

                            timer = setTimeout(function () {

                                $contents.css('height', 'auto');

                                $contents.each(function (key, val) {

                                    var $content = jQuery(this),
                                        contentH = $content.height();

                                    _h = Math.max(_h, contentH);

                                });

                                $contents.css('height', _h);

                            }, 100);
                        }
                    });
                },

                createCarousel: function (o) {
                    var obj = o
                    if (obj.length) {
                        if (!(obj.hasClass('slick-slider'))) {
                            obj.on('init', function (event, slick) {
                                setTimeout(function () {
                                    moduleProductDistributor.setItemHeight();
                                }, 100);
                            })

                            obj.slick({
                                dots: true,
                                infinite: true,
                                speed: 400,
                                // arrows: false,
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                responsive: [
                                    {
                                        breakpoint: 675,
                                        settings: {
                                            slidesToShow: 1
                                        }
                                    }
                                ]
                            });
                        }
                    }
                },

                // TEMP Fn
                wrapItems: function (o) {
                    var obj = o,
                        article = obj.find('.module-product-distributor_item'),
                        size = article.size()

                    for (var i = 0; i < size; i += 2) {
                        article.slice(i, i + 2)
                            .wrapAll("<div class='module-product-distributor_custom_wrap'></div>");
                    }

                    moduleProductDistributor.createCarousel(o)
                },

                unwrapItems: function (o) {
                    o
                        .find('.module-product-distributor_custom_wrap')
                        .contents()
                        .unwrap()
                        .siblings('.module-product-distributor_custom_wrap')
                        .remove();

                    moduleProductDistributor.createCarousel(o)
                }
            };
        }

        module.exports = moduleProductDistributor;
    }, { "../modules/commons": 3 }], 26: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module product menu
        
        --------------------------------------------------------------------------- */
        var $general,
            $module,
            $moduleFixed,
            $buttons,
            timer,
            lastScroll = 0,
            navPosition = 0;

        var moduleProductMenu = new function () {

            return {
                init: function () {

                    $general = jQuery('#general');
                    $module = jQuery('.module-product-menu');

                    // Clonamos el módulo para la versión fija que aparece al hacer scroll
                    $moduleFixed = $module
                        .clone()
                        .addClass('fixed')
                        .appendTo($general);


                    moduleProductMenu.setButtons();

                },
                setButtons: function () {

                    $buttons = jQuery('.module-product-menu .module-button');

                    $buttons.on('click', function () {

                        var $button = jQuery(this),
                            $list = $button.siblings('.module-list'),
                            listHei = $list[0].scrollHeight;

                        clearTimeout(timer);

                        $button.toggleClass('open');

                        if ($button.hasClass('open') === true) {

                            $list.css('height', listHei);

                            timer = setTimeout(function () {

                                $list.css('height', 'auto');

                            }, 8520);

                        } else {

                            $list.css('height', listHei);

                            timer = setTimeout(function () {

                                $list.css('height', 0);

                            }, 10);

                        }

                    });

                },
                scroller: function () {

                    if ($module === undefined || $module.length <= 0) {
                        return false;
                    }

                    var $body = jQuery('body'),
                        posY = $body.scrollTop() || document.documentElement.scrollTop,
                        modulePos = $module.offset().top,
                        moduleHei = $module.outerHeight(),
                        translate;

                    if (posY > (modulePos + moduleHei)) {

                        $moduleFixed.addClass('visible');

                    } else {

                        $moduleFixed.removeClass('visible');

                    }

                    navPosition += lastScroll - posY;
                    navPosition = Math.max(-$moduleFixed.find('.module-button').outerHeight(), navPosition);
                    navPosition = Math.min(0, navPosition);
                    translate = navPosition.toFixed(0);

                    $moduleFixed.css({
                        '-webkit-transform': 'translateY(' + translate + 'px) translateZ(0)',
                        'transform': 'translateY(' + translate + 'px) translateZ(0)'
                    });

                    lastScroll = posY;

                }
            };
        }

        module.exports = moduleProductMenu;
    }, {}], 27: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module product resume
        
        --------------------------------------------------------------------------- */
        var $module,
            $info,
            $button,
            $documentationLink,
            initHeight,
            timer;

        var moduleProductResume = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-product-resume');
                    $info = $module.find('.module-info');
                    $button = $module.find('.button-toggle-text');
                    $documentationLink = $module.find('.module-documentation-link');
                    initHeight = $info.height();

                    $button.on('click', function () {

                        $info.toggleClass('open');

                        if ($info.hasClass('open') === true) {

                            // Abrimos el contenido
                            var _h = $info[0].scrollHeight;

                            $info.css('height', _h);

                            timer = setTimeout(function () {

                                $info.css('height', 'auto');

                            }, 720);

                        } else {

                            // Cerramos el contenido
                            var _h = $info[0].scrollHeight;

                            $info.css('height', _h);

                            timer = setTimeout(function () {

                                $info.css('height', initHeight);

                            }, 20);

                        }

                    });

                    // Función para animar el ancla de ver toda la documentación a la capa correspondiente
                    $documentationLink.on('click', function (e) {

                        e.preventDefault();

                        var $link = jQuery(this),
                            dest = $link.attr('href'),
                            dest = dest.replace('#', ''),
                            $element = jQuery('a[name="' + dest + '"]'),
                            $header = jQuery('#header'),
                            headerHeight = 0;

                        if ($header !== undefined && $header.length > 0) {
                            headerHeight = $header.height();
                        }

                        var posY = $element.offset().top - headerHeight - 20;

                        jQuery('html, body').animate({
                            scrollTop: posY
                        }, 400);

                    });

                },
                resize: function () {

                    if ($module === undefined || $module.length <= 0) {
                        return false;
                    }

                    var contentHeight = $info[0].scrollHeight;

                    if (contentHeight > 200) {

                        $info.removeClass('visible');

                        var height = $info.height();

                        // Si es mayor a 200px de altura, aplicamos la funcionalidad del ver más. En caso contrario la eliminamos
                        if (contentHeight > height + 30) {

                            $info.addClass('overflow');

                        } else {

                            $info.removeClass('overflow');

                        }

                    } else {

                        // En caso de ser inferior a 200, lo mostramos directamente
                        $info
                            .addClass('visible')
                            .removeClass('overflow');

                    }


                }
            };
        }

        module.exports = moduleProductResume;
    }, {}], 28: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Registration Header
        
        --------------------------------------------------------------------------- */
        var $html,
            $body,
            $content,
            $module,
            $circles,
            $button,
            $layerButton,
            $fixedBar,
            $resume,
            $layerResume,
            $layerResumeContent,
            $resumeContent,
            scrollTop;

        var moduleRegistrationHeader = new function () {

            return {
                init: function () {

                    $html = jQuery('html');
                    $body = jQuery('body');
                    $content = jQuery('.content');
                    $module = jQuery('.module-registration-header');
                    $circles = $module.find('.circle_complete');
                    $button = $module.find('.module_button');
                    $layerButton = jQuery('.registration_resume-close_button');
                    $resume = jQuery('.registration_resume');
                    $resumeContent = jQuery('.registration_resume-content');

                    window.updateSteps = function (step) {

                        var $modules = jQuery('.module-registration-header'),
                            actualStep = step;

                        jQuery.each($modules, function (key, val) {

                            var $module = jQuery(val),
                                $li = $module.find('.module_list-element');

                            // Eliminamos las clases complete y active de todos los elementos
                            $li.removeClass('complete active inactive');

                            jQuery.each($li, function (key, val) {

                                var $el = jQuery(val),
                                    step = actualStep - 1;

                                if (key < step) {

                                    // Si el paso es mayor que el índice está completado
                                    $el.addClass('complete');

                                } else if (key === step) {

                                    // Si el paso es igual que el índice está activo
                                    $el.addClass('active');

                                } else {

                                    // Si el paso es mayor que el índice está inactivo
                                    $el.addClass('inactive');

                                }

                            });

                        });
                    }

                    window.updatePercentages = function () {

                        var $circles = jQuery('.circle_complete');

                        $circles.each(function () {

                            var $circle = jQuery(this),
                                radius = $circle.attr('r'),
                                $li = $circle.closest('.module_list-element'),
                                perc = $li.attr('data-perc'),
                                $number = $li.find('.number-data'),
                                zero,
                                newOffset,
                                opacity;

                            zero = Math.PI * radius * 2;
                            newOffset = zero - (zero * (perc / 100));

                            opacity = (.3 + (.7 * (Number(perc) / 100)));

                            $circle.css('stroke-dashoffset', newOffset);
                            $number.css('opacity', opacity);

                        });

                    }

                    $circles.each(function () {

                        var $circle = jQuery(this),
                            radius = $circle.attr('r'),
                            $li = $circle.closest('.module_list-element'),
                            initOffset;

                        initOffset = Math.PI * radius * 2;

                        $circle.css({
                            'stroke-dasharray': initOffset,
                            'stroke-dashoffset': initOffset
                        });

                    });

                    $button.on('click', function () {

                        if (window.window_width > 1279) {

                            $module.toggleClass('no_resume');

                        } else {

                            $module.toggleClass('tablet_resume');

                            if ($module.hasClass('tablet_resume') === true) {

                                $html.addClass('lock');

                            } else {

                                $html.removeClass('lock');

                            }

                        }

                    });

                    $layerButton.on('click', function (e) {

                        if (window.window_width > 1279) {
                            return false;
                        }

                        $html.removeClass('lock');
                        $('.module-registration-header').removeClass('tablet_resume');

                    });

                    $('.registration_resume').on('click', function (e) {

                        if (window.window_width > 1279) {
                            return false;
                        }

                        $html.removeClass('lock');
                        $('.module-registration-header').removeClass('tablet_resume');

                    });

                    $resumeContent.on('click', function (e) {

                        e.stopPropagation();

                    });

                    $fixedBar = $module
                        .clone()
                        .addClass('fixed')
                        .appendTo($content);

                    $body
                        .append('<div class="registration_resume-layer"><div class="registration_resume-layer_container"><div class="registration_resume-layer_content"></div></div></div>');

                    $layerResume = jQuery('.registration_resume-layer');
                    $layerResumeContent = jQuery('.registration_resume-layer_content');

                    $html.on('click', '.module-registration-header.fixed .module_button', function () {

                        var $button = jQuery(this);

                        if ($layerResume.hasClass('open') === false) {

                            $button.addClass('layerOpen');

                            $layerResumeContent
                                .empty()
                                .append($resumeContent.html());

                            $layerResume
                                .addClass('open');

                            if (window.window_width < 1280) {

                                scrollTop = jQuery(window).scrollTop();

                                $html.addClass('lock');

                                jQuery('#general').css({
                                    'height': 'auto',
                                    'overflow': 'visible'
                                });
                                jQuery('#header').css({
                                    'margin-top': '-' + scrollTop + 'px'
                                });
                                // jQuery('.content').css({
                                // 	'-webkit-transform' : 'translateY(-' + scrollTop + 'px)',
                                // 	'transform' 		: 'translateY(-' + scrollTop + 'px)'
                                // });

                                setTimeout(function () {
                                    jQuery(window).trigger('resize');
                                }, 720);

                            }

                        } else {

                            $button.removeClass('layerOpen');

                            $layerResume
                                .removeClass('open');

                            if (window.window_width < 1280) {

                                jQuery('#general').css({
                                    'height': '',
                                    'overflow': ''
                                });
                                jQuery('#header').css({
                                    'margin-top': 0
                                });
                                jQuery('.content').css({
                                    '-webkit-transform': '',
                                    'transform': ''
                                });
                                $html.removeClass('lock');
                                jQuery('body, html').scrollTop(scrollTop);

                            }

                        }

                    });

                    $html.on('click', '.registration_resume-layer .registration_resume-layer_content', function () {

                        var $button = jQuery('.module-registration-header.fixed .module_button');

                        $button.removeClass('layerOpen');

                        $layerResume
                            .removeClass('open');

                        if (window.window_width < 1280) {

                            jQuery('#general').css({
                                'overflow': ''
                            });
                            jQuery('#header').css({
                                'margin-top': 0
                            });
                            jQuery('.content').css({
                                '-webkit-transform': '',
                                'transform': ''
                            });
                            $html.removeClass('lock');
                            jQuery('body, html').scrollTop(scrollTop);

                        }

                    });

                    setTimeout(function () {
                        window.updatePercentages();
                    }, 1000);

                },
                scroller: function () {

                    if ($module === undefined || $fixedBar === undefined) {
                        return false;
                    }

                    if ($module.length === 0 || $fixedBar.length === 0) {
                        return false;
                    }

                    if (jQuery('#header').hasClass('lightbox') === true) {
                        return false;
                    }

                    var moduleY = $module.offset().top + $module.height(),
                        scrollY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

                    if (scrollY > moduleY) {

                        $fixedBar.addClass('visible');

                    } else {

                        if (($layerResume.hasClass('open') === false && window.window_width < 1280) || window.window_width >= 1280) {

                            $fixedBar.removeClass('visible');
                            $layerResume.removeClass('open');
                            jQuery('.module-registration-header.fixed .module_button').removeClass('layerOpen');

                        }

                    }

                }
            };
        }

        module.exports = moduleRegistrationHeader;
    }, {}], 29: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module Search
        
        --------------------------------------------------------------------------- */
        var $module,
            $button,
            $input;

        var moduleSearch = new function () {
            return {
                init: function () {

                    $module = jQuery('.module-search');
                    $button = $module.find('.module-button');
                    $input = $module.find('.module-input');

                    $input.on('keyup', function () {

                        if ($input.val().length > 0) {

                            $button.addClass('active');

                        } else {

                            $button.removeClass('active');

                        }

                    });

                }
            };
        }

        module.exports = moduleSearch;

    }, {}], 30: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module header
        
        --------------------------------------------------------------------------- */
        var $modules,
            cellWidth = 190;

        var moduleTable = new function () {

            return {
                init: function () {

                    $modules = jQuery('.module-table');

                    $modules.each(function (key, val) {

                        var $module = jQuery(val),
                            $tables = $module.find('.table');

                        $tables.each(function (key, val) {

                            var $table = jQuery(val),
                                $tr = $table.find('tr'),
                                total = 0;

                            // Las celdas tienen como mínimo 190px de ancho a no ser que la tabla tenga la clase wysiwyg, que sube a 250
                            if ($table.hasClass('wysiwyg') === true) {
                                cellWidth = 250;
                            } else if ($table.hasClass('alwaysVisible') === true) {
                                if (window.innerWidth <= 930) {
                                    cellWidth = 150
                                }
                            }

                            $tr.each(function () {
                                var $row = jQuery(this),
                                    $cells = $row.find('th, td');

                                if ($cells.length > total) {
                                    total = $cells.length;
                                }
                            });

                            $table.css('min-width', (cellWidth * total) + 'px');

                        });

                    });

                }
            };
        }

        module.exports = moduleTable;
    }, {}], 31: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module team detail
        
        --------------------------------------------------------------------------- */
        var touchStartCoords = { 'x': -1, 'y': -1 },
            touchEndCoords = { 'x': -1, 'y': -1 },
            direction = 'undefined',
            minDistanceXAxis = 30,
            maxDistanceYAxis = 30,
            maxAllowedTime = 1000,
            startTime = 0,
            elapsedTime = 0;


        var moduleTeamDetail = new function () {

            return {
                init: function () {
                    targetElement = document.querySelector('.imageWrapper');

                    if ((typeof targetElement != 'undefined') && (targetElement != null)) {
                        moduleTeamDetail.addMultipleListeners(targetElement, 'mousedown touchstart', moduleTeamDetail.swipeStart);
                        moduleTeamDetail.addMultipleListeners(targetElement, 'mousemove touchmove', moduleTeamDetail.swipeMove);
                        moduleTeamDetail.addMultipleListeners(targetElement, 'mouseup touchend', moduleTeamDetail.swipeEnd);
                    }

                },

                swipeStart: function (e) {
                    e = e ? e : window.event;
                    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
                    touchStartCoords = { 'x': e.pageX, 'y': e.pageY };
                    startTime = new Date().getTime();
                },

                swipeMove: function (e) {
                    e = e ? e : window.event;
                    // e = ('changedTouches' in e)?e.changedTouches[0] : e;
                    // touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
                    // elapsedTime = new Date().getTime() - startTime;

                    // if (elapsedTime <= maxAllowedTime){
                    // 	if (Math.abs(touchEndCoords.x) >= minDistanceXAxis){
                    // 		console.log('x')
                    // 		e.preventDefault()
                    // 	}
                    // }
                },

                swipeEnd: function (e) {
                    e = e ? e : window.event;
                    e = ('changedTouches' in e) ? e.changedTouches[0] : e;
                    touchEndCoords = { 'x': e.pageX - touchStartCoords.x, 'y': e.pageY - touchStartCoords.y };
                    elapsedTime = new Date().getTime() - startTime;

                    if (elapsedTime <= maxAllowedTime) {
                        if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis) {
                            direction = (touchEndCoords.x < 0) ? 'left' : 'right';
                            switch (direction) {
                                case 'left':
                                    arrow = targetElement.querySelector('.next_link')
                                    href = arrow.getAttribute('href')
                                    hasClass = arrow.classList.contains('disabled')

                                    if (!hasClass) {
                                        window.open(href, '_self')
                                    }

                                    break;
                                case 'right':
                                    arrow = targetElement.querySelector('.prev_link')
                                    href = arrow.getAttribute('href')
                                    hasClass = arrow.classList.contains('disabled')

                                    if (!hasClass) {
                                        window.open(href, '_self')
                                    }
                                    break;
                            }
                        }
                    }
                },

                addMultipleListeners: function (el, s, fn) {
                    var evts = s.split(' ');
                    for (var i = 0, iLen = evts.length; i < iLen; i++) {
                        el.addEventListener(evts[i], fn, false);
                    }
                }
            }
        }

        module.exports = moduleTeamDetail
    }, {}], 32: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module team distributor
        
        --------------------------------------------------------------------------- */
        var commons = require('../modules/commons');

        var $module,
            $list,
            $blocks,
            $topBlocks,
            $newList,
            $prevButton,
            $nextButton,
            _minH,
            timer;

        var moduleTeamDistributor = new function () {

            return {
                init: function () {

                    $module = jQuery('.module-team-distributor');
                    $list = $module.find('.module-list');
                    $blocks = $module.find('.module-list_block');
                    $newList = "<div class='module-list-cloned'></div>";

                    $list.after($newList);

                    $newList = $module.find('.module-list-cloned');

                    // Creamos una nueva lista para el slider de elementos individuales que se muestra en smartphone
                    $blocks.each(function (key, val) {

                        var $block = jQuery(val),
                            $cloned = $block
                                .clone()
                                .attr('class', 'content_block');

                        $newList.append($cloned);

                    });

                    var autoplay = false;

                    if ($module.attr('data-autoplay') === 'true') {
                        autoplay = true;
                    }

                    // Creamos el slider
                    $list.slick({
                        dots: true,
                        speed: 400,
                        slidesToShow: 4,
                        infinite: false,
                        responsive: [
                            {
                                breakpoint: 930,
                                settings: {
                                    slidesToShow: 3
                                }
                            }
                        ],
                        autoplay: autoplay,
                        slidesToScroll: 1,
                        autoplaySpeed: 3500
                    });

                    $list.on('afterChange', function (event, slick, currentSlide, nextSlide) {

                        moduleTeamDistributor.resize();

                    });


                    // Creamos el slider para smartphone
                    $newList.slick({
                        dots: true,
                        speed: 400,
                        slidesToShow: 1,
                        infinite: true,
                        autoplay: autoplay,
                        slidesToScroll: 1,
                        autoplaySpeed: 3500
                    });

                },
                resize: function () {

                    clearTimeout(timer);

                    $topBlocks = $module.find('.module-list_block:first-child');

                    // Los bloques superiores se igualan en tamaño para que no se generen "saltos" entre elementos del slider
                    timer = setTimeout(function () {

                        $topBlocks.css('height', 'auto');

                        _minH = commons.getMaxHeight($topBlocks);

                        $topBlocks.css('height', _minH + 'px');

                    }, 100);

                }
            };
        }

        module.exports = moduleTeamDistributor;
    }, { "../modules/commons": 3 }], 33: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Module team distributor
        
        --------------------------------------------------------------------------- */
        var commons = require('../modules/commons');

        var $module,
            $list,
            $blocks,
            $topBlocks,
            $newList,
            _minH;

        var moduleTeam = new function () {

            return {
                init: function () {
                    moduleTeam.linkRedirection();
                },

                linkRedirection: function () {
                    var links = document.querySelectorAll('.module-team button.module_list-name');

                    [].forEach.call(links, function (link) {
                        link.addEventListener('click', function () {
                            link.parentNode.querySelector('.module-list_image').click();
                        });
                    });
                }
            };
        }

        module.exports = moduleTeam;
    }, { "../modules/commons": 3 }], 34: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Popup General CTA Access
        
        --------------------------------------------------------------------------- */

        var $html;

        var popupGeneralCtaAccess = new function () {

            return {

                init: function () {

                    $html = jQuery('html');

                    $html.on('click', '.popup-general-cta-access .popup_button', function () {

                        var $popup = jQuery('.popup-general-cta-access'),
                            $video = $popup.find('.popup_video'),
                            src = $video.attr('data-src'),
                            $iframe = '<div class="popup_content__iframe"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + src + '?autoplay=1&showinfo=0" frameborder="0" allowfullscreen></iframe></div>',
                            $wrap = jQuery('.mfp-wrap'),
                            $content = $wrap.find('.mfp-content'),
                            contentHeight = $content.outerHeight();

                        $popup
                            .addClass('video')
                            .css({
                                'height': $(window).outerHeight()
                            });

                        $video.append($iframe);

                        //$wrap.scrollTop((contentHeight / 2) - (window.window_height / 2));

                    });

                    $html.on('click', '.popup-general-cta-access .button_close_video', function () {

                        var $popup = jQuery('.popup-general-cta-access'),
                            $iframe = $popup.find('iframe');

                        $iframe.remove();
                        $popup
                            .removeClass('video')
                            .removeAttr('style');

                    });

                },
                setButtons: function () {

                    var $popup = jQuery('.popup-general-cta-access'),
                        $text = $popup.find('.popup_text'),
                        $buttons = $popup.find('.popup_buttons_list'),
                        $bottom = $popup.find('.popup_bottom');

                    $text
                        .clone()
                        .addClass('cloned')
                        .insertBefore($bottom);

                    $buttons
                        .clone()
                        .addClass('cloned')
                        .insertBefore($bottom);

                }
            };
        }

        module.exports = popupGeneralCtaAccess;
    }, {}], 35: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Popup Help
        
        --------------------------------------------------------------------------- */

        var popupHelp = new function () {

            return {

                init: function () {

                    jQuery('html').on('click', '.popup-help .close_popup-button', function () {

                        var $popup = $.magnificPopup.instance;

                        $popup.close();

                    });

                }
            };
        }

        module.exports = popupHelp;
    }, {}], 36: [function (require, module, exports) {
        var swipe = require('../lib/touchSwipe'),
            items = [],
            target;

        var slider = new function () {
            return {

                /* ---------------------------------------------------------------------------
        
                Este módulo inicializa un slider.
        
                Parámetros:
                    element: string,       ---> clase o id del slider ('.element'/'#element')
                    controls: boolean,     ---> mostrar o no las flechas de control (true/false)
                    pagination: boolean,   ---> mostrar o no la paginación (true/false)
                    paginationContent: string,   ---> clase o id del destino de la paginación
                    autoPlay: boolean,     ---> autoplay (true/false)
                    animation: string      ---> nombre de la animación.
                    loop                   ---> el carrusel va en bucle (true/false)
        
                --------------------------------------------------------------------------- */

                slider: function (config) {

                    target = jQuery(config.element);

                    //Variables por defecto
                    var control_right,
                        control_left,
                        currentItem;
                    var stopIsPlaying = true;
                    var isTouch = 'ontouchstart' in document.documentElement;
                    var isLoop = false;
                    var autoPlayInterval
                    var slides = jQuery(config.element).find('li').length;

                    if (config.controls === undefined) {
                        config.controls = true;
                    }
                    if (config.liveControls === undefined) {
                        config.liveControls = false;
                    }
                    if (config.pagination === undefined) {
                        config.pagination = false;
                    }
                    if (config.lazyLoad === undefined) {
                        config.lazyLoad = false;
                    }
                    if (config.imageControls === undefined) {
                        config.imageControls = false;
                    }
                    if (config.loop === undefined) {
                        config.loop = false;
                    }
                    if (config.autoPlay === undefined) {
                        config.autoPlay = false;
                    }
                    if (config.animation === undefined) {
                        config.animation = false;
                    }
                    if (config.overlay === undefined) {
                        config.overlay = true;
                    }

                    if (slides <= 1) {
                        config.controls = false;
                        config.liveControls = false;
                        config.pagination = false;
                    }

                    if (config.overlay === true) {
                        target
                            .find('.slider li')
                            .prepend("<div class='slider-overlay'></div>");
                    }

                    //Guardamos la lista de elementos en un array
                    target.children('ul').children('li').each(function () {
                        var elem = jQuery(this);
                        items.push(elem);
                    });

                    // Damos a la lista el tamaño de 100% * número de elementos del array
                    target.children('ul').css({
                        'width': (items.length * 100) + '%'
                    });

                    //Establecemos la imagen como background para que se adapte correctamente
                    jQuery.each(items, function (key, val) {
                        var _w = 100 / items.length,
                            _t = -100 * key;

                        val.closest('li').css({
                            'width': _w + '%'
                        });

                        jQuery(val).find('.module-list_container').css({
                            '-webkit-transform': 'translateX(' + _t + '%)',
                            'transform': 'translateX(' + _t + '%)'
                        });
                    });

                    //Añadimos el estilo de la animación
                    if (config.animation) {
                        target.addClass(config.animation);
                    }

                    //Controles
                    if (config.controls) {
                        var controlsTarget = config.controlsContent;
                        controlsWrapper = jQuery('<div class="slider_controls"></div>'),
                            controlPrev = jQuery('<button class="slider_control prev_control" />'),
                            controlNext = jQuery('<button class="slider_control next_control" />');

                        controlsWrapper.append(controlPrev);
                        controlsWrapper.append(controlNext);
                        controlsTarget.append(controlsWrapper);

                        controlPrev.on('click', function () {
                            clearInterval(autoPlayInterval);
                            target.trigger('goToPrev');
                        });

                        controlNext.on('click', function () {
                            clearInterval(autoPlayInterval);
                            target.trigger('goToNext');
                        });
                    }

                    //Paginación
                    if (config.pagination) {
                        if (config.paginationContent === undefined) {

                            var paginationWrapper = jQuery('<div class="slider_pagination"></div>');
                            target.append(paginationWrapper);
                            jQuery.each(items, function (key, val) {
                                var title = $(val).data('title')
                                var pageNumber = key + 1;
                                var pageLink = jQuery('<a href="#slider_page_' + pageNumber + '" id="slider_page_' + pageNumber + '" class="slider_page_' + pageNumber + '"><span class="slider_page_number">0' + pageNumber + '</span><span class="slider_page_title"><span>' + title + '</span></span></a>');
                                paginationWrapper.append(pageLink);
                                if (pageNumber === 1) {
                                    jQuery('.slider_page_' + pageNumber).addClass('active');
                                }

                                //Evento click de la paginación
                                pageLink
                                    .on('click touchstart', function (e) {
                                        e.preventDefault();

                                        if (stopIsPlaying) {
                                            currentItem = (key + 1);
                                            target.trigger('goTo');
                                        }

                                        //Detención del autoplay
                                        clearInterval(autoPlayInterval);
                                    })
                            });

                        } else {

                            jQuery.each(items, function (key, val) {
                                var title = $(val).data('title')
                                var pageNumber = key + 1;
                                var pageLink = jQuery('<a href="#slider_page_' + pageNumber + '" id="slider_page_' + pageNumber + '" class="slider_page_' + pageNumber + ' slider_page"><span class="slider_page_number">0' + pageNumber + '</span><span class="slider_page_title"><span class="slider_page_title-inner">' + title + '<i class="slider_arrow-title slider_arrow-title--right"></span></span></a>');
                                config.paginationContent.append(pageLink);
                                if (pageNumber === 1) {
                                    jQuery('.slider_page_' + pageNumber).addClass('active');
                                }

                                //Evento click de la paginación
                                pageLink
                                    .on('click touchstart', function (e) {
                                        e.preventDefault();

                                        if (stopIsPlaying) {
                                            currentItem = (key + 1);
                                            target.trigger('goTo');
                                        }

                                        //Detención del autoplay
                                        clearInterval(autoPlayInterval);
                                    }).on('mouseover', function (e) {
                                        if (window.innerWidth >= 1280) {
                                            setMenuNavWidth(jQuery(this))
                                        }
                                    }).on('mouseout', function (e) {
                                        resetMenuNavWidth(jQuery(this))
                                    });
                            });

                        }
                    }

                    // Set menu nav width
                    function setMenuNavWidth(el) {
                        var el_width = el.outerWidth(true)
                        var title = el.find('.slider_page_title')
                        var inner = title.find('.slider_page_title-inner')
                        var title_width = inner.outerWidth(true) + 20

                        if (title_width > el_width) {
                            el.css({ 'width': title_width + 'px' })
                        }
                        title.css({ 'width': title_width + 'px' })
                    }

                    // Reset menu nav width
                    function resetMenuNavWidth(el) {
                        var title = el.find('.slider_page_title')
                        title.css({ 'width': '0px' })
                        el.css({ 'width': 40 + 'px' })
                        //title.removeAttr('style')
                    }

                    //Autoplay

                    function setAutoPlay() {

                        clearInterval(autoPlayInterval);

                        autoPlayInterval = setInterval(function () {
                            if (currentItem < items.length) {
                                currentItem++;
                            } else {
                                currentItem = 1;
                                isLoop = true;
                            }
                            target.trigger('goTo');
                        }, config.interval);

                    }

                    if (config.autoPlay) {
                        setAutoPlay();
                    }

                    //Eventos táctiles
                    if (isTouch) {
                        target.find('.module-list').swipe({
                            swipeLeft: function () {
                                target.trigger('goToNext');
                            },
                            swipeRight: function () {
                                target.trigger('goToPrev');
                            },
                            threshold: 50
                        });
                    }

                    //Inicialización

                    //Definición de valores iniciales
                    jQuery.each(items, function (key, val) {
                        if (key === 0) {
                            val.addClass('active');
                            currentItem = 1;
                            if (config.controls && !config.loop) {
                                control_left.addClass('disabled');
                            }

                            if (config.controls === true) {
                                slider.updateButtons(target);
                            }
                        }
                    });

                    //Evento saltar entre los elementos del slider
                    target.on('goTo', function () {

                        if (target.hasClass('change') === false) {

                            target.addClass('change');

                            if (stopIsPlaying) {
                                jQuery(config.element).find('li').removeClass('outRight outLeft inRight inLeft');
                                //Añadimos las clases necesarias para realizar las animaciones CSS
                                jQuery.each(items, function (key, val) {
                                    if (val.hasClass('active')) {
                                        if (currentItem < (key + 1)) {
                                            if (!isLoop) {
                                                jQuery(config.element).find('li.active').addClass('outRight');
                                                jQuery(config.element).find('li.active').removeClass('active');
                                                items[(currentItem - 1)].addClass('active inRight');
                                            } else {
                                                isLoop = false;
                                                jQuery(config.element).find('li.active').addClass('outLeft');
                                                jQuery(config.element).find('li.active').removeClass('active');
                                                items[(currentItem - 1)].addClass('active inLeft');
                                            }
                                            stopIsPlaying = false;
                                        }
                                        if (currentItem > (key + 1)) {
                                            if (!isLoop) {
                                                jQuery(config.element).find('li.active').addClass('outLeft');
                                                jQuery(config.element).find('li.active').removeClass('active');
                                                items[(currentItem - 1)].addClass('active inLeft');
                                            } else {
                                                isLoop = false;
                                                jQuery(config.element).find('li.active').addClass('outRight');
                                                jQuery(config.element).find('li.active').removeClass('active');
                                                items[(currentItem - 1)].addClass('active inRight');
                                            }
                                            stopIsPlaying = false;
                                        }
                                    }
                                });

                                if (config.controls === true) {
                                    slider.updateButtons(target);
                                }

                                //Clases para deshabilitar los controles
                                if (config.controls && !config.loop) {
                                    if (currentItem === items.length) {
                                        control_right.addClass('disabled');
                                    } else if (control_right.hasClass('disabled')) {
                                        control_right.removeClass('disabled');
                                    }
                                    if (currentItem === 1) {
                                        control_left.addClass('disabled');
                                    } else if (control_left.hasClass('disabled')) {
                                        control_left.removeClass('disabled');
                                    }
                                }
                            }
                            jQuery(config.element).find('li.active').on('webkitAnimationEnd oAnimationEnd animationend', function () {
                                target.removeClass('change');
                                stopIsPlaying = true;
                                jQuery(config.element).find('li.outLeft').removeClass('outLeft');
                                jQuery(config.element).find('li.inLeft').removeClass('inLeft');
                                jQuery(config.element).find('li.outRight').removeClass('outRight');
                                jQuery(config.element).find('li.inRight').removeClass('inRight');
                            });

                            //desactivamos/activamos los bullets en función del activo
                            jQuery(config.element).find('.slider_page').removeClass('active');
                            jQuery(config.element).find('.slider_page_' + currentItem).addClass('active');

                        }

                        if (config.autoPlay) {
                            setAutoPlay();
                        }

                    });

                    //Avanzar
                    target.on('goToNext', function () {

                        if (target.hasClass('change') === true) {
                            return false;
                        }

                        if (!config.loop) {
                            if (currentItem < items.length) {
                                currentItem++;
                            }
                        } else {
                            if (currentItem < items.length) {
                                currentItem++;
                            } else {
                                currentItem = 1;
                                isLoop = true;
                            }
                        }
                        target.trigger('goTo');

                        //Detención del autoplay
                        clearInterval(autoPlayInterval);
                    });

                    //Retroceder
                    target.on('goToPrev', function () {

                        if (target.hasClass('change') === true) {
                            return false;
                        }

                        if (!config.loop) {
                            if (currentItem > 1) {
                                currentItem--;
                            }
                        } else {
                            if (currentItem > 1) {
                                currentItem--;
                            } else {
                                currentItem = items.length;
                                isLoop = true;
                            }
                        }
                        target.trigger('goTo');

                        //Detención del autoplay
                        clearInterval(autoPlayInterval);
                    });

                },
                updateButtons: function (slider) {
                    var jQueryslider = slider,
                        jQuerycontrols = jQueryslider.find('.slider_controls'),
                        jQueryprevBtn = jQueryslider.find('#slider_control_left'),
                        jQuerynextBtn = jQueryslider.find('#slider_control_right'),
                        jQueryactive = jQueryslider.find('li.active'),
                        jQueryprev = jQueryactive.prev(),
                        jQuerynext = jQueryactive.next();

                    if (jQueryactive.is(':first-child') === true) {
                        jQueryprev = jQueryslider.find('li:last-child');
                    } else if (jQueryactive.is(':last-child') === true) {
                        jQuerynext = jQueryslider.find('li:first-child');
                    }

                    jQueryprevBtn.find('span').html(jQueryprev.attr('data-title'));
                    jQuerynextBtn.find('span').html(jQuerynext.attr('data-title'));

                    jQuerycontrols.addClass('change');

                    setTimeout(function () {
                        jQuerycontrols.removeClass('change');
                    }, 820);
                }
            };
        }

        module.exports = slider;
    }, { "../lib/touchSwipe": 1 }], 37: [function (require, module, exports) {
        /* ---------------------------------------------------------------------------
        
        Tooltips
        
        --------------------------------------------------------------------------- */
        var $html,
            $body,
            $tooltips,
            $tooltipsContent;

        var tooltip = new function () {

            return {
                init: function () {

                    $html = jQuery('html');
                    $body = jQuery('body');
                    $tooltips = jQuery('.tooltip_button');
                    $tooltipsContent = jQuery('.tooltip_content');

                    // Para abrir o cerrar los tooltips
                    $body.on('click', '.tooltip_button', function (e) {

                        e.stopPropagation();

                        if (jQuery(e.target).is('a') === false) {

                            e.preventDefault();

                        }

                        var $tooltip = jQuery(this);

                        $tooltip.toggleClass('visible');

                        if ($tooltip.hasClass('visible') === true) {

                            tooltip.resize();

                            scrollTop = jQuery(window).scrollTop();

                            setTimeout(function () {
                                $html.addClass('hidden');
                            }, 10);

                            // Comprobamos si está dentro de una caja para gestionar la opacidad
                            tooltip.checkBoxTooltip($tooltip, 'open');

                            // Comprobamos si está dentro de una tabla para gestionar el comportamiento de la misma
                            tooltip.checkTableTooltip($tooltip, 'open');

                            // Esta función global es creada por Kabel para gestionar las llamadas al api de analytics
                            window.googleTagManagerCall($tooltip);

                        } else {

                            $html.removeClass('hidden');

                            // Comprobamos si está dentro de una caja para gestionar la opacidad
                            tooltip.checkBoxTooltip($tooltip, 'close');

                            // Comprobamos si está dentro de una tabla para gestionar el comportamiento de la misma
                            tooltip.checkTableTooltip($tooltip, 'close');

                        }

                    });

                    // Para cerrar los tooltips al clicar fuera de los mismos
                    $body.on('click', function () {

                        if ($html.hasClass('hidden') === true) {

                            $html.removeClass('hidden lock');

                            jQuery('#general').css({
                                'overflow': 'overflow',
                                'top': 0
                            });
                            jQuery('body, html').scrollTop(scrollTop);

                            var $tooltip = jQuery('.tooltip_button.visible'),
                                $tooltips = jQuery('.tooltip_button');;

                            $tooltips.removeClass('visible');

                            // Comprobamos si está dentro de una tabla para gestionar el comportamiento de la misma
                            tooltip.checkTableTooltip($tooltip, 'close');

                        }

                    });

                },
                checkBoxTooltip: function ($tooltip, action) {

                    // Gestión del tooltip en un chebkox tipo box

                    var $label = $tooltip.closest('.radio_box-label'),
                        $input = $label.siblings('input[type="radio"]'),
                        name = $input.attr('name'),
                        $inputs = jQuery('input[name="' + name + '"]'),
                        selected = false;

                    if ($input.is(':checked') === true) {

                        // Si está seleccionado este input, salimos de la función
                        return false;

                    } else {

                        // Si no lo está, comprobamos si alguno de los demás está seleccionado
                        $inputs.each(function () {

                            var $el = jQuery(this);

                            if ($el.is(':checked') === true) {

                                selected = true;

                            }

                        });

                        if (selected === false) {

                            // Si no hay seleccionado ningún, salimos de la función
                            return false;

                        }

                        // En caso contrario - hay seleccionado algún input que no sea del que desplegamos el tooltip -, en función de la acción mostramos o quitamos su opacidad
                        if (action === 'open') {

                            $label.css('opacity', 1);

                        } else {

                            $label.css('opacity', '');

                        }

                    }

                },
                checkTableTooltip: function ($tooltip, action) {

                    // Gestión del tooltip en una tabla

                    var $tableContainer = $tooltip.closest('.module-table_container');

                    // Si el tooltip está en una tabla
                    if ($tableContainer.length > 0) {

                        var _margin = 0,
                            table = $tableContainer.find('table');

                        if (action === 'open') {

                            _margin = $tableContainer.scrollLeft();

                            $tableContainer.addClass('tooltip');

                        } else {

                            $tableContainer.removeClass('tooltip');

                        }

                        table.css('margin-left', -_margin);

                    }

                },
                resize: function () {

                    $tooltipsContent.each(function () {

                        var $content = jQuery(this);

                        // Posicionamos el contenido en 100% para hacer el cálculo
                        $content.css('left', '100%');

                        // Hacemos los cálculos para ver si está pegado a la izquierda o derecha y lo colocamos correctamente
                        var left = $content.offset().left,
                            right = window.window_width - $content.offset().left - $content.outerWidth(),
                            leftCss;

                        if (left < 20) {

                            left = Math.abs(left);
                            leftCss = 'calc(100% + 20px + ' + left + 'px)';

                        } else if (right < 20) {

                            right = Math.abs($content.outerWidth() - (window.window_width - $content.offset().left));
                            leftCss = 'calc(100% - 30px - ' + right + 'px)';

                        } else {
                            leftCss = '100%';
                        }

                        $content.css('left', leftCss);

                    });

                }
            };
        }

        module.exports = tooltip;
    }, {}], 38: [function (require, module, exports) {
        var onLoad = function (functions) {
            jQuery(window).load(function () {
                functions();
            });
        };

        module.exports = onLoad;

    }, {}], 39: [function (require, module, exports) {
        var onReady = function (functions) {
            jQuery(document).ready(function () {
                functions();
            });
        };

        module.exports = onReady;

    }, {}], 40: [function (require, module, exports) {
        var onResize = function (functions) {

            /*------------------ Window dimensions ------------------*/

            window.window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            window.window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            /*------------------- On resize event -------------------*/
            jQuery(window).on('resize newResize', function (e) {
                // Comprobamos que ha habido resize en x, para evitar lanzarlo cuando las barras del navegador desaparecen (Chrome mobile).
                var nww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                if (nww !== window.window_width || e.type === 'newResize') {
                    jQuery('body').addClass('resizing');
                    functions();

                    clearTimeout(window.resizeTimer);
                    window.resizeTimer = setTimeout(function () {
                        jQuery('body').removeClass('resizing');
                    }, 500);

                    window.window_width = nww;
                    window.window_height = window.innerHeight;
                }
            });
            jQuery(document).ready(function () {
                functions();
            });
        };

        module.exports = onResize;

    }, {}], 41: [function (require, module, exports) {
        var onScroll = function (functions) {
            var scrolling = false;
            var timeOut,
                interval;

            if (!jQuery('body').hasClass('ie9') && !jQuery('body').hasClass('ie8')) {
                jQuery(window).on('scroll newScroll', function () {
                    clearTimeout(timeOut);

                    timeOut = setTimeout(function () {
                        //cancelAnimationFrame(interval);
                        scrolling = false;
                    }, 250);

                    if (scrolling === false) {
                        function animationFrame() {
                            functions();
                            //interval = requestAnimationFrame(animationFrame);
                        }
                        animationFrame();
                        scrolling = true;
                    }
                });
            }
            jQuery(document).ready(function () {
                functions();
            });
        };

        module.exports = onScroll;

    }, {}]
}, {}, [2]);
