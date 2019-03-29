define(function () {
  /**
   * 监听页面是否已经到了底部
   * @param callback
   */
  var clientScrollBar = function (callback) {
    window.onscroll = function () {
      // 滚动条距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // 可视区高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 滚动条总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight === scrollHeight) {
        callback();
      }
    }
  };

  return {
    clientScrollBar
  }

});
