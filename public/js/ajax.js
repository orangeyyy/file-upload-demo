(function () {
  var box = $('.simple-view');
  $('.file-upload', box).on('change', function (ev) {
    $('.photo-path', box).val($(this).val());
  });

  $('.submit-btn', box).on('click', function (ev) {
    var btnNode = $(this);
    var form = $('form', box)[0];
    var typeInput = $('.method-type', box);
    var formData = new FormData(form);
    var xhr = new new XMLHttpRequest();

    if (btnNode.hasClass('busboy')) {
      xhr.open('post', '/busboy');
    } else if (btnNode.hasClass('formidable')) {
      xhr.open('post', '/formidable');
    }
    xhr.send(formData);

  });
})();