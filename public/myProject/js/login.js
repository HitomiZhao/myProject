// 表单校验
$(function () {
    $("#form").bootstrapValidator({
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名必须在2到6位之间"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码必须在6到12之间"
                    }
                }
            }
        },
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
    })
})

// 验证成功后点击登录按钮,会触发success.form.bv事件,此时表单会提交,这时候,通常我们需要禁止表单自动提交,使用ajax进行表单的校验
$(function () {
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $("#form").serialize(),
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.error === 1000) {
                    alert("用户名不存在");
                }
                if (info.error === 1001) {
                    alert("密码错误");
                }
                if (info.success) {
                    location.href = "index.html";
                }
            }
        })
    })
})