module.exports = class Resize
  constructor: ->
    $intro = $('.intro')
    $intro.imagesLoaded ->
      $(window).on 'resize.setElements', _.debounce (e) ->
        imgHeight = $intro.find('img').height()
        $intro.css('height', imgHeight)
      , 50
      .trigger('resize.setElements')
