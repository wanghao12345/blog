// 引入 express 模块
var express = require('express');

// 使用express的Router()路由方法
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('main/index', {
    userInfo: req.userInfo
  })
});

module.exports = router;
