// 引入 mongoose 模块
var mongoose = require('mongoose');

// 引入分类表结构
var categoriesSchema = require('../Schemas/categories');

// 创建模型类
module.exports = mongoose.model('Category', categoriesSchema);
