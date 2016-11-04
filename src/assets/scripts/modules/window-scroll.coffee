module.exports = class WindowScroll
  constructor: ->

    checkScroll = _.debounce ->

      if $(window).scrollTop() < 75
        $('html').removeClass('is-scrolled')
      else
        $('html').addClass('is-scrolled')
    , 0
    # $(window).on('scroll', checkScroll)
