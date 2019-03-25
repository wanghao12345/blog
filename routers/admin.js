// 引入 express 模块
var express = require('express');

// 引入 user model模块
var User = require('../models/User');

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

/**
 * 首页
 */
router.get('/', function (req, res, next) {
  res.render('admin/index', {
    userInfo: req.userInfo
  });
});

/**
 * 用户管理
 */
router.get('/user', function (req, res, next) {
  User.find().then(function (users) {
    console.log(users);
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users: users
    });
  })
});



module.exports = router;
