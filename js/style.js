//ajax4shop
"use strict";$.extend({ymqajax:function(options){var url=options.hasOwnProperty("url")?options.url:"";var type=options.hasOwnProperty("type")?options.type:"post";var async=options.hasOwnProperty("async")?options.async:true;var data=options.hasOwnProperty("data")?options.data:null;var dataType=options.hasOwnProperty("dataType")?options.dataType:"json";var isiziToast=options.hasOwnProperty("iziToast")?options.iziToast:false;var btn=options.hasOwnProperty("btn")?options.btn:false;var dosuccess=options.hasOwnProperty("dosuccess")?options.dosuccess:false;var success=function(res){if(res.code==403){iziToast.error({message:__("please_login_first"),position:"topCenter"});return}if(res.code==405){iziToast.error({message:__("illegal_operation"),position:"topCenter"});return}if(res.code==201){iziToast.show({message:__("no_data_found"),position:"bottomCenter"});if(dosuccess){if(options.hasOwnProperty("success")){options.success(res)}}return}if(isiziToast=="success"){iziToast.success({message:__(res.msg),position:"topCenter"})}else{if(isiziToast=="show"){iziToast.show({message:__(res.msg),position:"bottomCenter"})}}if(options.hasOwnProperty("success")){options.success(res)}};var error=function(xhr,textStatus,errorThrown){iziToast.show({message:__("Service is busy, please try again"),position:"bottomCenter"})};var complete=function(xhr){hideload();if(btn){btn.removeClass("btn-progress")}if(options.hasOwnProperty("complete")){options.complete(xhr)}};$.ajax({url:url,type:type,data:data,dataType:dataType,async:async,headers:{"Ymq-Customer-Id":ymq_customer_id,"Ymq-Ctoken":ymq_ctoken,"Ymq-Shop-Name":shop_data["name"]},success:function(res){success(res)},error:function(xhr,textStatus,errorThrown){error(xhr,textStatus,errorThrown)},complete:function(xhr){complete(xhr)}})}});
//boxpc
$.fn.RangeSlider=function(cfg){this.sliderCfg={min:cfg&&!isNaN(parseFloat(cfg.min))?Number(cfg.min):null,max:cfg&&!isNaN(parseFloat(cfg.max))?Number(cfg.max):null,step:cfg&&Number(cfg.step)?cfg.step:1,callback:cfg&&cfg.callback?cfg.callback:null};var $input=$(this);var min=this.sliderCfg.min;var max=this.sliderCfg.max;var step=this.sliderCfg.step;var callback=this.sliderCfg.callback;$input.attr('min',min).attr('max',max).attr('step',step);$input.bind("input",function(e){$input.attr('value',this.value);$input.css('background','linear-gradient(to right, #059CFA, white '+this.value+'%, white)');if($.isFunction(callback)){callback(this)}})};var per_page_num=50;var goback_arr=[];var ymq_shopify_address_init=null;var ymq_shopify_address_country_init=null;var cid=$("#app").attr('data-cid');var ctoken=$("#app").attr('data-ctoken');var prev_page='';var is_show_shot=true;console.log(shop_data);function showHidePage(show_class){$(".ymq-main-content").hide();$(".ymq-content").hide();$(".top-goback").data(show_class)}function showload(){$('.ymq-loading .load').show()}function hideload(){$('.ymq-loading .load').hide()}function all_init_iframe_show(){var data={auth:'ymq',action:'iframe-show',data:{}}window.parent.postMessage(data,"*")}function checkemail(email){var pattern=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;if(pattern.test(email)){return true}else{return false}}function getTranslatey(string){var string=string.split('matrix(');if(string[1]){string=string[1].split(')');if(string[0]){string=string[0].split(',');if(string[5]){string=string[5].replace(/(^\s*)|(\s*$)/g,"");return Number(string)}}}return 0}function getUuname(){return'U'+(((1+Math.random())*0x10000)|0).toString(16).substring(1)}function intervalResult(maxCount,time,flgBool,loopFn){if(typeof maxCount=="function"){loopFn=time;flgBool=maxCount;time=1000;maxCount=20}else if(typeof time=="function"){loopFn=flgBool;flgBool=time;time=1000}if(typeof flgBool!="function"){flgBool=function(){return false}}var i=0;var invSet=setInterval(function(){i++;if(i>maxCount||flgBool(i)){clearInterval(invSet);return}if(typeof loopFn=="function"){loopFn()}},time)}function getTranslateYValue(translateString){var n=translateString.indexOf(",");var n1=translateString.indexOf(")");var res=parseInt(translateString.slice(n+1,n1-1));return res}function getTranslateValues(matrix){if(matrix=='none'){return{x:0,y:0,z:0}}const matrixType=matrix.includes('3d')?'3d':'2d'const matrixValues=matrix.match(/matrix.*\((.+)\)/)[1].split(', ')if(matrixType==='2d'){return{x:matrixValues[4],y:matrixValues[5],z:0}}if(matrixType==='3d'){return{x:matrixValues[12],y:matrixValues[13],z:matrixValues[14]}}}function show_shot_header(fun){$('.in-top-content').addClass('ispage').removeClass('nopage');var initJson=getTranslateValues($(".scroll-in").css('transform'));var initY=0;if(initJson.hasOwnProperty("y")){initY=initJson['y']}$(".scroll-in").velocity({translateY:[-100,initY]},{duration:250,complete:function(){$('.scroll-finished').show();$('.scroll-in').hide();fun()}});is_show_shot=false}function show_long_header(fun){$('.in-top-content').addClass('nopage').removeClass('ispage');$('.scroll-finished').hide();$('.scroll-in').show();$(".scroll-in").velocity({translateY:[0,-100]},{duration:250,complete:function(){fun()}});is_show_shot=true}$(document).ready(function(){$(".aaaaaa").on('click',function(){$("#ymq-refer_page").click()});$("#scroll-box .close").on('click',function(){var data={auth:'ymq',action:'down-button-box',data:{}}window.parent.postMessage(data,"*")});all_init_iframe_show();$(document).on('click',".ymq-tab",function(){if($(this).hasClass('triggertab2')){$(".ymq-main-content").hide();$(".ymq-content").hide();$("."+$(this).data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({left:0,opacity:1},{duration:150,easing:'easeInOutQuart'});$(this).removeClass('triggertab2');goback_arr.push($(this).data("showtab"))}else{var that=$(this);show_shot_header(function(){$('.header_title').html(that.data("header_title"));$('.header_detail').html(that.data("header_detail"));$('.top-close').removeClass('top-close-blcak').addClass('top-close-white');$(".top-goback").show();$("."+that.data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({left:0,opacity:1},{duration:150,easing:'easeInOutQuart'})});$(".ymq-main-content").hide();$('#app').css('background','#f9f9f9');goback_arr.push(that.data("showtab"))}})$("#ymq-review").click(function(){$('.write_review').show()})$(document).on('click',".ymq-tab-2",function(){$('.'+goback_arr[goback_arr.length-1]).attr('data-top',$(".in-top-content").scrollTop());$(".in-top-content").scrollTop(0);$(".ymq-main-content").hide();$(".ymq-content").hide();$("."+$(this).data("showtab")).show().css({"position":"relative","left":"40px","right":"unset","opacity":"0"}).velocity({left:0,opacity:1},{duration:150,easing:'easeInOutQuart'});goback_arr.push($(this).data("showtab"))});$(".top-goback").click(function(){hideload();goback_arr.pop();if(goback_arr[goback_arr.length-1]!=undefined){$(".ymq-content").hide();$('.'+goback_arr[goback_arr.length-1]).show().css({"position":"relative","right":"40px","left":"unset","opacity":"0"}).velocity({right:0,opacity:1},{duration:150,easing:'easeInOutQuart'});$(".in-top-content").scrollTop($('.'+goback_arr[goback_arr.length-1]).attr('data-top'));if(prev_page!=''){$(this).data('back',prev_page);prev_page=''}else{$(this).data('back','')}can_scroll=false}else{$('#app').css('background','');$(".ymq-content").hide();$(".top-goback").hide();show_long_header(function(){$('.header_title').html($('.header_title').attr('data-text'));$('.header_detail').html($('.header_detail').attr('data-text'));$('.top-close').removeClass('top-close-white').addClass('top-close-blcak');$(".ymq-main-content").show().css({"position":"relative","right":"40px","left":"unset","opacity":"0"}).velocity({right:0,opacity:1},{duration:150,easing:'easeInOutQuart'})});can_scroll=false}})$(".in-top-content").scroll(function(){if(!$('.in-top-content').hasClass('ispage')){var top=$(this).scrollTop();if(top<=0){top=0}if(top<=65&&top>=0){var topc=top*top/40;$('.scroll-in').css('transform',`translateY(-${topc}px)`);if(top==65){if($('.scroll-finished').css('display')=='none'){$('.scroll-finished').show();$('.scroll-in').hide();$('.top-close').removeClass('top-close-blcak').addClass('top-close-white')}}else{if($('.scroll-in').css('display')=='none'){$('.scroll-finished').hide();$('.scroll-in').show();$('.top-close').removeClass('top-close-white').addClass('top-close-blcak')}}}else{if($('.scroll-finished').css('display')=='none'){$('.scroll-finished').show();$('.scroll-in').hide();$('.top-close').removeClass('top-close-blcak').addClass('top-close-white')}}}});$("#ymq-sign").on('click',function(){if(customeinfo!=null){if($('.sign-content .card').length>0){return}showload();$.ymqajax({url:"/api/signin/sign",data:{cid:cid,shop_name:shop_data.name,ctoken:ctoken},success:function(res){var pushHtml=`<div class="card"><div class="card-body">${res.data}<div class="text-right do-sign-box"><button class="btn btn-primary dosign">${__('sign_in')}</button></div></div></div>`;$('.sign-content').append(pushHtml)}})}else{iziToast.error({message:__('please_login_first'),position:'topCenter'});e.stopPropagation()}});$(document).on('click',".dosign",function(){var that=$(this);var cid=$("#app").attr('data-cid');var shop_name=$("#app").attr('data-shop_name');var ctoken=$("#app").attr('data-ctoken');that.addClass('btn-progress');$.ymqajax({url:"/api/signin/dosign",btn:that,success:function(res){if(res.msg=='already_signed_in'){iziToast.show({message:__(res.msg),position:'topCenter'});return false}if(that.hasClass('signin')){iziToast.show({message:__(res.msg),position:'topCenter'})}$("#calendar-box .today").addClass('signed');that.attr('disabled','disabled');changeSignPoint(res.data.points)}})});function changeSignPoint(point=0){var nowPoint=availablePoint;availablePoint=availablePoint+point;$('.home_point').text($('.home_point').text().replace(nowPoint,availablePoint))$('#ymq-point').data('header_detail',availablePoint);if($('.header_detail').text()!=''){$('.header_detail').text(availablePoint)}}})window.onload=function(){$("#logo").animate({"padding-top":'6px',opacity:'1'})}function setDate(beforeDate){return beforeDate.substring(0,10).replace(/-/g,"/")}function getTimestamp(time){return Date.parse(new Date(time))/1000}$(document).ready(function(){window.parent.postMessage({auth:'ymq',action:'admin-loading',data:{}},"*");window.addEventListener('message',function(e){var res=e.data;if(res.hasOwnProperty('auth')&&res.auth=='ymq'){switch(res.action){case'admin-color':admin_color(res.data);break;case'admin-wallpaper':admin_wallpaper(res.data);break;case'admin-shapes':admin_shapes(res.data);break;case'post-ymq-address-init-data':ymq_shopify_address_init=res.data;break;case'referral-link':$(res.data.id).trigger('click');var contentDom=$(`.${$(res.data.id).attr('data-showtab')}`);contentDom.find('.referral_name').html(res.data.name);contentDom.find("input[name='refer_name']").val(res.data.name);contentDom.find("input[name='referral_link']").val(res.data.link);break;case'toggle-shop-box':toggle_shop_box(res.data.display);break;case'admin-sortable':admin_sortable(res.data.sortable);break;case'admin-header':admin_header(res.data);break}}},false);function admin_sortable(data){var html='';data.forEach(function(item){html+=$(`.sort_${item}`).prop('outerHTML')});$("#home .ymq-main-content").html(html)}function admin_header(data){$('.text-1').html(data['caption']);if(data.hasOwnProperty("title")){$('.text-2').html(data['title'])}}function toggle_shop_box(display){if(display=='none'){$('#app').show().velocity({'margin-top':[0,60],opacity:[1,0]},{duration:250,easing:'easeInOutQuart',complete:function(){}})}else{$('#app').velocity({'margin-top':[60,0],opacity:[0,1]},{duration:250,easing:'easeInOutQuart',display:'none',complete:function(){window.parent.postMessage({auth:'ymq',action:'velocity-shop-box-show',data:{}},"*")}})}}function admin_color(data){$("#iframe-style").remove();$('body').append(data.style);if(data.svg){$('.icon_path').attr('fill',data.svg)}}function admin_wallpaper(data){$("#app").css('background-image',`url(/svg/index/wallpaper.html?icon=${data})`)}function admin_shapes(data){$("#iframe-style").remove();$('body').append(data)}})
//point
$(document).ready(function () {
    //point滚动加载用:开始
    var nowScorrle = '';
    var page;
    var IsHas;
    var accessPage = 0;
    var accessIsHas = true;
    var spendingPage = 0;
    var spendingIsHas = true;
    var can_scroll = false;
    //point滚动加载用:结束
    $(".top-goback").click(function(){
        can_scroll = false;
    })
    if (customeinfo != null) {
        if (customeinfo.birthday != '') {
            $(".month_select").find("option").attr("disabled",true);
            $(".date_select").find("option").attr("disabled",true);
            $(".month_select").find("option").eq(0).attr("selected",false);
            $(".date_select").find("option").eq(0).attr("selected",false);
            var birthday_arr = customeinfo.birthday.split('/');
            $(".month_select").find("option").eq(birthday_arr[0]-1).attr("disabled",false);
            $(".date_select").find("option").eq(birthday_arr[1]-1).attr("disabled",false);
            $(".month_select").find("option").eq(birthday_arr[0]-1).attr("selected",true);
            $(".date_select").find("option").eq(birthday_arr[1]-1).attr("selected",true);
        }
    }
    
    $('.month_select_box').selectFilter({
        callBack : function (val){
            var smallMonth = [4,6,9,11];
            if ($.inArray(val, smallMonth) >= 0) {
                $('.date_select').next().find('li').eq(30).addClass('filter-disabled')
                if ($('.date_day_show').text() == 31) {
                    $('.date_select').next().find('li:first').click()
                    $('.date_select').next().hide()
                }
            }
            if (val == 2) {
                $('.date_select').next().find('li').eq(28).addClass('filter-disabled')
                $('.date_select').next().find('li').eq(29).addClass('filter-disabled')
                $('.date_select').next().find('li').eq(30).addClass('filter-disabled')
                if ($('.date_day_show').text() > 28) {
                    $('.date_select').next().find('li:first').click()
                    $('.date_select').next().hide()
                }
            }
        }
    });
    $('.date_select_box').selectFilter({
        callBack : function (val){
            console.log(val)
        }
    });
    $('.save_date').click(function(){
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/setbirthday",
            iziToastType: 'success',
            data : {month:$('.date_month_show').text(),day:$('.date_day_show').text()},
            success : function(result) {
                $('.cart-point-box,.cart-point-box .doclose').click()
                that.removeClass('btn-progress');
                that.hide()
            },
            error : function(result){
                that.removeClass('btn-progress');
            }
        });

    });
    $(document).on('click', ".filter-disabled", function () {
        return false;
    });
    $(".point-tab-access").click(function(){
        nowScorrle = 1;
        page = accessPage;
        if ($('.point-access-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/pointgetlist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.point-access-content .ishas').length <= 0){
                        if (Object.keys(result.data).length > 0) {
                            var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('access_records')}</h6>
                                </div>
                            </div>
                        `;
                            pushHtml += creataccesshtml(result);
                            if (Object.keys(result.data).length < per_page_num) {
                                accessIsHas = false;
                                IsHas = false;
                            }
                            accessPage += 1;
                            page += 1;
                            $('.point-access-content').append(pushHtml);
                            setTimeout(function(){
                                can_scroll = true;
                                IsHas = accessIsHas;
                            },1000);
                        }
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = accessIsHas;
            },1000);
        }

    })



    $(".point-tab-spending").click(function(){
        nowScorrle = 0;
        page = spendingPage;
        if ($('.point-spending-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/pointuselist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.point-spending-content .ishas').length <= 0){
                        if (Object.keys(result.data).length > 0) {
                            var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('redeem_record')}</h6>
                                </div>
                            </div>
                        `;
                            pushHtml += creatspendinghtml(result);
                            if (Object.keys(result.data).length < per_page_num) {
                                spendingIsHas = false;
                                IsHas = false;
                            }
                            spendingPage += 1;
                            page += 1;

                            $('.point-spending-content').append(pushHtml);
                            hideload()

                            setTimeout(function(){
                                can_scroll = true;
                                IsHas = spendingIsHas;
                            },1000);
                        }
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = spendingIsHas;
            },1000);
        }

    })
    $(".point-ways_to_earn").click(function(){
        if ($('.point-ways_to_earn_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getwaytoearnlist",
                success : function(result) {
                    if ($('.point-ways_to_earn_cart .cart-item').length <= 0){
                        var l_arr = {2:'birthday',3:'signin',4:'p_order',5:'follow_twitter',6:'sharetwitter',7:'like_facebook',8:'share_facebook',9:'follow_instagram'};
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_earn')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            var add_point = '';
                            if (!$.isEmptyObject(level_info) && item.id > 1) {
                                if (level_info[l_arr[item.id]] > 0) {
                                    var add_point = '+'+level_info[l_arr[item.id]];
                                }
                            }
                            var isinclude = false;
                            pushHtml += `
                        <div class="cart-item row ${item.geted == 1 ? 'isinclude': ''}">
                            <div class="col-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-${item.id == 4 ? '10' : '6'} cart-item-center" style="padding-right:0;">`;
                            if (item.id == 1){
                                pushHtml += `<p class="earn-name">${__('sign_up')}</p>`;
                            }else if(item.id == 2){
                                pushHtml += `<p class="earn-name">${__('celebrate_birthday')}</p>`;
                            }else if(item.id == 3){
                                pushHtml += `<p class="earn-name">${__('sign_in')}</p>`;
                            }else if(item.id == 4){
                                pushHtml += `<p class="earn-name">${__('place_order')}</p>`;
                            }else if(item.id == 5){
                                pushHtml += `<p class="earn-name">${__('follow_on_twitter')}</p>`;
                            }else if(item.id == 6){
                                pushHtml += `<p class="earn-name">${__('share_on_twitter')}</p>`;
                            }else if(item.id == 7){
                                pushHtml += `<p class="earn-name">${__('like_on_facebook')}</p>`;
                            }else if(item.id == 8){
                                pushHtml += `<p class="earn-name">${__('facebook_share')}</p>`;
                            }else if(item.id == 9){
                                pushHtml += `<p class="earn-name">${__('instagram_follow')}</p>`;
                            }else if(item.id == 10){
                                pushHtml += `<p class="earn-name">${__('your_recommended_users_place_orders')}</p>`;
                            }
                            if (item.id == 4){
                                if (item.setting.type_id == 0) {
                                    pushHtml += `<p class="earn-point">${__('order_total_rate',[item.points+add_point])}% ${__('points')}</p>`;
                                }else{
                                    pushHtml += `<p class="earn-point">${item.points}${add_point} ${__('points')}</p>`;
                                }

                            }else{
                                pushHtml += `<p class="earn-point">${item.points}${add_point} ${__('points')}</p>`;
                            }

                            pushHtml += `</div>`;
                            if (item.id == 5 || item.id == 6 || item.id == 7 || item.id == 8 || item.id == 9) {
                                var share_class = "share_btn";
                                var share_data = `data-id="${item.id}"`;
                            }
                            if (customeinfo != null){
                                if (item.geted == 1){
                                    pushHtml += `
                                    <div class="col-4 t-right way_right">
                                        ${svg['finish']}
                                    </div>
                                `;
                                }else{
                                    if (item.id == 2){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span data-point="${item.points}${add_point}" class="btn btn-primary btn-custome birthday btn-birthday">${__('edit_date')}</span>
                                    </div>
                                `;
                                    }else if (item.id == 3){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <span class="btn btn-primary btn-custome signin dosign">${__('sign_in')}</span>
                                    </div>
                                `;
                                    }else if (item.id == 5){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href="https://www.twitter.com/intent/follow?screen_name=${item.setting.username}" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('follow')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 6){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://twitter.com/intent/tweet?text=${item.setting.message}&url=${item.setting.url}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('share')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 7){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://www.facebook.com/plugins/page.php?href=facebook.com/${item.setting.username}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('like')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 8){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href=# onClick="javascript:window.open('https://www.facebook.com/sharer/sharer.php?u=${item.setting.url}','','width=632,height=388,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false;" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('share')}</a>
                                    </div>
                                `;
                                    }else if (item.id == 9){
                                        pushHtml += `
                                    <div class="col-4 t-right way_right">
                                    <a href="https://www.instagram.com/${item.setting.username}" ${share_data} class="btn btn-primary btn-custome ${share_class}" target="_blank">${__('follow')}</a>
                                    </div>
                                `;
                                    }
                                }

                            }

                            pushHtml += `</div>`;
                        });
                        $('.point-ways_to_earn_cart').append(pushHtml);
                        $('.btn-birthday').on('click',function (e) {
                            $('.birthday-earn-point').text($(this).data('point'))
                            cart_point();
                            e.stopPropagation();
                        });
                    }

                }
            });
        }
    });
    $('.cart-point-box,.cart-point-box .doclose').on("click", function(e) {
        cart_point();
        e.stopPropagation();
    });
    $('.cart-point-box').on("click", ".cart-point-do-css3", function(e) {
        e.stopPropagation();
    });

    function cart_point(){
        if (!$(".cart-point-do-css3").hasClass('showcss')) {
            $(".cart-point-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-point-box").show();
        }else{
            $(".cart-point-do-css3").addClass('hidecss').removeClass('showcss');
            setTimeout(function(){
                $(".cart-point-box").hide();
                $(".order-point").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }

    $(".point-ways_to_redeem").click(function(){
        if ($('.point-ways_to_redeem_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getwaytoredeemlist",
                success : function(result) {
                    if ($('.point-ways_to_redeem_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_redeem')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
                            if(item.type == 1){
                                pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
                            }else if(item.type == 3){
                                pushHtml += `<p class="earn-name">${__('off_coupon',[item.get+'%'])}</p>`;
                            }else if(item.type == 4){
                                pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                            }else if(item.type == 5){
                                pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
                            }
                            if(item.type == 2){
                                pushHtml += `<p class="earn-point">${item.points} ${__('points')} = ${shop_data.money_format+item.get}</p>`;

                            }else{
                                pushHtml += `<p class="earn-point">${item.points} ${__('points')}</p>`;
                            }
                            pushHtml += `</div>
                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                        `;
                            if (item.type == 2 && item.setting.min != '') {
                                var need_points = item.setting.min;
                            }else{
                                var need_points = item.points;
                            }
                            if (customeinfo != null){
                                if (need_points <= availablePoint){
                                    if (item.needexplain){
                                        if (item.type == 2) {
                                            pushHtml += `
                                            <span class="btn btn-primary btn-custome view" data-day="${item.day}" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                                        `;
                                        }else{
                                            pushHtml += `
                                            <span class="btn btn-primary btn-custome view" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
                                        `;
                                        }

                                    }else{
                                        pushHtml += `
                                    <span class="btn btn-primary btn-custome redeem" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-id="${item.id}" data-type="${item.type}">${__('redeem')}</span>                                      
                                    `;
                                    }
                                }else{
                                    pushHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-width="2" transform="translate(1 1)"><path class="progress-base-path" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333"></path><path class="progress-main-path" stroke="#6568FE" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333" style="stroke-dasharray: 51.1503, 51.1503; stroke-dashoffset: 50;" data-stroke="${50*(need_points-availablePoint)/need_points}"></path></g></svg>`;
                                }

                            }
                            pushHtml += `</div></div>`;
                        });
                        $('.point-ways_to_redeem_cart').append(pushHtml);

                        $(".progress-main-path").each(function () {
                            $(this).animate({
                                'stroke-dashoffset':$(this).data("stroke")
                            },1000);
                        })
                    }

                }
            });
        }
    })
    

    var scrollUrl = '';
    $(".in-top-content").scroll(function(){
      if ($("body").height() - $(".ymqloading").offset().top > -90 && can_scroll && IsHas) {
        can_scroll = false;
        showload()
        if (nowScorrle) {
            scrollUrl = '/api/pointindex/pointgetlist';
        }else{
            scrollUrl = '/api/pointindex/pointuselist';
        }
        $.ymqajax({
            url : scrollUrl,
            dosuccess:true,
            data : {page:page},
            success : function(result) {
                if (result.code == 201) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    return false;
                }
                var html = '';
                if (nowScorrle) {
                    var html = creataccesshtml(result)
                }else{
                    var html = creatspendinghtml(result)
                }
                if (Object.keys(result.data).length < per_page_num) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                }
                if (nowScorrle) {
                    $(".point-access-content").append(html);
                    accessPage += 1;
                }else{
                    $(".point-spending-content").append(html);
                    spendingPage += 1;
                }
                page += 1;
                can_scroll = true;
            }
        });

      }
    });

    $(document).on('click', "#point .view", function () {
        goback_arr.push('point-view-content');
        showHidePage('.point-redeem-content');
        $(".point-view-content").show();
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                    ${$(this).parent('.way_right').prev().prev().html()}
                </div>
                <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">
                    ${$(this).parent('.way_right').prev().html()}
                </div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12">`;
                if ($(this).data('min_amout') > 0) {
                   pushHtml += `<div>${__('coupon_more_then',[shop_data.money_format+$(this).data('min_amout')])}</div>`; 
                }
                if ($(this).data('type') == 4 && $(this).data('get') != 'all') {
                   pushHtml += `<div>${__('coupon_less_then',[shop_data.money_format+$(this).data('get')])}</div>`; 
                }
                if ($(this).data('applies_type') == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if($(this).data('applies_type') == 2){
                    pushHtml += `<div>${__('coupon_select_product')}</div>`;
                }   
                if ($(this).data('day') > 0) {
                    var add_day = '';
                    if (!$.isEmptyObject(level_info)) {
                        if (level_info['day'] > 0) {
                           var add_day = '+'+level_info['day']; 
                       }
                    }
                    pushHtml += `<div>${__('coupon_day',[$(this).data('day')+add_day])}</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
        if ($(this).data('type') == 2) {
            if ($(this).data('max') != '' && $(this).data('max') < availablePoint) {
                var get_max = $(this).data('max');
            }else{
                var get_max = availablePoint;
            }
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('points')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('points');
                }
            }else{
                var get_min = $(this).data('points');
            }
            
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_points" data-points="${get_min}">${get_min}</span> ${__('points')} = ${__('off_coupon',[shop_data.money_format+'<span class="d_get" data-get="'+$(this).data('get')+'">'+$(this).data('get')+'</span>'])}</div>
                          <input class="form-control point_redeem_range" type="range" min="${get_min}" max="${get_max}" step="${$(this).data('points')}" aria-label="Points to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
            `;
        }
        pushHtml += `
            <div class="row" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome redeem" data-id="${$(this).data('id')}">${__('redeem')}</span>
                </div>
            </div>
        `;
        $('.point-view_cart').html(pushHtml);
        $(".in-top-content").animate({scrollTop:0},10);
        
    });

    $(document).on('input propertychange', ".point_redeem_range", function () {
        //var persent = 100*(($(this).val()-$(this).attr('min'))/$(this).attr('step'))/(($(this).attr('max')-$(this).attr('min'))/$(this).attr('step'));
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_points').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/$('.d_points').data('points'));
    });
    $(document).on('click', "#point .redeem", function () {
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/convert",
            btn: that,
            data : {id:that.data('id'),points:$('.point_redeem_range').val()},
            success : function(result) {
                var data = result.data;
                showHidePage('.point-redeem-content');
                $(".point-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.point-giftdetail_cart').html(pushHtml);
                hideload();
                $('.point-ways_to_redeem_cart .cart-item').remove()
                $('.point-ways_to_redeem_cart .cart-title').remove()
                $(".in-top-content").animate({scrollTop:0},10);
                changePoint(data.points,0)
                if (goback_arr.includes('point-view-content')) {
                   goback_arr.pop();  
                }
                //回显
                if ($('.point_convert_count').text() == '0') {
                    if(ymq_plan(shop_data.plan,'commission')){
                        $('.point_convert_tab').addClass('ymq-tab-2 point-giftlist-tab');
                    }else{
                        $('.point_convert_tab').addClass('ymq-tab point-giftlist-tab');
                    }
                    
                    $('.point_convert_more').show();
                }
                $('.point_convert_count').text(Number($('.point_convert_count').text())+1);
                //如果有数据就回显
                if ($('.point-giftlist_cart .cart-item').length > 0){
                    var giftData = [];
                    giftData.push(result.data);
                    pushHtml = creatGiftListHtml(giftData);
                    $('.point-giftlist_cart .cart-title').after(pushHtml);
                }
            }
        });
    });

    $(document).on('click', ".point-giftlist-tab", function () {
        if ($('.point-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/pointindex/getconvertlist",
                data:'',
                success : function(result) {
                    if ($('.point-giftlist_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('your_rewards')}</h6>
                        </div>`;
                        pushHtml += creatGiftListHtml(result.data);
                        $('.point-giftlist_cart').append(pushHtml);
                    }
                }
            }); 
        }
    })

    $(document).on('click', "#point .gift-view", function () {
        goback_arr.push('gift-view');
        $(".top-goback").data('back',".point-giftlist-content");
        prev_page = '.point-content';
        showHidePage('.point-giftlist-content');
        $(".point-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.point-giftdetail_cart').html(pushHtml);
        hideload()
        $(".in-top-content").animate({scrollTop:0},10);
        
    });


    function creatgiftdetailhtml(data){
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2">
                    ${svg[data.icon]}
                </div>
                <div class="col-10 cart-item-center">`;
                if(data.type == 1 || data.type == 2){
                    pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+data.get])}</p>`;
                }else if(data.type == 3){
                    pushHtml += `<p class="earn-name">${__('off_coupon',[data.get+'%'])}</p>`;
                }else if(data.type == 4){
                    pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
                }else if(data.type == 5){
                    pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
                }
                pushHtml += `<p class="earn-point">Spent ${data.points} ${__('points')}</p>`;
        pushHtml +=    
                `</div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12 text-center">
                ${__('use_discount')}
                </div>
            </div>
            <div class="cart-item row">
                <div class="col-12">
                    <div class="form-group">
                      <div class="input-group">
                        <input type="text" class="form-control copy_input" readonly data-indicator="pwindicator" value="${data.code}">
                        <div class="input-group-prepend">
                          <div class="input-group-text copy_code">
                            <svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        `;
        pushHtml += `
            <div class="row row_text">
                <div class="col-12">`;
                if (data.min_amout > 0) {
                   pushHtml += `<div>${__('coupon_more_then',[shop_data.money_format+data.min_amout])}</div>`; 
                }
                if (data.type == 4 && data.get != 'all') {
                   pushHtml += `<div>${__('coupon_less_then',[shop_data.money_format+data.get])}</div>`; 
                }
                if (data.applies_type == 1) {
                    pushHtml += `<div>Reward can only be used on select product collections.</div>`;
                }else if(data.applies_type == 2){
                    pushHtml += `<div>${__('coupon_select_product')}</div>`;
                }   
                if (data.day > 0) {
                   pushHtml += `<div>${__('coupon_day',[data.day])}</div>`; 
                } 
        pushHtml += `
                </div>
            </div>
        `;
        if (data.status != 2) {
            pushHtml += `
                <div class="row row_text" style="padding: 30px 20px 20px 20px;">
                    <div class="col-12" style="margin:0 auto;">
                        <span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome apply_code" data-code="${data.code}">${__('apply_code')}</span>
                    </div>
                </div>
            `;
        }
        
        return pushHtml;
    }

    $(document).on('click', "#point .share_btn", function () {
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/pointindex/getpoint",
            btn:that,
            data : {id:that.data('id')},
            success : function(result) {
                setTimeout(function(){
                    var parent1 = that.parent();
                    var parent2 = parent1.parent();
                    that.remove();
                    parent1.html(svg['finish']);
                    var pushHtml = parent2.prop("outerHTML");
                    parent2.remove();
                    $('.point-ways_to_earn_cart').append(pushHtml);
                    that.removeClass('btn-progress');
                    changePoint(result.data,1)
                },10000); 
            }
        });
    });

    function changePoint(point = 0,type = 0) {
        var nowPoint = availablePoint;
        if (type == 0){
            availablePoint = availablePoint - point;
        }else{
            availablePoint = availablePoint + point;
        }
        $('.home_point').text($('.home_point').text().replace(nowPoint,availablePoint))
        $('#ymq-point,.change_point').data('header_detail',availablePoint);
        $('.header_detail').html(availablePoint)
    }


    function creataccesshtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-7">`;
                        if (item.reward_matter == 1){
                            pushHtml += `<span class="reward_matter">${__('sign_up')}</span><br/>`;
                        }else if(item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('celebrate_birthday')}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('sign_in')}</span><br/>`;
                        }else if(item.reward_matter == 4){
                            pushHtml += `<span class="reward_matter">${__('place_order')}</span><br/>`;
                        }else if(item.reward_matter == 5){
                            pushHtml += `<span class="reward_matter">${__('follow_on_twitter')}</span><br/>`;
                        }else if(item.reward_matter == 6){
                            pushHtml += `<span class="reward_matter">${__('share_on_twitter')}</span><br/>`;
                        }else if(item.reward_matter == 7){
                            pushHtml += `<span class="reward_matter">${__('like_on_facebook')}</span><br/>`;
                        }else if(item.reward_matter == 8){
                            pushHtml += `<span class="reward_matter">${__('facebook_share')}</span><br/>`;
                        }else if(item.reward_matter == 9){
                            pushHtml += `<span class="reward_matter">${__('instagram_follow')}</span><br/>`;
                        }else if(item.reward_matter == 10){
                            pushHtml += `<span class="reward_matter">${__('your_recommended_users_place_orders')}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }
                // if(ymq_plan(shop_data.plan,'expiry')){
                //     if (setDate(item.expirationtime) == '2220/01/01') {
                //         var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                //         `;
                //     }else{
                //         var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${item.reward_matter == 100 ? '' : __('deadline')+' '+setDate(item.expirationtime)}</span>
                //         `;
                //     }
                // }else{
                //     var dataHtml = `        
                //         <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                //         `;
                // }   
                //过期时间是2888年则表示没有过期时间
                if (getTimestamp(item.expirationtime) == 28969286400) {
                    var dataHtml = `        
                    <span class="expirationtime col-12 text-right">${setDate(item.createtime)}</span>
                    `;
                }else{
                    var dataHtml = `        
                    <span class="expirationtime col-12 text-right">${__('deadline')+' '+setDate(item.expirationtime)}</span>
                    `;
                }         
                pushHtml += `
                        </div>
                        <div class="col-5 align-self-center text-right">
                            <span class="point">+${item.point} ${__('points')}</span>
                        </div>
                        ${dataHtml}
                        </div>
                    </div>
                `;
            });
        }else{
            accessIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    function creatGiftListHtml(data){
        var pushHtml = ``;
        data.forEach(function (item) {
            var used = '';
            if (item.status == 2) {
                used = 'coupon_used'
            }
            pushHtml += `
        <div class="cart-item row ${used}">
            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                ${svg[item.icon]}
            </div>
            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;
            if(item.type == 1){
                pushHtml += `<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`;
            }else if(item.type == 2){
                pushHtml += `<p class="earn-name">${__('order_discount')}</p>`;
            }else if(item.type == 3){
                pushHtml += `<p class="earn-name">${__('off_coupon',[item.get+'%'])}</p>`;
            }else if(item.type == 4){
                pushHtml += `<p class="earn-name">${__('free_shipping_coupon')}</p>`;
            }else if(item.type == 5){
                pushHtml += `<p class="earn-name">${__('free_product_coupon')}</p>`;
            }
            pushHtml += `<p class="earn-point">${__('spent')} ${item.points} ${__('points')}</p>`;
            pushHtml += `</div>
                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
        `;
            if (item.type == 2 && item.setting.min != '') {
                var need_points = item.setting.min;
            }else{
                var need_points = item.points;
            }
            if (item.type == 2) {
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}" data-day="${item.day}" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
            `;
            }else{
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}" data-day="${item.day}" data-get="${item.get}" data-points="${item.points}" data-min_amout="${item.min_amout}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" data-applies_type="${item.applies_type}">${__('view')}</span>                                      
            `;
            }
            pushHtml += `</div></div>`;
        });
        return pushHtml;
    }

    function creatspendinghtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-7">`;
                        if (item.reward_matter == 1 || item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('off_coupon',[shop_data.money_format+item.get])])}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('off_coupon',[item.get+'%'])])}</span><br/>`;
                        }else if(item.reward_matter == 4){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('free_shipping_coupon')])}</span><br/>`;
                        }else if(item.reward_matter == 5){
                            pushHtml += `<span class="reward_matter">${__('points_spent_on',[__('free_product')])}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }
                    pushHtml += `
                        </div>
                        <div class="col-5 align-self-center text-right" style="padding-left:0;">
                            <span class="point">-${item.point} ${__('points')}</span><br>
                            <span class="expirationtime text-right">${setDate(item.createtime)}</span>
                        </div>
                        </div>
                    </div>
                `;
            });
        }else{
            spendingIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    $(document).on('click', ".copy_code", function () {
        $('.copy_input').select();
        document.execCommand("Copy");
        $(this).html(`<svg t="1601084112227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5703" width="32" height="32"><path d="M896 512a384 384 0 1 0-384 384 384 384 0 0 0 384-384z m64 0A448 448 0 1 1 512 64a448 448 0 0 1 448 448z" p-id="5704" fill="#515151"></path><path d="M682.24 360.64a32 32 0 0 1 43.52 46.72l-277.44 256a32 32 0 0 1-43.52 0l-138.56-128a32 32 0 0 1 43.52-46.72l116.8 107.84z" p-id="5705" fill="#515151"></path></svg>`)
        setTimeout(function(){
            $('.copy_code').html(`<svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>`)
        },1000);
    })
});
//commissions
$(document).ready(function () {
   
    var  nowScorrle = '';
    var page;
    var IsHas;

    var accessPage = 0;
    var accessIsHas = true;

    var spendingPage = 0;
    var spendingIsHas = true;

    var can_scroll = false;
    $(".top-goback").click(function(){
        can_scroll = false;
    })
    $(".com-tab-access").click(function(){
        nowScorrle = 1;
        page = accessPage;
        if ($('.com-access-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/commissionsgetlist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.com-access-content .ishas').length <= 0){
                        if (result.code == 201) {
                            accessIsHas = false;
                            IsHas = false;
                            return false;
                        }
                        var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('access_records')}</h6>
                                </div>
                            </div>
                        `;
                        pushHtml += creataccesshtml(result);
                        if (Object.keys(result.data).length < per_page_num) {
                            accessIsHas = false;
                            IsHas = false;
                        }
                        accessPage += 1;
                        page += 1;

                        $('.com-access-content').append(pushHtml);

                        setTimeout(function(){
                            can_scroll = true;
                            IsHas = accessIsHas;
                        },1000);
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = accessIsHas;
            },1000);
        }
    })

    $(".com-tab-spending").click(function(){
        nowScorrle = 0;
        page = spendingPage;
        if ($('.com-spending-content .ishas').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/commissionsuselist",
                dosuccess:true,
                data : {page:page},
                success : function(result) {
                    if ($('.com-spending-content .ishas').length <= 0){
                        if (result.code == 201) {
                            spendingIsHas = false;
                            IsHas = false;
                            return false;
                        }
                        var pushHtml = `
                            <div class="card card-title">
                                <div class="cart-title">
                                    <h6 class="text-dark-1">${__('redeem_record')}</h6>
                                </div>
                            </div>
                        `;
                        pushHtml += creatspendinghtml(result);
                        if (Object.keys(result.data).length < per_page_num) {
                            spendingIsHas = false;
                            IsHas = false;
                        }
                        spendingPage += 1;
                        page += 1;
                        $('.com-spending-content').append(pushHtml);
                        setTimeout(function(){
                            can_scroll = true;
                            IsHas = spendingIsHas;
                        },1000);
                    }

                }
            });
        }else{
            setTimeout(function(){
                can_scroll = true;
                IsHas = spendingIsHas;
            },1000);
        }

    })

    

    $(".com-ways_to_earn").click(function(){
        
    })

    $(".com-ways_to_redeem").click(function(){
        if ($('.com-ways_to_redeem_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/getwaytoredeemlist",
                success : function(result) {
                    if ($('.com-ways_to_redeem_cart .cart-item').length <= 0){
                        var pushHtml = `<div class="cart-title">
                            <h6 class="text-dark-1">${__('ways_to_redeem')}</h6>
                        </div>`;
                        result.data.forEach(function (item) {
                            var add_withdrawal = '';
                            if (!$.isEmptyObject(level_info) && item.id == 1) {
                                if (level_info['withdrawal_rate'] > 0) {
                                    var add_withdrawal = level_info['withdrawal_rate'];
                                }
                            }
                            pushHtml += `
                        <div class="cart-item row">
                            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                                ${svg[item.icon]}
                            </div>
                            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding-right: 0;padding-left: 5px;">`;
                            if(item.type == 1){
                                pushHtml += `<p class="earn-name">${__('money')}</p>`;
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-name">${__('gift_card')}</p>`;
                            }
                            if(item.type == 1){
                                if (customeinfo != null && customeinfo.commission_withdrawal_percent > 0) {
                                    pushHtml += `<p class="earn-point">100 ${__('commissions')} = ${shop_data.money_format+customeinfo.commission_withdrawal_percent}</p>`;
                                }else{
                                    pushHtml += `<p class="earn-point">100 ${__('commissions')} = ${shop_data.money_format+item.get}+${add_withdrawal}</p>`;
                                }
                            }else if(item.type == 2){
                                pushHtml += `<p class="earn-point">${item.commissions} ${__('commissions')} = ${shop_data.money_format+item.get}</p>`;
                            }else{
                                pushHtml += `<p class="earn-point">${item.commissions} ${__('commissions')} = ${shop_data.money_format+item.get}</p>`;
                            }
                            pushHtml += `</div>
                                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
                        `;
                            if ((item.type == 2 || item.type == 1) && item.setting.min != '') {
                                var need_commissions = item.setting.min;
                            }else{
                                var need_commissions = item.commissions;
                            }
                            if (customeinfo != null){
                                if (need_commissions <= availableCommissions){
                                    if (item.type == 2) {
                                        pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                    `;
                                    }else if(item.type == 1){
                                        if (customeinfo.commission_withdrawal_percent > 0) {
                                            pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${customeinfo.commission_withdrawal_percent}" data-commissions="${item.commissions}"  data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                        `;
                                        }else{
                                            pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-min="${item.setting.min}" data-max="${item.setting.max}" data-get="${Number(item.get)+Number(add_withdrawal)}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                        `;
                                        }

                                    }
                                    else{
                                        pushHtml += `
                                        <span class="btn btn-primary btn-custome view" data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
                                    `;
                                    }
                                }else{
                                    pushHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-width="2" transform="translate(1 1)"><path class="progress-base-path" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333"></path><path class="progress-main-path" stroke="#6568FE" d="M4.86111111,18.3333333 C1.09026555,16.030889 -0.68888696,11.5012932 0.50697284,7.2480068 C1.70283264,2.99472037 5.58179605,0.055968107 10,0.055968107 C14.418204,0.055968107 18.2971673,2.99472037 19.4930271,7.2480068 C20.688887,11.5012932 18.9097344,16.030889 15.1388889,18.3333333" style="stroke-dasharray: 51.1503, 51.1503; stroke-dashoffset: 50;" data-stroke="${50*(need_commissions-availableCommissions)/need_commissions}"></path></g></svg>`;
                                }

                            }
                            pushHtml += `</div></div>`;
                        });
                        $('.com-ways_to_redeem_cart').append(pushHtml);
                        $(".progress-main-path").each(function () {
                            $(this).animate({
                                'stroke-dashoffset':$(this).data("stroke")
                            },1000);
                        })
                    }

                }
            });
        }
    })


    var scrollUrl = '';
    $(".in-top-content").scroll(function(){
      if ($("body").height() - $(".ymqloading").offset().top > -90 && can_scroll && IsHas) {
        can_scroll = false;
        showload()
        if (nowScorrle) {
            scrollUrl = '/api/commissionsindexapi/commissionsgetlist';
        }else{
            scrollUrl = '/api/commissionsindexapi/commissionsuselist';
        }
        $.ymqajax({
            url : scrollUrl,
            dosuccess:true,
            data : {page:page},
            success : function(result) {
                if (result.code == 201) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    return false;
                }
                var html = '';
                if (nowScorrle) {
                    var html = creataccesshtml(result)
                }else{
                    var html = creatspendinghtml(result)
                }
                if (Object.keys(result.data).length < 10) {
                    if (nowScorrle) {
                        accessIsHas = false;
                    }else{
                        spendingIsHas = false;
                    }
                    IsHas = false;
                    hideload()
                }else{
                    hideload()
                }

                if (nowScorrle) {
                    $(".com-access-content").append(html);
                    accessPage += 1;
                }else{
                    $(".com-spending-content").append(html);
                    spendingPage += 1;
                }
                page += 1;
                
                can_scroll = true;
            },
            error : function(result){
                hideload()
            }
        });
      }
    });

    $(document).on('click', "#commissions .view", function () {
        goback_arr.push('com-view-content');
        showHidePage('.com-redeem-content');
        $(".com-view-content").show();
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                    ${$(this).parent('.way_right').prev().prev().html()}
                </div>
                <div class="col-8 col-md-8 col-lg-8 col-sm-8 col-xs-8 cart-item-center">
                    ${$(this).parent('.way_right').prev().html()}
                </div>
            </div>
        `;
        if ($(this).data('type') == 1) {
            var get_max = availableCommissions;
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('commissions')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('commissions');
                }
            }else{
                var get_min = $(this).data('commissions');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_commissions" data-commissions="${get_min}">${get_min}</span> ${__('commissions')} = ${shop_data.money_format}<span class="d_get" data-get="${$(this).data('get')}">${$(this).data('get')*(get_min/100)}</span></div>
                          <input class="form-control redeem_range1 redeem_range" type="range" min="${get_min}" max="${get_max}" aria-label="commissions to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 5px 0;"><span>Paypal email</span></div>
                          <input class="form-control paypal_email" type="text" name="paypal_email">
                        </div>
                    </div>
                </div>
            `;
        }else if($(this).data('type') == 2){
            if ($(this).data('max') != '' && $(this).data('max') < availableCommissions) {
                var get_max = $(this).data('max');
            }else{
                var get_max = availableCommissions;
            }
            if ($(this).data('min') != '') {
                if ($(this).data('min') > $(this).data('commissions')) {
                    var get_min = $(this).data('min');
                }else{
                    var get_min = $(this).data('commissions');
                }
            }else{
                var get_min = $(this).data('commissions');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12">
                        <div class="form-group">
                          <div style="margin: 20px 0;text-align:center;"><span class="d_commissions" data-commissions="${get_min}">${get_min}</span> ${__('commissions')} = ${__('off_coupon',[shop_data.money_format+'<span class="d_get" data-get="'+$(this).data('get')+'">'+$(this).data('get')+'</span> '])}</div>
                          <input class="form-control redeem_range2 redeem_range" type="range" min="${get_min}" max="${get_max}" step="${$(this).data('commissions')}" aria-label="commissions to redeem" value="${get_min}">
                        </div>
                    </div>
                </div>
            `;
        }
        pushHtml += `
            <div class="row" style="padding: 30px 20px 20px 20px;">
                <div class="col-12" style="margin:0 auto;">
                    <span style="height: 50px;line-height: 40px;font-size: 18px;width: 100%;" class="btn btn-primary btn-custome redeem" data-id="${$(this).data('id')}">${__('redeem')}</span>
                </div>
            </div>
        `;
        $('.view_cart').html(pushHtml);
        
        $(".in-top-content").animate({scrollTop:0},10);
    });

    $(document).on('input propertychange', ".redeem_range1", function () {
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_commissions').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/100);
    });
    $(document).on('input propertychange', ".redeem_range2", function () {
        var persent = 100*($(this).val()-$(this).attr('min'))/($(this).attr('max')-$(this).attr('min'))
        console.log(persent)
        $(this).css('background-size',persent+'% 100%')
        
        $('.d_commissions').text($(this).val());
        $('.d_get').text($('.d_get').data('get')*$(this).val()/$('.d_commissions').data('commissions'));
    });
    
    $(document).on('click', "#commissions .redeem", function () {
        if ($('.paypal_email').length > 0 && !checkemail($('.paypal_email').val())) {
            iziToast.error({
              message: __('pelese_fill_correct_paypal_account'),
              position: 'topCenter'
            });
            $(".paypal_email").focus();
            return;
        }
        $(this).addClass('btn-progress');
        var that = $(this);
        $.ymqajax({
            url : "/api/commissionsindexapi/convert",
            btn: that,
            data : {id:that.data('id'),commissions:$('.redeem_range').val(),paypal_email:$('.paypal_email').val()},
            success : function(result) {
                var data = result.data;
                showHidePage('.com-redeem-content');
                $(".com-giftdetail-content").show();      
                var pushHtml = creatgiftdetailhtml(data);
                $('.com-giftdetail_cart').html(pushHtml);
                $('.com-ways_to_redeem_cart .cart-item').remove()
                $('.com-ways_to_redeem_cart .cart-title').remove()
                $(".in-top-content").animate({scrollTop:0},10);
                changeCommissions(data.commissions)
                if (goback_arr.includes('com-view-content')) {
                   goback_arr.pop();  
                }
                //回显
                if ($('.com_convert_count').text() == '0') {
                    $('.com_convert_tab').addClass('ymq-tab-2 com-giftlist-tab');
                    $('.com_convert_more').show();
                }
                $('.com_convert_count').text(Number($('.com_convert_count').text())+1);
                //如果有数据就回显
                if ($('.com-giftlist_cart .cart-item').length > 0){
                    var giftData = [];
                    giftData.push(result.data);
                    pushHtml = creatGiftListHtml(giftData);
                    $('.com-giftlist_cart .cart-title').after(pushHtml);
                }
            }
        });
    });

    $(document).on('click', ".com-giftlist-tab", function () {
        if ($('.com-giftlist_cart .cart-item').length <= 0){
            showload()
            $.ymqajax({
                url : "/api/commissionsindexapi/getconvertlist",
                success : function(result) {
                    if ($('.com-giftlist_cart .cart-item').length <= 0){
                        var pushHtml = `
                            <div class="cart-title">
                                <h6 class="text-dark-1">${__('your_rewards')}</h6>
                            </div>
                        `;
                        pushHtml += creatGiftListHtml(result.data);
                        $('.com-giftlist_cart').append(pushHtml);
                    }
                }
            });
        }
    })

    $(document).on('click', "#commissions .gift-view", function () {
        goback_arr.push('gift-view');
        $(".top-goback").data('back',".com-giftlist-content");
        prev_page = '.commissions-content';
        showHidePage('.com-giftlist-content');
        $(".com-giftdetail-content").show();      
        var pushHtml = creatgiftdetailhtml($(this).data());
        $('.com-giftdetail_cart').html(pushHtml);
        hideload()
        
        $(".in-top-content").animate({scrollTop:0},10);
    });

    function changeCommissions(commissions = 0) {
        var nowCommissions = availableCommissions;
        availableCommissions = availableCommissions - commissions;
        $('.home_commission').text($('.home_commission').text().replace(nowCommissions,availableCommissions))
        $('#ymq-commission').data('header_detail',availableCommissions);
        $('.header_detail').html(availableCommissions)
    }

    function creatGiftListHtml(data){
        var pushHtml = ``;
        data.forEach(function (item) {
        pushHtml += `
        <div class="cart-item row">
            <div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">
                ${svg[item.icon]}
            </div>
            <div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center" style="padding-right: 0;padding-left: 5px;">`;
            if(item.type == 1){
                if (item.status == 0) {
                    var shenghe = __('pending');
                }else if(item.status == 1){
                    var shenghe = __('approved');
                }else if(item.status == 2){
                    var shenghe = __('not_approved');
                }
                pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} <span class="shenghe">(${shenghe})</span</p>`;
            }else if(item.type == 2){
                pushHtml += `<p class="earn-name">${shop_data.money_format+item.get} ${__('gift_card')}</p>`;
            }
            pushHtml += `<p class="earn-point">${__('spent')} ${item.commissions} ${__('commissions')}</p>`;
            pushHtml += `</div>
                    <div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">
        `;
            // if ((item.type == 2 || item.type == 1) && item.setting.min != '') {
            //     var need_commissions = item.setting.min;
            // }else{
            //     var need_commissions = item.commissions;
            // }
            if (item.type == 2) {
                pushHtml += `
                <span class="btn btn-primary btn-custome gift-view" data-status="${item.status}" data-code="${item.code}"  data-get="${item.get}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}" >${__('view')}</span>                                      
            `;
            }else if(item.type == 1){
                if (item.status == 0) {
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['pending']}
                    </span>                                      
                `;
                }else if(item.status == 1){
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['approved']}
                    </span>                                      
                `;
                }else if(item.status == 2){
                    pushHtml += `
                    <span class="gift-view" data-get="${item.get}" data-status="${item.status}" data-commissions="${item.commissions}" data-id="${item.id}" data-type="${item.type}" data-icon="${item.icon}">
                    ${svg['not_approved']}
                    </span>                                      
                `;
                }
            }
            pushHtml += `</div></div>`;
        });
        return pushHtml;
    }

    function creatgiftdetailhtml(data){
        var pushHtml = `
            <div class="cart-item row">
                <div class="col-2">
                    ${svg[data.icon]}
                </div>
                <div class="col-8 cart-item-center">`;
                var shenghe = '';
                if(data.type == 1){
                    if (data.status == 0) {
                        shenghe = __('pending');
                    }else if(data.status == 1){
                        shenghe = __('approved');
                    }else if(data.status == 2){
                        shenghe = __('not_approved');
                    }
                    pushHtml += `<p class="earn-name">${shop_data.money_format+data.get} ${__('money')} ${shenghe}</p>`;
                }else if(data.type == 2){
                    pushHtml += `<p class="earn-name">${shop_data.money_format+data.get} ${__('gift_card')}</p>`;
                }
                pushHtml += `<p class="earn-point">Spent ${data.commissions} ${__('commissions')}</p>`;
        pushHtml +=    
                `</div>
                <div class="col-2 cart-item-center">`;
                if(data.type == 1){
                    if (data.status == 0) {
                        var withdrawal_tip = __('waiting_review');
                        pushHtml += `<span>${svg['pending']}</span>`;
                    }else if(data.status == 1){
                        var withdrawal_tip = __('withdrawal_approved');
                        pushHtml += `<span>${svg['approved']}</span>`;
                    }else if(data.status == 2){
                        var withdrawal_tip = __('withdrawal_rejected');
                        pushHtml += `<span>${svg['not_approved']}</span>`;
                    }
                }
        pushHtml += `
                </div>
            </div>`;
        if(data.type == 1){

            pushHtml += `<div class="row row_text">
                            <div class="col-12">
                            ${withdrawal_tip}
                            </div>
                        </div>`;
        }
        if (data.type == 2) {
            if (data.status == 0) {
                var gift_tip = __('creat_gift_soon');
            }else if(data.status == 1){
                var gift_tip = __('gift_success');
            }else if(data.status == 2){
                var gift_tip = __('gift_rejected');
            }
            pushHtml += `
                <div class="row row_text">
                    <div class="col-12 text-center">
                    ${__('use_discount')}
                    </div>
                </div>
                <div class="cart-item row">
                    <div class="col-12">
                        <div class="form-group">
                          <div class="input-group">
                            <input type="text" class="form-control copy_input" readonly data-indicator="pwindicator" value="${data.code}">
                            <div class="input-group-prepend">
                              <div class="input-group-text copy_code">
                                <svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="row row_text">
                    <div class="col-12">
                    ${gift_tip}
                    </div>
                </div>
            `;
        }
        return pushHtml;
    }


    function creataccesshtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                if (item.reward_matter == 100) {
                    var get_text = item.description;
                }else if(item.reward_matter == 50){
                    var get_text = __('return_commission');
                }else{
                    var get_text = __('your_recommended_users_place_orders');
                }
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-6 col-sm-6">
                          <span class="reward_matter">${get_text}</span><br/>
                        </div>
                        <div class="col-6 col-sm-6 align-self-center text-right">
                            <span class="point">+${item.commissions} ${__('commissions')}</span><br>
                            <span class="expirationtime">${setDate(item.createtime)}</span>
                        </div>
                        </div>
                    </div>
                `;
            });
        }else{
            accessIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    function creatspendinghtml(result){
        var pushHtml = '';
        if(result.code == 1){
            result.data.forEach(function (item) {
                pushHtml += `
                    <div class="card small-cart-item ishas">
                        <div class="row point-item">
                        <div class="col-6">`;
                        if (item.reward_matter == 1){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[shop_data.money_format+item.get])}</span><br/>`;
                        }else if(item.reward_matter == 2){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[shop_data.money_format+item.get+' '+__('gift_card')])}</span><br/>`;
                        }else if(item.reward_matter == 3){
                            pushHtml += `<span class="reward_matter">${__('commissions_spent_on',[__('free_product')])}</span><br/>`;
                        }else if(item.reward_matter == 60){
                            pushHtml += `<span class="reward_matter">${__('audit_commission_deduction')}</span><br/>`;
                        }else if(item.reward_matter == 100){
                            pushHtml += `<span class="reward_matter">${item.description}</span><br/>`;
                        }
                    pushHtml += `
                            
                        </div>
                        <div class="col-6 align-self-center text-right" style="padding-left:0;">
                            <span class="point">-${item.commissions} ${__('commissions')}</span><br>
                            <span class="expirationtime">${setDate(item.createtime)}</span>
                        </div>
                        </div>
                    </div>
                `;
            });
        }else{
            spendingIsHas = false;
            IsHas = false;
        }
        return pushHtml;
    }

    $(document).on('click', "#commissions .copy_code", function () {
        $('.copy_input').select();
        document.execCommand("Copy");
        $(this).html(`<svg t="1601084112227" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5703" width="32" height="32"><path d="M896 512a384 384 0 1 0-384 384 384 384 0 0 0 384-384z m64 0A448 448 0 1 1 512 64a448 448 0 0 1 448 448z" p-id="5704" fill="#515151"></path><path d="M682.24 360.64a32 32 0 0 1 43.52 46.72l-277.44 256a32 32 0 0 1-43.52 0l-138.56-128a32 32 0 0 1 43.52-46.72l116.8 107.84z" p-id="5705" fill="#515151"></path></svg>`)
        setTimeout(function(){
            $('.copy_code').html(`<svg t="1601043413182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192" width="32" height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z" fill="#1C1C1C" p-id="1194"></path></svg>`)
        },1000);
    })

})

//freeproduct

$(document).ready(function () {

    var free_product_ajax_data = null;
    $("#ymq-free-product").on('click',function () {
        if (free_product_ajax_data == null){
            showload();
            console.log(shop_data);
            $.ymqajax({
                url : "/api/freeproductindex/products.html",
                success : function(res) {
                    if (free_product_ajax_data == null){
                        var data = res.data;
                        console.log(data);
                        free_product_ajax_data = data;
                        var pushHtml = `<div class="htmleaf-container">
                                    <div class="container">
                                        <div class="row" id="my-gallery-container">`;
                        Object.getOwnPropertyNames(data).forEach(function(key){
                            var item = data[key];
                            pushHtml += `
                            <div class="item p-0">
                                <div class="card free-cart" data-id="${item['id']}">
                                    <div class="card-body p-0">
                                        <img style="width: 100%" src="${item['image']}" alt="" role="presentation">
                                    </div>
                                    <div class="card-footer p-0 pl-2 pr-2">
                                        <h6 class="text-dark-1 mb-2 mt-3">${item['title']}</h6>
                                        <p class="text-dark-1 text-left mb-1">${item['minVariantPrice']} - ${item['maxVariantPrice']}</p>
                                    </div>
                                </div>
                            </div>
                    `;
                        });
                        pushHtml += `</div>
                            </div>
                        </div>`;
                        $('.free-product-content').append(pushHtml);
                        $("#my-gallery-container").mpmansory(
                            {
                                childrenClass: 'item', // default is a div
                                columnClasses: 'padding', //add classes to items
                                breakpoints:{
                                    lg: 6,
                                    md: 6,
                                    sm: 6,
                                    xs: 6
                                },
                                distributeBy: { order: false, height: false, attr: 'data-order', attrOrder: 'asc' }, //default distribute by order, options => order: true/false, height: true/false, attr => 'data-order', attrOrder=> 'asc'/'desc'
                                onload: function (items) {
                                    //make somthing with items
                                }
                            }
                        );
                        $('.free-cart').on('click',function (e) {
                            cart_fixed();
                            show_variants_data($(this).attr('data-id'));
                            console.log(free_product_ajax_data[$(this).attr('data-id')]);
                            e.stopPropagation();
                        });

                        $('.cart-fixed-box,.cart-fixed-box .doclose').on("click", function() {
                            if (!$(this).hasClass('disabled')){
                                cart_fixed();
                                setTimeout(function () {
                                    left_fixed();
                                },300);
                            }
                        });
                        $('.cart-fixed-box').on("click", ".cart-fixed-do-css3", function(e) {
                            e.stopPropagation();
                        });
                    }
                }
            });
        }

        function show_variants_data(id,num = 0) {
            $('.do-count-box .count').attr('data-num',num).attr('data-id',id);
            console.log(free_product_ajax_data[id]['variants'][num]);
            $('.cart-fixed .card-header img').attr('src',free_product_ajax_data[id]['variants'][num]['image']);
            $('.cart-fixed .card-header .price').html(shop_data['money_format'] + free_product_ajax_data[id]['variants'][num]['price']);

            var need_html = '';
            if (free_product_ajax_data[id]['variants'][num]['point'] > 0 && shop_data.branding.setting.point.status == 1){
                need_html += `<span data-value="${free_product_ajax_data[id]['variants'][num]['point']}" class="point-span need-value">${free_product_ajax_data[id]['variants'][num]['point']*$('.count-box .count').val()}</span>
                ${__('points')}`;
            }
            if (shop_data.branding.setting.point.status == 1 && shop_data.branding.setting.commission.status == 1) {
                need_html += ` / `;
            }
            if (free_product_ajax_data[id]['variants'][num]['commission'] > 0 && shop_data.branding.setting.commission.status == 1){
                need_html += `<span data-value="${free_product_ajax_data[id]['variants'][num]['commission']}" class="commission-span need-value">${free_product_ajax_data[id]['variants'][num]['commission']*$('.count-box .count').val()}</span>
                ${__('commissions')}`;
            }
            $('.cart-fixed .card-header .need').html(need_html);

            var select_arr = [];
            free_product_ajax_data[id]['variants'][num]['selectedOptions'].forEach(function (item) {
                select_arr.push(item['value']);
            });
            $('.cart-fixed .card-header .title').html(free_product_ajax_data[id]['variants'][num]['title'] + ' (' + select_arr.join(' / ') + ')');
            var variants = free_product_ajax_data[id]['variants'];
            var variants_options = new Object();
            function makevariant(obj,value,index,total,variants_id){
                // console.log(index,total);
                if (!obj.hasOwnProperty(value[index]['value'])){
                    if (index+1 == total){
                        obj[value[index]['value']] = variants_id;
                    }else {
                        obj[value[index]['value']] = {};
                    }
                }

                if (index+1 < total){
                    makevariant(obj[value[index]['value']],value,index+1,total,variants_id);
                }
            }

            variants.forEach(function (item,index) {
                if (select_arr.length == 0 && index == 0){
                    item['selectedOptions'].forEach(function (v) {
                        select_arr.push(v['value']);
                    });
                }

                makevariant(variants_options,item['selectedOptions'],0,item['selectedOptions'].length,item['variant_id']);
            });
            var options = free_product_ajax_data[id]['options'];
            var html = '';
            options.forEach(function (option,key) {
                html += `<h6 class="text-dark">${option['name']}</h6>`;
                var values = option['values'];
                html += `<div class="options mb-2">`;
                var thischild = variants_options;
                for (var i=0; i<=key; i++){
                    if ((i - 1) >= 0){
                        thischild = thischild[select_arr[i-1]];
                    }
                }
                values.forEach(function (value) {
                    var disabled = true;
                    if (thischild.hasOwnProperty(value)){
                        disabled = false;
                    }
                    html += `<div data-index="${key}" data-id="${id}" class="option cursor-pointer text-dark ${select_arr[key] == value ? 'active' : ''} ${disabled ? 'disabled' : ''}">${value}</div>`;
                });
                html += `</div>`;
            });


            $(".options-box").html(html);


            $('.options-box .options .option').on('click',function (e) {
                var that = $(this);
                if(that.hasClass('disabled') || that.hasClass('active')){
                    return false;
                }
                select_arr[that.attr('data-index')] = that.html();
                var item = 0;
                free_product_ajax_data[id]['variants'].forEach(function (variant,key) {
                    var options = variant['selectedOptions'];
                    var is = true;
                    options.forEach(function (option,index) {
                        if (option['value'] != select_arr[index]){
                            is = false;
                        }
                    });
                    if (is){
                        item = key;
                    }
                });
                if (item == 0){
                    try {
                        free_product_ajax_data[id]['variants'].forEach(function (variant,key) {

                            if (variant['selectedOptions'][that.attr('data-index')]['value'] == that.html()){
                                item = key;
                                throw new Error("LoopTerminates");
                            }
                        });
                    } catch (e) {
                        if (e.message !== "LoopTerminates") throw e;
                    };

                }
                show_variants_data($(this).attr('data-id'),item);
                e.stopPropagation();
            });

            var pay_html = '';
            var show_pay_type = $('.do-count-box .count').attr('data-pay-type');

            if (free_product_ajax_data[id]['variants'][num]['point'] != 0 && free_product_ajax_data[id]['variants'][num]['commission'] != 0){
                if (!show_pay_type){
                    show_pay_type = 1;
                    $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                }
                if (shop_data.branding.setting.point.status == 1) {
                    pay_html += `
                        <div data-type="1" class="pay-method-option cursor-pointer text-dark ${show_pay_type == 1 ? 'active' : ''}">${__('point')}</div>
                    `;
                }else{
                    show_pay_type = 2;
                    $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                }
                if (shop_data.branding.setting.commission.status == 1) {
                    pay_html += `
                        <div data-type="2" class="pay-method-option cursor-pointer text-dark ${show_pay_type == 2 ? 'active' : ''}">${__('commission')}</div>
                    `;
                }
            }else{
                if (free_product_ajax_data[id]['variants'][num]['point'] != 0 && shop_data.branding.setting.point.status == 1){
                    show_pay_type = 1;
                }else{
                    show_pay_type = 2;
                }
                $('.do-count-box .count').attr('data-pay-type',show_pay_type);
                if (shop_data.branding.setting.point.status == 1) {
                    pay_html += `
                        <div data-type="1" class="pay-method-option cursor-pointer text-dark ${free_product_ajax_data[id]['variants'][num]['point'] == 0 ? 'disabled' : 'active'}">${__('point')}</div>
                    `;
                }
                if (shop_data.branding.setting.commission.status == 1) {
                    pay_html += `
                        <div data-type="2" class="pay-method-option cursor-pointer text-dark ${free_product_ajax_data[id]['variants'][num]['commission'] == 0 ? 'disabled' : ''} ${free_product_ajax_data[id]['variants'][num]['point'] == 0 ? 'active' : ''}">${__('commission')}</div>
                    `;
                }
            }
            $('.pay-method').html(pay_html);

            go_to_checkout();
            $('.pay-method-box .pay-method-option').on('click',function (e) {
                var that = $(this);
                if(that.hasClass('disabled') || that.hasClass('active')){
                    return false;
                }
                $('.pay-method-box .pay-method-option.active').removeClass('active');
                $(this).addClass('active');
                $('.do-count-box .count').attr('data-pay-type',$(this).attr('data-type'));
                go_to_checkout();
                e.stopPropagation();
            });




        }






    });

    $(".do-count-box .icon-item").on('click',function () {
        var dom = $(this).parent().children('.count');
        var value = dom.val();
        value = value - ($(this).attr('data-math')*-1);
        if (value < 1){
            value = 1;
        }
        dom.val(value);
        fresh_need(value);
        go_to_checkout();

    });

    $(".go_to_checkout").on('click',function (e) {
        if (!$(this).hasClass('disabled')){
            if ($(this).attr('do-sign')){
                console.log('登录');
            }else{

                address($('.choose-address').attr('data-index'));
                var dom = $('.do-count-box .count');
                console.log($('.do-count-box .count').attr('data-num'),free_product_ajax_data);
                var data = free_product_ajax_data[dom.attr('data-id')];
                $('.confirm-order-img').attr('src',data['variants'][dom.attr('data-num')]['image']);
                $('.confirm-order-title').html(data['title']);
                var option_html = [];
                data['variants'][dom.attr('data-num')]['selectedOptions'].forEach(function (item) {
                    option_html .push(item['value']);
                });
                $('.confirm-order-option').html(option_html.join(' / '));
                $('.confirm-order-price').html(shop_data['money_format'] + data['variants'][dom.attr('data-num')]['price']);
                $('.confirm-order-pay-type').html(dom.attr('data-pay-type') == 1 ? __('points') : __('commissions'));
                $('.confirm-order-need-type,.confirm-order-total-type').html(dom.attr('data-pay-type') == 1 ? __('points') : __('commissions'));
                $('.confirm-order-need').html(dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point'] : data['variants'][dom.attr('data-num')]['commission']);
                $('.confirm-order-count').html('x' + dom.val());
                $('.confirm-order-total').html(dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point']*dom.val() : data['variants'][dom.attr('data-num')]['commission']*dom.val());
            }
        }
        e.stopPropagation();
    });
    $('.doleftfixed').on("click",function() {
        if(!$(this).hasClass('disabled')){
            left_fixed($($(this).attr('data-dom')));
        }
    });

    $('.jump-to-add-address').on('click',function () {
        before_init_address_form();
    });

    $('.do_checkout').on('click',function () {
        var dom = $('.do-count-box .count');
        var variant_data = free_product_ajax_data[dom.attr('data-id')]['variants'][dom.attr('data-num')];

        var data = {};
        if (free_product_order_ajax_data != null){
            var order = {};
            order['image'] = $('.confirm-order-img').attr('src');
            order['money'] = (dom.attr('data-pay-type') == 1 ? variant_data['point'] : variant_data['commission'])*dom.val();
            order['pay_type'] = dom.attr('data-pay-type');
            order['price'] = variant_data['price'];
            order['quantity'] = dom.val();
            order['title'] = variant_data['title'];
        }
        data['variant_id'] = variant_data['variant_id'];
        data['quantity'] = dom.val();
        data['pay_type'] = dom.attr('data-pay-type');
        // dom.attr('data-pay-type') == 1 ? data['variants'][dom.attr('data-num')]['point'] : data['variants'][dom.attr('data-num')]['commission']
        var address = null;
        var index = $('.choose-address').attr('data-index');
        if (index == 'defalut'){
            if (customeinfo['default_address']){
                address = customeinfo['default_address'];
            }
        }else {
            if (customeinfo['addresses'][index]){
                address = customeinfo['addresses'][index];
            }
        }

        data['address'] = address;
        console.log(data);
        $('.do_checkout').addClass('btn-progress');
        $('.cart-fixed-box').addClass('disabled');
        $('.doleftfixed').addClass('disabled');
        $.ymqajax({
            url : "/api/freeproductindex/creat.html",
            data:{data},
            success : function(res) {
                console.log(res);

                if (free_product_order_ajax_data != null){
                    order['cancelledAt'] = null;
                    order['closed'] = false;
                    order['createdAt'] = res['data']['created_at']['date'];
                    order['date'] = res['data']['created_at']['date'];
                    order['displayFulfillmentStatus'] = 'UNFULFILLED';
                    order['id'] = res['data']['id'];
                    order['variantTitle'] = res['data']['line_items'][0]['variant_title'];
                    free_product_order_ajax_data.unshift(order);
                    free_product_order_content();
                }
                console.log(availablePoint,availableCommissions);
                if (dom.attr('data-pay-type') == 1){
                    availablePoint -= (variant_data['point']*dom.val());
                    $('#ymq-point').attr('data-header_detail',$('#ymq-point').attr('data-header_detail')-(variant_data['point']*dom.val()));
                }else{
                    availableCommissions -= (variant_data['commission']*dom.val());
                    $('#ymq-commission').attr('data-header_detail',$('#ymq-commission').attr('data-header_detail')-(variant_data['commission']*dom.val()));

                }
                // console.log(availablePoint,availableCommissions);
                $('.cart-fixed-box').removeClass('disabled').trigger('click');
                // $('.top-goback').trigger('click');
                // showload();
                setTimeout(function () {
                    $("#ymq-free-product-order").addClass('triggertab2').trigger('click');
                },100);


            },
            complete: function (xhr) {
                $('.do_checkout').removeClass('btn-progress');
                $('.cart-fixed-box').removeClass('disabled');
                $('.doleftfixed').removeClass('disabled');
            }
        });
        // dom.remove();
        // customeinfo['addresses'].splice(index,1);
        //
        // left_fixed($('.address-add-fixed'));

    });

    $('.choose-address').on("click", function() {
        var addresses = customeinfo['addresses'];
        var id = 0;
        if ($(this).attr('data-index') == 'defalut'){
            if (customeinfo['default_address']){
                id = customeinfo['default_address']['id'];
            }
        }else{
            if (customeinfo['addresses']){
                id = customeinfo['addresses'][$(this).attr('data-index')]['id'];
            }
        }
        var html = '';
        addresses.forEach(function (address,index) {
            html += `
                <div data-index="${index}" id="address-item-${address['id']}" class="choose-address-item order-cart pl-2 pr-2 pt-2 pb-2 space-between mb-3 order-addrss-cart cursor-pointer ${address['id'] == id ? 'border-color' : ''}">
                    <div>
                        <p class="mb-0">${address['address1'] == null ? '' : address['address1']} ${address['address2'] == null ? '' : address['address2']} ${address['city'] == null ? '' : address['city']}</p>
                        <p class="mb-0">${address['zip'] == null ? '' : address['zip']} ${address['province'] == null ? '' : address['province']}</p>
                        <p class="mb-0">${address['name'] == null ? '' : address['name']} ${address['phone'] == null ? '' : address['phone']}</p>
                    </div>
                    <div data-index="${index}" class="cursor-pointer edit-address-item">
                        <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2977"><path d="M728.688641 380.509705L540.028987 196.968723 136.385074 599.881396l-70.198941 257.396118 256.664879-70.93018L728.688641 380.509705zM884.442542 225.487043a132.354254 132.354254 0 0 0 0-186.465938 130.891776 130.891776 0 0 0-186.465938 0L596.334387 139.932083l189.390894 183.540982zM34.742857 933.326368h954.266858V1024H34.742857z" fill="#757D91" p-id="2978"></path></svg>
                    </div>
                </div>
            `;
        });
        $(".address-fixed .card-body").html(html);
        $('.choose-address-item').on('click',function () {
            left_fixed($('.address-fixed'));
            $('.choose-address').attr('data-index',$(this).attr('data-index'));
            address($(this).attr('data-index'));
        });
        $('.edit-address-item').on('click',function (e) {
            left_fixed($('.address-add-fixed'));
            before_init_address_form($(this).attr('data-index'));
            e.stopPropagation();
        });

    });
    $('.address-add-fixed-delete').on('click',function () {
        if (!$(this).hasClass('disabled')){
            var id = $(this).attr('data-id');
            var index = $(this).attr('data-index');
            var dom = $(`#address-item-${id}`);
            $.ymqajax({
                url : "/api/freeproductindex/addressdelete.html",
                data:{id},
                success : function(res) {
                }
            });
            dom.remove();
            customeinfo['addresses'].splice(index,1);

            left_fixed($('.address-add-fixed'));
        }
    });
    $('.do-save-address').on("click", function() {
        var that = $(this);
        var data = {};
        $('.address-add-fixed input').each(function () {
            if (!$(this).attr('disabled')){
                if ($(this).attr('name') == 'country'){
                    if ($(this).val() != '---'){
                        data[$(this).attr('name')] = $(this).val();
                    }
                }else if ($(this).attr('name') == 'set_default'){
                    if ($(this).is(':checked')){
                        data['set_default'] = 1;
                    }else{
                        data['set_default'] = 0;
                    }
                }else{
                    if ($(this).val() != ''){
                        data[$(this).attr('name')] = $(this).val();
                    }
                }
            }
        });
        that.addClass('btn-progress');
        $('.address-add-fixed #address-country').addClass('disabled');
        $('.address-add-fixed #address-province').addClass('disabled');
        $('.cart-fixed-box').addClass('disabled');
        $('.doleftfixed').addClass('disabled');
        $('.address-add-fixed-delete').addClass('disabled');
        $.ymqajax({
            url : "/api/freeproductindex/address.html",
            data:{data},
            success : function(res) {
                console.log(res);
                if (res.code == 1){
                    left_fixed($('.address-add-fixed'));
                    left_fixed($('.address-fixed'));
                    var index = null;
                    if (that.attr('data-index')){
                        index = that.attr('data-index');
                        customeinfo['addresses'][index] = res['data'];

                    }else{
                        customeinfo['addresses'].push(res['data']);
                        index = customeinfo['addresses'].length - 1;
                    }
                    if (data['set_default'] == 1){
                        customeinfo['default_address'] = res['data'];
                    }
                    $('.choose-address').attr('data-index',index);
                    address(index);

                }

            },
            complete: function (xhr) {
                that.removeClass('btn-progress');
                $('.address-add-fixed #address-country').removeClass('disabled');
                $('.address-add-fixed #address-province').removeClass('disabled');
                $('.cart-fixed-box').removeClass('disabled');
                $('.doleftfixed').removeClass('disabled');
                $('.address-add-fixed-delete').removeClass('disabled');
            }
        });
    });

    function cart_fixed() {
        if (!$(".cart-fixed-do-css3").hasClass('showcss')) {
            $(".cart-fixed-do-css3").addClass('showcss').removeClass('hidecss');
            $(".cart-fixed-box").show();
            $(".in-top-content").css('overflow-y','hidden');
        }else{
            $(".cart-fixed-do-css3").addClass('hidecss').removeClass('showcss');
            $(".in-top-content").css('overflow-y','scroll');
            setTimeout(function(){
                $(".cart-fixed-box").hide();
                $(".order-fixed").addClass('lefthidecss').removeClass('leftshowcss');
            },300);
        }
    }

    function left_fixed(dom = null) {
        if (dom){
            if (!dom.hasClass('leftshowcss')) {
                dom.addClass('leftshowcss').removeClass('lefthidecss');
            }else{
                dom.addClass('lefthidecss').removeClass('leftshowcss');
            }
        }else{
            $('.left-fixed').removeClass('lefthidecss').removeClass('leftshowcss');
        }
    }

    //id (新增) (编辑)
    function before_init_address_form(index = null) {
        if (ymq_shopify_address_init != null){
            init_address_form(index);
        }else{
            var data = {
                auth: 'ymq',
                action: 'get-ymq-address-init-data',
                data:{}
            };
            window.parent.postMessage(data, "*");
            intervalResult(100,100,function(){
                if(ymq_shopify_address_init != null){

                    console.log('自旋',ymq_shopify_address_init);
                    init_address_form(index);
                    return true;
                }
                return false;
            });
        }
    }

    function init_address_form(index) {
        if (ymq_shopify_address_country_init == null){
            ymq_shopify_address_country_init = [];
            var country_html = `
                <select id="test" style="display: none;">
                    ${ymq_shopify_address_init['country']['option']}
                </select>
            `;
            $('.address-add-fixed .card-body').html(country_html);
            $('#test option').each(function () {
                var data = {};
                data['name'] = $(this).html();
                data['value'] = $(this).attr('value');
                var province = $(this).attr('data-provinces');
                
                if (province != "[]"){
                    console.log(typeof province);
                    province = province.substring(2,province.length - 2);
                    province = province.split('],[');
                    province.forEach(function (value,key) {
                        value = value.split(',');
                        value.forEach(function (v,k) {
                            value[k] = v.substring(1,v.length - 1);
                        });
                        province[key] = value;
                    });
                }else{
                    province = '';
                }
                data['province'] = province;
                ymq_shopify_address_country_init.push(data);
            });
            console.log(ymq_shopify_address_country_init);
        }

        var html = '';
        var edit_address = '';
        var country_index = 0;
        var province_index = 0;
        var isDefalut = false;
        if (index != null){
            edit_address = customeinfo['addresses'][index];
            $('.address-add-fixed .card-header .address-add-fixed-html').html('Edit Address');
            $('.address-add-fixed .card-header .address-add-fixed-delete').show().attr('data-id',edit_address['id']).attr('data-index',index);
            $('.address-add-fixed .card-footer button').html('Edit').attr('data-index',index);

            html += `<input value="${edit_address['id']}" type="hidden" name="id">`;
            if (edit_address['id'] == customeinfo['default_address']['id']){
                isDefalut = true;
                $('.address-add-fixed .card-header .address-add-fixed-delete').hide().removeAttr('data-id').removeAttr('data-index');
            }
        }else{
            $('.address-add-fixed .card-header .address-add-fixed-html').html('Add Address');
            $('.address-add-fixed .card-header .address-add-fixed-delete').hide().removeAttr('data-id').removeAttr('data-index');
            $('.address-add-fixed .card-footer button').html('Save').removeAttr('data-index');
        }
        console.log(edit_address);
        country_index = -1;
        province_index = -1;
        try {
            ymq_shopify_address_country_init.forEach(function (item,index) {
                if (item['value'] == edit_address['country']){
                    country_index = index;
                    throw new Error("EndIterative");
                }
            });
        } catch(e) {
            if(e.message!="EndIterative") throw e;
        };

        if (country_index != -1 && ymq_shopify_address_country_init[country_index]['province']){
            try {
                ymq_shopify_address_country_init[country_index]['province'].forEach(function (item,index) {
                    if (item[1] == edit_address['province']){
                        province_index = index;
                        console.log('eee',province_index);
                        throw new Error("EndIterative");
                    }
                });
            } catch(e) {
                if(e.message!="EndIterative") throw e;
            };

        }



        Object.getOwnPropertyNames(ymq_shopify_address_init).forEach(function(key){
            var data = ymq_shopify_address_init[key];

            if (data['type'] == 'text'){
                html += `
                        <div class="form-group">
                            <label for="address-${key}">${data['label']}</label>
                            <input value="${edit_address ? (edit_address[key] == null ? '' : edit_address[key]) : ''}" id="address-${key}" type="text" name="${key}" class="form-control">
                        </div>
                    `;
            }
            console.log(country_index,province_index)
            if(key == 'country'){

                html += `<div class="country-form-group">`;
                html += `
                        <div class="form-group cursor-pointer country-input">
                            <label for="address-${key}">${data['label']}</label>
                            <input readonly style="background: #fff;" data-index="${country_index}" value="${country_index == -1 ? '' : ymq_shopify_address_country_init[country_index]['value']}" id="address-${key}" type="text" name="${key}" class="form-control">
                        </div>
                    `;
                if (country_index != -1 && ymq_shopify_address_country_init[country_index]['province']){
                    console.log(ymq_shopify_address_init['province']);
                    html += `
                        <div class="form-group cursor-pointer">
                            <label for="address-province">${ymq_shopify_address_init['province']['label']}</label>
                            <input readonly style="background: #fff;" data-index="${province_index}" value="${province_index == -1 ? '' : ymq_shopify_address_country_init[country_index]['province'][province_index][1]}" id="address-province" type="text" name="province" class="form-control">
                        </div>
                    `;
                }else{
                    html += `
                        <div class="form-group cursor-pointer" style="display: none;">
                            <label for="address-province">${ymq_shopify_address_init['province']['label']}</label>
                            <input readonly disabled style="background: #fff;" data-index="${province_index}" value="" id="address-province" type="text" name="province" class="form-control">
                        </div>
                    `;
                }


                html += `</div>`;
            }

        });
        html += `
            <label class="custom-switch mt-2 pl-0">
                <input type="checkbox" ${isDefalut ? 'checked' : ''} name="set_default" class="custom-switch-input">
                <span class="custom-switch-indicator"></span>
                <span class="custom-switch-description">${ymq_shopify_address_init['set_default']['label']}</span>
            </label>
        `;
        $('.address-add-fixed .card-body').html(html);
        $('.address-add-fixed #address-country').on('click',function () {
            if (!$(this).hasClass('disabled')){
                left_fixed($('.country-fixed'));
                choose_country_html($(this).attr('data-index'));
            }

        });
        $('.address-add-fixed #address-province').on('click',function () {
            if (!$(this).hasClass('disabled')){
                left_fixed($('.country-fixed'));
                choose_province_html($('.address-add-fixed #address-country').attr('data-index'),$(this).attr('data-index'));
            }
        });
    }

    function choose_province_html(i1 = 0,i2 = 0) {
        var data = ymq_shopify_address_country_init[i1]['province'];
        var html = '<ul class="list-group">';
        data.forEach(function (value,index) {
            html += `
                <li data-index="${index}" data-value="${value[1]}" class="list-group-item ${i2 == index ? 'active' : ''}">${value[0]}</li>
            `;
        });
        html += '</ul>';
        $('.country-fixed .card-body').html(html);
        $('.country-fixed .card-body .list-group-item').on('click',function () {
            if (!$(this).hasClass('active')){
                refresh_province(i1,$(this).attr('data-index'));
            }
            left_fixed($('.country-fixed'));
        });
    }

    function choose_country_html(i = 0) {
        var html = '<ul class="list-group">';
        ymq_shopify_address_country_init.forEach(function (value,index) {
            html += `
                <li data-index="${index}" data-value="${value['value']}" class="list-group-item ${i == index ? 'active' : ''}">${value['name']}</li>
            `;
        });
        html += '</ul>';
        $('.country-fixed .card-body').html(html);
        $('.country-fixed .card-body .list-group-item').on('click',function () {
            if (!$(this).hasClass('active')){
                refresh_country($(this).attr('data-index'));
                refresh_province($(this).attr('data-index'),0);
            }
            left_fixed($('.country-fixed'));
        });
    }
    function refresh_country(index) {
        var data = ymq_shopify_address_country_init[index];
        $('.address-add-fixed .card-body #address-country').val(data['value']).attr('data-index',index);
    }
    function refresh_province(index1,index2) {
        var data = ymq_shopify_address_country_init[index1]['province'];
        if (data){
            data = data[index2];
            $('.address-add-fixed .card-body #address-province').val(data[1]).attr('disabled',false).attr('data-index',index2).parent('.form-group').show();
        }else{
            $('.address-add-fixed .card-body #address-province').val('').attr('disabled',true).parent('.form-group').hide();
        }
        // console.log($('.address-add-fixed .card-body #address-province').val());
    }
    function address(index = 'defalut') {
        var address = null;
        if (index == 'defalut'){
            if (customeinfo['default_address']){
                address = customeinfo['default_address'];
            }
        }else {
            if (customeinfo['addresses'][index]){
                address = customeinfo['addresses'][index];
            }
        }
        if(address){
            $(".order-addrss-cart .addrss-line-1").html(
                `${address['address1'] == null ? '' : address['address1']} ${address['address2'] == null ? '' : address['address2']} ${address['city'] == null ? '' : address['city']}`
            ).removeClass('pt-3').removeClass('pb-3');
            $(".order-addrss-cart .addrss-line-2").html(
                `${address['zip'] == null ? '' : address['zip']} ${address['province'] == null ? '' : address['province']}`
            );
            $(".order-addrss-cart .addrss-line-3").html(
                `${address['name'] == null ? '' : address['name']} ${address['phone'] == null ? '' : address['phone']}`
            );
        }else{
            $(".order-addrss-cart .addrss-line-1").html(__('set_shipping_address')).addClass('pt-3').addClass('pb-3');
            $(".order-addrss-cart .addrss-line-2").html();
            $(".order-addrss-cart .addrss-line-3").html();
        }

    }

    function fresh_need(count) {
        $('.need').children('.need-value').each(function () {
            $(this).html($(this).attr('data-value')*count);
        });
    }

    function intervalResult(maxCount,time,flgBool,loopFn){
        if(typeof maxCount=="function"){
            loopFn=time;
            flgBool=maxCount;
            time=1000;
            maxCount=20;
        }
        else if(typeof time=="function"){
            loopFn=flgBool;
            flgBool=time;
            time=1000;
        }
        if(typeof flgBool!="function"){
            flgBool=function(){
                return false;
            }
        }
        var i=0;
        var invSet=setInterval(function(){
            i++;
            if(i>maxCount||flgBool(i)){
                clearInterval(invSet);
                return;
            }
            if(typeof loopFn=="function"){
                loopFn();
            }
        },time);
    }

    function go_to_checkout(){
        if (!customeinfo){
            $('.go_to_checkout').html('Sign In').attr('do-sign','1');
        }else{
            var pay_type = $('.do-count-box .count').attr('data-pay-type');
            var money = 0;
            if(pay_type == 1){
                money = $('.need .point-span').html();
            }else{
                money = $('.need .commission-span').html();
            }
            var iHave = 0;
            var msg = '';
            if (pay_type == 1){
                iHave = availablePoint;
                msg = __('not_enough_points');
            }else{
                iHave = availableCommissions;
                msg = __('not_enough_commissions');
            }
            if (money > iHave){
                $('.go_to_checkout').html(msg).addClass('disabled');
            }else {
                $('.go_to_checkout').html('Go To Checkout').removeClass('disabled');
            }
        }
        console.log(customeinfo);
    }


});


//freeproductorder
var free_product_order_ajax_data=null;function free_product_order_content(){$('.free-product-order-content').html();var html='';free_product_order_ajax_data.forEach(function(item){html+=`<div class="card"><div class="card-header pt-2 pb-2 pl-2 pr-2"><div class="text-dark">${setDate(item['date'])}</div><div>${item['closed']?'Archived':item['displayFulfillmentStatus']}</div></div><div class="card-body"><div class="item1"><img src="${item['image']}"alt=""></div><div class="item2 pl-3"><p>${item['title']}</p><p>${item['variantTitle']}</p></div><div class="item3 pl-3"><p>${shop_data['money_format']}${item['price']}</p></div></div><div class="card-footer pt-0 pb-2 pl-2 pr-2">${__('spent')}${item['money']}${item['pay_type']==1?__('points'):_('commissions')}</div></div>`});$('.free-product-order-content').html(html)}$(document).ready(function(){$("#ymq-free-product-order").on('click',function(){if(free_product_order_ajax_data==null){showload();$.ymqajax({url:"/api/freeproductindex/order.html",success:function(res){if(free_product_order_ajax_data==null){free_product_order_ajax_data=res['data'];if(free_product_order_ajax_data){free_product_order_content()}}}})}})});
//refer
$(document).ready(function(){$(document).on('click',"#ymq-refer",function(){if($('.refer-content .ishas').length>0){return false}showload()$.ymqajax({url:"/api/referralindex/getlist",success:function(res){var pushHtml=`<div class="card card-title"><div class="cart-title"><h6 class="text-dark-1">${__('referral_history')}</h6></div></div>`;pushHtml+=creatreferlisthtml(res.data);$('.refer-content').append(pushHtml)}})});$(document).on('click',".refer_email_submit",function(){if(!checkemail($('.refer_email').val())){iziToast.show({message:__('pelese_fill_correct_email_address'),position:'topCenter'});$(".refer_email").focus();return}$(this).addClass('btn-progress');var that=$(this);$.ymqajax({url:"/api/referralindex/accept",btn:that,data:{referral_link:$('.referral_link').val(),refer_email:$('.refer_email').val(),refer_name:$('.refer_name').val()},success:function(result){if(result.mas=='has'){iziToast.show({message:__('has_unused_coupons'),position:'bottomCenter'});return false}if(result.mas=='no_reward'){iziToast.show({message:__('no_rewards_to_receive'),position:'bottomCenter'});return false}$('.top-goback').trigger('click')iziToast.show({message:__('has_sent_to_your_email'),position:'bottomCenter'})}})});function creatreferlisthtml(data){var pushHtml=``;for(var i in data){var item=data[i]pushHtml+=`<div class="card ishas"><div class="row point-item"><div class="col-6"><span class="point">${item.b_first_name}</span><br><span class="expirationtime">Completed</span></div><div class="col-6 align-self-center text-right"style="padding-left:0;"><span class="point">${shop_data.money_format}${item.spent}</span><br><span class="expirationtime">${setDate(item.createtime)}</span></div></div>`;if(item.hasOwnProperty('coupon')){for(var index in item['coupon']){var items=item['coupon'][index];var used='';if(items.status==2){used='coupon_used'}pushHtml+=`<div class="cart-item row ${used}"><div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">${svg[items.icon]}</div><div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center"style="padding:0;">`;if(items.type==1){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('off_coupon',[shop_data.money_format+items.get])}</p>`}else if(items.type==3){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('off_coupon',[items.get+'%'])}</p>`}else if(items.type==4){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('free_shipping_coupon')}</p>`}pushHtml+=`</div><div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">`;pushHtml+=`<span class="btn btn-primary btn-custome gift-view"data-status="${items.status}"data-code="${items.code}"data-day="${items.day}"data-get="${items.get}"data-min_amout="${items.min_amout}"data-id="${items.id}"data-type="${items.type}"data-icon="${items.icon}"data-applies_type="${items.applies_type}">${__('view')}</span>`;pushHtml+=`</div></div>`}}pushHtml+=`</div>`}return pushHtml}$(document).on('click',"#refer .gift-view",function(){goback_arr.push('gift-view');showHidePage('.refer-giftlist-content');$(".refer-giftdetail-content").show();var pushHtml=creatgiftdetailhtml($(this).data());$('.refer-giftdetail_cart').html(pushHtml);hideload()$(".in-top-content").animate({scrollTop:0},10)});function creatgiftdetailhtml(data){var pushHtml=`<div class="cart-item row"><div class="col-2">${svg[data.icon]}</div><div class="col-10 cart-item-center">`;if(data.type==1){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('off_coupon',[shop_data.money_format+data.get])}</p>`}else if(data.type==3){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('off_coupon',[data.get+'%'])}</p>`}else if(data.type==4){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('free_shipping_coupon')}</p>`}pushHtml+=`</div></div>`;pushHtml+=`<div class="row row_text"><div class="col-12 text-center">${__('use_discount')}</div></div><div class="cart-item row"><div class="col-12"><div class="form-group"><div class="input-group"><input type="text"class="form-control copy_input"readonly data-indicator="pwindicator"value="${data.code}"><div class="input-group-prepend"><div class="input-group-text copy_code"><svg t="1601043413182"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="1192"width="32"height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z"fill="#1C1C1C"p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z"fill="#1C1C1C"p-id="1194"></path></svg></div></div></div></div></div></div>`;pushHtml+=`<div class="row row_text"><div class="col-12">`;if(data.min_amout>0){pushHtml+=`<div>${__('coupon_more_then',[shop_data.money_format+data.min_amout])}</div>`}if(data.type==4&&data.get!='all'){pushHtml+=`<div>${__('coupon_less_then',[shop_data.money_format+data.get])}</div>`}if(data.applies_type==1){pushHtml+=`<div>Reward can only be used on select product collections.</div>`}else if(data.applies_type==2){pushHtml+=`<div>${__('coupon_select_product')}</div>`}if(data.day>0){pushHtml+=`<div>${__('coupon_day',[data.day])}</div>`}pushHtml+=`</div></div>`;if(data.status!=2){pushHtml+=`<div class="row row_text"style="padding: 30px 20px 20px 20px;"><div class="col-12"style="margin:0 auto;"><span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;"class="btn btn-primary btn-custome apply_code"data-code="${data.code}">${__('apply_code')}</span></div></div>`}return pushHtml}})
//vip
$(document).ready(function(){$(".vip_coupon").click(function(){if($('.vip_coupon_cart .cart-item').length<=0){var that=$(this);showload()$.ymqajax({url:"/api/vipindex/getvipCoupon",data:{vipids:that.data('vipids'),now_level:now_level},success:function(result){if($('.vip_coupon_cart .cart-item').length<=0){var pushHtml='';var border='border-top: 1px dashed #ccc;';var that_i='';for(let i in result.data){that_i=i;pushHtml+=`<div class="cart-title"><h6 class="text-dark-1">${__('vip_coupons')}</h6></div><div class="cart-item row"style="height: auto;margin-bottom: 0;padding-top: 10px;${border}"><div class="col-2">${$('.vip_icon_'+i).html()}</div><div class="col-10 cart-item-center"><p class="earn-name"style="line-height:48px;">${$('.vip_level_'+i).html()}</p></div></div>`;result.data[i].forEach(function(item){pushHtml+=`<div class="cart-item row"><div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">${svg[item.icon]}</div><div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center"style="padding-right:0;">`;if(item.type==1){pushHtml+=`<p class="earn-name">${__('off_coupon',[shop_data.money_format+item.get])}</p>`}else if(item.type==2){pushHtml+=`<p class="earn-name">${__('order_discount')}</p>`}else if(item.type==4){pushHtml+=`<p class="earn-name">${__('free_shipping_coupon')}</p>`}pushHtml+=`<p class="earn-point">${__('can_be_claimed',[item.month])}</p>`;pushHtml+=`</div><div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">`;if(now_level==that_i){if(item.can_convert){if(item.needexplain){pushHtml+=`<span class="btn btn-primary btn-custome view"data-day="${item.day}"data-get="${item.get}"data-month="${item.month}"data-min_amout="${item.min_amout}"data-id="${item.id}"data-type="${item.type}"data-icon="${item.icon}"data-applies_type="${item.applies_type}">${__('view')}</span>`}else{pushHtml+=`<span class="btn btn-primary btn-custome redeem"data-day="${item.day}"data-get="${item.get}"data-id="${item.id}"data-type="${item.type}">${__('redeem')}</span>`}}else{pushHtml+=`${svg['finish']}`}}pushHtml+=`</div></div>`})};$('.vip_coupon_cart').append(pushHtml)$(".progress-main-path").each(function(){$(this).animate({'stroke-dashoffset':$(this).data("stroke")},1000)})}}})}})$(document).on('click',"#vip .view",function(){goback_arr.push('vip-coupon-content');showHidePage('.vip-coupon-content');$(".view-coupon-content").show();var pushHtml=`<div class="cart-item row"><div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">${$(this).parent('.way_right').prev().prev().html()}</div><div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">${$(this).parent('.way_right').prev().html()}</div></div>`;pushHtml+=`<div class="row row_text"><div class="col-12">`;if($(this).data('min_amout')>0){pushHtml+=`<div>${__('coupon_more_then',[shop_data.money_format+$(this).data('min_amout')])}</div>`}if($(this).data('type')==4&&$(this).data('get')!='all'){pushHtml+=`<div>${__('coupon_less_then',[shop_data.money_format+$(this).data('get')])}</div>`}if($(this).data('applies_type')==1){pushHtml+=`<div>Reward can only be used on select product collections.</div>`}else if($(this).data('applies_type')==2){pushHtml+=`<div>${__('coupon_select_product')}</div>`}if($(this).data('day')>0){pushHtml+=`<div>${__('coupon_day',[$(this).data('day')])}</div>`}pushHtml+=`</div></div>`;pushHtml+=`<div class="row"style="padding: 30px 20px 20px 20px;"><div class="col-12"style="margin:0 auto;"><span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;"class="btn btn-primary btn-custome redeem"data-id="${$(this).data('id')}">${__('redeem')}</span></div></div>`;$('.view-coupon-content_cart').html(pushHtml);$(".in-top-content").animate({scrollTop:0},10)});$(document).on('click',"#vip .redeem",function(){$(this).addClass('btn-progress');var that=$(this);$.ymqajax({url:"/api/vipindex/convert",btn:that,data:{id:that.data('id')},success:function(result){var data=result.data;showHidePage('.vip-coupon-content');$(".vip-giftdetail-content").show();var pushHtml=creatgiftdetailhtml(data);$('.vip-giftdetail_cart').html(pushHtml);hideload();$(".in-top-content").animate({scrollTop:0},10)}})});$(".vip_convert_history").click(function(){if($('.vip-giftlist_cart .cart-item').length<=0){showload()$.ymqajax({url:"/api/vipindex/getconvertlist",data:'',success:function(result){var pushHtml=`<div class="cart-title"><h6 class="text-dark-1">${__('your_rewards')}</h6></div>`;result.data.forEach(function(item){var used='';if(item.status==2){used='coupon_used'}pushHtml+=`<div class="cart-item row ${used}"><div class="col-2 col-md-2 col-lg-2 col-sm-2 col-xs-2">${svg[item.icon]}</div><div class="col-6 col-md-6 col-lg-6 col-sm-6 col-xs-6 cart-item-center">`;if(item.type==1){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('off_coupon',[shop_data.money_format+item.get])}</p>`}else if(item.type==3){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('off_coupon',[item.get+'%'])}</p>`}else if(item.type==4){pushHtml+=`<p class="earn-name"style="line-height:48px;">${__('free_shipping_coupon')}</p>`}pushHtml+=`</div><div class="col-4 col-md-4 col-lg-4 col-sm-4 col-xs-4 t-right way_right">`;pushHtml+=`<span class="btn btn-primary btn-custome gift-view"data-status="${item.status}"data-code="${item.code}"data-day="${item.day}"data-get="${item.get}"data-min_amout="${item.min_amout}"data-id="${item.id}"data-type="${item.type}"data-icon="${item.icon}"data-applies_type="${item.applies_type}">${__('view')}</span>`;pushHtml+=`</div></div>`});$('.vip-giftlist_cart').append(pushHtml)}})}})$(document).on('click',"#vip .gift-view",function(){goback_arr.push('gift-view');$(".top-goback").data('back',".vip-giftlist-content");prev_page='.vip-content';showHidePage('.vip-giftlist-content');$(".vip-giftdetail-content").show();var pushHtml=creatgiftdetailhtml($(this).data());$('.vip-giftdetail_cart').html(pushHtml);hideload()$(".in-top-content").animate({scrollTop:0},10)});function creatgiftdetailhtml(data){var pushHtml=`<div class="cart-item row"><div class="col-2">${svg[data.icon]}</div><div class="col-10 cart-item-center">`;if(data.type==1){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('off_coupon',[shop_data.money_format+data.get])}</p>`}else if(data.type==3){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('off_coupon',[data.get+'%'])}</p>`}else if(data.type==4){pushHtml+=`<p class="earn-name"style="line-height: 48px;">${__('free_shipping_coupon')}</p>`}pushHtml+=`</div></div>`;pushHtml+=`<div class="row row_text"><div class="col-12 text-center">${__('use_discount')}</div></div><div class="cart-item row"><div class="col-12"><div class="form-group"><div class="input-group"><input type="text"class="form-control copy_input"readonly data-indicator="pwindicator"value="${data.code}"><div class="input-group-prepend"><div class="input-group-text copy_code"><svg t="1601043413182"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="1192"width="32"height="32"><path d="M263.2 761.3H145.4c-45.5 0-82.5-37-82.5-82.5V150.6c0-45.5 37-82.5 82.5-82.5h488.9c45.5 0 82.5 37 82.5 82.5v70.1c0 11-9 20-20 20s-20-9-20-20v-70.1c0-23.4-19-42.5-42.5-42.5H145.4c-23.4 0-42.5 19-42.5 42.5v528.3c0 23.4 19 42.5 42.5 42.5h117.8c11 0 20 9 20 20s-8.9 19.9-20 19.9z"fill="#1C1C1C"p-id="1193"></path><path d="M897.2 971.1H400.9c-42.5 0-77.2-34.6-77.2-77.2V358.4c0-42.5 34.6-77.2 77.2-77.2h496.4c42.5 0 77.2 34.6 77.2 77.2V894c-0.1 42.5-34.7 77.1-77.3 77.1zM400.9 321.2c-20.5 0-37.2 16.7-37.2 37.2V894c0 20.5 16.7 37.2 37.2 37.2h496.4c20.5 0 37.2-16.7 37.2-37.2V358.4c0-20.5-16.7-37.2-37.2-37.2H400.9z"fill="#1C1C1C"p-id="1194"></path></svg></div></div></div></div></div></div>`;pushHtml+=`<div class="row row_text"><div class="col-12">`;if(data.min_amout>0){pushHtml+=`<div>${__('coupon_more_then',[shop_data.money_format+data.min_amout])}</div>`}if(data.type==4&&data.get!='all'){pushHtml+=`<div>${__('coupon_less_then',[shop_data.money_format+data.get])}</div>`}if(data.applies_type==1){pushHtml+=`<div>Reward can only be used on select product collections.</div>`}else if(data.applies_type==2){pushHtml+=`<div>${__('coupon_select_product')}</div>`}if(data.day>0){pushHtml+=`<div>${__('coupon_day',[data.day])}</div>`}pushHtml+=`</div></div>`;if(data.status!=2){pushHtml+=`<div class="row row_text"style="padding: 30px 20px 20px 20px;"><div class="col-12"style="margin:0 auto;"><span style="height: 50px;line-height: 50px;font-size: 18px;width: 100%;"class="btn btn-primary btn-custome apply_code"data-code="${data.code}">${__('apply_code')}</span></div></div>`}return pushHtml}})