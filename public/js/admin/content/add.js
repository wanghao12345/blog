$(function () {

  var $addBox = $('#content_add');

  // 提交
  $addBox.find('button#submit').on('click', function () {
    addContentRequest($addBox);
  });
});

/**
 * 增加内容
 */
function addContentRequest($addBox) {
  $.ajax({
    type: 'post',
    url: '/admin/content/add',
    data: {
      category: $addBox.find('select[name="category"]').val(),
      title: $addBox.find('input[name="title"]').val(),
      description: $addBox.find('textarea[name="description"]').val(),
      content: window.editor.html(),
    },
    dataType: 'json',
    success: function (result) {
      if (!result.code) {
        window.location.href='/admin/content'
      }
    }
  })
}
