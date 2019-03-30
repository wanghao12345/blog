// 引入 express 模块
var express = require('express');

// 引入 user model模块
var User = require('../models/User');

// 引入 category model模块
var Category = require('../models/Category');

// 引入 content model 模块
var Content = require('../models/Content');

// 引入 comment model 模块
var Comment = require('../models/Comment');

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
 * 分类管理首页
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
          name: name
        });
      }
    }
  }).then(function (sameCategory) {
    if (sameCategory) {
      res.render('admin/error', {
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
  }).then(function (result) {
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
router.get('/category/delete', function (req, res, next) {
  var id = req.query.id || '';

  if (id === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '该分类信息不存在'
    })
  }

  Category.remove({
    _id: id
  }).then(function (err) {
    if (err) {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '删除成功',
        url: '/admin/category'
      })
    } else {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '删除失败'
      })
    }
  })
});

/**
 * 内容管理首页
 */
router.get('/content', function (req, res, next) {
  var category = req.query.category || '';

  var query = {};
  if (category !== '') {
    query.category = category;
  }

  var page = Number(req.query.page || 1);
  var limit = 10;
  var pages = 0;

  Content.count(query).then(function (count) {
    // 计算总页数
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能低于1
    page = Math.max(page, 1);

    // 忽略条数
    var skip = (page - 1) * limit;

    Content.find(query).limit(limit).skip(skip).populate(['category', 'user']).sort({addTime: -1}).then(function (contents) {
      // 查询分类
      Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_index', {
          userInfo: req.userInfo,
          categories: categories,
          contents: contents,
          // 分页参数
          page: page,
          pages: pages,
          limit: limit,
          count: count,
          pageUrl: '/admin/content'
        });
      });
    });
  });
});

/**
 * 内容添加
 */
router.get('/content/add', function (req, res, next) {
  Category.find().sort({_id: -1}).then(function (categories) {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    });
  });
});

/**
 * 内容增加保存
 */
router.post('/content/add', function (req, res, next) {
  var category = req.body.category || '';
  var title = req.body.title || '';
  var titleImg = req.body.titleImg || '';
  var description = req.body.description;
  var content = req.body.content;

  if (category === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '分类信息不能为空'
    })
  }

  if (title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '标题不能为空'
    })
  }

  new Content({
    category: category,
    title: title,
    user: req.userInfo._id.toString(),
    description: description,
    titleImg: titleImg,
    content: content
  }).save(function (result) {
    res.json({
      code: 0,
      message: '内容保存成功'
    })
  })

});

/**
 * 内容修改
 */
router.get('/content/edit', function (req, res, next) {
  var id = req.query.id;

  Content.findOne({_id: id}).then(function (content) {
    Category.find().sort({_id: -1}).then(function (categories) {
      res.render('admin/content_edit', {
        userInfo: req.userInfo,
        categories: categories,
        content: content
      });
    });
  });
});

/**
 * 获取单个内容
 */
router.get('/content/getContent', function (req, res, next) {
  var id = req.query.id;

  Content.findOne({_id: id}).then(function (content) {
    res.json({
      code: 0,
      data: content
    })
  });
});

/**
 * 保存修改
 */
router.post('/content/edit', function (req, res, next) {
  var id = req.body.id || '';
  var category = req.body.category || '';
  var title = req.body.title || '';
  var titleImg = req.body.titleImg || '';
  var description = req.body.description;
  var content = req.body.content;

  if (category === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '分类信息不能为空'
    })
  }

  if (title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '标题不能为空'
    })
  }

  Content.update({
    _id: id
  },{
    category: category,
    title: title,
    titleImg: titleImg,
    user: req.userInfo._id.toString(),
    description: description,
    content: content
  }).then(function (result) {
    res.json({
      code: 0,
      message: '更新成功'
    })
  })
});

/**
 * 删除
 */
router.get('/content/delete', function (req, res, next) {
  var id = req.query.id;

  Content.remove({
    _id: id
  }).then(function (err) {
    if (err) {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '删除成功',
        url: '/admin/content'
      })
    } else {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '删除失败'
      })
    }
  })

});

/**
 * 评论首页
 */
router.get('/comment', function (req, res, next) {

  var page = Number(req.query.page || 1);
  var limit = 10;
  var pages = 0;

  Comment.count().then(function (count) {
    // 计算总页数
    pages = Math.ceil(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能低于1
    page = Math.max(page, 1);

    // 忽略条数
    var skip = (page - 1) * limit;

    Comment
      .find()
      .limit(limit)
      .skip(skip)
      .populate('content', 'title')
      .populate('user', 'username')
      .sort({_id: -1})
      .then(function (comments) {
        res.render('admin/comment_index', {
          userInfo: req.userInfo,
          comments: comments,
          // 分页参数
          page: page,
          pages: pages,
          limit: limit,
          count: count,
          pageUrl: '/admin/comment'
        });
      });
  });
});

/**
 * 删除评论
 */
router.get('/comment/delete', function (req, res, next) {
  var id = req.query.id || '';
  if (id === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '删除失败'
    })
  }

  Comment.remove({_id: id}).then(function (err) {
    if (err) {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '删除成功',
        url: '/admin/comment'
      })
    } else {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '删除失败'
      })
    }
  })
});


module.exports = router;
