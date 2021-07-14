(function($, window, i) {
    $.fn.optiondropdown = function(options) {
        var options = $.extend({

        }, options);
        this.each(function() {
            i++;
            /**
             * 初始化
             * @type {{}}
             */
            var that = $(this);
            var slected = {};
            var disabled = {};
            if (that.hasClass('ymq-inited')) {
                var multiple = that.hasClass('ymq-multiple');
                var parentBox = that.parents('.selectDropdown');
                var label = that.next().next();
                initLabelTextAndLiActiveClass();
            }else{
                refreshSelected();
                var multiple = that.hasClass('ymq-multiple');
                var dropdown = $('<div />').addClass(`ymq-dropdown selectDropdown ${multiple ? 'multiple' : ''}`);

                that.wrap(dropdown);

                var label = $('<span />').text($(this).attr('placeholder')).insertAfter($(this));
                var list = $('<ul class="ymq-multiple-ul"></ul>');


                that.find('option').each(function(index) {
                    list.append($(`<li data-index="${index}" class="ymq-multiple-li ${$(this).prop("disabled") ? 'disabled' : ''}"></li>`).append($('<a />').html($(this).html())));
                });
                list.insertAfter($(this));
                var parentBox = that.parents('.selectDropdown');
                if (!multiple){
                    that.val('');
                }
                if(!$.isEmptyObject(slected)){
                    initLabelTextAndLiActiveClass();
                    that.parent().addClass('filled');
                }

                that.addClass('ymq-inited');

                /**
                 * 绑定事件
                 */

                parentBox.find('ul li a').on('click touch', function(e) {
                    var liAdom = $(this);
                    if (liAdom.parent('li').hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }

                    var dropdown = $(this).parents('.selectDropdown');
                    var select = dropdown.find('.ymq-dropdown');
                    var multiple = that.hasClass('ymq-multiple');
                    var active = $(this).parent().hasClass('active');
                    var label = active ? dropdown.find('select').attr('placeholder') : $(this).text();

                    if (multiple){
                        liAdom.parents('.ymq-multiple-li').toggleClass('active');
                        that.find('option').eq(liAdom.parents('.ymq-multiple-li').data('index')).prop('selected', liAdom.parents('.ymq-multiple-li').hasClass('active'));
                        initLabelTextAndLiActiveClass();
                    }else{
                        dropdown.find('option').prop('selected', false).change();
                        dropdown.find('ul li').removeClass('active');
                        that.val('');
                        dropdown.toggleClass('filled', !active);
                        dropdown.children('span').text(label);

                        if(!active) {
                            dropdown.find('option:contains(' + $(this).text() + ')').prop('selected', true).change();
                            $(this).parent().addClass('active');
                        }
                    }
                    select.trigger('change');
                    //如果是多选选择之后则不关闭下拉选项
                    if(multiple){
                        e.preventDefault();
                        return false;
                    }


                });

                /**
                 *
                 */
                parentBox.on('click touch', function(e) {
                    var isOpen = false;
                    if($(this).hasClass('open')){
                        isOpen = true;
                    }
                    $('.ymq-dropdown').removeClass('open');
                    if(!isOpen){
                        $(this).addClass('open');
                    }
                    e.preventDefault();
                    return false;
                });
            }







            //方法区
            function initLabelTextAndLiActiveClass() {
                refreshSelected();
                var label_html = '';
                parentBox.find('.ymq-multiple-li').removeClass('active').removeClass('disabled');
                Object.keys(slected).forEach(function(key){
                    var data = slected[key];
                    if(multiple){
                        label_html += `<span class="ymq-multiple-item-box"><span class="ymq-multiple-item"><span class="ymq-multiple-text">${data['text']}</span> <span data-index="${key}" class="ymq-multiple-remove"></span></span></span></span>`;
                    }else{
                        label_html = data['text'];
                    }
                    parentBox.find('.ymq-multiple-li').eq(key).addClass('active');
                });

                Object.keys(disabled).forEach(function(key){
                    var data = disabled[key];
                    parentBox.find('.ymq-multiple-li').eq(key).addClass('disabled');
                });

                if(label_html == ''){
                    label_html = that.attr('placeholder');
                }
                label.html(label_html);
                parentBox.find('.ymq-multiple-remove').on('click touch', function(e) {
                    that.find('option').eq($(this).data('index')).prop('selected', false);
                    that.trigger('change');
                    initLabelTextAndLiActiveClass();
                    e.preventDefault();
                    return false;
                });
            }

            function refreshSelected() {
                slected = {};
                disabled = {};
                that.find('option').each(function(index) {
                    if($(this).prop('selected') && !$(this).prop('disabled')){
                        slected[index] = {
                            'value': $(this).val(),
                            'text': $(this).html(),
                        };
                    }
                    if ($(this).prop('disabled')) {
                        disabled[index] = {
                            'value': $(this).val(),
                            'text': $(this).html(),
                        };
                    }
                });
            }

        });
    }
    $(document).on('click touch', function(e) {
        $('.ymq-dropdown').removeClass('open');
    });
})(jQuery, this, 0);

$(document).ready(function () {
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
    $('.ymq-dropdown').optiondropdown();
    $('.start-button-next').on('click',function () {
        $('.start-item').removeClass('active');
        $(`.start-item-${$(this).data('next')}`).addClass('active');
        $('.progress-bar').css('width','25%');
    });
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
    $('.start-creat-account').on('click',function () {
        var email = $('#email').val();
        var that = $(this);
        var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(!reg.test(email)){
            $('.invalid-feedback').addClass('opacity-1');
            $('#email').addClass('is-invalid');
            return false;
        }
        $('.invalid-feedback').removeClass('opacity-1');
        $('#email').removeClass('is-invalid');
        that.addClass('btn-progress').children('.start-next').hide();
        var email = $('#email').val();
        var password = $('#password').val();
        $.ajax({
            type: 'POST',
            url: '/api/auth/creat',
            dataType: 'json',
            data: {email,password},
            success: function (res) {
                if (res.code == 0){
                    iziToast.error({
                        message: res.msg,
                        position: 'bottomCenter'
                    });
                }
                if (res.code == 1){
                    $('.progress-bar').css('width','50%');
                    $('.start-item').removeClass('active');
                    $('.start-item-3').addClass('active');
                }
                that.removeClass('btn-progress').children('.start-next').show();

            },
            error: function (jqXHR) {
                that.removeClass('btn-progress').children('.start-next').show();
            }
        });
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
        $(".colorpickerinput").each(function () {
            var name = $(this).attr('name');
            var value = $(this).val();
            switch (name) {
                case 'banner-color':
                    $('.start-color-header').css('background',value.colorRgbToHsl(true));
                    break;
                case 'banner-font':
                    $('.start-color-header p').css('color',value);
                    break;
                case 'button-color':
                    $('.start-color-button').css({
                        'background-color': value.colorRgbToHsl(false)[0],
                        'box-shadow': 'unset',
                        'border': 'unset'
                    });
                    var styleHtml = `
                        .start-color-button:focus, .start-color-button.disabled:focus,.start-color-button:focus:active, .start-color-button.disabled:focus:active,.start-color-button:active, .start-color-button:hover, .start-color-button.disabled:active, .start-color-button.disabled:hover{
                            background-color: ${value.colorRgbToHsl(false)[1]}!important;
                        }
                        `;
                    $('#start-style').html(styleHtml);
                    break;
                case 'button-font':
                    $('.start-color-button').css('color',value);
                    break;
                case 'icon-color':
                    $('.icon_path').attr('fill',value);
                    break;
            }
        });
    });

    var start_form_data = $('#color-form').serialize();

    $('.start-color-button').on('click',function () {
        if (start_form_data == $('#color-form').serialize()){
            $('.progress-bar').css('width','75%');
            $('.start-item-3-left').removeClass('active');
            $('.start-item-3-left-2').addClass('active');
        }else{
            var data = {
                'banner-background': $("input[name='banner-color']").val().colorRgbToHsl(true),
                'banner-color': $("input[name='banner-color']").val(),
                'banner-font': $("input[name='banner-font']").val(),
                'button-background': $("input[name='button-color']").val().colorRgbToHsl(false)[0],
                'button-background-hover': $("input[name='button-color']").val().colorRgbToHsl(false)[1],
                'button-color': $("input[name='button-color']").val(),
                'button-font': $("input[name='button-font']").val(),
                'icon-color': $("input[name='icon-color']").val(),
                'link-color': '#6777EF',
            };
            var that = $(this);
            that.addClass('btn-progress').children('.start-next').hide();
            $.ajax({
                type: 'POST',
                url: '/api/branding/color',
                dataType: 'json',
                data: data,
                success: function (res) {
                    if (res.code == 0){
                        iziToast.error({
                            message: res.msg,
                            position: 'bottomCenter'
                        });
                    }
                    if (res.code == 1){
                        $('.progress-bar').css('width','75%');
                        $('.start-item-3-left').removeClass('active');
                        $('.start-item-3-left-2').addClass('active');
                    }
                    that.removeClass('btn-progress').children('.start-next').show();

                },
                error: function (jqXHR) {
                    that.removeClass('btn-progress').children('.start-next').show();
                }
            });
        }
    });
    var start_lan_form = $('#start-lan-form').serialize();
    $("input[name='title']").on('keyup',function () {
        $('.start-color-header .text-2').html($(this).val());
    });
    $('.start-lan-button').on('click',function () {
        if (start_lan_form == $('#start-lan-form').serialize()){
            $('.progress-bar').css('width','100%');
            $('.start-item').removeClass('active');
            $('.start-item-4').addClass('active');
        }else{
            var that = $(this);
            that.addClass('btn-progress').children('.start-next').hide();
            $.ajax({
                type: 'POST',
                url: '/api/branding/startlan',
                dataType: 'json',
                data: $('#start-lan-form').serialize(),
                success: function (res) {
                    if (res.code == 0){
                        iziToast.error({
                            message: res.msg,
                            position: 'bottomCenter'
                        });
                    }
                    if (res.code == 1){
                        $('.progress-bar').css('width','100%');
                        $('.start-item').removeClass('active');
                        $('.start-item-4').addClass('active');
                    }
                    that.removeClass('btn-progress').children('.start-next').show();

                },
                error: function (jqXHR) {
                    that.removeClass('btn-progress').children('.start-next').show();
                }
            });
        }
    });

    $("input[name='icon']").on('change',function () {
        var icon = $("input[name='icon']:checked").next().find('img').attr('src');
        icon = icon.replaceAll('rgb(0%2C%200%2C%200)',encodeURIComponent('#FFFFFF'));
        $('.right-icon-img').attr('src',icon);
    });


    $('.start-icon-button').on('click',function () {
        var that = $(this);
        that.addClass('btn-progress').children('.start-next').hide();
        $.ajax({
            type: 'POST',
            url: '/api/branding/startlauncher',
            dataType: 'json',
            data: {icon: $("input[name='icon']:checked").val()},
            success: function (res) {
                if (res.code == 0){
                    iziToast.error({
                        message: res.msg,
                        position: 'bottomCenter'
                    });
                    that.removeClass('btn-progress').children('.start-next').show();
                }
                if (res.code == 1){
                    window.location.href = "/";
                }

            },
            error: function (jqXHR) {
                that.removeClass('btn-progress').children('.start-next').show();
            }
        });
    });
});