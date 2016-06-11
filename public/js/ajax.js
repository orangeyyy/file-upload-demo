(function () {
  var box = $('.ajax-view');
  $('.file-upload', box).on('change', function (ev) {
    $('.photo-path', box).val($(this).val());
  });

  $('.submit-btn', box).on('click', function (ev) {
    ev.preventDefault();
    var btnNode = $(this);
    var form = $('form', box)[0];
    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();

    if (btnNode.hasClass('busboy')) {
      xhr.open('post', '/busboyJson');
    } else if (btnNode.hasClass('formidable')) {
      xhr.open('post', '/formidableJson');
    }
    
    xhr.onreadystatechange = function(){
      if ( xhr.readyState == 4 && xhr.status == 200 ) {
        var resultData = JSON.parse(xhr.responseText);
　　　　　var resultNode = $('<div class="result-content"></div>');
        resultNode.append($('<label class="title"> result</label>'));
        resultNode.append($('<div class="text username">username: '+ resultData.username+'</div>'));
        resultNode.append($('<div class="text gender">gender: ' + resultData.gender + '</div>'));
        var imgListNode = $('<div class="img-list"></div>');
        resultData.imgs.forEach(function (item) {
          imgListNode.append($('<div class="img" style="background-image: url(\''+ item +'\')"></div>'));
        });
        resultNode.append(imgListNode);
        box.append(resultNode);
　　　　}  
    }
    xhr.send(formData);

  });
})();