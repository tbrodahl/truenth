upperBanner = require('./modules/upper-banner')
windowScroll = require('./modules/window-scroll')
navToggle = require('./modules/nav-toggle')

$ ->
  window.upperBanner = new upperBanner()
  window.windowScroll = new windowScroll()
  window.navToggle = new navToggle()
