module.exports = class UpperBanner
  constructor: ->
    @build()

  build: ->
    $('.js-close-upper-banner').on 'click touchstart', (e) ->
      e.preventDefault()
      $('html').addClass('is-upper-banner-closed')
