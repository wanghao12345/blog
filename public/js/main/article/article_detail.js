require.config({
  baseUrl: '/public/js',
  paths: {
    jquery: 'lib/jquery-3.2.1.min',
    getQueryString: 'utils/getQueryString',
    template: 'lib/template'
  }
});

require(['jquery', 'getQueryString', 'template'], function ($, getQueryString, template) {

  $(function () {

    var editHtml = template('edit-comment-cont', {});
    $('.edit-comment-outBox').append(editHtml);

    // 获取文章详情
    var id = getQueryString.getQueryString('id');
    $('#comment-list').addClass('comment-' + id);
    getArticleDetail(id, function (result) {
      var html = template('article_head', result.data);
      $('#article-head').append(html);
      $('#article-body').html(result.data.content);

    });

    // 提交评论
    var $articleComment = $('#article-comment');
    $articleComment.find('#postComment').on('click', function () {
      postComment(id, 0, $articleComment);
    });

    // 回复
    $articleComment.on('click','.reply-btn', function () {
      var id = $(this).data('id');
      $('#edit-comment').remove();
      $(this).parents('li').after(editHtml);
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
          addComment(result.data)
        }
      }
    })
  }

  /**
   * 添加评论
   */
  function addComment(data) {
    var html = template('comment-cont', data);
    $('.comment-' + data.fid).append(html);
  }

});



