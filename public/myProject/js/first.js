$(function () {

    var currentPage = 1;
    var pageSize = 5;
    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template("firstTpl", info);
                $("tbody").html(htmlStr);
                // 分页实现
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }

        })
    }

    // 添加功能
    $(".btn_add").on("click", function () {
        $("#addModal").modal("show");
    })

    // 添加校验功能
    $("#form").bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "内容不能为空"
                    }
                }
            }
        }

    })

    // 表单校验成功,在事件中阻止默认的事件,通过发送ajax提交即可
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $("#form").serialize(),
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    currentPage = 1;
                    render();
                    $("#addModal").modal("hide");
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })
})