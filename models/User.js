// 引入 mongoose 模块
var mongoose = require('mongoose');

// 引入用户表结构
var usersSchema = require('../Schemas/users');

// 创建模型类
module.exports = mongoose.model('User', usersSchema);
