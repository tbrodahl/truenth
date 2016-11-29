navExpandedClass = 'is-nav-expanded'

module.exports = class Video
  constructor: ->
    @build()

  build: ->
    $('.js-video-toggle a').on 'click', (e) -> e.preventDefault()
    $('.js-video-toggle').on 'click', (e) ->
      e.preventDefault()
      $('html').addClass('is-video-active')
      $div = $(this)
      src = $div.data('iframe-src')
      $div.append("<iframe src='#{src}' allowfullscreen frameborder='0' />")
      .addClass('is-js-video-active')
