(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['buoy/dist/js/buoy'], factory());
  } else if (typeof exports === 'object') {
    module.exports = factory(require('buoy/dist/js/buoy'));
  } else {
    root.Nav = factory(root.buoy);
  }
})(this, function(buoy) {

  'use strict';

  //
  // Variables
  //

  var Nav = {}; // Object for public APIs
  var supports = !!document.querySelector && !!window.addEventListener; // Feature test
  var settings; // Placeholder variables

  // Default settings
  var defaults = {
    NAV_ELEMENT: 'c-nav',
    NAV_ACTIVE_CLASS: 'c-nav--active',
    TOGGLE_ELEMENT: 'c-hamburger',
    TOGGLE_ACTIVE_CLASS: 'c-hamburger--close'
  };

  //
  // Methods
  //

  /**
   * Toggle the Nav
   * @private
   */
  var toggleNav = function(event) {

    var toggle = document.querySelector('.' + settings.TOGGLE_ELEMENT);
    var nav = document.querySelector('.' + settings.NAV_ELEMENT);

    if (toggle && event.target === toggle || toggle && event.target === toggle.children[0]) {
      if (!nav.classList.contains(settings.NAV_ACTIVE_CLASS)) {

        nav.style.display = 'block';

        window.setTimeout(function() {
          nav.classList.add(settings.NAV_ACTIVE_CLASS);
          toggle.classList.add(settings.TOGGLE_ACTIVE_CLASS);
        }, 10);

        return;
      } else if (nav.classList.contains(settings.NAV_ACTIVE_CLASS)) {

        nav.classList.remove(settings.NAV_ACTIVE_CLASS);
        toggle.classList.remove(settings.TOGGLE_ACTIVE_CLASS);

        window.setTimeout(function() {
          nav.style.display = 'none';
        }, 400);

        return;
      }
    }

    if (nav.classList.contains(settings.NAV_ACTIVE_CLASS) && toggle.classList.contains(settings.TOGGLE_ACTIVE_CLASS)) {

      nav.classList.remove(settings.NAV_ACTIVE_CLASS);
      toggle.classList.remove(settings.TOGGLE_ACTIVE_CLASS);

      window.setTimeout(function() {
        nav.style.display = 'none';
      }, 400);
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

    // Listen for click events
    document.addEventListener('click', eventHandler, false);

  };


  //
  // Public APIs
  //

  return Nav;

});
