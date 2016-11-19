navExpandedClass = 'is-nav-expanded'

module.exports = class NavToggle
  constructor: ->
    @build()

  build: ->
    $('.js-nav-menu-toggle').on 'click', (e) ->
      e.preventDefault()
      $('html').toggleClass(navExpandedClass, !$('html').hasClass(navExpandedClass))

    $("figure.nav-overlay, .js-close-nav").on 'click', (e) ->
      if $('html').hasClass(navExpandedClass)
        $('html').removeClass(navExpandedClass)

    $('.side-nav a').not('[data-toggle=modal]').on 'click touchend', (e) ->
      e.preventDefault()
      href = $(this).attr('href')
      $('html').removeClass(navExpandedClass)
      setTimeout ->
        window.location = href
      , 1000

    $('.side-nav a[data-toggle=modal]').on 'click touchend', (e) ->
      e.preventDefault()
      target = $(this).attr('data-target')
      $('html').removeClass(navExpandedClass)
      setTimeout ->
        $(target).modal('show')
      , 500
