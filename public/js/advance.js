(function () {
	var box = $('.advance-view');
	var filesData = [];
	function addFiles(files) {
		var addItem = function (file) {
			let index = filesData.push(file) - 1;
			let fileReader = new FileReader();
	  		fileReader.onload = function (e) {
	  		let liNode = $('<li class="item" data-index='+ index +'><div class="del-btn"></div></li>');
	  			liNode.css('background-image', 'url("'+e.target.result+'")');
	  			$('ul', box).append(liNode);
	  		}
	  		fileReader.readAsDataURL(file);
		}
		for (let i = 0; i < files.length; ++i) {
			addItem(files[i]);	
		}
	}

	$('.file-upload', box).on('change', function (ev) {
		addFiles(this.files);
	});

	$('.img-preview').delegate('.del-btn', 'click', function (ev) {
		var imgNode = $(ev.currentTarget).parent('li');
		delete filesData[imgNode.attr('data-index')];
		imgNode.remove();
	});
	



	$('.submit-btn', box).on('click', function (ev) {
		ev.preventDefault();
	    var btnNode = $(this);
	    var formData = new FormData();
	    //var files = $('.file-upload', box)[0].files;
	   	formData.append('username', $("input[name='username']").val())
	   	formData.append('gender', $("input[name='gender']:checked").val());
	   	for (let i = 0; i < filesData.length; ++i) {
	   		if (filesData[i]) {
		   		formData.append('photo', filesData[i]);
		   	}
	   	}
	    var xhr = new XMLHttpRequest();

	    if (btnNode.hasClass('busboy')) {
	      xhr.open('post', '/busboyJson');
	    } else if (btnNode.hasClass('formidable')) {
	      xhr.open('post', '/formidableJson');
	    }
	    xhr.upload.onprogress = function (event) {
	    	if (event.lengthComputable) {
	    		$('progress',box).val(event.loaded * 100 / event.total);
		　　　}
	    };

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

	 $(document).on({ 
        dragleave:function(e){    //拖离 
            e.preventDefault(); 
        }, 
        drop:function(e){  //拖后放 
            e.preventDefault(); 
        }, 
        dragenter:function(e){    //拖进 
            e.preventDefault(); 
        }, 
        dragover:function(e){    //拖来拖去 
            e.preventDefault(); 
        } 
    }); 
	$('.img-preview', box).on({
		dragover: function (ev) {
			ev.preventDefault();
			$(this).addClass('active');
			return false;
		},
		dragenter: function (ev) {

		},
		dragleave: function (ev) {
			ev.preventDefault();
			$(this).removeClass('active');
			return false;
		},
		drop: function (ev) {
			ev.preventDefault();
			$(this).removeClass('active');
			var files = event.dataTransfer.files;
			//addFiles(files);
			$('.file-upload', box)[0].files = files;
			return false;
		}
	});
})();