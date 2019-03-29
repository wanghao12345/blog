// 引入 mongoose 模块
var mongoose = require('mongoose');

// 引入评论表结构
var commentsSchema = require('../Schemas/comments');

// 创建模型类
module.exports = mongoose.model('Comment', commentsSchema);
