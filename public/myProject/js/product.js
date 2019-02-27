$(function () {
    var currentPage = 1;
    var pageSize = 2;
    var picArray = [];
    // 渲染列表
    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                var htmlStr = template("productTpl", info);
                $("tbody").html(htmlStr);

                // 分页插件
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

    // 点击添加按钮,模态框显示
    $(".addBtn").on("click", function () {
        $(".addModal").modal("show");

        // 点击添加按钮,发送ajax请求,获取二级分类数据,添加到ul中
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("productList", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    // 点击a标签,动态的设置给button按钮
    $(".dropdown-menu").on("click", 'a', function () {
        var txt = $(this).text();
        $("#dropdownTxt").text(txt);

        var id = $(this).data('id');
        $('[name="brandId"]').val(id);

        $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    // 图片预览
    $("#fileupload").fileupload({
        dataType: 'json',
        done: function (e, data) {
            var picObj = data.result;
            var picUrl = picObj.picAddr;
            picArray.unshift(picObj);
            $("#imgBox").prepend('<img src="' + picUrl + '" alt="" style="height:100px">');
            if (picArray.length > 3) {
                picArray.pop();
                $("#imgBox img:last-of-type").remove();
            }
            if (picArray.length === 3) {
                $("#form").data("bootstrapValidator").updateStatus("picArr", "VALID");
            }
        }
    })

    // 表单校验
    $("#form").bootstrapValidator({
        excluded: [],
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '请输入非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式, xx 是两位数字, 例如: 32-40'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d*$/,
                        message: '商品价格是数字格式'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d*$/,
                        message: '商品价格是数字格式'
                    }
                }
            },
            picArr: {
                validators: {
                    notEmpty: {
                        message: '请选择三张图片'
                    }
                }
            }

        }
    })

    // 添加表单校验成功事件
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();
        var params = $("#form").serialize();
        params += JSON.stringify(picArray);
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: params,
            dataType: 'json',
            success: function (info) {
                console.log(info);
                $(".addModal").modal("hide");
                currentPage = 1;
                render();
                $("#form").data("bootstrapValidator").resetForm(true);
                // 重置button和图片
                $("#dropdownTxt").text("请选择二级分类");
                $("#imgBox img").remove();
                picArray = [];
            }
        })
    })
})