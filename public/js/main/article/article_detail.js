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
    var id = getQueryString.getQueryString('id');
    getArticleDetail(id, function (result) {

      var html = template('article_head', result.data);
      $('#article-head').append(html);
      $('#article-body').html(result.data.content);

    });
  });

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

});



