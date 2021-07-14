var icon_launcher_arr = [];
$(document).ready(function () {
    var form_data = $('#defaultForm').serialize();
    $(".colorpickerinput ").each(function () {
        var color = $(this).val();
        $(this).prev('.color-btn').css('background-color',color);
    });
    window.addEventListener('message', function (e) {
        var res = e.data;
        if (res.hasOwnProperty('auth') && res.auth == 'ymq'){
            switch (res.action) {
                case 'admin-loading':
                    admin_loading();
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
    $(".colorpickerinput").colorpicker({
        format: 'hex',
        component: '.input-group-append',
        extensions: [{
            name: 'preview',
            options: {
                showText: true,
                template:'<div class="colorpicker-bar colorpicker-preview"><input type="text" class="form-control"></div>'
            }
        }]
    });
    $(".colorpickerinput").on('focus',function(){
        var that = $(this);
        var pickDom = $("#"+$(this).attr("aria-describedby"));
        pickDom.find('.form-control').val($(this).val()).bind('input propertychange',function () {
            that.val($(this).val());
            that.trigger('change');
        });
    });
    $(".colorpickerinput").on('change',function(){
        $(this).prev('.color-btn').css('background-color',$(this).val());
        // do_change_iframe($(this));
    });
    $(".color-btn").on('click',function () {
        $(this).next('.colorpickerinput').trigger('focus');
    });

    $('a').on('click',function () {
        var href = $(this).attr('href');
        if (form_data != $('#defaultForm').serialize()){
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
    function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    function inputChange(){
        if ($(".icon_launcher").length > 0 && $(".icon_launcher").val() != '') {
            var icon = $(".icon_launcher").val();
            var small = false;
        }else{
            var img = $("input[name='icon']:checked").next().children('img');
            var icon = img.attr('src');
            var small = img.hasClass('small-radio-img');
        }
        
        var layout = $("input[name='layout']:checked").val();
        

        var text = $("input[name='text']").val();
        var color = $("input[name='color']").val();
        var bcolor = $("input[name='bcolor']").val();
        icon = replaceAll(icon,'rgb(0%2C%200%2C%200)',encodeURIComponent(color));

        // console.log(color,icon,encodeURIComponent(color));
        

        if (layout == 1){
            $("input[name='text']").attr('disabled',false);
        }else{
            $("input[name='text']").attr('disabled',true);
        }

        var data = {
            auth: 'ymq',
            action: 'admin-launcher',
            data: {
                layout: layout,
                icon: icon,
                text: text,
                bcolor: bcolor,
                color: color,
                small: small
            }
        };
        $("#iframe")[0].contentWindow.postMessage(data,'*');


        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    }
    $('input').on('keyup',function(){
        inputChange();
    });
    $("input,select").on('change', function() {
        inputChange();
    });

    $(".launcher-save").on('click',function () {
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            var layout = $("input[name='layout']:checked").val();
            var icon = $("input[name='icon']:checked").val();
            var text = $("input[name='text']").val();
            var color = $("input[name='color']").val();
            var bcolor = $("input[name='bcolor']").val();
            var launcher = $(".icon_launcher").val();
            $.ymqajax({
                url: " /api/branding/launcher.html",
                data: {layout,icon,text,color,bcolor,launcher},
                success: function (res) {
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });

    $(document).on('click', '.diyCancel', function () {
        
        setTimeout(function (){
            $(".upload-ul").each(function(){
                if ($(this).children('.diyUploadHover').length > 0) {
                    $(this).children('.upload-pick').hide()
                }else{
                    $(this).children('.upload-pick').show()
                }
            });
            $('.oncover').removeClass('cover')
            $('.icon_box').removeClass('opacity02')
            inputChange();
        }, 300);
    });
    var icon_arr = ['launcher'];
    icon_arr.forEach(function (item) {
        $('#icon_'+item).diyUpload({
            server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
            fileNumLimit:1,
            getTokenUrl:'/api/ossapi/gettoken',
            getTokenUrlData:{size:1024*1024},
            fileSizeLimit:1024*1024,
            fileSingleSizeLimit:1024*1024,
            type:'image',
            viewbox: 'view_'+item,
            data_arr: 'icon_'+item+'_arr',
            input: 'icon_'+item,
            success:function(data,$fileBox) {
                if (eval('icon_'+item+'_arr').length !== 0) {
                    $('.view_'+item).each(function(i){
                        $(this).attr("data-src",eval('icon_'+item+'_arr')[i]);
                    });
                    $('.icon_'+item+'_spotlight .spotlight').each(function(i){
                        $(this).attr("data-src",eval('icon_'+item+'_arr')[i]);
                        $(this).css({
                          backgroundImage: 'url("'+ eval('icon_'+item+'_arr')[i] +'")'
                        });
                    });
                    var img_text = eval('icon_'+item+'_arr').join(',');
                    $('.icon_'+item).val(img_text);
                    $('.oncover').addClass('cover')
                    $('.icon_box').addClass('opacity02')
                    inputChange();
                    
                    //if(icon_free_product == 'banner_images'){
                        //do_change_iframe($('.banner_images'),'banner-image',$('.banner_images').val());
                    //}
                }
                $('.images-save').removeClass('disabled');
                $('.images-save').attr('disabled',false);
            },
            error:function( err ) { },
            buttonText : '',
            accept: {
                title: "Images",
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            thumb:{
                width:5000,
                height:10000,
                quality:100,
                allowMagnify:true,
                crop:true,
                type:"image/jpeg"
            }
        });
    });

});