upperBanner = require('./modules/upper-banner');
windowScroll = require('./modules/window-scroll');

$ ->
  window.upperBanner = new upperBanner()
  window.windowScroll = new windowScroll()
