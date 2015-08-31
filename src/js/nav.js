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
    TOGGLE_ELEMENT: 'c-hamburger',
    TOGGLE_ACTIVE_CLASS: 'c-hamburger--close'
  };

  // Elements
  var toggle = document.querySelector('.' + defaults.TOGGLE_ELEMENT); // the hamburger
  if (toggle && toggle.hasAttribute('data-toggle') && toggle.hasAttribute('data-toggle-class')) {
    var nav = document.querySelector('#' + toggle.getAttribute('data-toggle')); // the navigation
    var toggleTargetClass = toggle.getAttribute('data-toggle-class'); // the class that animates the navigation in/out
  }

  //
  // Methods
  //

  /**
   * Toggle the Nav
   * @private
   */
  var toggleNav = function(event) {

    // check if the clicked element is the hamburger
    if (event.target === toggle) {

      // if the nav doesn't contain the active class then add it
      if (!nav.classList.contains(toggleTargetClass)) {

        // first make the nav visible
        nav.style.display = 'block';

        // then animate it by adding the active class
        window.setTimeout(function() {
          nav.classList.add(toggleTargetClass);
          toggle.classList.add(settings.TOGGLE_ACTIVE_CLASS);
        }, 10);

        return;

        // if the nav contains the active class then remove it
      } else if (nav.classList.contains(toggleTargetClass)) {

        nav.classList.remove(toggleTargetClass);
        toggle.classList.remove(settings.TOGGLE_ACTIVE_CLASS);

        window.setTimeout(function() {
          nav.style.display = 'none';
        }, 400);

        return;
      }

      // if the clicked element isn't the hamburger && the nav has the active class, then remove it
    } else if (nav.classList.contains(toggleTargetClass) && toggle.classList.contains(settings.TOGGLE_ACTIVE_CLASS)) {

      nav.classList.remove(toggleTargetClass);
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
