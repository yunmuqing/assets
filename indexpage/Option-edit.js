
$(document).ready(function () {
    var shopify_conainer = {};
    var form_data = $('#defaultForm').serialize();
    if ($("input[name='id']").length == 1){
        var domClass = $("input[name='applies_type']:checked").attr('data-class') ? $("input[name='applies_type']:checked").attr('data-class') : '.specific_products';

        var dom = $(domClass);
        if (dom.length){
            var id = dom.find('.specific_input').val();
            var valus = id.split(',');
            var url = '';
            if (dom.find('.ajax-modal').attr('data-type') == 'collections'){
                url = '/api/shopifydata/collections_by_id.html'
            }else{
                url = '/api/shopifydata/products_by_id.html';
            }
            $.ajax({
                url: url,
                type: 'post',
                data:{id:id},
                dataType: 'json',
                success: function (res) {
                    dom.find('.content-show').html('');
                    if(res.code == 1){
                        shopify_conainer = res.msg;
                        contentShow(res.msg,valus,dom.find('.ajax-modal'));

                    }
                }
            });
        }

    }



    function isInteger(obj) {
        return obj % 1 === 0
    }
    $("input,textarea,select").bind('input propertychange', function() {
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }

    });


    $(".ajax-modal").each(function () {
        var that = $(this);
        var type = that.attr('data-type');
        $(this).ajaxModal({
            center: true,
            title: that.attr('data-title'),
            headerhtml: '<ul class="list-group list-group-flush border-top">\n' +
                '    <li class="list-group-item">\n' +
                '        <div class="form-group margin-bottom-0">\n' +
                '            <div class="input-group">\n' +
                '                <div class="input-group-prepend">\n' +
                '                    <div class="input-group-text">\n' +
                '                        <i class="fas fa-search"></i>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <input type="text" class="form-control currency search-input" placeholder="'+that.attr('data-placeholder')+'">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </li>\n' +
                '</ul>',
            body: '<img class="load" src="/svg/load-blue-44.svg">',
            url: that.attr('data-url'),
            ajaxSuccess: function(res,modal){

                showHtml(res,modal,that);
                modal.on('hidden.bs.modal', function() {
                    modal.find(".search-input").val('');
                });

            },
            buttons: [
                {
                    text: 'Cancel',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Add',
                    class: 'btn btn-primary btn-shadow disabled',
                    handler: function(modal) {
                        if (!$(this).hasClass('disabled')){
                            var ids = [];
                            modal.find('.shopify-checkbox:checked').each(function () {
                                ids.push($(this).val());
                            });
                            modal.modal('hide');
                            $(this).fireModal({
                                title: 'Will be copied to the product you selected',
                                body: 'If the copied product already has data, it will be overwritten!',
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
                                        text: 'Copy',
                                        class: 'btn btn-danger btn-shadow',
                                        handler: function(modal) {
                                            var dom = $(this);
                                            dom.addClass('btn-progress');
                                            $.ajax({
                                                url: '/api/option/copy.html',
                                                type: 'post',
                                                data:{ids,type,product_id},
                                                dataType: 'json',
                                                success: function (res) {
                                                    dom.removeClass('btn-progress');
                                                },
                                                error:function () {
                                                    dom.removeClass('btn-progress');
                                                }
                                            });
                                        }
                                    }
                                ]
                            });
                        }
                    }
                }
            ],
            appended: function (dom, modal_form, options) {
                var timeout;
                dom.find(".search-input").on('input', function () {
                    clearTimeout(timeout);
                    var input = $(this);
                    timeout = setTimeout(function() {
                        dom.find('.modal-body').html(options.body);
                        $.ymqajax({
                            url: options.url,
                            success: function (res) {
                                showHtml(res,dom,that);
                            },
                            data:{title:input.val()},
                            ymqtype: 'modal',
                            dom: dom.find('.modal-body'),
                        });
                    }, 1000);
                });
            }
        });

    });


    $(document).on('click', ".shopify-checkbox",function(){
        //判断按钮是否disabled
        var vals = [];
        var name = $(this).attr('name');
        $.each($(`input[name='${name}']:checked`),function(){
            vals.push($(this).val());
        });
        if (vals.length == 0){
            $(this).parents('.modal-content').find('.btn-primary').addClass('disabled');
        }else{
            $(this).parents('.modal-content').find('.btn-primary').removeClass('disabled');
        }
        //点击全选他的变体

        if ($(this).is(":checked")){
            $(".shopify-variant-checkbox[name='variant-"+$(this).val()+"']").prop("checked",true);
        }else{
            $(".shopify-variant-checkbox[name='variant-"+$(this).val()+"']").prop("checked",false);
        }
        $(this).parent().removeClass('not-cheched-all');
    })




    function showHtml(res,modal,that) {
        var value = that.find('.specific_input').val();
        var variants_value = null;
        if (that.find('.variants').val()){
            variants_value = JSON.parse(that.find('.variants').val());
        }


        value = value.split(',');
        var pushHtml = '<ul class="list-group list-group-flush content-ul y-scroll">';
        var data = Object.values(res.data);

        data.forEach(function (item) {
            var variant_value = [];


            var not_all_choose_class = true;
            if (that.attr('data-type') == 'products'){
                if (variant_value != "all" && item['variants'].length != variant_value.length){
                    not_all_choose_class = false;
                }
            }

            pushHtml += `
                        <li class="list-group-item">
                            <div class="custom-control ${not_all_choose_class ? '' : 'not-cheched-all'} custom-checkbox">
                              <input type="checkbox" ${value.indexOf(item['id']) == -1 ? '' : 'checked data-checked="1"' } name="product" value="${item['id']}" class="custom-control-input shopify-checkbox" id="product-${item['id']}" data-image="${item['image']}" data-title="${item['title']}" data-sid="${item['sid']}" >
                               <label class="custom-control-label flex-start" for="product-${item['id']}">
                                  <div class="media space-between">
                                        <div class="mr-4 i-box">
                                            <img width="40" src="${item['image']}">
                                        </div>
                                        <div class="media-body">
                                            <div class="inline-block">
                                                <p class="mt-0 mb-0 text-dark-1 line-h-1">${item['title']}</p>
                                            </div>
                                        </div>
                                    </div>
                               </label>
                            </div>
                        `;

            pushHtml += '</li>';
        })

        pushHtml += '</ul>';
        modal.find('.modal-body').html(pushHtml);
    }

    function removalArray(arr1,arr2){
        var arr = arr1.concat(arr2);
        return Array.from(new Set(arr));
    }

    function contentShow(shopify_conainer,valus,that){
        var dom = that.parents('.specific').find('.content-show');
        var html = '';
        if (!jQuery.isEmptyObject(shopify_conainer)){
            valus.forEach((item)=>{
                html += '<li class="list-group-item no-padding-left no-padding-right" data-id="'+item+'" data-sid="'+shopify_conainer[item]['sid']+'">\n' +
                    '                                <div class="custom-control custom-checkbox no-padding-left">\n' +
                    '                                    <div class="media space-between">\n' +
                    '                                        <div class="mr-4 i-box">\n' +
                    '                                            <img width="40" src="'+shopify_conainer[item]['image']+'">\n' +
                    '                                        </div>\n' +
                    '                                        <div class="media-body space-between">\n' +
                    '                                            <p class="mt-0 mb-0 text-dark-1 line-h-1">'+shopify_conainer[item]['title']+'</p>\n' +
                    '                                            <div class="space-between">' ;
                if(that.attr('data-type') == 'products'){
                    html +='                                               <div class="mr-4 text-dark-1 pointer variants-edit float-right">Edit</div>\n' ;
                }
                html +='                                               <button type="button" class="close big-close" data-dismiss="modal" data-type="'+that.attr("data-type")+'" aria-label="Close">\n' +
                    '                                                    <span aria-hidden="true">×</span>\n' +
                    '                                               </button>\n' +
                    '                                            </div>' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                </div>\n' +
                    '                            </li>';
            });
        }
        dom.html(html);
    }
    $(document).on('click', ".content-show .close",function(){
        var id = $(this).parents('.list-group-item').attr('data-id');
        var inputDom = $(this).parents('.specific').find('.specific_input');

        var value = inputDom.val();
        value = resetValue(id,value);
        if ($(this).attr('data-type') == 'products'){
            var variantsDom = $(this).parents('.specific').find('.variants');
            resetVariants(id,variantsDom);
            variantsDom.trigger('input');
        }

        inputDom.val(value);
        // inputDom.trigger('input');
        inputDom.trigger('input');

        $(this).parents('.list-group-item').remove();
    })
    $('.x-y-select').on('change',function(){
        // p_c_toggle($(this).val());
        $(this).parents('.card').find('.specific').hide().find('input').attr('disabled',true);

        $(this).parents('.card').find($(this).val()).show().find('input').attr('disabled',false);
    })


    function resetValue(id,value){
        value = value.split(',');
        value.splice(value.indexOf(id), 1);
        value = value.toString();
        return value;
    }
    function resetVariants(id,dom){
        var variants = JSON.parse(dom.val());
        delete variants[id];
        dom.val(JSON.stringify(variants));
    }
    $('input[name=applies_type]').change(function() {
        $('input[name=applies_type]').next().next().css('background-color','#fdfdff').css('color','#6c757d');
        $('input[name=applies_type]:checked').next().next().css('background-color','#6777ef').css('color','#fff');
        var clazz = $(this).attr('data-class');
        $('.specific').hide().find('input').attr('disabled',true);
        if (clazz){
            $(clazz).show().find('input').attr('disabled',false);
        }
    });

    $('.input-toggle').change(function() {
        if($(this).is(':checked')){
            $(this).parents('.toggle-box').next('.hide').show().find('input').attr('disabled',false).trigger('input');
            // $(this).parents('.toggle-box').next('.hide').show().find('input').attr('disabled',false).trigger('input');
        }else {
            $(this).parents('.toggle-box').next('.hide').hide().find('input').attr('disabled',true).trigger('input');

        }
    });

    $('.copy').on('click',function () {
        $('.copy-box').toggle();
    })



    function creatVariantHtml(data = {}){
        
        switch(Number(data['type']))
          {
              case 1:
                  var type_text = 'Drop-down';
                  break;
              case 2:
                  var type_text = 'Radio';
                  break;
              case 3:
                  var type_text = 'Button';
                  break;
              case 4:
                  var type_text = 'Switch';
                  break;
          }
        var optionHtml = creatVariantValueHtml(data);

        var headerHtml = `
        <div class="card">
        <div class="variant_box_${data.name}" data-id="${data.name}">
            <div class="option_box_header card-header">
              <div class="up_down is-rotate" style="margin-right: 15px;">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/down.png">
              </div>
              <span class="option-type-text btn btn-dark btn_type">${type_text}</span>
              <span class="option_title option_titleoption_id">${data.name}</span>
            </div>
            <div class="option_box_body card-body" style="display:block;">
              <div class="row option_value_header">
                <div class="col-2">
                  <div class="form-group">
                    <label>Option Title</label>
                    <input ymq-validate="require" value="${data.name}" disabled class="form-control" type="text">
                  </div>
                </div>
                
                <div class="col-2">
                  <div class="form-group">
                    <label>Tooltip</label>
                    <input class="form-control tooltip_text option_variant_json" value="${data['tooltip']}" data-id="${data.name}" data-key="tooltip" type="text">
                  </div>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <label>Help Text position</label>
                    <select class="form-control select2 tooltip_position option_variant_json" data-id="${data.name}" data-key="tooltip_position">
                      <option value="1" ${Number(data['tooltip_position'])== 1 ? 'selected' : ''}>Below the entire option</option>
                      <option value="2" ${Number(data['tooltip_position'])== 2 ? 'selected' : ''}>Above the entire option</option>
                      <option value="3" ${Number(data['tooltip_position'])== 3 ? 'selected' : ''}>Below the option title</option>
                    </select>
                  </div>
                </div>
                
                <div class="col-2">
                  <div class="form-group">
                    <label>Help Text</label>
                    <input class="form-control help_text option_variant_json" value="${data['help']}" type="text" data-id="${data.name}" data-key="help">
                  </div>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <label>Option Type</label>
                    <select class="form-control select2 type option_type_select option_variant_json" data-id="${data.name}" data-key="type">
                      <option value="1" ${Number(data['type'])== 1 ? 'selected' : ''}>Drop Down</option>
                      <option value="2" ${Number(data['type'])== 2 ? 'selected' : ''}>Radio</option>
                      <option value="3" ${Number(data['type'])== 3 ? 'selected' : ''}>Button</option>
                      <option value="4" ${Number(data['type'])== 4 ? 'selected' : ''}>Switch</option>
                    </select>
                  </div>
                </div>
              </div>
              ${optionHtml}
            </div>
          </div>
        </div>
      `;
      return headerHtml;
    }

    function creatVariantValueHtml(data){
        var display_none = `style="display:none;"`;
        if (Number(data['type'])== 4) {
            display_none = ``;
        }
        var html = ``;
        for(var key in data.values){
            var item = data.values[key];
            html += `
            <div class="col-6">
              <div class="card list-group-item padding0 option_value_box">
                <div class="row select_item">
                  <div class="col-5">
                    <div class="form-group">
                        <label>Title</label>
                      <input ymq-validate="require" value="${item.title}" class="form-control" disabled type="text">
                    </div>
                  </div>
                  <div class="col-7 is_switch" ${display_none}>
                    <div class="row">
                      <div class="col-5 padding_r0">
                        <div class="form-group">
                        <label>swatches</label>
                          <select class="form-control select2 option_variant_value_json canvas_type_select" data-id="${item.title}" data-key="canvas_type" data-pid="${data.name}">
                            <option value="1" ${Number(item['canvas_type'])== 1 ? 'selected' : ''}>color</option>
                            <option value="2" ${Number(item['canvas_type'])== 2 ? 'selected' : ''}>image</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-7 padding_r0 padding-l-5 flex-end">
                        <div class="canvas_type canvas_type1" style="${Number(item['canvas_type'])== 1 ? '' : 'display: none;'}">
                          <button type="button" class="btn btn-primary color_picker" data-id="1" data-pid="1"><i class="fas fa-fill-drip"></i></button>
                          <span class="color_picker_span" style="background:${item['canvas1']!= '' ? '#'+item['canvas1'] : 'transparent'};"></span>
                          <input type="hidden" name="canvas1" class="option_variant_value_json canvas1" data-id="${item.title}" data-key="canvas1" data-pid="${data.name}" value="${item['canvas1']}">
                        </div>
                        <div class="canvas_type canvas_type2" style="${Number(item['canvas_type'])== 2 ? '' : 'display: none;'}">
                          <button type="button" class="btn btn-primary selectImgBtn" data-toggle="modal" data-target="#selectImgModel" data-id="${item.title}" data-pid="${data.name}"><i class="fa fa-upload"></i></button>
                          <img class="canvas_img canvas_img_${item.title}" src="${item['canvas2']!= '' ? item['canvas2'] : '/svg/swatch.png'}">
                          <input type="hidden" name="canvas2" class="option_variant_value_json canvas2" data-id="${item.title}" data-key="canvas2" data-pid="${data.name}" value="${item['canvas2']}">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
        }

        var select_value_option = `
            <div class="select_body">
                <div class="list-group option_value_list" data-id="${data.name}" id="option_${data.name}">
                    <div class="row">
                    ${html}
                    </div>
                </div>
            </div>
        `;
        return select_value_option;
    }
    function initVariant(){
        
        for(var key in ymq_variantjson){
            $('#variant_option').append(creatVariantHtml(ymq_variantjson[key]));
        }
        $(".select2").select2({minimumResultsForSearch: -1});
    }
    initVariant()
    $(document).on('change', '.option_variant_value_json', function () {
        ymq_variantjson[$(this).data("pid")]["values"][$(this).data("id")][$(this).data("key")] = $(this).val();
        console.log(ymq_variantjson)
    })
    $(document).on('change', '.option_variant_json', function () {
        ymq_variantjson[$(this).data("id")][$(this).data("key")] = $(this).val();
        console.log(ymq_variantjson)
    })
    $(document).on('change', '.option_type_select', function () {
        $('.variant_box_'+$(this).data('id')+' .is_switch').hide();
        switch(Number($(this).val()))
          {
              case 1:
                  var type_text = 'Drop-down';
                  break;
              case 2:
                  var type_text = 'Radio';
                  break;
              case 3:
                  var type_text = 'Button';
                  break;
              case 4:
                  var type_text = 'Switch';
                  $('.variant_box_'+$(this).data('id')+' .is_switch').show();
                  break;
          }
        $(this).parent().parent().parent().parent().prev().children(".btn_type").text(type_text);
    })
    $('.color_picker').ymqColorpicker()
});

