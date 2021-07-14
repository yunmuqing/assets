$(document).ready(function () {

    $('.start-lan-button').on('click',function () {
        var currency = $('.currency').val();
        var that = $(this);
        that.addClass('btn-progress');
        $.ajax({
            type: 'POST',
            url: '/api/branding/startlan',
            dataType: 'json',
            data: {currency},
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