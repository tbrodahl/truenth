module.exports = class Resize
  constructor: ->
    $intro = $('.intro')
    $intro.imagesLoaded ->
      $(window).on 'resize.setElements', _.debounce (e) ->
        if $(window).width() <= 767
          imgHeight = $intro.find('img.intro__img--mobile').height()
        else
          imgHeight = $intro.find('img.intro__img--desktop').height()
        $intro.css('height', imgHeight)
      , 50
      .trigger('resize.setElements')
