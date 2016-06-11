var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var fs = require('fs');
var BusBoy = require('busboy');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('simple');
});
router.get('/ajax', function (req, res, next) {
  res.render('ajax');
});

router.get('/advance', function (req, res, next) {
  res.render('advance');
});

router.get('/result', function (req, res, next) {
  res.render('result', {
    username: 'orangexxx',
    gender: 'male',
    imgs : [
      '/19.9元.jpg',
      '/upload_26e7efba9809184dcb30fec343805caf.jpg',
      '/upload_47e83a7501d291655a12ffc6ecfed752.jpg'
    ]
  });
});

router.post('/formidable', function (req, res, next) {
  var form = new formidable.IncomingForm();
    form.uploadDir = path.resolve(__dirname, '../upload');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function(err, fields, files) {
      var imgs = [];
      files.photo.forEach(function (item) {
         imgs.push('/' + path.basename(item.path));
      });
      res.render('result', {
        username: fields.username,
        gender: fields.gender,
        imgs: imgs
      });
    });
    form.on('file', function (name, file) {

    });
    form.on('field', function (name, value) {

    });
    form.on('progress', function (bytesReceived, bytesExpected) {

    });
    form.on('end', function () {

    });
});

router.post('/busboy', function (req, res, next) {
  var busboy = new BusBoy({
     headers: req.headers
   });
  var resultData = {
    imgs: []
  };
   busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
     console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
      var saveTo = path.resolve(__dirname, '../upload/'+filename);
      resultData.imgs.push('/' + filename);
      file.pipe(fs.createWriteStream(saveTo));
   });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      resultData[fieldname] = val;
      console.log('Field [' + fieldname + ']: value: ' + util.inspect(val));
    });
    busboy.on('finish', function() {
      res.render('result', resultData);
    });
    req.pipe(busboy);
});
function formidableReq (req, res) {

}

function busboyReq (req, res) {

}

module.exports = router;
