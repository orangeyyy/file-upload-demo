var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var fs = require('fs');
var BusBoy = require('busboy');
var uuid = require('node-uuid');
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
  formidableReq(req, res, function (resultData) {
    res.render('result', resultData);
  });
});

router.post('/formidableJson',  function (req, res, next) {
  formidableReq(req, res, function (resultData) {
    res.send(resultData);
  });
});

router.post('/busboy', function (req, res, next) {
  busboyReq(req, res, function (resultData) {
    res.render('result', resultData);
  });
});

router.post('/busboyJson', function (req, res, next) {
  busboyReq(req, res, function (resultData) {
    res.send(resultData);
  });
});
function formidableReq (req, res, callback) {
  var form = new formidable.IncomingForm();
    form.uploadDir = path.resolve(__dirname, '../upload');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function(err, fields, files) {
      var imgs = [];
      if (files.photo) {
        if (util.isArray(files.photo)) {
          files.photo.forEach(function (item) {
             imgs.push('/' + path.basename(item.path));
          });
        } else {
          imgs.push('/' + path.basename(files.photo.path));
        }
      }

      callback({
        username: fields.username,
        gender: fields.gender,
        imgs: imgs
      });
    });
    form.on('fileBegin', function(name, file) {
      var uploadName = uuid.v1() + path.extname(file.name);
      file.path = path.resolve(__dirname, '../upload/'+uploadName);
    });
    form.on('file', function (name, file) {

    });
    form.on('field', function (name, value) {

    });
    form.on('progress', function (bytesReceived, bytesExpected) {

    });
    form.on('end', function () {

    });
}

function busboyReq (req, res, callback) {
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
      var uploadName = uuid.v1() + path.extname(filename);
      var saveTo = path.resolve(__dirname, '../upload/'+uploadName);
      resultData.imgs.push('/' + uploadName);
      file.pipe(fs.createWriteStream(saveTo));
   });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      resultData[fieldname] = val;
      console.log('Field [' + fieldname + ']: value: ' + util.inspect(val));
    });
    busboy.on('finish', function() {
      callback(resultData);
      res.render('result', resultData);
    });
    req.pipe(busboy);
}

module.exports = router;
