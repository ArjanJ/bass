(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['buoy'], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(require('buoy/dist/js/buoy'));
  } else {
    root.nav = factory(root, root.buoy);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {

  'use strict';

  //
  // Variables
  //

  var Nav = {}; // Object for public APIs
  var supports = !!document.querySelector && !!global.addEventListener; // Feature test
  var settings; // Placeholder variables

  // Default settings
  var defaults = {
    callbackBefore: function() {},
    callbackAfter: function() {}
  };

  // css classes
  var cssClasses = {
  	NAV:               'c-nav',
  	NAV_ACTIVE:        'c-nav--active',
    NAV_IS_ANIMATING:  'c-nav--is-animating',
  	HAMBURGER:         'c-hamburger',
  	HAMBURGER_CLOSE:   'c-hamburger--close',
    HAMBURGER_LINES:   'c-hamburger__lines'
  };

  var toggle = document.querySelector('.' + cssClasses.HAMBURGER);
  var dataToggle = toggle.getAttribute('data-toggle');
  var nav;
  if (dataToggle && dataToggle.length) {
    nav = document.querySelector('#' + dataToggle);
  } else {
    throw new Error('data-toggle attribute missing.');
  }

  //
  // Methods
  //

  /**
   * Toggle the Nav
   * @private
   */
  var toggleNav = function(event) {

    if (event.target === toggle && !nav.classList.contains(cssClasses.NAV_ACTIVE)) {

      nav.classList.add(cssClasses.NAV_ACTIVE);

      global.setTimeout(function() {
        nav.classList.add(cssClasses.NAV_IS_ANIMATING);
        toggle.classList.add(cssClasses.HAMBURGER_CLOSE);
      }, 10);

      return;
    } else if (event.target == toggle && nav.classList.contains(cssClasses.NAV_ACTIVE)) {

      nav.classList.remove(cssClasses.NAV_IS_ANIMATING);
      toggle.classList.remove(cssClasses.HAMBURGER_CLOSE);

      global.setTimeout(function() {
        nav.classList.remove(cssClasses.NAV_ACTIVE);
      }, 500);
    }

    if (nav.classList.contains(cssClasses.NAV_ACTIVE) && toggle.classList.contains(cssClasses.HAMBURGER_CLOSE)) {

      nav.classList.remove(cssClasses.NAV_IS_ANIMATING);
      toggle.classList.remove(cssClasses.HAMBURGER_CLOSE);

      global.setTimeout(function() {
        nav.classList.remove(cssClasses.NAV_ACTIVE);
      }, 500);
    }

  };


  /**
   * Handle events
   * @private
   */
  var eventHandler = function(event) {

  	if (event.type === 'click') {
  		toggleNav(event);
  	}

  };

  /**
   * Destroy the current initialization.
   * @public
   */
  Nav.destroy = function() {

    // If plugin isn't already initialized, stop
    if (!settings) return;

    // Remove init class for conditional CSS
    document.documentElement.classList.remove(settings.initClass);

    // @todo Undo any other init functions...

    // Remove event listeners
    document.removeEventListener('click', eventHandler, false);

    // Reset variables
    settings = null;

  };

  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  Nav.init = function(options) {

    // feature test
    if (!supports) return;

    // Destroy any existing initializations
    Nav.destroy();

    // Merge user options with defaults
    settings = buoy.extend(defaults, options || {});

    // Add class to HTML element to activate conditional CSS
    // document.documentElement.classList.add(settings.initClass);

    // Listen for click events
    document.addEventListener('click', eventHandler, false);

  };


  //
  // Public APIs
  //

  return Nav;

});
