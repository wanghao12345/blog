$(function () {
  var $loginBox = $('#login-modular');
  var $registerBox = $('#register-modular');
  var $userInfo = $('#userInfo-modular');

  // 切换到注册面板
  $loginBox.find('a.switch').on('click', function () {
    $registerBox.show();
    $loginBox.hide();
  });

  //切换到登录面板
  $registerBox.find('a.switch').on('click', function () {
    $registerBox.hide();
    $loginBox.show();
  });

  // 注册
  $registerBox.find('input#register-btn').on('click', function () {
    registerRequest($registerBox, $loginBox);
  });

  // 登录
  $loginBox.find('input#login-btn').on('click', function () {
    loginRequest($loginBox, $userInfo);
  });

  // 退出
  $userInfo.find('a.layout').on('click', function () {
    logoutRequest();
  });

});

/**
 * 注册请求
 */
function registerRequest($registerBox, $loginBox) {
  $.ajax({
    type: 'post',
    url: '/api/user/register',
    data: {
      username: $registerBox.find('[name="username"]').val(),
      password: $registerBox.find('[name="password"]').val(),
      repassword: $registerBox.find('[name="repassword"]').val()
    },
    dataType: 'json',
    success: function (result) {
      $registerBox.find('p.warning').html(result.message);
      if (!result.code) { // 注册成功，跳往登录
        setTimeout(function () {
          $loginBox.show();
          $registerBox.hide();
        }, 1000);
      }
    }
  })
}

/**
 * 登录请求
 */
function loginRequest($loginBox, $userInfo) {
  $.ajax({
    type: 'post',
    url: '/api/user/login',
    data: {
      username: $loginBox.find('[name="username"]').val(),
      password: $loginBox.find('[name="password"]').val()
    },
    dataType: 'json',
    success: function (result) {
      $loginBox.find('p.warning').html(result.message);
      if (!result.code) { // 登录成功，显示用户信息
        setTimeout(function () {
          window.location.reload();
        }, 1000)
      }
    }
  });
}

/**
 * 退出登录请求
 */
function logoutRequest() {
  $.ajax({
    type: 'get',
    url: '/api/user/logout',
    success: function (result) {
      if (!result.code) {
        window.location.reload();
      }
    }
  });
}
