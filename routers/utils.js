// 引入 express 模块
var express = require('express');

// 引入 multiparty 模块
var multiparty = require('multiparty');

// 使用express的Router()路由方法
var router = express.Router();

router.post('/upload/img', function (req, res, next) {

  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/upload/'});
  //上传完成后处理
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('parse error: ' + err);
    } else {
      var inputFile = files.file[0];

      var uploadedPath = inputFile.path;
      res.json({
        error: 0,
        code: 0,
        path: '\\' + uploadedPath,
        url: 'http://localhost:8081\\' + uploadedPath
      })
    }
  });

});

module.exports = router;
