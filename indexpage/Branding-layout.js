$(document).ready(function () {
    var form_data = getSortDataByDom($('#sortable_login .sortable_li')).toString()+','+getSortDataByDom($('#sortable_logout .sortable_li')).toString();
    var input_data = $('#defaultForm').serialize();
    var admin_loading_count = 0;
    window.addEventListener('message', function (e) {
        var res = e.data;
        if (res.hasOwnProperty('auth') && res.auth == 'ymq'){
            switch (res.action) {
                case 'admin-loading':
                    admin_loading_count ++;
                    console.log(admin_loading_count);
                    if(admin_loading_count == 2){
                        admin_loading();
                    }
                    break;
            }
        }
    }, false);
    function admin_loading(){
        $('.ifrem-box .ifrem-content .load').hide();
        $('.ifrem-box .ifrem-content').removeClass('space-between');
        $('.ifrem-box .ifrem-content #iframe').show();
        // $('.right-line,.left-line,.right-ruler').show();
        $(".right-left-hide").css('display','inline-block');

    }
    var iframe = $("#iframe");
    iframe.attr("src",iframe.attr('data-src'));
    var iframe2 = $("#iframe2");
    iframe2.attr("src",iframe2.attr('data-src'));




    $('a').on('click',function () {
        var href = $(this).attr('href');
        if (!dataIsChange()){
            $(this).fireModal({
                title: 'You have unsaved changes on this page',
                body: 'If you leave this page, all unsaved changes will be lost. Are you sure you want to leave this page?',
                center: true,
                initShow: true,
                removeOnDismiss: true,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');
                        }
                    },
                    {
                        text: 'Leave page',
                        class: 'btn btn-danger btn-shadow',
                        handler: function(modal) {
                            window.location.href=href;
                        }
                    }
                ]
            });
            return false;
        }
        // window.location.href=href;
    });
    $("select").on('change',function () {
        headerChange();
    });
    $('input').on('keyup',function(){
        headerChange();

    });

    function headerChange(){
        if (input_data != $('#defaultForm').serialize()) {
            $('.layout_save').removeClass('disabled');
        }else{
            $('.layout_save').addClass('disabled');
        }
        if ($(this).hasClass('logout')){
            $("#iframe")[0].contentWindow.postMessage({
                auth: 'ymq',
                action: 'admin-header',
                data: {
                    caption: $("input[name='logout_caption']").val(),
                    title: $("input[name='title']").val(),
                }
            },'*');
        }else{
            $("#iframe2")[0].contentWindow.postMessage({
                auth: 'ymq',
                action: 'admin-header',
                data: {
                    caption: $("input[name='login_caption']").val()
                }
            },'*');
        }
    }

    $('.tab-1 div').on('click',function(){
        if (!$(this).hasClass('active')){
            $('.tab-1 div').removeClass('active');
            $(this).addClass('active');
            $('.ifrem-content iframe').hide();
            $($(this).attr('data-iframe')).show();
            $('.sortable-box,.header-cart').hide();
            console.log($(this).attr('data-sortable'));
            $($(this).attr('data-sortable')).show();

        }
    });


    if(jQuery().selectric) {
        $(".program").selectric({
            disableOnMobile: false,
            nativeOnMobile: false,
        });
    }

    if ($('#sortable_logout').length > 0) {
        new Sortable(sortable_logout, {
            handle: '.handle',
            animation: 150,
            ghostClass: 'blue-background-class',
            chosenClass: "sort_chosen",
            dragClass: "sort_drag",
            // 列表的任何更改都会触发
            onSort: function (/**Event*/evt) {
                $("#iframe")[0].contentWindow.postMessage(getSortData($('#sortable_logout .sortable_li')),'*');
                if (dataIsChange()){
                    $('.layout_save').addClass('disabled');
                }else{
                    $('.layout_save').removeClass('disabled');
                }
            }
        });
    }



    if ($('#sortable_login').length > 0) {
        new Sortable(sortable_login, {
            handle: '.handle',
            animation: 150,
            ghostClass: 'blue-background-class',
            chosenClass: "sort_chosen",
            dragClass: "sort_drag",
            // 列表的任何更改都会触发
            onSort: function (/**Event*/evt) {
                $("#iframe2")[0].contentWindow.postMessage(getSortData($('#sortable_login .sortable_li')),'*');
                if (dataIsChange()){
                    $('.layout_save').addClass('disabled');
                }else{
                    $('.layout_save').removeClass('disabled');
                }
            }
        });
    }

    function dataIsChange() {
        var data = getSortDataByDom($('#sortable_login .sortable_li')).toString()+','+getSortDataByDom($('#sortable_logout .sortable_li')).toString();
        return data == form_data;
    }
    
    function getSortData(dom) {
        return {
            auth: 'ymq',
            action: 'admin-sortable',
            data: {
                sortable: getSortDataByDom(dom)
            }
        };

    }



    function getSortDataByDom(dom) {
        var sortable = [];
        dom.each(function(){
            sortable.push($(this).data('sortable'))
        })
        return sortable;

    }

    $(".layout_save").on('click',function () {
        var that = $(this);
        if (!that.hasClass('disabled')){
            that.addClass('btn-progress');
            var sortable_login = getSortDataByDom($('#sortable_login .sortable_li')).toString();
            var sortable_logout = getSortDataByDom($('#sortable_logout .sortable_li')).toString();
            var logout_caption = $("input[name='logout_caption']").val();
            var title = $("input[name='title']").val();
            var program = $("select[name='program']").val();
            var login_caption = $("input[name='login_caption']").val();
            $.ymqajax({
                url: " /api/branding/layout",
                data: {sortable_login,sortable_logout,logout_caption,title,program,login_caption},
                success: function (res) {
                    that.removeClass('btn-progress').addClass('disabled');
                }
            });
        }
    });

    $('.tab-2').on('click',function(){
        $('.header-cart-box').show();
        $('.do-back').show();
        $('.sortable-out-box').hide();
    });
    $('.do-back').on('click',function () {
        $('.header-cart-box').hide();
        $('.do-back').hide();
        $('.sortable-out-box').show();
    });

});