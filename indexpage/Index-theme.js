$(document).ready(function () {

    $('.initialize').on('click',function () {
        var theme_id = $('.theme_id').val();
        var that = $(this);
        that.addClass('btn-progress');
        $.ajax({
            type: 'POST',
            url: '/api/index/theme',
            dataType: 'json',
            data: {theme_id},
            success: function (res) {
                if (res.code == 0){
                    iziToast.error({
                        message: res.msg,
                        position: 'bottomCenter'
                    });
                }else{
                    iziToast.success({
                        message: res.msg,
                        position: 'bottomCenter'
                    });
                }
                that.removeClass('btn-progress');
            },
            error: function (jqXHR) {
                that.removeClass('btn-progress');
            }
        });
    });


});