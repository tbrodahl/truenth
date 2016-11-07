loggedInAdminClass = 'is-showing-logged-in' # to html
loggedInClass = 'is-logged-in' # to body
upperBannerClosedClass = 'is-upper-banner-closed'

module.exports = class Admin
  constructor: ->
    @build()

  build: ->
    $(document).on 'keypress', (e) ->
      if e.which is 97 # 'a' pressed
        $('html').toggleClass(upperBannerClosedClass, !$('body').hasClass(loggedInClass))
        $('body').toggleClass(loggedInClass, !$('body').hasClass(loggedInClass))
        $('html').toggleClass(loggedInAdminClass, !$('html').hasClass(loggedInAdminClass))
