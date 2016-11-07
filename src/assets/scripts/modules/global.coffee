config = require('../config')

module.exports = class Global
  constructor: ->
    @addFX()
    @bindEvents()

  addFX: ->

    $.extend($.easing, window.easing)

  bindEvents: ->
    $('.intro__down').on 'click', (e) ->
      e.preventDefault()
      $target = $('.home-intro .intro')
      position = $target.offset().top + $target.outerHeight() - $('.header').outerHeight()
      $('html,body').animate
        scrollTop: position
      , config.fx.speed.mid, config.fx.easing
