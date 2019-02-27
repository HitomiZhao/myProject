// 测试进度条功能
// 开始
// NProgress.start();

// setTimeout(function() {
//   // 结束
//   NProgress.done();
// }, 2000);


// 在发送第一个ajax请求, 开启进度条
// 在全部的ajax回来, 关闭进度条

// ajax全局事件
// .ajaxComplete(fn);   每个ajax完成时, 都会调用fn回调函数   (完成: 不管成功还是失败)
// .ajaxSuccess(fn);    每个ajax只要成功了, 就会调用fn
// .ajaxError(fn);      每个ajax只要失败了, 就会调用fn
// .ajaxSend(fn);       每个ajax发送前, 都会调用fn

// .ajaxStart(fn);      在第一个ajax开始发送时, 调用fn
// .ajaxStop(fn);       在全部的ajax完成时, 调用fn  (不管成功还是失败)


// 在第一个ajax开始发送时, 开启进度条
$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
})

// 在全部的ajax完成时, 关闭进度条
$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    // 结束进度条
    NProgress.done();
  }, 500);
});


// 公用的功能:
// 1. 左侧二级菜单的切换
// 2. 左侧整体菜单的切换
// 3. 公共的退出功能 

// 等待 dom 结构加载完成后, 才会执行
$(function() {

  // 1. 左侧二级菜单的切换
  $('.lt_aside .category').click(function() {
    // 找下一个兄弟元素, 切换显示
    $(this).next().stop().slideToggle();
  });


  // 2. 左侧整体菜单的切换
  $('.lt_topbar .icon_menu').click(function() {

    // 让左侧整个菜单切换显示, 改左侧菜单的 left 值
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
  });


  // 3. 退出功能
  //    点击菜单的退出按钮, 显示一个模态框, 询问用户
  $('.lt_topbar .icon_logout').click(function() {
    // 让模态框显示, modal('show')
    $('#logoutModal').modal('show');
  });

  //   点击模态框的退出按钮, 表示确认退出
  //   发送 ajax 请求, 让服务器端销毁用户的登陆状态
  $('#logoutBtn').click(function() {

    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function( info ) {
        console.log( info );
        if (info.success) {
          // 退出成功, 跳转登录页
          location.href = 'login.html';
        }
      }
    })

  })

})

