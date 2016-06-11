(function () {
  $('.navbar-nav li').on('click', function (ev) {
    $('.navbar-nav li').removeClass('active');
    $(ev.currentTarget).addClass('active');
  });
})();