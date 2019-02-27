$(function () {
    // 点击分类管理时,下级菜单显示
    $(".user_click").on("click", function () {
        $(this).next().stop().slideToggle();
    });

    // 点击menu按钮,左侧整体隐藏
    $(".topbar_menu").on("click", function () {
        $(".lt_aside").toggleClass("hidemenu");
        $(".lt_main").toggleClass("hidemenu");
        $(".lt_topbar").toggleClass("hidemenu")
    });
    // 点击退出按钮,模态框显示

    $(".topbar_logout").on("click", function () {
        $("#myModal").modal("show");
    });

    // 点击模态框的退出按钮,表示确认退出
    $(".btnLogout").on("click", function () {
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    location.href = "login.html";
                }
            }
        })
    })
})

//     // 进度条

// $(document).ajaxStart(function () {
//     NProgress.start();
// });
// $(document).ajaxStop(function () {
//     setTimeout(function () {
//         NProgress.done();
//     }, 1000);
// });