// 引入 mongoose 模块
var mongoose = require('mongoose');

// 引入分类表结构
var contentsSchema = require('../Schemas/contents');

// 创建模型类
module.exports = mongoose.model('Content', contentsSchema);
