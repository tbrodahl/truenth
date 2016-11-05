module.exports = class Resize
  constructor: ->
    $intro = $('.intro')
    $intro.imagesLoaded ->
      $(window).on 'resize.setElements', (e) ->
        imgHeight = $intro.find('img').height()
        console.log 'imgHeight', imgHeight
        $intro.css('height', imgHeight)
      .trigger('resize.setElements')
