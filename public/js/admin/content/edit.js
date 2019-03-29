$(function () {

  var $addBox = $('#content_add');
  // 获取id并请求
  var id = getQueryString('id');
  id && getContent(id, $addBox);

  // 提交
  $addBox.find('button#submit').on('click', function () {
    updateContentRequest($addBox, id);
  });

  // 选择图片
  uploaderImg(function (path) {
    $('input[name="titleImg"]').val(path);
  });
});

/**
 * 保存内容
 */
function updateContentRequest($addBox, id) {
  $.ajax({
    type: 'post',
    url: '/admin/content/edit',
    data: {
      id: id,
      category: $addBox.find('select[name="category"]').val(),
      title: $addBox.find('input[name="title"]').val(),
      titleImg: $addBox.find('input[name="titleImg"]').val(),
      description: $addBox.find('textarea[name="description"]').val(),
      content: window.editor.html(),
    },
    dataType: 'json',
    success: function (result) {
      if (!result.code) {
        window.location.href = '/admin/content'
      }
    }
  })
}

/**
 * 获取初始化
 */
function getContent(id, $addBox) {
  $.ajax({
    type: 'get',
    url: '/admin/content/getContent?id=' + id,
    data: {},
    dataType: 'json',
    success: function (result) {
      if (!result.code) {
        $addBox.find('select[name="category"]').val(result.data.category);
        $addBox.find('input[name="title"]').val(result.data.title);
        $addBox.find('input[name="titleImg"]').val(result.data.titleImg);
        $addBox.find('#fileList').html('<img style="width: 100%; height: 100%" src="'+result.data.titleImg+'" alt="标题图片" />');
        $addBox.find('textarea[name="description"]').val(result.data.description);
        window.editor.html(result.data.content);
      }
    }
  })
}

/**
 * 上传图片
 */
function uploaderImg(callback) {
  // 初始化Web Uploader
  var uploader = WebUploader.create({

    // 选完文件后，是否自动上传。
    auto: true,

    // swf文件路径
    swf: '/public/js/lib/webuploader/Uploader.swf',

    // 文件接收服务端。
    server: '/utils/upload/img',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#filePicker',

    // 只允许选择图片文件。
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    }
  });
  // 当有文件添加进来的时候
  uploader.on( 'fileQueued', function( file ) {
    var $li = $(
      '<div id="' + file.id + '" class="file-item thumbnail">' +
      '<img>' +
      '<div class="info">' + file.name + '</div>' +
      '</div>'
      ),
      $img = $li.find('img');

    var $list = $('#fileList');
    // $list为容器jQuery实例
    $list.html( $li );

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
      if ( error ) {
        $img.replaceWith('<span>不能预览</span>');
        return;
      }

      $img.attr( 'src', src );
    }, 100, 130 );
  });
  // 文件上传过程中创建进度条实时显示。
  uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
      $percent = $li.find('.progress span');

    // 避免重复创建
    if ( !$percent.length ) {
      $percent = $('<p class="progress"><span></span></p>')
        .appendTo( $li )
        .find('span');
    }

    $percent.css( 'width', percentage * 100 + '%' );
  });

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on( 'uploadSuccess', function( file , result) {
    $( '#'+file.id ).addClass('upload-state-done');
    if (!result.code){
      callback(result.path);
    }
  });

// 文件上传失败，显示上传出错。
  uploader.on( 'uploadError', function( file ) {
    var $li = $( '#'+file.id ),
      $error = $li.find('div.error');

    // 避免重复创建
    if ( !$error.length ) {
      $error = $('<div class="error"></div>').appendTo( $li );
    }

    $error.text('上传失败');
  });

// 完成上传完了，成功或者失败，先删除进度条。
  uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').remove();
    uploader.reset();
  });
}

/**
 * 获取url参数
 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

