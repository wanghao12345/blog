// 引入 express 模块
var express = require('express');

// 引入 user model模块
var User = require('../models/User');

// 引入 category model模块
var Category = require('../models/Category');

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
  /**
   * 从数据库中读取用户数据
   *
   * limit(Number): 限制获取的数据条数
   * skip(Number): 忽略数据的条数
   *
   * 每页显示2条
   *  1:  1-2 skip: 0
   *  2:  3-4 skip: 2
   *  3:  5-6 skip: 4
   *  n:  ... skip: (当前页 - 1) * limit
   */

  var page = Number(req.query.page || 1);
  var limit = 10;
  var pages = 0;

  User.count().then(function (count) {
    // 计算总页数
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能低于1
    page = Math.max(page, 1);

    // 忽略条数
    var skip = (page - 1) * limit;

    User.find().limit(limit).skip(skip).then(function (users) {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        // 分页参数
        page: page,
        pages: pages,
        limit: limit,
        count: count,
        pageUrl: '/admin/user'
      });
    });
  });
});

/**
 * 分类首页
 * @type {Router|router}
 */
router.get('/category', function (req, res, next) {



  var page = Number(req.query.page || 1);
  var limit = 10;
  var pages = 0;

  Category.count().then(function (count) {
    // 计算总页数
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能低于1
    page = Math.max(page, 1);

    // 忽略条数
    var skip = (page - 1) * limit;

    Category.find().limit(limit).skip(skip).then(function (categories) {
      console.log(categories);
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        // 分页参数
        page: page,
        pages: pages,
        limit: limit,
        count: count,
        pageUrl: '/admin/category'
      });
    });
  });
});

/**
 * 添加分类
 */
router.get('/category/add', function (req, res, next) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  });
});

/**
 * 保存分类
 */
router.post('/category/add', function (req, res, next) {

  var name = req.body.name || '';

  // 1.分类名是否为空
  if (name === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空'
    });
    return;
  }

  // 2.查看数据库中是否有同名分类名称
  Category.findOne({
    name: name
  }).then(function (rs) {
    if (rs) {
      // 数据库中已经存在该分类
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类已经存在'
      });
      return Promise.reject();
    } else {
       // 数据库中不存在该分类，可以保存
      return new Category({
        name: name
      }).save();
    }
  }).then(function (newCategory) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    });
  })

});

/**
 * 分类修改
 */
router.get('/category/edit', function (req, res, next) {
  // 获取要修改的分类信息，并且用表单的形式展现出来
  var id = req.query.id;

  Category.findOne({
    _id: id
  }).then(function (category) {
    if (!category){
      res.render('/admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      });
      return Promise.reject();
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      });
    }
  });
});


/**
 * 分类修改保存
 */
router.post('/category/edit', function (req, res, next) {
  var id = req.query.id || '';
  var name = req.body.name || '';

  // 1.查看分类信息是否存在
  Category.findOne({
    _id: id
  }).then(function (category) {
    if (!category){
      res.render('/admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      });
      return Promise.reject();
    } else {
      if (name === category.name) {// 当用户没有修改
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/category'
        });
        return Promise.reject();
      } else { // 用户修改
        // 要修改的分类名称是否已经再数据库中存在
        return Category.findOne({
          _id: id,
          name: name
        });
      }
    }
  }).then(function (sameCategory) {
    if (sameCategory) {
      res.render('/admin/error', {
        userInfo: req.userInfo,
        message: '数据库中已经存在同名分类'
      });
      return Promise.reject();
    } else {
      Category.update({
        _id: id
      }, {
        name: name
      }).then(function (status) {
        console.log(status);
      })
    }
  }).then(function () {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '修改成功',
      url: '/admin/category'
    });
  });
});




/**
 * 分类删除
 */
router.get('/admin/category/delete', function (req, res, next) {
  res.render('admin/category_delete', {
    userInfo: req.userInfo
  });
});




module.exports = router;
