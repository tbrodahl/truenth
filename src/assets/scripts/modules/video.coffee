navExpandedClass = 'is-nav-expanded'

module.exports = class Video
  constructor: ->
    @build()

  build: ->
    console.log 'build'
    $('.js-video-toggle').on 'click', (e) ->
      e.preventDefault()
      $div = $(this).closest('[data-iframe-src]')
      src = $div.data('iframe-src')
      $div.append("<iframe src='#{src}' allowfullscreen frameborder='0' />")
      .addClass('is-js-video-active')
