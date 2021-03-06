require.config({
  baseUrl: '/public/js',
  paths: {
    jquery: 'lib/jquery-3.2.1.min',
    getQueryString: 'utils/getQueryString',
    template: 'lib/template',
    share: 'main/share/share'
  }
});

require(['jquery', 'getQueryString', 'template', 'share'], function ($, getQueryString, template, share) {

  $(function () {

    var editHtml = template('edit-comment-cont', {});
    $('.edit-comment-outBox').append(editHtml);

    // 获取文章详情
    var id = getQueryString.getQueryString('id');
    $('#comment-list').addClass('comment-' + id);
    getArticleDetail(id, function (result) {
      var html = template('article_head', result.data.contents);
      $('#article-head').append(html);
      $('#article-body').html(result.data.contents.content);
      $('span.comment-num').html(result.data.comments);
    });

    // 获取文章评论
    getComment(id);

    // 提交评论
    var $articleComment = $('#article-comment');
    $articleComment.on('click', '#postComment', function () {
      var fid = $(this).data('fid') || 0;
      postComment(id, fid, $articleComment);
    });

    // 回复
    $articleComment.on('click','.reply-btn', function () {
      var fid = $(this).data('fid');
      $('#edit-comment').remove();
      $(this).parents('li.comment-li-'+fid).after(editHtml);
      $articleComment.find('#postComment').attr('data-fid', fid);
    });
  });

  /**
   * 获取文章详情
   */
  function getArticleDetail(id, callback) {
    $.get({
      type: 'get',
      url: '/article/get_detail',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (result) {
        !result.code && callback(result);
      }
    })
  }
  /**
   * 评论
   * @param id 文章内容id
   * @param fid 回复的目标贴的id
   */
  function postComment(id, fid, $articleComment) {
    fid || (fid = id);
    var date = new Date();
    var createTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' '
                     + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    if (!$articleComment.find('input#userInfo').val()) {
      layui.use('layer', function(){
        var layer = layui.layer;
        layer.msg('登录后才可评论！', {icon: 2});
      });
      return
    }
    if (!$articleComment.find('textarea#comment').val()) {
      layui.use('layer', function(){
        var layer = layui.layer;
        layer.msg('评论内容不能为空！', {icon: 2});
      });
      return
    }

    $.ajax({
      type: 'post',
      url: '/api/commit/article/comment',
      data: {
        userInfo: $articleComment.find('input#userInfo').val(),
        contents: id,
        fid: fid,
        describe: $articleComment.find('textarea#comment').val(),
        createTime: createTime
      },
      dataType: 'json',
      success: function (result) {
        if (!result.code){
          addComment(id, result.data)
        }
      }
    })
  }

  /**
   * 添加评论
   */
  function addComment(id, data) {
    // 初始化
    $('div.edit-comment').remove();
    var editHtml = template('edit-comment-cont', {});
    $('.edit-comment-outBox').append(editHtml);
    // 获取评论
    getComment(id);
  }

  /**
   * 获取文章评论内容
   */
  function getComment(id) {
    $.ajax({
      type: 'get',
      url: '/api/get/article/comment',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (result) {
        if(!result.code){
          $('ul#comment-list').html('');
          result.data.forEach(function (item, index) {
            var html = template('comment-cont', item);
            $('.comment-' + item.fid).append(html);
          })
          $('span.comment-num').html(result.data.length);
        }
      }
    })
  }

});



