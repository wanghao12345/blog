// 引入 express 模块
var express = require('express');

// 使用express的Router()路由方法
var router = express.Router();

router.get('/user', function (req, res, next) {
  res.send('Admin-User');
});

module.exports = router;
