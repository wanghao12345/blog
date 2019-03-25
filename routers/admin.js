// 引入 express 模块
var express = require('express');

// 使用express的Router()路由方法
var router = express.Router();

// 验证管理员权限是否可以进入
router.use(function (req, res, next) {
  if (!req.userInfo.isAdmin) {
    // 如果当前用户是非管理员
    res.send('对不起，只有管理员才可以进入后台管理系统');
    return;
  }
  next();
});

// 后台首页
router.get('/', function (req, res, next) {
  console.log(req.userInfo);
  res.render('admin/index', {
    userInfo: req.userInfo
  });
});

module.exports = router;
