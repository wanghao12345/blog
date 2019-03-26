// 引入 express 模块
var express = require('express');

// 引入 category model模块
var Category = require('../models/Category')

// 使用express的Router()路由方法
var router = express.Router();

router.get('/', function (req, res, next) {
  Category.find().then(function (categories) {
    res.render('main/index', {
      userInfo: req.userInfo,
      categories: categories
    })
  });
});

module.exports = router;
