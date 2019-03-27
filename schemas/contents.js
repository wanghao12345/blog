// 引入 mongoose 模块
var mongoose = require('mongoose');

// 内容的表结构
module.exports = new mongoose.Schema({
  // 关联字段 - 分类的id
  category: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'Category'
  },

  // 内容标题
  title: String,

  // 内容简介
  description: {
    type: String,
    default: ''
  },

  // 内容
  content: {
    type: String,
    default: ''
  }

});
