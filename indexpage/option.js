$(document).ready(function () {
  jQuery.fn.extend({
      ymqValidate:function(customeFunction){
        var that = $(this);
        var emailRe = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
        var numberRe = /^[0-9]+.?[0-9]*/; 
        //错误计数
        var error_num = 0;
        var error_box = `<div class="ymq_error_box"></div>`;
        //提交百度时触发
        $(this).submit(function(e){
          error_num = 0;
          $('#'+$(this).attr('id')+' input,#'+$(this).attr('id')+' select').each(function(){
            validate($(this))
          })
          myconsole(error_num)
          //没有错误执行自定义方法
          if (error_num == 0) {
            customeFunction();
          }else{
            alert('option title,option value title is required');
            $('#'+$(this).attr('id')+' .ymqhaserror').eq(0).focus();
          }
          return false;
      });
        //下单改变时触发
        $(document).on('input propertychange', '#'+$(this).attr('id')+' input,#'+$(this).attr('id')+' select', function () 
        {
          validate($(this))
        })
        //验证函数
      function validate(inputDom){
        //隐藏禁用的不参与
        if (typeof inputDom.attr('disabled') !== typeof undefined && inputDom.attr('disabled') !== false && inputDom.attr('disabled') == 'true') {
          return;
        }
        var errorInfo = ``;
        var validateInfo = inputDom.attr('ymq-validate');
        if (!inputDom.next().hasClass('ymq_error_box')) {
          inputDom.after(error_box);
        }
        if (typeof validateInfo !== typeof undefined && validateInfo !== false && validateInfo != '') {
        var validateInfoArr = validateInfo.split('|');
        validateInfoArr.forEach(function (item) {
              if (item == 'require' && inputDom.val() == '') {
                error_num++;
                errorInfo += `<span class="ymq_error">required</span>`;
              }
              if (inputDom.val() != '') {
                if(item.search("minchar:") > -1 && inputDom.val().length < item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">大于${item.split(':')[1]}个字符</span>`;
                }
                if(item.search("maxchar:") > -1 && inputDom.val().length > item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">不得大于${item.split(':')[1]}个字符</span>`;
                }
                if(item.search("min:") > -1 && inputDom.val() < item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">不得小于${item.split(':')[1]}</span>`;
                }
                if(item.search("max:") > -1 && inputDom.val() > item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">不得大于${item.split(':')[1]}</span>`;
                }
                if(item == 'email' && !emailRe.test(inputDom.val())){
                  error_num++;
                  errorInfo += `<span class="ymq_error">请输入邮箱</span>`;
                }
                //是整数
                if(item == 'integer' && inputDom.val() % 1 !== 0){
                  error_num++;
                  errorInfo += `<span class="ymq_error">Please enter an integer.</span>`;
                }
                //是数字
                if(item == 'number' && !numberRe.test(inputDom.val())){
                  error_num++;
                  errorInfo += `<span class="ymq_error">enter number</span>`;
                }
                //数字大于
                if(item.search("numbermin:") > -1 && inputDom.val() < item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">数字大于${item.split(':')[1]}</span>`;
                }
                //数字小于
                if(item.search("numbermax:") > -1 && inputDom.val() > item.split(':')[1]){
                  error_num++;
                  errorInfo += `<span class="ymq_error">数字小于${item.split(':')[1]}</span>`;
                }
                //浮点数(不得超过几位小数)  暂时不考虑
                if(item.search("float:") > -1){
                  if (inputDom.val() % 1 !== 0) {
                    if (inputDom.val().toString().split(".")[1].length > item.split(':')[1]) {
                      error_num++;
                      errorInfo += `<span class="ymq_error">${item.split(':')[1]}小数</span>`;
                    }
                  }
                }
              }
                
            })
        }
        inputDom.next('.ymq_error_box').html(errorInfo)
        if (errorInfo != '') {
          inputDom.addClass('ymqhaserror');
        }else{
          inputDom.removeClass('ymqhaserror');
        }
      }
      } 
  });

    //id索引
    var ymq_index = 1;
    var available_option = [];
    var key_prefix = 'ymq';
    var temoptionbox = 'temoptionbox';
    var tembox = 'tembox';
    var tem_prefix = 'tem';
    var hasOptionValueArr = ['3','4','5','6','7','8'];
    var canvasTypeArr = [5,8];
    
    //var condition = {};
    var basImgUrl = '';
    var img_suffix = '';
    
    
    //有值就回显
    if (Object.keys(ymq_option).length > 0) {
        init();
    }

    //添加模板
    $(document).on('click', '.add_tem span', function () {
      var temId = $('.tem_select').val();
      if (temId.length < 1) {
        alert('Please choose one template');
        return;
      }
      var temType = $('.tem_type_select').val();
      temId = temId.filter(item => {
        if(ymq_temoption.hasOwnProperty(tem_prefix+item) && temType == 1){
            return false;
        }
        return true;
      })
      if (temId.length < 1) {
        alert('All selected templates have been added');
        return;
      }
      var that = $(this);
      that.addClass('btn-progress');
      $.ajax({
          type: 'POST',
          url: '/api/tem/getbyid',
          dataType: 'json',
          data: {temId},
          success: function (res) {
            var data = res.data;
            data.forEach(function (item,index) {
              if (Number(temType) == 1) {
                addTem1(JSON.parse(item['optionjson']),JSON.parse(item['conditionjson']),item['id'],item['name']);
                console.log(ymq_option)
              }else{
                addTem2(JSON.parse(item['optionjson']),JSON.parse(item['conditionjson']));
                console.log(ymq_option)
              }
            })
            that.removeClass('btn-progress');
            $('html, body').animate({
              scrollTop: $('.ymq_bottom').offset().top},500
            );
          },
          error: function (res) {
              that.removeClass('btn-progress');
          }
      });
    })
    function myconsole(json){
      return;
    }
    $(document).on('click', '.tem_yinru', function () { 
        var t_id = $(this).data('id');
        $(this).fireModal({
            title: 'Assignment',
            body: `
              The association between the template and the product will be disconnected, and the content in the template will be directly assignment to the product.
            `,
            center: true,
            initShow: true,
            buttons: [
                {
                    text: 'Import',
                    class: 'btn btn-secondary btn-primary',
                    handler: function(modal) {
                        yinrutem(t_id)
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Cancle',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
    })
    //吧已经引入的模板直接赋值到产品中
    function yinrutem(t_id){
      addTem2(ymq_temoption[tem_prefix+t_id],ymq_temcondition[tem_prefix+t_id],3,t_id);
      $('#'+tembox+t_id).remove();
      delete ymq_option[tem_prefix+t_id];
      delete ymq_temoption[tem_prefix+t_id];
      delete ymq_temcondition[tem_prefix+t_id];
      $(".select2").select2({minimumResultsForSearch: -1});
      temIdArr.remove(t_id);
      console.log(ymq_option)
    }
    //删除模板
    $(document).on('click', '.tem_delete', function () {
      //删除json
      var tem_id = $(this).data('id');
      delete ymq_option[tem_prefix+tem_id];
      delete ymq_temoption[tem_prefix+tem_id];
      delete ymq_temcondition[tem_prefix+tem_id];
      temIdArr.remove(tem_id);
      console.log(temIdArr)
      //删除dom
      $(this).parent('.card-header').parent('.tembox').remove();
      console.log(ymq_option);
      console.log(ymq_temoption);
    });
    //吧模板数据引用到产品中
    function addTem1(json,conditionJson,temId,temName,type = 1){
      //创建模板特殊dom
      var temHtml = `
        <div class="option_box list-group-item card ${tembox}" id="${tembox+temId}" data-id="${temId}" data-type="100">
            <div class="option_box_header card-header">
              <div class="up_down is-rotate">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/down.png">
              </div>
              <div class="handle">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/sort.png">
              </div>
              <span class="option-type-text btn btn-dark btn_type">Templete</span>
              <span class="option_title">${temName}</span>
              <span class="btn btn-secondary tem_yinru" data-id="${temId}">Assignment</span>
              <div class="tem_delete" data-id="${temId}">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
              </div>
            </div>
            <div class="option_box_body card-body ${temoptionbox}" id="${temoptionbox+temId}" style="display:block;">
              <div class="tem_drag"></div>
            </div>
          </div>
      `;
      $('#option_sort').append(temHtml);
      for(var key in json){
        var item  = json[key];
        createOptionHtml(item['type'],item['id'],item,2,temId);
      }
      $(`#${temoptionbox+temId} input,#${temoptionbox+temId} select`).attr('disabled','disabled');
      $(`#${temoptionbox+temId} .add_choice,#${temoptionbox+temId} .handle_value,#${temoptionbox+temId} .option_condition,#${temoptionbox+temId} .option_delete,#${temoptionbox+temId} .up_down,#${temoptionbox+temId} .handle`).hide();
      $(`#${temoptionbox+temId} .option_value_condition`).removeClass('option_value_condition');
      $(`#${temoptionbox+temId} .option_value_delete`).attr('class','option_tem_delete');
      $(".select2").select2({minimumResultsForSearch: -1});
      //type为1表示新增，type为2表示初始化，不需要操作已有json
      if (type == 1) {
        //给ymq_temoption和ymq_temcondition添加元素
        ymq_temoption[tem_prefix+temId] = json;
        ymq_temcondition[tem_prefix+temId] = conditionJson;
        temIdArr.push(temId);
        console.log(temIdArr)
        //给ymq_option添加元素
        ymq_option[tem_prefix+temId] = {"id":temId,"type":100};
      }
      
    } 
    //把模板直接添加到产品中
    function addTem2(json,conditionJson,addtype = 1,t_id = 0){
      conditionJson = JSON.stringify(conditionJson);
      for(var key in json){
        var item  = json[key];
        var jsonStr = JSON.stringify(item);
        jsonStr = jsonStr.replace(eval('/'+item.id+'/g'),ymq_index_prefix+ymq_index);
        conditionJson = conditionJson.replace(eval('/'+item.id+'/g'),ymq_index_prefix+ymq_index);
        item = JSON.parse(jsonStr);
        createOptionHtml(item['type'],ymq_index_prefix+ymq_index,item,addtype,t_id);
        ymq_option[key_prefix+ymq_index_prefix+ymq_index] = item;
        ymq_index++;
      }
      if (conditionJson != '{}') {
        conditionJson = JSON.parse(conditionJson);
        for(var key in conditionJson){
          ymq_condition[key] = conditionJson[key];
        }
      }
    }  

    //数据回显
    function init(){
      for(var key in ymq_option){
        var item  = ymq_option[key];
        //模板
        if (item['type'] == 100) {
          addTem1(ymq_temoption[tem_prefix+item['id']],ymq_temcondition[tem_prefix+item['id']],item['id'],$('.temname'+item['id']).text(),type = 2);
        }else{
          //初始化ymq_index
          if (ymq_index < Number(item['id'].replace(ymq_index_prefix,''))) {
            ymq_index = Number(item['id'].replace(ymq_index_prefix,''));
          }
          createOptionHtml(item['type'],item['id'],item);
        }
        
      }
      ymq_index++;
      $(".select2").select2({minimumResultsForSearch: -1});
    }  
    

    //初始化option的排序
    new Sortable(option_sort, {
        handle: '.handle',
        animation: 150,
        ghostClass: 'blue-background-class',
        chosenClass: "sort_chosen",
        dragClass: "sort_drag",
        // 列表的任何更改都会触发
        onSort: function (evt) {
            //顺序改变修改，修改json
            sort_option_json();
            myconsole(ymq_option)
        }
    });

    //新增option
    $(document).on('click', '.add_option span', function () { 
      var type = $('.option_type select').val();
      createOptionHtml(type,ymq_index_prefix+ymq_index);
      $(".select2").select2({minimumResultsForSearch: -1});
      //给json新增
      ymq_option[key_prefix+ymq_index_prefix+ymq_index] = {};
      ymq_option[key_prefix+ymq_index_prefix+ymq_index]['id'] = ymq_index_prefix+ymq_index;
      ymq_option[key_prefix+ymq_index_prefix+ymq_index]['type'] = type;
      myconsole(ymq_option);
      ymq_index++;
      $('html, body').animate({
        scrollTop: $('.ymq_bottom').offset().top},500
      );
    });
    //删除option时修改condition
    function deleteConditionByOption(now_key){
      now_key = now_key+'';
      //1、先删除自己的contition
      deleteCondition(now_key);
      //2、删除限制条件里的
      for(var key in ymq_condition){
          //不操作自己
          if (key == now_key) {
              continue;
          }
          //把当前condition元素给他的父类添加chiliren
          if (ymq_condition[key]['children'] == '') {
              var children_arr = [];
          }else{
              var children_arr = ymq_condition[key]['children'].split(',');
          }
          children_arr.remove(now_key);
          ymq_condition[key]['children'] = children_arr.join(',');

          //删除condition option
          for(var ke in ymq_condition[key]['options']){
            //删除option value
            if (now_key.indexOf("_") != -1) {
              //当now_key的父ID等于options的id时才执行
              if (ymq_condition[key]['options'][ke]['id'] == now_key.split('_')[0]) {
                var value_arr = ymq_condition[key]['options'][ke]['value'].split(',');
                //数组包含要删除的now_key
                if (value_arr.indexOf(now_key) > -1) {
                  //移除
                  value_arr.remove(now_key);
                  //判断数组的length等于0的话斤直接删除这一项
                  if (value_arr.length == 0) {
                    delete ymq_condition[key]['options'][ke];
                    //接着判断ymq_condition[key]['options']是否还有子项，没有直接删除
                    if (Object.keys(ymq_condition[key]['options']).length == 0) {
                      delete ymq_condition[key];
                    }
                  }else{
                    ymq_condition[key]['options'][ke]['value'] = value_arr.join(",")
                  }
                }
              }
            }else{
              //删除option
              if (ymq_condition[key]['options'][ke]['id'] == now_key) {
                delete ymq_condition[key]['options'][ke];
                //如果没有子项直接删除
                if (Object.keys(ymq_condition[key]['options']).length == 0) {
                  delete ymq_condition[key];
                }
              }
            }
          }  
      }
      myconsole(ymq_condition)
    }
  
    //删除option
    $(document).on('click', '.option_delete', function () {
      //删除option，修改json
      delete ymq_option[key_prefix+$(this).data('id')];
      deleteConditionByOption($(this).data('id'))
      myconsole(ymq_option);
      $(this).parent('.option_box_header').parent('.option_box').remove();
    });

    

    //删除option value
    $(document).on('click', '.option_value_delete', function () {
      //删除option value，修改json
      delete ymq_option[key_prefix+$(this).data('pid')]['options'][$(this).data('id')];
      deleteConditionByOption($(this).data('id'))
      myconsole(ymq_option);
      $(this).parent('div').parent('div').parent('.list-group-item').remove();
    });

    //新增option value选择
    $(document).on('click', '.add_choice', function () {
      add_option_value($(this))
    });



    
    function htmlSpecialChars(str)    
    {    
        if (typeof(str)=='string') {
          str = str.replace(/&/g, '&amp;');  
          str = str.replace(/</g, '&lt;');  
          str = str.replace(/>/g, '&gt;');  
          str = str.replace(/"/g, '&quot;');  
          str = str.replace(/'/g, '&#039;');  
        }
        
        return str;  
    }  
    
    //option表单改变构造json数据
    $(document).on('change', '.option_json', function () {
        var value = get_input_value($(this));
        //给json新增
        ymq_option[key_prefix+$(this).data('id')][$(this).data('key')] = value;
        myconsole(ymq_option);
    })  
    //option value表单改变构造json数据
    $(document).on('change', '.option_value_json', function () {
        var value = get_input_value($(this));
        //给json新增
        ymq_option[key_prefix+$(this).data('pid')]['options'][$(this).data('id')][$(this).data('key')] = value;
        myconsole(ymq_option);
    })  

    $(document).on('click', '.add_new_condition', function () {
        if ($('.condition_box .condition_item').length > 0) {
            if ($('.condition_andor').val() == '||') {
                var andor = `<span class="anor_text">OR</span>`;
            }else{
                var andor = `<span class="anor_text">AND</span>`;
            }
        }else{
            var andor = `IF`;
        }
        var available_option_html = creat_option_select(available_option);
        var html = `
            <div class="card padding_tb_15 margin0 condition_item condition_item${$(this).data('index')}" data-index="${$(this).data('index')}">
                <div class="row align_center">
                  <div class="col-1 text-right padding_r0">
                  ${andor}
                  </div>
                  <div class="col-3 option_select_box">
                    ${available_option_html}
                  </div>
                  <div class="col-1">
                    <div class="condition_value_delete">
                      <img class="delete_svg" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
                    </div>
                  </div>
                </div>
            </div>
        `;
        $('.condition_box').append(html);
        $(".select2").select2({minimumResultsForSearch: -1});
        $(this).data('index',Number($(this).data('index'))+1);
    })
    //预览
    $(document).on('click', '.yulan', function () {
        set_default();
        var temoption = JSON.stringify(ymq_temoption);
        var temcondition = JSON.stringify(ymq_temcondition);
        var option = JSON.stringify(ymq_option);
        var condition = JSON.stringify(ymq_condition);
        var condition = JSON.stringify(ymq_condition);
        var yulan = true;
        var variantjson = JSON.stringify(ymq_variantjson);
        $('.yulan').addClass('btn-progress');
        $.ajax({
            type: 'POST',
            url: '/api/option/save',
            dataType: 'json',
            data: {product_id,option,condition,temoption,temcondition,oldTemId,yulan,variantjson},
            success: function (res) {
              $('.yulan').removeClass('btn-progress');
              $('.yulan-box').show();
                var t = 5;//设定跳转的时间
                var timer =setInterval(function () {
                    if (t == 0) {
                        clearInterval(timer);
                        $('.yulan-box').hide();
                        window.open(res.data);
                    }
                    $('#miao').html(t);
                    t--;
                }, 1000); //启动1秒定时

            },
            error: function (res) {
                $('.yulan').removeClass('btn-progress');
            }
        });
    });
    $('#optionForm').ymqValidate(function(){
      save()
    });

    var default_header_info = {"required":"0","tooltip":"","tooltip_position":"1","help":""};
    var filed_info = {"price":"","one_time":"0","placeholder":"","min_char":"","max_char":"","default_text":"","min":"","max":"","field_type":"1"};
    var switch_info = {"price":"","one_time":"0","switch_text":"","default":"0"};
    var color_info = {"price":"","one_time":"0"};
    var area_info = {"price":"","one_time":"0","placeholder":"","min_char":"","max_char":"","default_text":""};
    var file_info = {"price":"","one_time":"0","file_type":"1","file_num":"1","btn_text":"Upload"};
    var option_value_default_info = {"id":"","price":"","value":"","hasstock":1,"one_time":"0","default":"0"};
    var canvas_default_info = {"id":"","price":"","value":"","hasstock":1,"one_time":"0","default":"0","canvas_type":"1","canvas1":"","canvas2":""};
    var date_info = {"price":"","one_time":0,"date_format":"","date_minDateType":0,"min_date":"","date_maxDateType":0,"max_date":"","min_time":"","max_time":"","weekly_limit":[],"day_limit":[]};
    var custome_text = {"html":""};
    function save(){
        set_default();
        var option = JSON.stringify(ymq_option);
        var condition = JSON.stringify(ymq_condition);
        
        sendPost(option,condition);
    }
    

    //给没有值的配置默认值
    function set_default(){
        var linshi_default_header_info = default_header_info;
        var error_num = 0;
        //给没有值的配置默认值
        for(var key in ymq_option){
            if ([4,6].includes(Number(type))) {
              linshi_default_header_info.style = "1";
            }
            var item = ymq_option[key];
            var type = Number(item[['type']]);
            //给公共头部配置信息
            if (type == 11) {
                for(var ke in custome_text){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = custome_text[ke]
                    }
                }
            }else{
                for(var ke in default_header_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = default_header_info[ke]
                    }
                }
            }


            if ([1].includes(type)) {
                for(var ke in filed_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = filed_info[ke]
                    }
                }
            }
            if ([2].includes(type)) {
                for(var ke in area_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = area_info[ke]
                    }
                }
            }
            if ([9,10].includes(type)) {
                for(var ke in date_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = date_info[ke]
                    }
                }
            }
            
            if ([3,4,5,6,7,8].includes(type)) {
                //没有option value提示报错
                if(!item.hasOwnProperty('options')){
                    error_num++;
                    //把错误显示出来;
                }else{
                    for(var ke in item['options']){
                        //value,price,hastock按照固定顺序排序，方便后期批量修改
                        var linshi_json = {};
                        if ([5,8].includes(type)) {
                          for(var k in canvas_default_info){
                              if(!item['options'][ke].hasOwnProperty(k)){
                                linshi_json[k] = canvas_default_info[k]
                              }else{
                                linshi_json[k] = ymq_option[key]['options'][ke][k];
                              }
                          }
                          ymq_option[key]['options'][ke] = linshi_json;
                        }else{
                          for(var k in option_value_default_info){
                              if(!item['options'][ke].hasOwnProperty(k)){
                                linshi_json[k] = option_value_default_info[k]
                              }else{
                                linshi_json[k] = ymq_option[key]['options'][ke][k]
                              }
                          }
                          ymq_option[key]['options'][ke] = linshi_json;
                        }
                        
                    }
                }
            }

            if (type == 12) {
                for(var ke in file_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = file_info[ke]
                    }
                }
            }
            if (type == 13) {
                for(var ke in switch_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = switch_info[ke]
                    }
                }
            }
            if (type == 14) {
                for(var ke in color_info){
                    if(!item.hasOwnProperty(ke)){
                        ymq_option[key][ke] = color_info[ke]
                    }
                }
            }

        }
    }
    //获取input的值
    function get_input_value(that){
        var value = that.val();
        if (that.attr('type') == 'checkbox') {
            var value = 0;
            if (that.is(":checked")) {
                value = 1; 
            }
        }
        if (that.hasClass('option_summernote')) {
          return value;
        }else{
          return htmlSpecialChars(value);
        }
        
    }

    $(document).on('input propertychange', '.option_title_input', function () {
      $('.option_title'+$(this).data('id')).text($(this).val());
    })

    //默认按钮取消选中
    $(document).on('input propertychange', '.default_radio', function () {
      if ($(this).is(":checked")) {
        $('.default_radio'+$(this).data('pid')).prop('checked', false).change();
          // 把自己设置为选中
          $(this).prop('checked',true);
        }
    })

    //折叠显示
    $(document).on('click', '.up_down', function () {
        if ($(this).hasClass('is-rotate')) {
         $(this).removeClass('is-rotate');
         $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
        }else{
         $(this).addClass('is-rotate');
         $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
        }
        // rotate($(this).children('img'));
        // $(this).parent('.option_box_header').next('.option_box_body').toggle(100)
    });

    //排序时修改下单的json方法
    function sort_option_json(){
      var linshi_option = {};
      $('.option_box.list-group-item').each(function(){
        //模板
        if (Number($(this).data('type')) == 100) {
          linshi_option[tem_prefix+$(this).data('id')] = ymq_option[tem_prefix+$(this).data('id')];
        }else{
          linshi_option[key_prefix+$(this).data('id')] = ymq_option[key_prefix+$(this).data('id')];
        }
        
      })
      ymq_option = linshi_option;
      console.log(ymq_option)
    }
    //排序时修改下单选项的json方法
    function sort_option_value_json(sort_id){
        var that = $('#'+sort_id);
        var linshi_option = {};
        $('#'+sort_id+' .option_value_box').each(function(){
            linshi_option[$(this).data('id')] = ymq_option[key_prefix+that.data('id')]['options'][$(this).data('id')];
        })
        ymq_option[key_prefix+that.data('id')]['options'] = linshi_option;
    }
    
    //给选择系列的下单添加排序
    function add_sort(sort_id){
      var sort_code = `
        new Sortable(${sort_id}, {
            handle: '.handle_value',
            animation: 150,
            ghostClass: 'blue-background-class',
            chosenClass: "sort_chosen",
            dragClass: "sort_drag",
            // 列表的任何更改都会触发
            onSort: function (evt) {
                //顺序改变修改，修改json
                sort_option_value_json('${sort_id}');
                myconsole(ymq_option)
            }
        });
      `;
        if ($(`#${sort_id}`).length > 0) {
            eval(sort_code);
        }
    }
    //添加选择的option_value
    function add_option_value(that){
      var appendHtml = add_option_value_html(that.data('id'),that.data('index'),that.data('type'));
      $('#option_'+that.data('id')).append(appendHtml)
      $(".select2").select2({minimumResultsForSearch: -1});
      $('.color_picker').ymqColorpicker();
      //给json新增
      if(!ymq_option[key_prefix+that.data('id')].hasOwnProperty("options")){
          ymq_option[key_prefix+that.data('id')]['options'] = {};
      }
      ymq_option[key_prefix+that.data('id')]['options'][that.data('id')+'_'+that.data('index')] = {};
      ymq_option[key_prefix+that.data('id')]['options'][that.data('id')+'_'+that.data('index')]['id'] = that.data('id')+'_'+that.data('index');
      console.log(ymq_option);

      that.data('index',Number(that.data('index'))+1);
    }

    ///////////////////下面是构建html的所有方法/////////////////////
    //构建下单属性的html
    function createOptionHtml(type,now_index,value = null,addtype = 1,t_id = 0 ){
      addtype = Number(addtype);
      if (addtype == 1) {
        var more_info = {appendId:"option_sort",optionClass:"option_box list-group-item card"};
      }else if(addtype == 2) {
        var more_info = {appendId:temoptionbox+t_id,optionClass:"option_box card"};
      }else if(addtype == 3) {
        var more_info = {appendId:tembox+t_id,optionClass:"option_box list-group-item card"};
      }

      //设定初始值
      if (value == null) {
        var commonValue = {"label":"","required":0,"tooltip":"","help":"","tooltip_position":"1","html":""};
      }else{
        var commonValue = value;
      }
      var ridao_html = ``;
      switch(type)
      {
          case '1':
              var optionHtml = ceratTextArea(1,value);
              var option_type_text = 'Field';
              break;
          case '2':
              var optionHtml = ceratTextArea(2,value);
              var option_type_text = 'Area';
              break;
          case '3':
              var optionHtml = ceratChoice(3,value);
              var option_type_text = 'Drop-down';
              break;
          case '4':
              var optionHtml = ceratChoice(4,value);
              var option_type_text = 'Radio';
              break;
          case '5':
              var optionHtml = ceratChoice(5,value);
              var option_type_text = 'swatches Single';
              break;
          case '6':
              var optionHtml = ceratChoice(6,value);
              var option_type_text = 'CheckBox';
              break;
          case '7':
              var optionHtml = ceratChoice(7,value);
              var option_type_text = 'Multiple Select';
              break;
          case '8':
              var optionHtml = ceratChoice(8,value);
              var option_type_text = 'swatches Multiple';
              break;
          case '9':
              var optionHtml = ceratDate(9,value);
              var option_type_text = 'Date';
              break;
          case '10':
              var optionHtml = ceratDate(10,value);
              var option_type_text = 'Date Range';
              break;
          case '12':
              var optionHtml = ceratFileArea(12,value);
              var option_type_text = 'File';
              break; 
          case '13':
              var optionHtml = ceratSwitch_color(13,value);
              var option_type_text = 'Switch';
              break;
          case '14':
              var optionHtml = ceratSwitch_color(14,value);
              var option_type_text = 'Color pick';
              break;
      }
      if ([4,6].includes(Number(type))) {
        ridao_html = `
          <div class="col-2">
            <div class="form-group">
              <label>Style</label>
              <select class="form-control select2 style option_json" data-id="option_id" data-key="style">
                <option value="1" ${Number(commonValue['style'])== 1 ? 'selected' : ''}>Normal</option>
                <option value="2" ${Number(commonValue['style'])== 2 ? 'selected' : ''}>Button</option>
              </select>
            </div>
          </div>
        `
      }



      if (type == 11){
          var appendHtml = `
        <div class="${more_info.optionClass}" data-id="option_id" data-type="${type}">
            <div class="option_box_header card-header">
              <div class="up_down is-rotate">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/down.png">
              </div>
              <div class="handle">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/sort.png">
              </div>
              <span class="option-type-text btn btn-dark btn_type">Custom text</span>
              <div class="option_delete" data-id="option_id">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
              </div>
            </div>
            <div class="option_box_body card-body" style="display:block;">
              <textarea class="option_summernote form-control option_json" type="text" data-id="option_id" data-key="html">${commonValue['html']}</textarea>
            </div>
          </div>
      `;
      }else{
          var appendHtml = `
        <div class="${more_info.optionClass}" data-id="option_id" data-type="${type}">
            <div class="option_box_header card-header">
              <div class="up_down is-rotate">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/down.png">
              </div>
              <div class="handle">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/sort.png">
              </div>
              <span class="option-type-text btn btn-dark btn_type">${option_type_text}</span>
              <span class="option_title option_titleoption_id">${commonValue['label']}</span>
              <span class="btn btn-secondary condition option_condition" data-id="option_id">Condition</span>
              <div class="option_delete" data-id="option_id">
                <img src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
              </div>
            </div>
            <div class="option_box_body card-body" style="display:block;">
              <div class="row option_value_header">
                <div class="col-2">
                  <div class="form-group">
                    <label>Option Title</label>
                    <input ymq-validate="require" value="${commonValue['label']}" class="option_title_input form-control option_json" data-key="label" data-id="option_id" type="text">
                  </div>
                </div>
                <div class="col-1">
                  <div class="form-group">
                    <div class="control-label">Required</div>
                    <div class="custom-switches-stacked">
                      <label class="custom-switch">
                        <input type="checkbox" name="required" ${Number(commonValue['required'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-id="option_id" data-key="required" value="1">
                        <span class="custom-switch-indicator"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-2">
                  <div class="form-group">
                    <label>Tooltip</label>
                    <input class="form-control tooltip_text option_json" value="${commonValue['tooltip']}" data-id="option_id" data-key="tooltip" type="text">
                  </div>
                </div>
                <div class="col-3">
                  <div class="form-group">
                    <label>Help Text position</label>
                    <select class="form-control select2 tooltip_position option_json" data-id="option_id" data-key="tooltip_position">
                      <option value="1" ${Number(commonValue['tooltip_position'])== 1 ? 'selected' : ''}>Below the entire option</option>
                      <option value="2" ${Number(commonValue['tooltip_position'])== 2 ? 'selected' : ''}>Above the entire option</option>
                      <option value="3" ${Number(commonValue['tooltip_position'])== 3 ? 'selected' : ''}>Below the option title</option>
                    </select>
                  </div>
                </div>
                
                <div class="col-2">
                  <div class="form-group">
                    <label>Help Text</label>
                    <input class="form-control help_text option_json" value="${commonValue['help']}" type="text" data-id="option_id" data-key="help">
                  </div>
                </div>
                ${ridao_html}
              </div>
              ${optionHtml}
            </div>
          </div>
      `;
      }
        //新增option，修改json
        appendHtml = appendHtml.replace(/option_id/g,now_index);
      if (addtype == 3) {
        $('#'+more_info.appendId).before(appendHtml);
      }else{
        $('#'+more_info.appendId).append(appendHtml);
      }

    if (type == 11){
        add_option_summernote()
    }

      //如果是选择并且不是模板就初始化排序功能
      if(hasOptionValueArr.indexOf(type) > -1){
        add_sort('option_'+now_index);
      }
    }

    

    function ceratSwitch_color(type,value = null){
        //没有初始值
        if (value == null) {
          value = switch_info;
        }
        var diff_html = ``;
        if (Number(type) == 13) {
          var diff_html = `
            <div class="col-2">
                <div class="form-group">
                  <label>is Checked</label>
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_json default_radio default_radiooption_id" data-key="default" data-id="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Switch show text</label>
                <input ymq-validate="require" class="form-control switch_text option_json" data-key="switch_text" data-id="option_id" value="${value['switch_text']}" type="text">
              </div>
            </div>
          `;
        }
        var filed_area_value = `
          <div class="row align_center">
            <div class="col-1 padding_r0 no_hide">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            
            <div class="col-2 no_hide one_time_hide">
              <div class="form-group">
                <label class="align_center">One Time <span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            ${diff_html}
          </div>
      `; 
      return filed_area_value;
    }

    //构建text系列html
    function ceratTextArea(type,value = null){
        //没有初始值
        if (value == null) {
          if (type == 1) {
            value = filed_info;
          }else{
            value = area_info;
          }
        }
        if (type == 1) {
        var dif_content = `
          <div class="col-2">
            <div class="form-group">
              <label>Type</label>
              <select class="form-control select2 option_json field_type" data-key="field_type" data-id="option_id">
                <option value="1" ${Number(value['field_type'])== 1 ? 'selected' : ''}>normal</option>
                <option value="2" ${Number(value['field_type'])== 2 ? 'selected' : ''}>email</option>
                <option value="3" ${Number(value['field_type'])== 3 ? 'selected' : ''}>Phone Number</option>
                <option value="4" ${Number(value['field_type'])== 4 ? 'selected' : ''}>number</option>
                <option value="5" ${Number(value['field_type'])== 5 ? 'selected' : ''}>Integer</option>
                
              </select>
            </div>
          </div>
          <div class="diff_box col-4">
          <div class="field_type_box field_type_box1 row" style="display:${Number(value['field_type'])== 1 ? 'flex' : 'none'};">
            <div class="col-6">
              <div class="form-group">
                <label>Min Characters</label>
                <input class="form-control min_char option_json" data-key="min_char" data-id="option_id" value="${value['min_char']}" type="number">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>Max Characters</label>
                <input class="form-control max_char option_json" data-key="max_char" data-id="option_id" value="${value['max_char']}" type="number">
              </div>
            </div>
          </div>
          <div class="field_type_box field_type_box4 row" style="display:${Number(value['field_type'])== 4 ? 'flex' : 'none'};">
            <div class="col-6">
              <div class="form-group">
                <label>Min</label>
                <input class="form-control min option_json" data-key="min" data-id="option_id" value="${value['min']}" type="number">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>Max</label>
                <input class="form-control max option_json" data-key="max" data-id="option_id" value="${value['max']}" type="number">
              </div>
            </div>
          </div>
          </div>
          `
        }else{
        var dif_content = `
          <div class="col-4">
          <div class="field_type_box field_type_box1 row">
            <div class="col-6">
              <div class="form-group">
                <label>Min Characters</label>
                <input class="form-control min_char option_json" data-key="min_char" data-id="option_id" value="${value['min_char']}" type="number">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>Max Characters</label>
                <input class="form-control max_char option_json" data-key="max_char" data-id="option_id" value="${value['max_char']}" type="number">
              </div>
            </div>
          </div>
          </div>
        `;

        }

        var filed_area_value = `
          <div class="row align_center">
            <div class="col-1 padding_r0 no_hide">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            
            <div class="col-2 one_time_hide">
              <div class="form-group no_hide">
                <label class="align_center">One Time <span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            
            ${dif_content}
            <div class="col-6">
              <div class="form-group">
                <label>Default Text</label>
                <input class="form-control default_text option_json" data-key="default_text" data-id="option_id" value="${value['default_text']}" type="text">
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label>placeholder text</label>
                <input class="form-control option_json" data-key="placeholder" data-id="option_id" value="${value['placeholder']}" type="text">
              </div>
            </div>
          </div>
      `; 
      return filed_area_value;
    }

    //构建File系列html
    function ceratFileArea(type,value = null){
        //没有初始值
        if (value == null) {
          value = file_info;
        }
        var file_value = `
          <div class="row align_center">
            <div class="col-2 no_hide">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            
            <div class="col-2 no_hide one_time_hide">
              <div class="form-group">
                <label class="align_center">One Time <span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>button text</label>
                <input class="form-control btn_text option_json" data-key="btn_text" data-id="option_id" value="${value['btn_text']}" type="text">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>File type</label>
                <select class="form-control select2 option_json file_type" data-key="file_type" data-id="option_id">
                  <option value="1" ${Number(value['file_type'])== 1 ? 'selected' : ''}>image</option>
                  <option value="2" ${Number(value['file_type'])== 2 ? 'selected' : ''}>Archive</option>
                  <option value="3" ${Number(value['file_type'])== 3 ? 'selected' : ''}>PDF</option>
                  <option value="4" ${Number(value['file_type'])== 4 ? 'selected' : ''}>World</option>
                  <option value="5" ${Number(value['file_type'])== 5 ? 'selected' : ''}>Excel</option>
                </select>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Max File Num</label>
                <input type="number" min="1" name="file_num" class="option_json form-control" data-key="file_num" data-id="option_id" value="${value['file_num']}">
              </div>
            </div>
          </div>
      `; 
      return file_value;
    }

    //构建date系列html
    function ceratDate(type,value = null){
        //没有初始值
        if (value == null) {
          value = date_info;
        }
        var date_value = `
          <div class="row align_center">
            <div class="col-2 no_hide">
              <div class="form-group">
                <label>Price</label>
                <input ymq-validate="number" class="form-control value_price option_json" data-key="price" data-id="option_id" type="text" value="${value['price']}">
              </div>
            </div>
            
            <div class="col-2 no_hide one_time_hide">
              <div class="form-group">
                <label class="align_center">One Time <span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></label>
                <div class="custom-switches-stacked">
                  <label class="custom-switch">
                    <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_json" data-key="one_time" data-id="option_id" value="1">
                    <span class="custom-switch-indicator"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label>Date format</label>
                <select class="form-control select2 option_json" data-key="date_format" data-id="option_id">
                  <option ${Number(value['date_format'])== 'YYYY-MM-DD hh:mm:ss' ? 'selected' : ''} value="YYYY-MM-DD hh:mm:ss">YYYY-MM-DD hh:mm:ss</option>
                  <option ${Number(value['date_format'])== 'YYYY-MM-DD' ? 'selected' : ''} value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option ${Number(value['date_format'])== 'YYYY-MM' ? 'selected' : ''} value="YYYY-MM">YYYY-MM</option>
                  <option ${Number(value['date_format'])== 'YYYY' ? 'selected' : ''} value="YYYY">YYYY</option>
                  <option ${Number(value['date_format'])== 'hh:mm:ss' ? 'selected' : ''} value="hh:mm:ss">hh:mm:ss</option>
                </select>
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Min Date</label>
                <select class="form-control select2 option_json dateType" data-key="date_minDateType" data-id="option_id">
                  <option ${Number(value['date_minDateType'])== 0 ? 'selected' : ''} value="0">none</option>
                  <option ${Number(value['date_minDateType'])== 1 ? 'selected' : ''} value="1">today</option>
                  <option ${Number(value['date_minDateType'])== 2 ? 'selected' : ''} value="2">customize</option>
                </select>
              </div>
            </div>
            <div class="col-2" style="display: ${Number(value['date_minDateType'])== 2 ? 'block' : 'none'};">
              <div class="form-group">
                <label>Min Date</label>
                <input class="form-control min_date option_json" data-key="min_date" readonly onclick="dateDD(this);" data-id="option_id" value="${value['min_date']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Max Date</label>
                <select class="form-control select2 option_json dateType" data-key="date_maxDateType" data-id="option_id">
                  <option ${Number(value['date_maxDateType'])== 0 ? 'selected' : ''} value="0">none</option>
                  <option ${Number(value['date_maxDateType'])== 1 ? 'selected' : ''} value="1">today</option>
                  <option ${Number(value['date_maxDateType'])== 2 ? 'selected' : ''} value="2">customize</option>
                </select>
              </div>
            </div>
            <div class="col-2" style="display: ${Number(value['date_maxDateType'])== 2 ? 'block' : 'none'};">
              <div class="form-group">
                <label>Max Date</label>
                <input class="form-control max_date option_json" data-key="max_date" readonly onclick="dateDD(this);" data-id="option_id" value="${value['max_date']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Min Time</label>
                <input class="form-control min_time option_json" data-key="min_time" readonly onclick="dateTime(this);" data-id="option_id" value="${value['min_time']}">
              </div>
            </div>
            <div class="col-2">
              <div class="form-group">
                <label>Max Time</label>
                <input class="form-control max_time option_json" data-key="max_time" readonly onclick="dateTime(this);" data-id="option_id" value="${value['max_time']}">
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label>Weekly limit</label>
                <select class="form-control select2 option_json" data-key="weekly_limit" data-id="option_id" multiple="">
                    <option ${value.weekly_limit.includes("0") ? 'selected' : ''} value="0">Sunday</option>
                    <option ${value.weekly_limit.includes("1") ? 'selected' : ''} value="1">Monday</option>
                    <option ${value.weekly_limit.includes("2") ? 'selected' : ''} value="2">Tuesday</option>
                    <option ${value.weekly_limit.includes("3") ? 'selected' : ''} value="3">Wednesday</option>
                    <option ${value.weekly_limit.includes("4") ? 'selected' : ''} value="4">Thursday</option>
                    <option ${value.weekly_limit.includes("5") ? 'selected' : ''} value="5">Friday</option>
                    <option ${value.weekly_limit.includes("6") ? 'selected' : ''} value="6">Saturday</option>
                </select>
              </div>
            </div>
            <div class="col-3">
              <div class="form-group">
                <label>Limit by date</label>
                <select class="form-control select2 option_json" data-key="day_limit" data-id="option_id" multiple="">
                    <option ${value.day_limit.includes("1") ? 'selected' : ''} value="1">1</option>
                    <option ${value.day_limit.includes("2") ? 'selected' : ''} value="2">2</option>
                    <option ${value.day_limit.includes("3") ? 'selected' : ''} value="3">3</option>
                    <option ${value.day_limit.includes("4") ? 'selected' : ''} value="4">4</option>
                    <option ${value.day_limit.includes("5") ? 'selected' : ''} value="5">5</option>
                    <option ${value.day_limit.includes("6") ? 'selected' : ''} value="6">6</option>
                    <option ${value.day_limit.includes("7") ? 'selected' : ''} value="7">7</option>
                    <option ${value.day_limit.includes("8") ? 'selected' : ''} value="8">8</option>
                    <option ${value.day_limit.includes("9") ? 'selected' : ''} value="9">9</option>
                    <option ${value.day_limit.includes("10") ? 'selected' : ''} value="10">10</option>
                    <option ${value.day_limit.includes("11") ? 'selected' : ''} value="11">11</option>
                    <option ${value.day_limit.includes("12") ? 'selected' : ''} value="12">12</option>
                    <option ${value.day_limit.includes("13") ? 'selected' : ''} value="13">13</option>
                    <option ${value.day_limit.includes("14") ? 'selected' : ''} value="14">14</option>
                    <option ${value.day_limit.includes("15") ? 'selected' : ''} value="15">15</option>
                    <option ${value.day_limit.includes("16") ? 'selected' : ''} value="16">16</option>
                    <option ${value.day_limit.includes("17") ? 'selected' : ''} value="17">17</option>
                    <option ${value.day_limit.includes("18") ? 'selected' : ''} value="18">18</option>
                    <option ${value.day_limit.includes("19") ? 'selected' : ''} value="19">19</option>
                    <option ${value.day_limit.includes("20") ? 'selected' : ''} value="20">20</option>
                    <option ${value.day_limit.includes("21") ? 'selected' : ''} value="21">21</option>
                    <option ${value.day_limit.includes("22") ? 'selected' : ''} value="22">22</option>
                    <option ${value.day_limit.includes("23") ? 'selected' : ''} value="23">23</option>
                    <option ${value.day_limit.includes("24") ? 'selected' : ''} value="24">24</option>
                    <option ${value.day_limit.includes("25") ? 'selected' : ''} value="25">25</option>
                    <option ${value.day_limit.includes("26") ? 'selected' : ''} value="26">26</option>
                    <option ${value.day_limit.includes("27") ? 'selected' : ''} value="27">27</option>
                    <option ${value.day_limit.includes("28") ? 'selected' : ''} value="28">28</option>
                    <option ${value.day_limit.includes("29") ? 'selected' : ''} value="29">29</option>
                    <option ${value.day_limit.includes("30") ? 'selected' : ''} value="30">30</option>
                    <option ${value.day_limit.includes("31") ? 'selected' : ''} value="31">31</option>
                </select>
              </div>
            </div>
          </div>
      `; 
      return date_value;
    }

    //构建选择系列html
    function ceratChoice(type,value = null){
      var option_value_index = 1;
      myconsole(value) 
      var optionsHtml = ``;
      if (value != null) {
        for(var key in value['options']){
          var index = value['options'][key]['id'].split('_')[1];
          //初始化option_value_index
          if (option_value_index < index) {
            option_value_index = index;
          }
          optionsHtml += add_option_value_html(value['id'],index,type,value['options'][key]);
        }
        myconsole(optionsHtml)
        option_value_index++;
      }
      //画布
      if (canvasTypeArr.includes(type)) {
        var select_radio_option = `
          <div class="select_body">
                <div class="card">
                  <div class="row select_item">
                    <div class="col-2 padding_left_30">Title</div>
                    <div class="col-1 padding0">Price</div>
                    <div class="col-2 padding_r0 align_center one_time_hide">one time <span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></div>
                    <div class="col-3 padding_r0">swatches</div>
                    <div class="col-1 padding_r0">hasstock</div>
                    <div class="col-1">Default</div>
                    <div class="col-2 condition_header_text">Condition</div>
                  </div>
                </div>
                <div class="list-group option_value_list" data-id="option_id" id="option_option_id">
                  ${optionsHtml}
                </div>
                <span class="btn btn-secondary add_choice" data-type="${type}" data-id="option_id" data-index="${option_value_index}">Add Value</span>
            </div>
        `;
      }else{
        var select_radio_option = `
          <div class="select_body">
                <div class="card">
                  <div class="row select_item">
                    <div class="col-2 padding_left_30">Title</div>
                    <div class="col-2">Price</div>
                    <div class="col-2 padding_r0 align_center one_time_hide">one time<span class="ymq_tools ymq_tools_span" data-title="If selected, the price increase will only be increased once, and will not increase with the purchase quantity."></span></div>
                    <div class="col-1 padding_r0">hasstock</div>
                    <div class="col-1">Default</div>
                    <div class="col-2 condition_header_text">Condition</div>
                  </div>
                </div>
                <div class="list-group option_value_list" data-id="option_id" id="option_option_id">
                  ${optionsHtml}
                </div>
                <span class="btn btn-secondary add_choice" data-type="${type}" data-id="option_id" data-index="${option_value_index}">Add Value</span>
            </div>
        `;
      }
      
      return select_radio_option;
    }

    

    function add_option_value_html(pid,index,type,value=null){
      if (value == null) {
        if (canvasTypeArr.includes(type)) {
          value = canvas_default_info;
        }else{
          value = option_value_default_info;
        }
      }
      if(!value.hasOwnProperty('hasstock')){
            value["hasstock"] = 1;
        }
      if (canvasTypeArr.includes(type)) {
        var select_raido_option_value = `
          <div class="card list-group-item padding0 option_value_box option_canvas" data-id="option_value_id">
            <div class="row select_item">
              <div class="col-2 padding_left_30">
                <div class="handle_value">
                  <img class="img_24" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/sort.png">
                </div>
                <div class="form-group">
                  <input ymq-validate="require" value="${value['value']}" class="form-control value_title option_value_json" data-id="option_value_id" data-key="value" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-1 padding0 no_hide">
                <div class="form-group">
                  <input ymq-validate="number" value="${value['price']}" class="form-control value_price option_value_json" data-id="option_value_id" data-key="price" data-pid="option_id" type="text">
                </div>
              </div>
              
              <div class="col-2 padding_r0 no_hide one_time_hide">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json" data-key="one_time" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-3 padding_r0">
                <div class="row">
                  <div class="col-5 padding_r0">
                    <div class="form-group">
                      <select class="form-control select2 option_value_json canvas_type_select" data-id="option_value_id" data-key="canvas_type" data-pid="option_id">
                        <option value="1" ${Number(value['canvas_type'])== 1 ? 'selected' : ''}>color</option>
                        <option value="2" ${Number(value['canvas_type'])== 2 ? 'selected' : ''}>image</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-7 padding_r0 padding-l-5">
                    <div class="canvas_type canvas_type1" style="${Number(value['canvas_type'])== 1 ? '' : 'display: none;'}">
                      <button type="button" class="btn btn-primary color_picker" data-id="1" data-pid="1"><i class="fas fa-fill-drip"></i></button>
                      <span class="color_picker_span" style="background:${value['canvas1']!= '' ? '#'+value['canvas1'] : 'transparent'};"></span>
                      <input type="hidden" name="canvas1" class="option_value_json canvas1" data-id="option_value_id" data-key="canvas1" data-pid="option_id" value="${value['canvas1']}">
                    </div>
                    <div class="canvas_type canvas_type2" style="${Number(value['canvas_type'])== 2 ? '' : 'display: none;'}">
                      <button type="button" class="btn btn-primary selectImgBtn" data-toggle="modal" data-target="#selectImgModel" data-id="option_value_id" data-pid="option_id"><i class="fa fa-upload"></i></button>
                      <img class="canvas_img canvas_img_option_value_id" src="${value['canvas2']!= '' ? basImgUrl+value['canvas2'] : '/svg/swatch.png'}">
                      <input type="hidden" name="canvas2" class="option_value_json canvas2" data-id="option_value_id" data-key="canvas2" data-pid="option_id" value="${value['canvas2']}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['hasstock'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json option_value_json" data-key="hasstock" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json default_radio default_radiooption_id option_value_json" data-key="default" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <span class="btn btn-secondary condition option_value_condition" data-id="option_value_id" data-pid="option_id">Condition</span>
                <div class="option_value_delete" data-id="option_value_id" data-pid="option_id">
                  <img class="delete_svg" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
                </div>
              </div>
            </div>
          </div>
        `;
      }else{
        var select_raido_option_value = `
          <div class="card list-group-item padding0 option_value_box" data-id="option_value_id">
            <div class="row select_item">
              <div class="col-2 padding_left_30">
                <div class="handle_value">
                  <img class="img_24" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/sort.png">
                </div>
                <div class="form-group">
                  <input ymq-validate="require" value="${value['value']}" class="form-control value_title option_value_json" data-id="option_value_id" data-key="value" data-pid="option_id" type="text">
                </div>
              </div>
              <div class="col-2 no_hide">
                <div class="form-group">
                  <input ymq-validate="number" value="${value['price']}" class="form-control value_price option_value_json" data-id="option_value_id" data-key="price" data-pid="option_id" type="text">
                </div>
              </div>
              
              <div class="col-2 no_hide one_time_hide">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="one_time" ${Number(value['one_time'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json" data-key="one_time" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['hasstock'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json option_value_json" data-key="hasstock" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-1">
                <div class="form-group">
                  <div class="custom-switches-stacked">
                    <label class="custom-switch">
                      <input type="checkbox" name="default" ${Number(value['default'])== 1 ? 'checked' : ''} class="custom-switch-input option_value_json default_radio default_radiooption_id option_value_json" data-key="default" data-id="option_value_id" data-pid="option_id" value="1">
                      <span class="custom-switch-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <span class="btn btn-secondary condition option_value_condition" data-id="option_value_id" data-pid="option_id">Condition</span>
                <div class="option_value_delete" data-id="option_value_id" data-pid="option_id">
                  <img class="delete_svg" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      select_raido_option_value = select_raido_option_value.replace(/option_value_id/g,pid+'_'+index);
      //多选去除联动效果
      if ([6,7,8].includes(type)) {
          select_raido_option_value = select_raido_option_value.replace(/default_radio/g,'');
      }
      select_raido_option_value = select_raido_option_value.replace(/option_id/g,pid);
      return select_raido_option_value;
    }


    ////////////////////condition////////////////内容
    //删除condition value
    $(document).on('click', '.condition_value_delete', function () {
        $(this).parent('div').parent('div').parent('.condition_item').remove();
    });
    //保存condition
    function saveCondition(){
        var json = {};
        var condition_cid = $('.condition_cid').val();
        if (condition_cid.indexOf("_") != -1) {
            json["type"] = "2";
            json["disabled_text"] = $('.disabled_text').val();
        }else{
            json["type"] = "1";
        }
        json["andor"] = $('.condition_andor').val();
        json["show"] = $('.condition_isshow').val();
        if(ymq_condition.hasOwnProperty(condition_cid)){
            json["children"] = ymq_condition[condition_cid]['children'];
        }else{
            json["children"] = "";
        }
        json['options'] = {};
        var index = 1;
        //遍历
        $('.condition_box .condition_item').each(function(){
            var n_index = $(this).data('index');
            json['options'][index] = {};
            json['options'][index]['id'] = $('.condition_item'+n_index+' .option_select').val();
            json['options'][index]['type'] = $('.condition_item'+n_index+' .condition_type').val();
            if ($('.condition_item'+n_index+' .condition_select_value').length > 0) {
                var value = $('.condition_item'+n_index+' .condition_value').val().join(",");
            }else{
                if ($('.condition_item'+n_index+' .condition_value').length > 0) {
                    var value = $('.condition_item'+n_index+' .condition_value').val();
                }else{
                    var value = "";
                }
            }
            json['options'][index]['value'] = value;
            index++;
        })
        ymq_condition[condition_cid] = json;
        
        addConditionChildren(condition_cid);
        console.log(ymq_condition);
    }
    function deleteCondition(now_key){
        if(ymq_condition.hasOwnProperty(now_key)){
            for(var key in ymq_condition){
                //不操作自己
                if (key == now_key) {
                    continue;
                }
                //把当前condition元素给他的父类添加chiliren
                if (ymq_condition[key]['children'] == '') {
                    var children_arr = [];
                }else{
                    var children_arr = ymq_condition[key]['children'].split(',');
                }
                children_arr.remove(now_key);
                ymq_condition[key]['children'] = children_arr.join(',');
                
            }
            delete ymq_condition[now_key]; 
            myconsole(ymq_condition);            
        }
    }

    function addConditionChildrenbeifen(now_key){
        var options_arr = [];
        //遍历
        for(var key in ymq_condition[now_key]['options']){
            options_arr.push(ymq_condition[now_key]['options'][key]['id']);
        }
        for(var key in ymq_condition){
            //不操作自己
            if (key == now_key) {
                continue;
            }
            //把当前condition元素给他的父类添加chiliren
            if (options_arr.includes(key.split('_')[0])) {
                if (ymq_condition[key]['children'] == '') {
                    var children_arr = [];
                }else{
                    var children_arr = ymq_condition[key]['children'].split(',');
                }
                
                if (!children_arr.includes(now_key)) {
                    children_arr.push(now_key);
                }
                ymq_condition[key]['children'] = children_arr.join(",");
            }else{

                //删除已经移除的children
                if (ymq_condition[key]['children'] != '') {
                    var children_arr = ymq_condition[key]['children'].split(',');
                    if (children_arr.includes(now_key)) {
                      children_arr.remove(now_key)
                    }
                    ymq_condition[key]['children'] = children_arr.join(",");
                }
            }
            //给当前contition添加children
            for(var ke in ymq_condition[key]['options']){
                if (ymq_condition[key]['options'][ke]['id'] == now_key.split('_')[0]) {
                    if (ymq_condition[now_key]['children'] == '') {
                        var children_arr1 = [];
                    }else{
                        var children_arr1 = ymq_condition[now_key]['children'].split(',');
                    }
                    
                    if (!children_arr1.includes(key)) {
                        children_arr1.push(key);
                    }
                    ymq_condition[now_key]['children'] = children_arr1.join(",");
                }
            } 
        }
    }

    function str_has_add(l_str,s_str){
      if (l_str == '') {
        return s_str;
      }
      var l_str_arr = l_str.split(',');
      if (l_str_arr.includes(s_str)) {
        return l_str;
      }
      return l_str+','+s_str;
    }
    function str_has_remove(l_str,s_str){
      if (l_str == '') {
        return l_str;
      }
      var l_str_arr = l_str.split(',');
      if (!l_str_arr.includes(s_str)) {
        return l_str;
      }
      return l_str_arr.remove(s_str).join(',');
    }
    function addConditionChildren(now_key){
        var fathers_arr = [];
        //遍历
        for(var key in ymq_condition[now_key]['options']){
            if (ymq_condition[now_key]['options'].value != '') {
              //是有子选项的选项时
              if (hasOptionValueArr.includes(ymq_option[key_prefix+ymq_condition[now_key]['options'][key]['id']].type)) {
                var options_value_arr = ymq_condition[now_key]['options'][key]['value'].split(',');
                options_value_arr.forEach(function (item) {
                  fathers_arr.push(item);
                })
              }
              fathers_arr.push(ymq_condition[now_key]['options'][key]['id']);
            }
        }
        for(var key in ymq_condition){
            //不操作自己
            if (key == now_key) {
                continue;
            }
            //添加新的children
            if (fathers_arr.includes(key)) {
              ymq_condition[key]['children'] = str_has_add(ymq_condition[key]['children'],now_key);
            }else{
              //删除没有的children
              ymq_condition[key]['children'] = str_has_remove(ymq_condition[key]['children'],now_key);
            }

            //给当前contition添加children
            var condition_options = ymq_condition[key]['options'];
            //当前是子选项
            if (now_key.indexOf("_") > -1) {
              for(var ke in condition_options){
                if (condition_options[ke]['value'] != '') {
                  var condition_options_value_arr = condition_options[ke]['value'].split(',');
                  if (condition_options_value_arr.includes(now_key)) {
                    ymq_condition[now_key]['children'] = str_has_add(ymq_condition[now_key]['children'],key);
                  }
                }
              } 
            }else{
              for(var ke in condition_options){
                  if (condition_options[ke]['id'] == now_key) {
                      ymq_condition[now_key]['children'] = str_has_add(ymq_condition[now_key]['children'],key);
                  }
              } 
            }
        }
    }

    //condition弹窗
    $(document).on('click', '.condition', function () {
        //权限,如果没有权限，不可用,html中，给.condition加隐藏
        if (false) {
          return false;
        }
        $(this).addClass('btn-progress');
        available_option = [];
        var html = getCanUsedOption($(this).data('id'),$(this).data('pid'))
        $(this).fireModal({
            title: 'Add conditions',
            body: html,
            size: 'larg-modal',
            center: true,
            initShow: true,
            removeOnDismiss:true,
            buttons: [
                {
                    text: 'Save',
                    class: 'btn btn-secondary btn-primary',
                    handler: function(modal) {
                        //新增或修改ymq_condition json
                        //如果没有条件则删除对应ymq_condition的key
                        if ($('.condition_box .condition_type').length > 0) {
                            saveCondition();
                        }else{
                            deleteCondition($('.condition_cid').val());
                        }
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Delete',
                    class: 'btn btn-secondary btn-danger',
                    handler: function(modal) {
                        //删除ymq_condition json
                        deleteCondition($('.condition_cid').val());
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Close',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
        $(this).removeClass('btn-progress');
        $(".select2").select2({minimumResultsForSearch: -1});
    })

    $(document).on('change', '.condition_andor', function () {
        if ($(this).val() == '||') {
            $('.anor_text').text('OR')
        }else{
            $('.anor_text').text('AND')
        }  
    })
    $(document).on('change', '.field_type', function () {
        $(this).parent().parent().next('.diff_box').children('.field_type_box').hide()
        $(this).parent().parent().next('.diff_box').children('.field_type_box'+$(this).val()).css('display','flex');
        if ($(this).val() == 5 || $(this).val() == 6) {
          $(this).parent().parent().next('.diff_box').children('.field_type_box4').css('display','flex');
        }
    })
    
    //condition select改变时重置后面的select
    $(document).on('change', '.option_select', function () {
        $(this).parents('.option_select_box').next('.col-2').remove();
        $(this).parents('.option_select_box').next('.col-4').remove();
        //不是please choose执行
        if ($(this).val() != 0) {
            //根据type构造condition_type的html
            var selectedDom = $(this).children('option:selected');
            // creat_condition_type(selectedDom.data('type'));
            // creat_children_html($(this).val());
            $(this).parents('.option_select_box').after(creat_condition_type($(this).val())+creat_children_html($(this).val()));
            $(".select2").select2({minimumResultsForSearch: -1});
        }
        
    })  

    function echoCondition(c_id){
        var now_options = ymq_condition[c_id]['options'];
        var init_option = ``;
        if (ymq_condition[c_id]['andor'] == '||') {
            var andor1 = `<span class="anor_text">OR</span>`;
        }else{
            var andor1 = `<span class="anor_text">AND</span>`;
        }
        for(var key in now_options){
            if (key == 1) {
                var andor = 'IF';
            }else{
                var andor = andor1;
            }
            init_option += `
                <div class="card padding_tb_15 margin0 condition_item condition_item${key}" data-index="${key}">
                    <div class="row align_center">
                      <div class="col-1 text-right padding_r0">
                      ${andor}
                      </div>
                      <div class="col-3 option_select_box">
                        ${creat_option_select(available_option,now_options[key]['id'])}
                      </div>
                      ${creat_condition_type(now_options[key]['id'],now_options[key]['type'])+creat_children_html(now_options[key]['id'],now_options[key]['value'])}
                      <div class="col-1">
                        <div class="condition_value_delete">
                          <img class="delete_svg" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
                        </div>
                      </div>
                    </div>
                </div>
            `;
        }
        return init_option;
    }
    
    function initConditionHtml(c_id,select){
        var condition_index = 1;
        var init_option = ``;
        if(ymq_condition.hasOwnProperty(c_id)){
            var andor = ymq_condition[c_id]['andor'];
            var show = ymq_condition[c_id]['show'];
            //TODO::初始化condition,还要给condition_index重新赋值
            init_option = echoCondition(c_id);
            condition_index = Object.keys(ymq_condition[c_id]['options']).length;
            var now_disabled_text = ymq_condition[c_id]['disabled_text'];
        }else{
            //设置默认值
            var now_disabled_text = "sold out";
            var andor = '||';
            if (c_id.toString().indexOf('_') != -1) {
              var show = 2;
            }else{
              var show = 1;
            }
            
            init_option = `
                <div class="card padding_tb_15 margin0 condition_item condition_item${condition_index}" data-index="${condition_index}">
                    <div class="row align_center">
                      <div class="col-1 text-right padding_r0">
                      IF
                      </div>
                      <div class="col-3 option_select_box">
                        ${creat_option_select(select)}
                      </div>
                      <div class="col-1">
                        <div class="condition_value_delete">
                          <img class="delete_svg" src="https://cdn.jsdelivr.net/gh/yunmuqing/img@latest/option/delete.png">
                        </div>
                      </div>
                    </div>
                  </div>
            `
        }
        var andor = `
            <div class="form-group">
                <select class="form-control select2 condition_andor">
                  <option value="||" ${andor=='||' ? 'selected' : ''}>Any</option>
                  <option value="&&" ${andor=='&&' ? 'selected' : ''}>ALL</option>
                </select>
              </div>
        `;
        if (c_id.toString().indexOf('_') != -1) {
          var isShow = `
            <div class="form-group">
                <select class="form-control select2 condition_isshow">
                  <option value="2" ${show==2 ? 'selected' : ''}>disabled</option>
                  <option value="1" ${show==1 ? 'selected' : ''}>enable</option>
                </select>
              </div>
          `;
          var disabled_text= `
              <div class="col-3 align_center">
                  <span class="padding_r15">disabled text</span>
                  <input class="form-control disabled_text" type="text" value="${now_disabled_text}">
              </div>
          `
        }else{
          var isShow = `
            <div class="form-group">
                <select class="form-control select2 condition_isshow">
                  <option value="1" ${show==1 ? 'selected' : ''}>show</option>
                  <option value="2" ${show==2 ? 'selected' : ''}>hide</option>
                </select>
              </div>
          `;
          var disabled_text= ``;
        }
        


        var returnHtml = `
            <input type="hidden" class="condition_cid" name="condition_cid" value="${c_id}">
            <div class="card padding_tb_15 margin0">
              <div class="row align_center">
                <div class="col-1 text-right padding_r0">
                Rule
                </div>
                <div class="col-3 align_center">
                  <span class="padding_r15">If</span>
                  ${andor}
                  <span class="padding_l15">these rules match:</span>
                </div>
              </div>
            </div>
            <div class="condition_box">
              ${init_option}
            </div>
            <div class="card  margin0">
              <div class="row align_center">
                <div class="col-1"></div>
                <div class="col-3"><button class="btn btn-primary add_new_condition" data-index="${condition_index+1}">Add Condition</button></div>
              </div>
            </div>

            <div class="card padding_tb_15 margin0">
              <div class="row align_center">
                <div class="col-1 text-right padding_r0">
                Operating
                </div>
                <div class="col-3 align_center">
                  <span class="padding_r15">Then</span>
                  ${isShow}
                </div>
                ${disabled_text}
                
              </div>
            </div>
        `;
        return returnHtml;
    }

    //穿件option_select下拉的html
    function creat_option_select(select,p_id = 0){
        var options = ``;
        select.forEach(function (item) {
            options += `<option value="${item['id']}" data-type="${item['type']}" ${item['id']==p_id ? 'selected' : ''}>${item['label']}</option>`;
        })
        var html = `
            <div class="form-group">
              <select class="form-control select2 option_select">
                <option value="0">pelase choose</option>
                ${options}
              </select>
            </div>
        `;
        return html;
    }


    function getCanUsedOptionbeifen(c_id,P_id){
        if (P_id == undefined) {
            var P_id = c_id;
        }
        for(var key in ymq_option){
            if (ymq_option[key]["id"] == P_id) {
                continue;
            }
            var item = [];
            //是包含选项的
            if(hasOptionValueArr.indexOf(ymq_option[key]["type"]) > -1){
                //label不为空并且有选项
                if (ymq_option[key]['label'] != '' && ymq_option[key]['label'] != undefined && ymq_option[key].hasOwnProperty("options") && Object.keys(ymq_option[key]["options"]).length > 0) {
                    item['id'] = ymq_option[key]["id"];
                    item['type'] = ymq_option[key]["type"];
                    item['label'] = ymq_option[key]["label"];
                    available_option.push(item);
                }
            }else{
                //label不为空
                if (ymq_option[key]['label'] != '' && ymq_option[key]['label'] != undefined) {
                    item['id'] = ymq_option[key]["id"];
                    item['type'] = ymq_option[key]["type"];
                    item['label'] = ymq_option[key]["label"];
                    available_option.push(item);
                }
            } 
        }
        //初始化html
        return initConditionHtml(c_id,available_option);
        
    }

    function str_has(l_str,s_str){
      if (l_str == '') {
        return l_str;
      }
      var l_str_arr = l_str.split(',');
      if (!l_str_arr.includes(s_str)) {
        return l_str;
      }
      return l_str_arr.remove(s_str).join(',');
    }

    function getCanUsedOption(c_id,P_id){
        var disabled_arr = [];
        if (P_id == undefined) {
            var P_id = c_id;
            //获取当前不可显示的option id,当A是B的条件，那么给B添加条件时A就不能出现，避免死循环
            for(var key in ymq_condition){
              var ymq_condition_options = ymq_condition[key]['options']
              for(var ke in ymq_condition_options){
                if (ymq_condition_options[ke]['id'] == c_id) {
                  disabled_arr.push(key)
                }
              }
            }
        }
        for(var key in ymq_option){
            //当A是B的条件，那么给B添加条件时A就不能出现，避免死循环
            if (disabled_arr.includes(ymq_option[key]["id"])) {
              continue;
            }
            if (ymq_option[key]["id"] == P_id || ymq_option[key]['label'] == '' || ymq_option[key]['label'] == undefined) {
                continue;
            }
            if(hasOptionValueArr.indexOf(ymq_option[key]["type"]) > -1 && !(ymq_option[key].hasOwnProperty("options") && Object.keys(ymq_option[key]["options"]).length > 0)){
              continue;
            }
            var item = [];
            item['id'] = ymq_option[key]["id"];
            item['type'] = ymq_option[key]["type"];
            item['label'] = ymq_option[key]["label"];
            available_option.push(item);
        }
        //初始化html
        return initConditionHtml(c_id,available_option);
    }

    function getAllChildren(c_id){
      for(var key in ymq_condition){
        if (ymq_condition[key]['children'] != '') {
            var children_arr = ymq_condition[key]['children'].split(',');
            if (c_id.indexOf(children_arr) > -1) {

            }
        }
      }
    }

    function creat_children_html(id,value = ''){
        var option = ymq_option[key_prefix+id];
        if (["1","2"].includes(option['type'])) {
            var inputHtml = `
                <input class="form-control condition_value" type="text" value="${value}">
            `;
        }else if(["9","10"].includes(option['type'])){
            var inputHtml = `
                <input class="form-control condition_value" readonly onclick="dateAndTime(this);" type="text" value="${value}">
            `;
        }else if(hasOptionValueArr.includes(option['type'])){
            var value_arr = value.split(','); 
            var optionHtml = ``;
            if(option.hasOwnProperty('options')){
                var disabled_arr = [];
                var c_id = $('.condition_cid').val();
                for(var key in ymq_condition){
                  if (key.indexOf("_") == -1 || key.split("_")[0] != id) {
                    continue;
                  }
                  var ymq_condition_options = ymq_condition[key]['options']
                  for(var ke in ymq_condition_options){
                    if (ymq_condition_options[ke]['value'].split(",").includes(c_id)) {
                      disabled_arr.push(key);
                    }
                  }
                }
                console.log(disabled_arr)
                for(var key in option['options']){
                  //判断当已经添加了S选中时不可选蓝色，那么当给蓝色加条件时，应该排除S码选项
                  if (disabled_arr.includes(option['options'][key]['id'])) {
                    continue;
                  }
                  optionHtml += `<option value="${option['options'][key]['id']}" ${value_arr.includes(option['options'][key]['id']) ? 'selected' : ''}>${option['options'][key]['value']}</option>`
                }
                var inputHtml = `
                  <select class="form-control select2 condition_select_value condition_value" multiple="">
                      ${optionHtml}
                  </select>
                `;
            }else{
                var inputHtml = `No options value available`;
            }
        }else if(option['type'] == "12" || option['type'] == "13"){
            var inputHtml = '';
        }else if(option['type'] == "14"){
            var inputHtml = '<input type="text" name="" class="color_picker form-control condition_value">';
        }
        var returnHtml = `
            <div class="col-4">
                <div class="form-group">
                  ${inputHtml}
                </div>
            </div>
        `;
        return returnHtml;
    }

    $(document).on('change', '.condition_type', function () {
        if ([11,12,17,18].includes(Number($(this).val()))) {
            $(this).parent().parent().next().hide();
        }else{
            $(this).parent().parent().next().show();
        }  
    })

    var condition_type = {
        1:"is one of",2:"is not one of",3:"is",4:"is not",5:"contains",
        6:"does not contain",7:"equals or greater than",8:"equals or less than",9:"greater than",10:"less than",
        11:"is empty",12:"is not empty",13:"between []",14:"between ()",15:"between (]",16:"between [)",17:"on",18:"off",19:"belongs to",20:"not belongs to"
    };
    function creat_condition_type(optionId,selected = 0){
        type = Number(ymq_option[key_prefix+optionId]['type']);
        if ([2].includes(type)) {
            var need = [3,4,11,12];
        }else if([1].includes(type)){
          if (ymq_option[key_prefix+optionId].hasOwnProperty('field_type') && [4,5,6].includes(Number(ymq_option[key_prefix+optionId]['field_type']))) {
            var need = [3,4,7,8,9,10,11,12,13,14,15,16];
          }else{
            var need = [3,4,11,12];
          }
        }else if([3,4,5].includes(type)){
            var need = [1,2,11,12];
        }else if([6,7,8].includes(type)){
            var need = [19,20,5,6,11,12];
        }else if([9,10].includes(type)){
            var need = [3,4,7,8,9,10,11,12];
        }else if(type == 12){
            var need = [11,12];
        }else if(type == 13){
            var need = [17,18];
        }else if(type == 14){
            var need = [3,4];
        }

        var option = ``;
        need.forEach((item) => {
          option += `<option value="${item}" ${item==selected ? 'selected' : ''}>${condition_type[item]}</option>`;
        })
        var condition_type_html = `
            <div class="col-2">
                <div class="form-group">
                  <select class="form-control select2 condition_type">
                    ${option}
                  </select>
                </div>
            </div>
        `;
        return condition_type_html;
    }   

  
  jQuery.fn.extend({
      ymqUpload:function(config = {}){
        //默认值
        var defaultConfig = {
          filesSize:100,
          url:'/api/aws/uploadimage',
          multi_selection:true,
          filters : {
            max_file_size : '500kb', //最大只能上传400kb的文件
            //prevent_duplicates : true, //不允许选取重复文件
            mime_types: [
              {title : "Image files", extensions : "jpg,jpeg,bmp,gif,png"},
              {title : "Zip files", extensions : "zip"}
            ]
          }
        };
        //使用配置值覆盖默认配置
        for(var key in defaultConfig){
          if (key == 'filters') {
            if (config.hasOwnProperty(key)) {
              for(var ke in defaultConfig[key]){
                if (config[key].hasOwnProperty(ke)) {
                  defaultConfig[key][ke] = config[key][ke];
                }
              }
            }
          }else{
            if (config.hasOwnProperty(key)) {
              defaultConfig[key] = config[key]
            }
          }
            
        }
        var that = $(this);
        var that_text = that.html();
        //filesAddLength和add_file2个值都是算总的上传进度的
        var filesAddLength = 1;
        var add_file = [];
        //上次文件个数，用来限制文件上传个数限制
        var filesAddNum = 0;
        //var chushiProgress = 0;
        var that = $(this);
        uploade = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          flash_swf_url : 'Moxie.swf',
          silverlight_xap_url : 'Moxie.xap',
          browse_button : that.attr('id'),
          url : defaultConfig.url,
          multi_selection : defaultConfig.multi_selection,
          filters : defaultConfig.filters,
          init: {
            PostInit: function() {
            },
            BeforeUpload: function (uder, files) {
              that.addClass('disabled');
              if (filesAddNum >= defaultConfig.filesSize) {
                myconsole('aaa')
                return false;
              }
            },
            FilesAdded: function(up, files) {
              filesAddlength = files.length;
              for(var i = 0, len = files.length; i<len; i++){
                add_file.push(files[i].id);
              }
              //that.html(that_text+' '+chushiProgress+'%');
              up.start()
            },
            FileUploaded: function (uder, file, data) {
              filesAddNum++;
              fileUploaded(uder, file, data)
            },
            UploadProgress: function(up, file) {
              var progress = 0;
              for(var i = 0, len = up.files.length; i<len; i++){
                if (add_file.includes(up.files[i].id)) {
                  progress += up.files[i].percent/filesAddlength;
                }
              }
              myconsole(progress);
              // if (progress < 100) {
              //   for (var i = 0; i <= progress-chushiProgress; i++) {
              //     that.html(that_text+' '+Number(Number(progress)+Number(i))+'%')
              //   }
              //   chushiProgress = progress;
              // }
              that.html(that_text+' '+Math.round(progress)+'%')
            },
            UploadComplete: function (uder, files) {
              add_file = [];
              that.html(that_text)
              that.removeClass('disabled');
            },
            Error: function(up, err) {
              add_file = [];
              myconsole(err)
              // for(var key in up.files){
              //   if (up.files[key]['id'] == err.file['id']) {
              //     delete up.files[key];
              //   }
              // }
            }
          }
        });

        uploade.init();
        function fileUploaded(uder, file, data){
          var result = JSON.parse(data.response);
          console.log(result)
          var html = `
            <div class="up_img_box_item" data-src="${result.data.relative_path}">
              <input class="up_img_checkBox" type="checkBox" name="up_img" value="${result.data.relative_path}">
              <img src="${result.data.relative_path}">
            </div>
          `;
          $('.up_img_box').prepend(html);
        }
        function previewImage(file,callback){
          //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
          if(!file || !/image\//.test(file.type)) return; //确保文件是图片
          if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function(){
              callback(fr.result);
              fr.destroy();
              fr = null;
            }
            fr.readAsDataURL(file.getSource());
          }else{
            var preloader = new mOxie.Image();
            preloader.onload = function() {
              preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
              var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
              callback && callback(imgsrc); //callback传入的参数为预览图片的url
              preloader.destroy();
              preloader = null;
            };
            preloader.load( file.getSource() );
          } 
        }
      } 
  });

  $('#select_img').ymqUpload();


  var nextMarker = '';
  var firstImg = '';
  
  $(document).on('click', '.selectImgBtn', function () {
    $('.canvas_pid').val($(this).data('pid'));
    $('.canvas_id').val($(this).data('id'));
    if ($('.up_img_box .up_img_box_item').length == 0) {
      var that = $(this);
      that.addClass('btn-progress');
      getImg(that);
    }
  })
  $(document).on('click', '.up_img_checkBox', function (event) {
      event.stopPropagation();   //  阻止事件冒泡
  });
  $(document).on('click', '.up_img_box_item', function () {
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).attr('src',basImgUrl+$(this).data('src'))
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).next('.canvas2').val($(this).data('src')).change();
    $('.close_img_box').trigger('click');
  })
  $(document).on('click', '.add_img_url', function () {
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).attr('src',basImgUrl+$('.img_url').val())
    $('#option_'+$('.canvas_pid').val()+' .canvas_img_'+$('.canvas_id').val()).next('.canvas2').val($('.img_url').val()).change();
    var pushHtml = `
          <div class="up_img_box_item" data-src="${$('.img_url').val()}">
            <input class="up_img_checkBox" type="checkBox" data-id="0" name="up_img" value="${$('.img_url').val()}">
            <img src="${basImgUrl+$('.img_url').val()}">
          </div>
        `;
    $('.up_img_box').prepend(pushHtml);
    images_arr.push($('.img_url').val())
    $('.close_img_box').trigger('click');
    $('.img_url').val('')
  })
  $(document).on('click', '.load_more', function () {
    var that = $(this);
    that.addClass('btn-progress');
    getImg(that);
  })

  //批量添加图片url
  $(document).on('click', '.add_imgs_urls', function () { 
        $(this).fireModal({
            title: 'Add image links in bulk',
            body: `
            <div style="height: calc(100vh - 200px)!important;">
              <div class="form-group">
                  <label>Add image links in bulk(Press enter to wrap and enter the next link address)</label>
                  <textarea class="imgs_urls form-control" style="min-height:200px;"></textarea>
              </div>
            </div>
            `,
            center: true,
            initShow: true,
            buttons: [
                {
                    text: 'ADD',
                    class: 'btn btn-secondary add_imgs_btn btn-primary',
                    handler: function(modal) {
                      var imgs_urls_val = $('.imgs_urls').val();
                      console.log(imgs_urls_val)
                      if (imgs_urls_val == '') {
                        alert('Must not be empty');
                        return false;
                      }
                      imgs_urls_val = imgs_urls_val.split(/[(\r\n)\r\n]+/)
                      
                      imgs_urls_val = imgs_urls_val.filter(function (s) {
                         return s && s.trim();
                      });
                      $('.add_imgs_btn').addClass('btn-progress');
                      $.ymqajax({
                          url: "/api/img/addimg",
                          data: {imgs_urls_val},
                          success: function (res) {
                            console.log(res)
                            var pushHtml = ``;
                            res.data.forEach((item) => {
                                pushHtml += `
                                  <div class="up_img_box_item" data-src="${item.url}">
                                    <input class="up_img_checkBox" type="checkBox" name="up_img" data-id="${item.id}" value="${item.url}">
                                    <img src="${basImgUrl+item.url}">
                                  </div>
                                `;
                            })
                            $('.up_img_box').prepend(pushHtml);
                            $('.add_imgs_btn').removeClass('btn-progress');
                            modal.modal('hide');
                          },
                          error:function(res){
                            $('.add_imgs_btn').removeClass('btn-progress');
                          }
                      });
                      
                    }
                },
                {
                    text: 'Cancle',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
  })

  //批量添加图片url
  $(document).on('click', '.howtouse', function () { 
        $(this).fireModal({
            title: 'How to use shopify image',
            body: `
            <div style="height: calc(100vh - 200px)!important;">
              <iframe width="100%" height="400" src="https://www.youtube.com/embed/znyzvu5jpQs?hl=en_GB&rel=0&version=3" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
            `,
            center: true,
            initShow: true,
            buttons: [
                {
                    text: 'Cancle',
                    class: 'btn btn-secondary btn-shadow',
                    handler: function(modal) {
                        modal.modal('hide');
                    }
                }
            ]
        });
  })

  function getImg(that){
    var page = $('.load_more_btn').data('page');
    $.ymqajax({
        url: "/api/img/get",
        data: {page},
        success: function (res) {
          if (res.msg < 100 ) {
            $('.load_more_btn').text('no more');
            $('.load_more_btn').removeClass('load_more');
          }else{
            $('.load_more_btn').addClass('load_more');
            $('.load_more_btn').data('page',Number(page)+1);
          }
          if (res.msg > 0) {
            var pushHtml = ``;
            res.data.data.forEach((item) => {
                pushHtml += `
                  <div class="up_img_box_item" data-src="${item.url}">
                    <input class="up_img_checkBox" type="checkBox" data-id="${item.id}" name="up_img" value="${item.url}">
                    <img src="${basImgUrl+item.url}">
                  </div>
                `;
            })
            $('.up_img_box').append(pushHtml);
          }
          $('.load').hide()
          that.removeClass('btn-progress');
        },
        error:function(res){
          that.removeClass('btn-progress');
        }
    });
  }

  function getImgaws(that,first = false){
    $.ymqajax({
        url: "/api/aws/getimage",
        data: {nextMarker},
        success: function (res) {
          console.log(res)
          if (res.code != 201) {
            nextMarker = res.data.nextMarker;
            var pushHtml = ``;
            res.data.data.forEach((item) => {
                pushHtml += `
                  <div class="up_img_box_item" data-src="${item}">
                    <input class="up_img_checkBox" type="checkBox" name="up_img" value="${item}">
                    <img src="${basImgUrl+item}">
                  </div>
                `;
            })
            $('.up_img_box').append(pushHtml);
          }else{
            $('.load_more').text('no more');
            $('.load_more').addClass('disabled');
            $('.load_more').removeClass('load_more');
          }
          $('.load').hide()
          that.removeClass('btn-progress');
        },
        error:function(res){
          that.removeClass('btn-progress');
        }
    });
  }
  $(document).on('click', '.up_img_delete', function () {
    var img_arr = getCheckboxDataId($('.up_img_checkBox:checked'));
    if (img_arr.length > 0) {
      var that = $(this);
      that.addClass('btn-progress');
      $.ymqajax({
          url: "/api/img/delete",
          data: {img_arr},
          success: function (res) {
            deleteCheckboxValue($('.up_img_checkBox:checked'))
            that.removeClass('btn-progress');
            that.hide()
          },
          error:function(res){
            that.removeClass('btn-progress');
          }
      });
    }
  })
  $(document).on('click', '.up_img_delete_aws', function () {
    var img_arr = getCheckboxValue($('.up_img_checkBox:checked'));
    if (img_arr.length > 0) {
      var that = $(this);
      that.addClass('btn-progress');
      $.ymqajax({
          url: "/api/aws/deleteimg",
          data: {img_arr},
          success: function (res) {
            myconsole(res)
            deleteCheckboxValue($('.up_img_checkBox:checked'))
            that.removeClass('btn-progress');
          },
          error:function(res){
            that.removeClass('btn-progress');
          }
      });
    }
  })
  $(document).on('input propertychange', '.up_img_checkBox', function (){
    if ($('.up_img_checkBox:checked').length > 0) {
      $('.up_img_delete').show()
    }else{
      $('.up_img_delete').hide()
    }
  })

  function deleteCheckboxValue(checkboxDmo){
    checkboxDmo.each(function(){
      $(this).parent('.up_img_box_item').remove();
    })
  }

  function getCheckboxValue(checkboxDmo){
    var check_arr = [];
    checkboxDmo.each(function(){
      //check_arr[index] = $(this).val()
      check_arr.push($(this).val());
    })
    return check_arr;
  }
  function getCheckboxDataId(checkboxDmo){
    var check_arr = [];
    checkboxDmo.each(function(){
      //check_arr[index] = $(this).val()
      check_arr.push($(this).data('id'));
    })
    return check_arr;
  }
  jQuery.fn.extend({
    ymqColorpicker:function(config = {}){
      if ($(this).length > 0) {
        var color = $(this).parent('.canvas_type').children('.canvas1').val();
        //默认值
        var defaultConfig = {
          submit: 0,
          color:color,
          onSubmit:function(hsb,hex,rgb,el) {
            //$(el).css('background-color', '#'+hex);
            $(el).parent().children('.color_picker_span').css('background','#'+hex);
            $(el).parent().children('.canvas1').val(hex).change();
            $(el).colpickHide();

          }
        };
        //使用配置值覆盖默认配置
        for(var key in defaultConfig){
          if (config.hasOwnProperty(key)) {
            defaultConfig[key] = config[key]
          }  
        }

        $(this).colpick({
          color:defaultConfig.color,
          onSubmit:defaultConfig.onSubmit
        });
      }
    }
  });

  $('.color_picker').ymqColorpicker()

  
  $(document).on('change', '.canvas_type_select', function () {
    $(this).parent().parent().next().children('.canvas_type').hide();
    $(this).parent().parent().next().children('.canvas_type'+$(this).val()).show();
  })


    
    $(document).on('change', '.dateType', function () {
      if ($(this).val() == 2) {
        $(this).parent().parent().next().show();
      }else{
        $(this).parent().parent().next().hide();
      }
    })



    Array.prototype.remove = function(val) { 
        var index = this.indexOf(val); 
        if (index > -1) { 
            this.splice(index, 1); 
        } 
    };
    function add_option_summernote(){
        $('.option_summernote').summernote({
            fontSizes: ['12', '14','16', '18','20','20', '24','26','28','30','32', '36', '40','48' , '64'],
            lineHeights: ['0.5', '0.8','1.0', '1.2','1.4','1.5', '1.6','1.8','2.0','2.5','3.0'],
            toolbar: [
                ['style', ['style']],
                ['fontface', ['fontname','color','fontsize']],//字体
                ['font', ['bold', 'italic', 'superscript', 'subscript', 'strikethrough','underline', 'clear']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']],
                ['mybutton', ['hello']]
            ],
            popover: {
                image: [
                    ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']],
                    ['link', ['linkDialogShow', 'unlink']]
                ],
                link: [
                    ['link', ['linkDialogShow', 'unlink']]
                ],
                table: [
                    ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                    ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                ],
                air: [
                    ['color', ['color']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['para', ['ul', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture']]
                ]
            },
            focus: true,
            minHeight: 200,
            callbacks: {
                // 失去简单触发change事件
                onBlur: function(files) {
                    $('.option_summernote').change();
                }
            }
        });
    }



})
var enLang = {                            
      name  : "en",
      month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      weeks : [ "SU","MO","TU","WE","TH","FR","SA" ],
      times : ["Hour","Minute","Second"],
      timetxt: ["Time","Start Time","End Time"],
      backtxt:"Back",
      clear : "Clear",
      today : "Now",
      yes   : "Confirm",
      close : "Close"
  }
//蓝色主题色
var jedateblue = { bgcolor:"#275efe",color:"#ffffff", pnColor:"#00CCFF"};
// var jedateblue = { bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"};
var jedategreen = {bgcolor:"#00A680",pnColor:"#00DDAA"};
var jedatered = {bgcolor:"#D91600",pnColor:"#FF6653"};
function dateDD(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'YYYY-MM-DD',
        isinitVal:true,
        onClose:true,  
        trigger:false,
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }  
    });
}
function dateTime(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'hh',
        onClose:false, 
        trigger:false, 
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }
    });
}
function dateAndTime(elem){
    jeDate(elem,{
        theme:jedateblue, 
        format: 'YYYY-MM-DD hh:mm:ss',
        onClose:false, 
        trigger:false, 
        language:enLang,
        donefun: function(obj){
            $(obj.elem).change()
        }
    });
}

$(document).on("mouseover",".ymq_tools",function(){
　　var _this = $(this);
    _this.justToolsTip({
        events:event,
        animation:"fadeIn",
        //width:"300px",
        contents:_this.data('title'),
        gravity:'right'
    });
})
