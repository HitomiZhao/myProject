$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var id;
    var isDelete;
    render();

    function render() {
        // 动态的从后台获取数据渲染页面
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                var htmlStr = template("userTpl", info);
                $("tbody").html(htmlStr);

                // 初始化分页插件
                $("#paginator").bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    // 给分页按钮添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }


    // 点击禁用时模态框的状态
    $("tbody").on("click", 'button', function () {
        $("#addModal").modal("show");
        id = $(this).parent().data("id");
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
        // 当点击确定时,将该行的状态改为相反的
        $(".btn_confirm").on("click", function () {
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (info) {
                    console.log(info);
                    if (info.success) {
                        $("#addModal").modal("hide");
                        render();
                    }
                }
            })
        })
    })

})