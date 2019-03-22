/*
* 应用程序的启动入口文件
*/

// 引入 express 模块
var express = require('express');

// 引入 swig 模板引擎模块
var swig = require('swig');

// 引入 mongoose 模块
var mongoose = require('mongoose');

// 创建 app 应用
var app = express();

// 配置应用模板:
// 1.定义当前应用所使用的模板引擎 第一个参数：模板引擎的名称，第二个参数：解析处理模板内容的方法
app.engine('html', swig.renderFile);

// 2.设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');

// 3.注册所使用的模板引擎，第一个参数必须是view engine, 第二个参数和app.engine方法中定义的模板引擎的名称必须一致
app.set('view engine', 'html');

// 4.开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

// 配置静态文件
app.use('/public', express.static(__dirname + '/public'));

// 配置后台管理模块
app.use('/admin', require('./routers/admin'));

// 配置api模块
app.use('/api', require('./routers/api'));

// 配置前台管理模块
app.use('/', require('./routers/main'));

// 连接数据库
// 1.命令行开启数据库服务：mongod --dbpath=D:\blog\db --port=27018

// 2.连接数据库
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
  if (err) {
    console.log('数据库连接失败！');
  } else {
    console.log('数据库连接成功！');

    // 监听http请求
    app.listen(8081);

  }
});






