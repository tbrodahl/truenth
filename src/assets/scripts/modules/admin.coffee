loggedInAdminClass = 'is-showing-logged-in' # to html
loggedInClass = 'is-logged-in' # to body
upperBannerClosedClass = 'is-upper-banner-closed'

module.exports = class Admin
  constructor: ->
    @build()

  build: ->
    $('.js-mock-submit').on 'submit', (e) ->
      e.preventDefault()
      $(this).addClass('is-submitted')


    $(document).on 'keypress', (e) ->
      if e.which is 97 # 'a' pressed
        $('html').toggleClass(upperBannerClosedClass, !$('body').hasClass(loggedInClass))
        $('body').toggleClass(loggedInClass, !$('body').hasClass(loggedInClass))
        $('html').toggleClass(loggedInAdminClass, !$('html').hasClass(loggedInAdminClass))
