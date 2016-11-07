upperBanner = require('./modules/upper-banner')
windowScroll = require('./modules/window-scroll')
windowResize = require('./modules/window-resize')
navToggle = require('./modules/nav-toggle')
global = require('./modules/global')

$ ->
  window.global = new global()
  window.upperBanner = new upperBanner()
  window.windowScroll = new windowScroll()
  window.windowResize = new windowResize()
  window.navToggle = new navToggle()
