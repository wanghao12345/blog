$(function () {

  var $addBox = $('#content_add');
  // 获取id并请求
  var id = getQueryString('id');
  id && getContent(id, $addBox);

  // 提交
  $addBox.find('button#submit').on('click', function () {
    updateContentRequest($addBox, id);
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
        $addBox.find('textarea[name="description"]').val(result.data.description);
        window.editor.html(result.data.content);
      }
    }
  })
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

