(function (){
  var box = $('.simple-view');
  $('.file-upload', box).on('change', function (ev) {
    $('.photo-path', box).val($(this).val());
  });

  $('.submit-btn', box).on('click', function (ev) {
    var btnNode = $(this);
    var form = $('form', box)[0];
    if (btnNode.hasClass('busboy')) {
      form.action = '/busboy';
    } else if (btnNode.hasClass('formidable')) {
      form.action = '/formidable';
    }
    form.submit();
  });
})();