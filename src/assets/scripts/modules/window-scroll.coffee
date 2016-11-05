module.exports = class WindowScroll
  constructor: ->

    checkScroll = _.debounce ->
      if $('.upper-banner').outerHeight() > 0 then offset =  $('.upper-banner').outerHeight() else offset = 0
      # console.log 'offset', offset
      if $(window).scrollTop() <= offset
        $('html').removeClass('is-scrolled')
      else
        $('html').addClass('is-scrolled')
    , 0
    $(window).on('scroll', checkScroll)
