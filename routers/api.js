// 引入 express 模块
var express = require('express');

// 引入 user 用户model模型
var User = require('../models/User');

// 引入 content model模型
var Content = require('../models/Content');

// 使用express的Router()路由方法
var router = express.Router();

// 统一返回格式
var responseData;
// 初始化返回格式
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  };

  next();
});
/**
 * 用户注册
 *
 *    注册逻辑
 *      1.用户名不能为空
 *      2.密码不能为空
 *      3.两次输入密码必须一致
 *      4.用户是否已经被注册--数据库查询
 *
 */
router.post('/user/register', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;

  // 1.用户名不能为空
  if (username === '') {
    responseData.code = 1;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return;
  }

  // 2.密码不能为空
  if (password === '') {
    responseData.code = 2;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }

  // 3.两次输入密码必须一致
  if (password !== repassword) {
    responseData.code = 3;
    responseData.message = '两次输入的密码不一致';
    res.json(responseData);
    return;
  }

  // 4.数据库中查询用户名是否已经被注册
  User.findOne({
    username: username
  }).then(function (userInfo) {
    console.log(userInfo);
    if (userInfo) { // 数据库中有该记录
      responseData.code = 4;
      responseData.message = '用户名已经被注册了';
      res.json(responseData);
      return;
    }
    // 保存用户注册的信息到数据库中
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then(function (newUserInfo) {
    // 注册成功
    responseData.message = '注册成功';
    res.json(responseData);
  });
});

/**
 * 用户登录
 *
 *    登录逻辑
 *    1.用户名不能为空
 *    2.密码不能为空
 *    3.用户名是否存在，用户名密码是否存在--数据库查询
 */
router.post('/user/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  // 1.用户名不能为空
  if (username === '') {
    responseData.code = 1;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return;
  }

  // 2.密码不能为空
  if (password === '') {
    responseData.code = 2;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }

  // 3.数据库中查询
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 3;
      responseData.message = '用户名或密码错误';
      res.json(responseData);
      return;
    }
    // 用户名和密码是正确的
    responseData.message = '登录成功';
    responseData.userInfo= {
      _id: userInfo._id,
      username: userInfo.username
    };
    // 设置cookies
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }));
    res.json(responseData);
    return;
  });
});

/**
 * 用户退出登录
 */
router.get('/user/logout', function (req, res) {
  req.cookies.set('userInfo', null);
  res.json(responseData);
});

/**
 * 获取主页文章列表
 */
router.get('/home/article/list', function (req, res, next) {
  var page = req.query.page || 1;
  var limit = 10;
  Content.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('category', 'name')
    .populate('user', 'username')
    .sort({_id: -1})
    .then(function (contents) {
    res.json({
      code: 0,
      data: contents
    })
  });
});

module.exports = router;
