$(function () {
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("secondTpl", info);
                $("tbody").html(htmlStr);

                // 初始化分页插件
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

    // 点击添加分类按钮,模态框显示
    $(".btn_add").on("click", function () {
        $("#addModal").modal("show");

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("firstCate", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    // 点击模态框的ul中的a标签按钮,给button设置值
    $(".dropdown-menu").on("click", 'a', function () {
        var txt = $(this).text();
        $(".dropdown #dropdownText").text(txt);

        // 获取id,设置给隐藏域
        var id = $(this).data("id");
        $('[name="categoryId"]').val(id);

        // 只要给隐藏域赋值了,此时校验状态应该更新成功
        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');

    })

    // 完成图片预览上传功能
    $("#fileupload").fileupload({
        dataType: 'json',
        done: function (e, data) {
            var result = data.result;
            var picUrl = result.picAddr;

            // 设置给img src 
            $("#imgBox img").attr("src", picUrl);

            // 把路径赋值给隐藏域
            $('[name="brandLogo"]').val(picUrl);

            // 只要隐藏域有值了,就是更新成功状态
            $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");

        }
    });

    // 直接进行校验
    $("#form").bootstrapValidator({
        // 配置exclude排除项,对隐藏域完成校验
        excluded: [],
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            }

        }
    })

    // 注册表单校验成功事件,阻止默认的提交,使用ajax提交
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();

        $.ajax({ 
            type: 'post',
            url: '/category/addSecondCategory',
            data: $("#form").serialize(),
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render();

                    $("#form").data("bootstrapValidator").resetForm(true);

                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").attr("src", "./images/none.png");
                }
            }
        })
    })
})