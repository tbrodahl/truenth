upperBanner = require('./modules/upper-banner')
windowScroll = require('./modules/window-scroll')
windowResize = require('./modules/window-resize')
navToggle = require('./modules/nav-toggle')
global = require('./modules/global')
admin = require('./modules/admin')
video = require('./modules/video')

$ ->
  window.app ?= {}
  window.app.global = new global()
  window.app.upperBanner = new upperBanner()
  window.app.windowScroll = new windowScroll()
  window.app.windowResize = new windowResize()
  window.app.navToggle = new navToggle()
  window.app.admin = new admin()
  window.app.video = new video()
