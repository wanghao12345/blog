// 引入 mongoose 模块
var mongoose = require('mongoose');

// 引入 moment 模块
var moment = require('moment');

// 内容的表结构
var contentSchema = new mongoose.Schema({
  // 关联字段 - 分类的id
  category: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'Category'
  },

  // 内容标题
  title: String,

  // 标题图片
  titleImg: String,

  // 关联字段 - 用户id
  user: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用
    ref: 'User'
  },

  // 添加时间
  addTime: {
    type: String,
    // default: new Date()
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },

  // 阅读量
  views: {
    type: Number,
    default: 0
  },

  // 喜欢人数
  loves: {
    type: Number,
    default: 0
  },

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
module.exports = contentSchema
