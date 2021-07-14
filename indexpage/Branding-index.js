var banner_img = [];
// var waterImg = ymqShopInfo.branding.water.water_image;
// waterImg = waterImg.replace(/https:\/\/ymq-shopify.oss-us-east-1.aliyuncs.com\//g,"");
// var waterImg = '';
// var percentage = ymqShopInfo.branding.water.percentage;
// var brightness = ymqShopInfo.branding.water.brightness;
// var contrast = ymqShopInfo.branding.water.contrast;
// var transparency = ymqShopInfo.branding.water.transparency;
// var vertical = ymqShopInfo.branding.water.vertical;
// var horizontal = ymqShopInfo.branding.water.horizontal;
// var position = ymqShopInfo.branding.water.position;
// function setWatermark(){
//     if ($('.water_image').val() == '') {
//         waterImg = '';
//         $('.smpale_img').attr('src',$('.smpale_img').data('src'))
//         $('.water').val('')
//     }else{
//         var src = '?x-oss-process=image/watermark,image_'+waterBtoa(waterImg)+'_'+waterBtoa('x-oss-process=image/resize,P_'+percentage+'/bright,'+brightness+'/contrast,'+contrast)+',g_'+position+',t_'+transparency+',x_'+horizontal+',y_'+vertical;
//         $('.smpale_img').attr('src',$('.smpale_img').data('src')+src)
//         $('.water').val(src)
//     }

// }

// function waterBtoa(str){
//     var str = window.btoa(str);
//     str =  str.replace(/=/g,"");
//     str =  str.replace(/\+/g,"-");
//     str =  str.replace(/\//g,"_");
//     return str;
// }
// if (waterImg != '') {
//     setWatermark()
// }
if(img_input==undefined){
    var img_input = '';
}
if (img_input == 'water_image') {
    var p_upload_size = 500*1024;
}else{
    var p_upload_size = 5*1024*1024;
}
$(document).ready(function() {

    // $('.watermark-btn').click(function(){
    //     $('.watermark-btn').addClass('btn-default');
    //     $('.watermark-btn').removeClass('btn-primary');
    //     $(this).addClass('btn-primary');
    //     position = $(this).data('position');
    //     $('.position-input').val(position)
    //     setWatermark()
    // })
    // $('.water-input').bind('input propertychange', function(){
    //     window[$(this).attr('name')] = $(this).val();
    // })
    // $(".water-input").on("change",function(){
    //   setWatermark();
    // })
    // $('.ymq-range').bind('input propertychange', function(){
    //     $(this).parent().next().children().val($(this).val())
    // })
    // $('.show-input').bind('input propertychange', function(){
    //     $(this).parent().prev().children().val($(this).val())
    // })
 
    // $(".water-save").on('click',function () {
    //     var that = $(this);
    //     that.addClass('btn-progress').addClass('disabled');
    //     $.ymqajax({
    //         url: " /api/branding/water",
    //         data: $('#defaultForm').serialize(),
    //         success: function (res) {
    //             that.removeClass('btn-progress').removeClass('disabled');
    //         }
    //     });
    // });

    var imgUpload = $('#banner_img_upload').diyUpload({
        server:'https://ymq-shopify.oss-us-east-1.aliyuncs.com',
        fileNumLimit:1,
        getTokenUrl:'/api/ossapi/gettoken',
        getTokenUrlData:{size:p_upload_size},
        fileSizeLimit:p_upload_size,
        fileSingleSizeLimit:p_upload_size,
        type:'image',
        viewbox: 'viewImg',
        data_arr: 'banner_img',
        input: img_input,
        success:function(data,$fileBox) {
            console.log(banner_img)
            if (banner_img.length !== 0) {
                $('.viewImg').each(function(i){
                    $(this).attr("data-src",banner_img[i]);
                });
                $('.banner_img .spotlight').each(function(i){
                    $(this).attr("data-src",banner_img[i]);
                    $(this).css({
                      backgroundImage: 'url("'+ banner_img[i] +'")'
                    });
                });
                
                var reviewPhotoText = banner_img.join(',');
                $('.'+img_input).val(reviewPhotoText);
                if(img_input == 'water_image'){
                    waterImg = reviewPhotoText.replace(/https:\/\/ymq-shopify.oss-us-east-1.aliyuncs.com\//g,"");
                    setWatermark()
                }
                if(img_input == 'banner_images'){
                    //console.log($('.banner_images').val())
                    do_change_iframe($('.banner_images'),'banner-image',$('.banner_images').val());
                }
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
    //diyLeft
    $(document).on('click', '.diyCancel', function () {
        removeDis();
        setTimeout(function (){
            $(".upload-ul").each(function(){
                if ($(this).children('.diyUploadHover').length > 0) {
                    $(this).children('.upload-pick').hide()
                }else{
                    $(this).children('.upload-pick').show()
                }
            });
        }, 300);
        
        // if (img_input == 'water_image') {
        //     setWatermark()
        // }
    });

    $(".images-save").on('click',function () {
        var that = $(this);
        that.addClass('btn-progress');
        $.ymqajax({
            url: " /api/branding/images",
            data: {banner_img:$(".banner_images").val()},
            success: function (res) {
                that.removeClass('btn-progress');
            }
        });
    });


    var form_data = $('#defaultForm').serialize();
    $(".colorpickerinput ").each(function () {
        var color = $(this).val();
        $(this).prev('.color-btn').css('background-color',color);
    });

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
        do_change_iframe($(this));
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

    function removeDis(){
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    }
    $("input,select").on('change', function() {
        removeDis();
    });


    String.prototype.colorRgbToHsl = function(stringMode = false){

        var backCycle = function (num, cycle) {
            let index = num % cycle;
            if (index < 0) {
                index += cycle;
            }
            return index;
        }
        var numberFixed = function (num = 0, count = 3) {
            const power = Math.pow(10, count);
            return Math.floor(num * power) / power;
        }
        var rgb2hsl = function (R = 0, G = 0, B = 0, stringMode = false) {
            const _R = R / 255;
            const _G = G / 255;
            const _B = B / 255;
            const Cmax = Math.max(_R, _G, _B);
            const Cmin = Math.min(_R, _G, _B);
            const V = Cmax - Cmin;

            let H = 0;
            if (V === 0) {
                H = 0;
            } else if (Cmax === _R) {
                H = 60 * (((_G - _B) / V) % 6);
            } else if (Cmax === _G) {
                H = 60 * ((_B - _R) / V + 2);
            } else if (Cmax === _B) {
                H = 60 * ((_R - _G) / V + 4);
            }

            H = Math.floor(backCycle(H, 360));
            const L = numberFixed((Cmax + Cmin) / 2);
            const S = V === 0 ? 0 : numberFixed(V / (1 - Math.abs(2 * L - 1)));

            var r1 = H;
            var g1 = numberFixed(100 * S);
            var b1 = numberFixed(100 * L);
            var r2 = r1;
            var g2 = '';
            var b2 = '';
            var b3 = '';
            if (g1 >= 90){
                g2 = 100;
            }else{
                g2 = g1 + 10;
            }
            if (b1 <= 15){
                b2 = 0;
            }else{
                b2 = b1 - 15;
            }
            if (b1 <= 9){
                b3 = 0;
            }else{
                b3 = b1 - 9;
            }

            if (stringMode) {
                // return `hsl(${H},${numberFixed(100 * S)}%,${numberFixed(100 * L)}%)`;
                return `linear-gradient(135.19deg,hsla(${r1},${g1}%,${b1}%,1),hsla(${r2},${g2}%,${b2}%,1))`;
            }else{

                return [`hsla(${r1},${g1}%,${b1}%,1)`,`hsla(${r2},${g2}%,${b3}%,1)`];
            }

        }
        var sColor = this.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i=1; i<4; i+=1) {
                    sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i=1; i<7; i+=2) {
                sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
            }
            return rgb2hsl(sColorChange[0],sColorChange[1],sColorChange[2],stringMode);
        }
        return sColor;
    };


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
    var iframe_button = $("#iframe-button");
    iframe_button.attr("src",iframe_button.attr('data-src'));
    function do_change_iframe(that,c_name = '',c_value = ''){
        var ajaxData = {};
        var style = '<style id="iframe-style">';
        var svg = null;
        $("#defaultForm").find('input').each(function () {
            if (c_name == '') {
                var name = $(this).attr('name');
            }else{
                var name = c_name;
            }
            if (c_value == '') {
                var value = $(this).val();
            }else{
                var value = c_value;
            }

            ajaxData[name] = value;
            switch (name) {
                case 'banner-color':
                    if (!ymqShopInfo['branding']['banner-images']){
                        style += `
                            .scroll-in{
                                background: ${value.colorRgbToHsl(true)};
                            }`;
                    }
                    style += `
                            .scroll-finished{
                                background: ${value.colorRgbToHsl(true)};
                            }`;
                    ajaxData['banner-background'] = value.colorRgbToHsl(true);
                    break;
                case 'banner-font':
                    style += `
                        .scroll-in-text .text-1,.scroll-in-text .text-2{
                            color: ${value}!important;
                        }`;
                    break;
                case 'button-color':
                    style += `
                        .btn{
                            border: 1px solid transparent;
                            background-color: ${value.colorRgbToHsl(false)[0]};
                            box-shadow: unset;
                        }
                        .btn:focus, .btn.disabled:focus,.btn:focus:active, .btn.disabled:focus:active,.btn:active, .btn:hover, .btn.disabled:active, .btn.disabled:hover{
                            background-color: ${value.colorRgbToHsl(false)[1]}!important;
                        }
                        `;
                    ajaxData['button-background'] = value.colorRgbToHsl(false)[0];
                    ajaxData['button-background-hover'] = value.colorRgbToHsl(false)[1];
                    break;
                case 'button-font':
                    style += `
                        .btn{
                            color: ${value};
                        }
                        .btn:focus, .btn.disabled:focus,.btn:focus:active, .btn.disabled:focus:active,.btn:active, .btn:hover, .btn.disabled:active, .btn.disabled:hover{
                            color: ${value};
                        }
                        `;
                    break;
                case 'link-color':
                    style += `
                        a{
                            color: ${value};
                        }
                        a:hover{
                            color: ${value};
                        }
                        `;
                    break;
                case 'icon-color':
                    svg = value;
                    break;
                case 'banner-image':
                    style += `
                        .scroll-in{
                            background-image: url(${value})!important;
                        }`;
                    break;
            }
        });
        style += '</style>';
        var data = {
            auth: 'ymq',
            action: 'admin-color',
            data: {
                style: style,
                svg: svg
            }
        };
        $("#iframe")[0].contentWindow.postMessage(data,'*');
    }

    $('.do-branding').on('click',function () {
        var that = $(this);
        that.addClass('btn-progress');
        var value = 0;
        if ($(this).attr('data-value') == 0){
            value = 1;
        }
        $.ymqajax({
            url: " /api/branding/ymq.html",
            data: {value},
            success: function (res) {
                var style = '';
                if (value == 1){
                    that.html('Show Ymq branding');
                    that.attr('data-value',1);
                    style = `
                        <style>
                            #logo{
                                height: 34px;
                            }
                            #logo .logo-item{
                                display: none;
                            }
                        </style>
                    `;
                }else{
                    that.html('Hide Ymq branding');
                    that.attr('data-value',0);
                    style = `
                        <style>
                            #logo{
                                height: unset;
                            }
                            #logo .logo-item{
                                display: inline-block;
                            }
                        </style>
                    `;
                }
                var data = {
                    auth: 'ymq',
                    action: 'admin-color',
                    data: {
                        style: style,
                        svg: null
                    }
                };
                $("#iframe")[0].contentWindow.postMessage(data,'*');
                form_data = $('#defaultForm').serialize();
                that.removeClass('btn-progress');
            }
        });
    });
    $(".color-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            var ajaxData = {};
            $("#defaultForm").find('input').each(function () {
                var name = $(this).attr('name');
                var value = $(this).val();
                console.log(value)
                ajaxData[name] = value;
                console.log(value.colorRgbToHsl(true));
                switch (name) {
                    case 'banner-color':
                        ajaxData['banner-background'] = value.colorRgbToHsl(true);
                        break;
                    case 'button-color':
                        ajaxData['button-background'] = value.colorRgbToHsl(false)[0];
                        ajaxData['button-background-hover'] = value.colorRgbToHsl(false)[1];
                        break;
                }
            });
            $.ymqajax({
                url: " /api/branding/color.html",
                data: ajaxData,
                success: function (res) {
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });

    $("#wallpaper input").on('change',function () {
        var data = {
            auth: 'ymq',
            action: 'admin-wallpaper',
            data: $(this).val()
        };
        $("#iframe")[0].contentWindow.postMessage(data,'*');
    });
    $(".wallpaper-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            $.ymqajax({
                url: " /api/branding/wallpaper.html",
                data: {wallpaper:$("input[name='wallpaper']:checked").val()},
                success: function (res) {
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });
    if(jQuery().selectric) {
        $(".shapes").selectric({
            disableOnMobile: false,
            nativeOnMobile: false,
            optionsItemBuilder: function(itemData) {
                return `<div class="flex-justify-content-start"><div class="option-redio mr-3 ${itemData.text}"></div> ${itemData.text}</div>`;
                // return itemData.value.length ? '<span class="ico ico-' + itemData.value +  '"></span>' + itemData.text : itemData.text;
            },
            labelBuilder: function (itemData) {
                return `<div class="flex-justify-content-start"><div class="option-redio mr-2 ${itemData.text}"></div> ${itemData.text}</div>`;
            }
        });
    }

    $("#shapes select").on('change',function () {
        var ajaxData = {};
        var style = '<style id="iframe-style">';
        $("#shapes select").each(function () {
            var name = $(this).attr('name');
            var value = $(this).val();
            ajaxData[name] = value;
            switch (name) {
                case 'card':
                    style += `
                        .card{
                            border-radius: ${value}em!important;
                        }`;
                    break;
                case 'button':
                    style += `
                        .btn{
                            border-radius: ${value}em!important;
                        }`;
                    break;
                case 'input':
                    style += `
                        .form-control{
                            border-radius: ${value}em!important;
                        }`;
                    break;

            }
        });
        style += '</style>';
        if ($(this).attr('name') == 'container'){
            $("#iframe").css('border-radius',$(this).val()+'em');
        }else{
            var data = {
                auth: 'ymq',
                action: 'admin-shapes',
                data: style
            };
            $("#iframe")[0].contentWindow.postMessage(data,'*');
        }
    });

    $(".shape-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            $.ymqajax({
                url: " /api/branding/shape.html",
                data: $('#defaultForm').serialize(),
                success: function (res) {
                    console.log(res);
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });

    $("#placement input,#placement select").on('change',function () {
        var name = $(this).attr('name');
        switch (name) {
            case 'position':
                if($(this).val() == 'left'){
                    $(".right-hide").hide();
                    $(".left-hide").css('display','inline-block');
                    $(".ifrem-botton-box").removeClass('text-right').addClass('text-left');
                    $(".right-bottom-ruler-box").removeClass('text-right').addClass('text-left');
                    $('.bottom-ruler').removeClass('right-bottom-ruler').addClass('left-bottom-ruler');
                }else{
                    $(".left-hide").hide();
                    $(".right-hide").css('display','inline-block');
                    $(".ifrem-botton-box").removeClass('text-left').addClass('text-right');
                    $(".right-bottom-ruler-box").removeClass('text-left').addClass('text-right');
                    $('.bottom-ruler').removeClass('left-bottom-ruler').addClass('right-bottom-ruler');
                }
                break;
            case 'side':
                $(".side-val").html($(this).val()+'px');
                break;
            case 'bottom':
                $(".bottom-val").html($(this).val()+'px');
                break;

        }
    });
    $(".placement-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            $.ymqajax({
                url: " /api/branding/placement.html",
                data: $('#defaultForm').serialize(),
                success: function (res) {
                    console.log(res);
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });
    $(".visibility-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');
            $.ymqajax({
                url: " /api/branding/visibility.html",
                data: $('#defaultForm').serialize(),
                success: function (res) {
                    console.log(res);
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                }
            });
        }
    });
});


var icon_point_arr = [];
var icon_commission_arr = [];
var icon_sign_in_arr = [];
var icon_free_product_arr = [];
var icon_earn_arr = [];
var icon_redeem_arr = [];
var icon_history1_arr = [];
var icon_history2_arr = [];
var icon_order_arr = [];
var icon_birthday_arr = [];
var icon_register_arr = [];
var icon_twitterlike_arr = [];
var icon_twittershare_arr = [];
var icon_facebooklike_arr = [];
var icon_facebookshare_arr = [];
var icon_instagram_arr = [];
var icon_fixedamount_arr = [];
var icon_incrementsamount_arr = [];
var icon_percentage_arr = [];
var icon_freeshipping_arr = [];
var icon_pending_arr = [];
var icon_approved_arr = [];
var icon_not_approved_arr = [];
var icon_finish_arr = [];
var icon_arr = ['point','commission','sign_in','free_product','earn','redeem','history1','history2','order','birthday','register','twitterlike','twittershare','facebooklike','facebookshare','instagram','fixedamount','incrementsamount','percentage','freeshipping','finish','not_approved','approved','pending'];

$(document).ready(function() {
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
    
    $('.icon-save').on('click',function () {
        var that = $(this);
        that.addClass('btn-progress');
        $.ymqajax({
            url: " /api/branding/icon",
            data: $('#defaultForm').serialize(),
            success: function (res) {
                console.log(res)
                //$("#iframe")[0].contentWindow.postMessage(data,'*');
                form_data = $('#defaultForm').serialize();
                that.removeClass('btn-progress');
            }
        });
    });
    if ($('#sortable_home').length > 0) {
        new Sortable(sortable_home, {
            handle: '.handle',
            animation: 150,
            ghostClass: 'blue-background-class',
            chosenClass: "sort_chosen",
            dragClass: "sort_drag",
            // 列表的任何更改都会触发
            onSort: function (/**Event*/evt) {
                
                // same properties as onEnd
            }
        });  
    }
    
    
    $(".layout_save").on('click',function () {
        var that = $(this);
        that.addClass('btn-progress').addClass('disabled');
        var sortable_home = [];
        $('#sortable_home .sortable_li').each(function(){
            sortable_home.push($(this).data('sortable'))
        })
        var sortable_home = sortable_home.toString(); 
        $.ymqajax({
            url: " /api/branding/layout",
            data: {sortable_home},
            success: function (res) {
                that.removeClass('btn-progress').removeClass('disabled');
            }
        });
        return false;
    });
});


