// 引入 mongoose 模块
var mongoose = require('mongoose');

// 评论的表结构
module.exports = new mongoose.Schema({

  // 关联字段 - 用户的id
  user: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'User'
  },

  // 关联字段 - 内容的id
  content: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'Content'
  },

  // 父级评论id
  fid: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'Comment'
  },

  // 评论内容
  describe: String,

  // 评论时间
  createTime: String
});
