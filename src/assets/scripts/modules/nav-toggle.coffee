navExpandedClass = 'is-nav-expanded'

module.exports = class NavToggle
  constructor: ->
    # @build()

  build: ->
    $('.js-nav-menu-toggle').on 'click', (e) ->
      e.preventDefault()
      $('html').toggleClass(navExpandedClass, !$('html').hasClass(navExpandedClass))

    $("figure.nav-overlay").on 'click', (e) ->
      if $('html').hasClass(navExpandedClass)
        $('html').removeClass(navExpandedClass)
