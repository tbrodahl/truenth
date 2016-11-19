config = require('../config')

module.exports = class Global
  constructor: ->
    @addFX()
    @addPlugins()
    @bindEvents()

  addFX: ->
    $.extend($.easing, window.easing)

  addPlugins: ->
    $('.modal').on('show.bs.modal', (e) ->
      $(this).addClass('is-modal-active')
    )
    $('.modal').on('hide.bs.modal', (e) ->
      $this = $(this)
      setTimeout ->
        $this.removeClass('is-modal-active')
      , 200

    )


  bindEvents: ->
    $('.js-scroll-down').on 'click', (e) ->
      e.preventDefault()
      $target = $($(this).attr('data-target'))
      position = $target.offset().top + $target.outerHeight() - 92
      $('html,body').animate
        scrollTop: position
      , config.fx.speed.mid, config.fx.easing

    # $('nav.side-nav').simplerSidebar
    #   top: 0,
    #   align: 'left'
    #   animation:
    #     duration: 250
    #     easing: 'easeOutExpo'
    #   sidebar:
    #     width: if $(window).width() < 640 then 311 else 495
    #   selectors:
    #     trigger: '.js-nav-menu-toggle',
    #     quitter: 'a'
