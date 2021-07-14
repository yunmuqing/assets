$(document).ready(function () {
    $('#upgrade').on('click',function () {
        var that = $(this);
        that.addClass('btn-progress');
        var plan = that.attr('data-plan');
        $.ajax({
            url: '/api/upgrade.html',
            success: function (res) {
                if(res.code == 1){
                    window.location.href=res.data;
                }else{
                    that.removeClass('btn-progress');
                }
            }
        });
    });

});