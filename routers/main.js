// 引入 express 模块
var express = require('express');

// 引入 category model模块
var Category = require('../models/Category');

// 引入 content model模块
var Content = require('../models/Content');

// 引入 comment model模块
var Comment = require('../models/Comment');

// 使用express的Router()路由方法
var router = express.Router();

/**
 * 前端首页
 */
router.get('/', function (req, res, next) {
  Category.find().then(function (categories) {
    res.render('main/index', {
      userInfo: req.userInfo,
      categories: categories
    })
  });
});

/**
 * 文章详情
 */
router.get('/article/detail', function (req, res, next) {
  var id = req.query.id;
  Content.findOne({_id: id}).then(function (content) {
    var views = content.views + 1;
    Category.find().then(function (categories) {
      Content.update({
        _id: id
      },{
        views: views
      }).then(function (result) {
        res.render('main/article/article_detail', {
          userInfo: req.userInfo,
          categories: categories
        });
      })
    });
  });
});

/**
 * 获取文章详情
 */
router.get('/article/get_detail', function (req, res, next) {
  var id = req.query.id;
  Content.findOne({_id: id})
    .populate('category', 'name')
    .populate('user', 'username')
    .then(function (contents) {
      Comment.find({content: id}).then(function (comments) {
        var data = {};
        data.comments = comments.length;
        data.contents = contents;
        res.json({
          code: 0,
          data: data
        })
      });
  });
});



module.exports = router;
