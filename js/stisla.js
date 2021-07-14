"use strict";

(function($, window, i) {
  $.extend({
    getUrlParam: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null){
        return decodeURI(r[2]); // decodeURI(r[2]); 解决参数是中文时的乱码问题
      }
      return null;
    },
    ymqPushState: function (json) {
      var url = document.URL;
      var num = url.indexOf('?');
      var baseUrl = url.substring(0,num);
      var ziff = [];
      Object.keys(json).forEach(function(item){
        if (json[item] !== ''){
          ziff.push(`${item}=${json[item]}`);
        }
      });
      history.pushState(null,null,`${baseUrl}${ziff.length > 0 ? '?' : ''}${ziff.join('&')}`);
    },
    setDate: function (beforeDate) {
      return beforeDate.substring(0,10).replace(/-/g,"/");
    }
  });

  $.fn.ymqTable = function(options) {
    var options = $.extend({
      thead: [],
      input: true,
      inputKey: '',
      tbody: [],
      url: '',
      tab: [],
      search: true,
      select: [],
      action: [],
      scroll: {
        dom: $(document),
        mistake: 0
      },
      doChange: function () {

      }
    }, options);

    this.each(function() {
      i++;
      var that = $(this);
      initFinshed();
      makeTbody();


      function makeTab() {
        if (options.tab.length > 0){
          options.tabKey = options.tab[0]['key'];
          var active = $.getUrlParam(options.tabKey) ? $.getUrlParam(options.tabKey) : options.tab[0]['value'];
          that.data(options.tabKey,active);
          var html = `
            <div class="table-tab-ul-box">
                  <ul class="table-tab-ul">
          `;
          options.tab.forEach(function (i) {
            html += `
              <li data-key="${options.tabKey}" data-value="${i['value']}" class="table-li ${i['value'] == active ? 'active' : ''}">
                  <div class="table-div">
                      <span class="table-span">${i['text']}</span>
                  </div>
              </li>
            `;
          });
          html += `
                </ul>
              </div>
          `;
          return html;
        }
      }

      function doSearch() {
        var table_timeout;
        that.find('.table-search-input').on('input', function () {
          clearTimeout(table_timeout);
          var input = $(this);
          table_timeout = setTimeout(function() {
            that.data('search',input.val());
            doChange();
          }, 1000);
        });
      }

      function tabChange() {
        that.find('.table-li').on('click',function () {
          if (!$(this).hasClass('active')){
            that.find('.table-li').removeClass('active');
            $(this).addClass('active');
            that.data(options.tabKey,$(this).data('value'));
            doChange();
            if (options.tab[$(this).index()].hasOwnProperty("do")){
              options.tab[$(this).index()].do($(this).data('value'),that);
            }
          }
        });
      }

      options.doChange = function () {
        doChange();
      }

      function doChange() {
        $.ymqPushState(that.data());
        makeTbody();
        that.find(`#checkbox-all-${i}`).prop('checked', false).trigger("change");
      }

      function checkboxChange() {
        var dad = that.find('custom-control-input[data-checkbox-role="dad"]');
        that.find('.child-custom-control-input').change(function () {

          var all = that.find('.child-custom-control-input'),
              checked = that.find('.child-custom-control-input:checked'),
              total = all.length,
              checked_length = checked.length;
          that.find('.selected-count').html(checked_length);

          options.inputValues = [];
          checked.each(function(){
            options.inputValues.push($(this).val());
          });
          if (checked_length == 0){
            //一个没选
            options.childSelect = 0;
          }else{
            if (checked_length == total){
              //都选了
              options.childSelect = 2;

            }else{
              //没全选
              options.childSelect = 1;
            }

            if (checked_length == 1){
              that.find('.table-checked-line .selected-one').removeClass('disabled');
            }else{
              that.find('.table-checked-line .selected-one').addClass('disabled');
            }

          }

          toggleCheckedLine(options.childSelect);
        });
      }

      function scrollThead() {
        var dom = that.find('.scroll-thead');
        var html = '';
        that.find('.thead-show th').each(function (index) {
          if (options.input && index == 0){
            var inputHtml = `
              <div class="custom-checkbox custom-control">
                    <input type="checkbox" data-checkboxes="mygroup-${i}" data-checkbox-role="dad" class="custom-control-input" id="checkbox-all-scroll-hide-${i}">
                    <label for="checkbox-all-scroll-hide-${i}" class="custom-control-scroll-label custom-control-label">&nbsp;</label>
              </div>
            `;
            html += `<div class="item" style="padding: ${$(this).css('padding')};width: ${$(this).innerWidth()}px;">${inputHtml}</div>`;
          }else{
            html += `<div class="item" style="padding: ${$(this).css('padding')};width: ${$(this).innerWidth()}px;">${$(this).html()}</div>`;
          }
        });
        dom.html(html);
        checkboxes();
      }



      function initFinshed() {
        that.html(nameHtml());
        cartPage();
        checkboxes();
        tabChange();
        initSelect();
        initSceoll();
        initAction();
        doSearch();
        doScroll();
        options.ajaxObj = null;
      }

      function initSceoll() {
        that.find('.table-select-box-out').innerWidth(that.innerWidth());
        $(window).resize(function() {
          scrollThead();
          that.find('.table-select-box-out').innerWidth(that.innerWidth());
        });
      }

      function doScroll() {
        options.scroll.dom.scroll(function () {
          var obj = $('.table-striped thead');
          var clientHeight = $(window).height();
          var scrollTop = $(document).scrollTop();
          var offsetTop = obj.offset().top;
          var objHeight = obj.height();
          scrollTop = scrollTop - (-that.find('.card-header').innerHeight()) - that.find('.thead-show').innerHeight() - options.scroll.mistake;
          if(offsetTop < scrollTop + clientHeight && offsetTop + objHeight > scrollTop) {
            //hide
            fixedHide();
          }else{
            //show
            fixedShow();
          }
        });
      }
      function fixedShow() {
        that.find('.scroll-thead-box').addClass('fixed-show');
        that.find('.table-select-box-out').addClass('fixed-show-just-position')
      }
      function fixedHide() {
        that.find('.scroll-thead-box').removeClass('fixed-show');
        that.find('.table-select-box-out').removeClass('fixed-show-just-position')
      }
      function initAction() {
        that.find('.btn-action-out').on('click',function () {
          if ($(this).hasClass('disabled')){
            return false;
          }
          options.action[$(this).data('index')]['out'][$(this).data('outindex')].do(options);
        });
        options.action.forEach(function (item,index) {
          var dom = $(`.table-action-${i}-${index}`);
          dom.ymqDropdown({
            item: item['in'],
            text: item['text'],
            noAutoWidth: item['noAutoWidth'],
            noActiveClass: true,
            change: function (res) {
              var index = parseInt(res['index'][0]);
              item['in'][index].do(options);
            }
          });


        })
      }

      function initSelect() {
        options.select.forEach(function (item) {
          var dom = $(`.table-select-${i}-${item['key']}`);
          var data = item['items'];
          var json = [];
          var selectedValue = $.getUrlParam(item['key']);

          if (selectedValue){
            selectedValue = selectedValue.split(',');
          }else{
            selectedValue = [];
          }
          selectedValue = selectedValue.map(function (data) {
            return data.toString();
          });

          selectedValue = Array.from(new Set(selectedValue));
          that.data(item['key'],selectedValue.join(','));
          data.forEach(function (i) {
            json.push(i);
          });
          dom.ymqDropdown({
            item: json,
            date: item['date'],
            checkbox: item['checkbox'],
            selectedValue:selectedValue,
            noAutoWidth: item['noAutoWidth'],
            text: item['text'],
            radio: item['radio'],
            change: function (res) {
              console.log(res);
              that.data(res['key'],res['value'].join(','));
              doChange();
            }
          });
        });

      }

      function makePageInfo(current_page,last_page) {
        that.data('current_page',current_page);
        that.data('last_page',last_page);
      }



      function makeTbody() {
        that.find('tbody').html(`
          <tr>
                <td align="center" colspan="${getColspan()}">
                    <svg class="load" style="overflow:hidden;display:inline-block;width:44px;height:44px;-webkit-animation:loading .5s linear infinite;animation:loading .5s linear infinite;color:transparent;display: inline-block;animation: loading .5s linear infinite;color: transparent;" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" role="status"><path style="fill:#47c1bf" d="M15.542 1.487A21.507 21.507 0 0 0 .5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 0 0-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 1 0-.9-2.863z"></path></svg>
                </td>
            </tr>
        `);
        if(options.ajaxObj !=null) options.ajaxObj.abort();

        options.ajaxObj = $.ajax({
          url: options.url,
          type: 'post',
          data: that.data(),
          dataType: 'json',
          async: true,
          success: function (res) {
            page(res.data);
            console.log(res);
            var data = res.data.data;
            var html = '';
            if(data){
              html = '';
              data.forEach(function (item) {
                html +=`<tr class="tr-${item['id']}">`;
                if (options.input){
                  html += `
                      <td class="p-0 table-input text-center">
                          <div class="custom-checkbox custom-control">
                              <input type="checkbox" data-checkboxes="mygroup-${i}" value="${item[options.inputKey]}" class="custom-control-input child-custom-control-input" id="checkbox-${item[options.inputKey]}">
                              <label for="checkbox-${item[options.inputKey]}" value="${item[options.inputKey]}" class="custom-control-label">&nbsp;</label>
                          </div>
                      </td>
                  `;
                }
                options.tbody.forEach(function (i) {
                  html += `
                     <td>
                        ${i.makeHtml(item)}
                     </td>
                  `;
                });
                html += '</tr>';
              });
              that.find('tbody').html(html);
              checkboxChange();
              scrollThead();
            }else{
              return '111';
            }
          },
          error: function(xhr, textStatus, errorThrown){

          }
        });

      };

      function cartPage() {
        if ($.getUrlParam('page')){
          that.data('page',$.getUrlParam('page'));
        }else{
          that.data('page',1);
        }

        that.find('.btn-page').on('click',function () {
          if (!$(this).hasClass('disabled')){
            if ($(this).hasClass('btn-prev')){
              that.data('page',that.data('page') - 1);
            }else{
              that.data('page',that.data('page') - (-1));
            }
            if (that.data('page') <= 0){
              that.data('page',1);
            }
            if (that.data('page') > options.last_page){
              that.data('page',options.last_page);
            }
            doChange();
          }
        });
      }

      function page(data) {
        if (data){
          options.current_page = data['current_page'];
          options.last_page = data['last_page'];
          that.find('.btn-page').removeClass('disabled');
          if (options.current_page == 1){
            that.find('.btn-prev').addClass('disabled');
          }
          if (options.current_page == options.last_page){
            that.find('.btn-next').addClass('disabled');
          }
        }
      }

      function checkboxes() {
        that.find("[data-checkboxes]").each(function() {
          var me = $(this),
              group = me.data('checkboxes'),
              role = me.data('checkbox-role');
          if (me.hasClass('checkboxes-init')){
            return;
          }
          me.addClass('checkboxes-init');
          me.change(function() {
            var all = that.find('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"])'),
                checked = that.find('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"]):checked'),
                dad = that.find('[data-checkboxes="' + group + '"][data-checkbox-role="dad"]'),
                total = all.length,
                checked_length = checked.length;
            options.inputValues = [];
            checked.each(function(){
              options.inputValues.push($(this).val());
            });
            if(role == 'dad') {
              if(me.is(':checked')) {
                all.prop('checked', true);
                all.each(function () {
                  options.inputValues.push($(this).val());
                });
                dad.prop('checked', true);
                options.childSelect = 2;
                that.find('.selected-count').html(total);
              }else{
                all.prop('checked', false);
                dad.prop('checked', false);
                options.inputValues = [];
                options.childSelect = 0;
                that.find('.selected-count').html(0);
              }
              toggleCheckedLine();
            }else{
              if(checked_length >= total) {
                dad.prop('checked', true);
              }else{
                dad.prop('checked', false);
              }
            }
          });
        });
      }

      function toggleCheckedLine() {
        var dad = that.find('.custom-control-input[data-checkbox-role="dad"]');

        switch(options.childSelect) {
          case 0:
            that.find('.table-select-box-out').hide();
            dad.next('.custom-control-label').removeClass('not-all-selected');
            break;
          case 1:
            that.find('.table-select-box-out').show();
            dad.next('.custom-control-label').addClass('not-all-selected');
            break;
          case 2:
            that.find('.table-select-box-out').show();
            dad.next('.custom-control-label').removeClass('not-all-selected');
            break;
        }
      }

      function nameHtml() {
        return `
            <div class="row table-box">
              <div class="col-12">
                  <div class="card">
                    ${makeCardHeader()}
                    ${makeCardBody()}
                    ${makeCardFooter()}
                  </div>
                </div>
            </div>
        `;
      };

      function makeCardFooter() {
        return `
          <div class="card-footer">
                <div class="media align-center">
                    <div class="media-body">
                        <button class="btn btn-icon btn-prev btn-page btn-secondary"><i class="fas fa-arrow-left"></i></button>
                        <button class="btn btn-icon btn-next btn-page btn-secondary"><i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
        `;
      }
      function makeSearch() {
        if (options.search){
          var html = `
            <div class="search-box">
                <div class="form-group search-form-group">
                    <svg class="icon pl-3 pr-3" style="height: 20px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3553"><path d="M400.696889 801.393778A400.668444 400.668444 0 1 1 400.696889 0a400.668444 400.668444 0 0 1 0 801.393778z m0-89.031111a311.637333 311.637333 0 1 0 0-623.331556 311.637333 311.637333 0 0 0 0 623.331556z" fill="#8a8a8a" p-id="3554"></path><path d="M667.904 601.998222l314.766222 314.823111-62.919111 62.976-314.823111-314.823111z" fill="#8a8a8a" p-id="3555"></path></svg>
                    <input type="text" value="${$.getUrlParam('search') ? $.getUrlParam('search') : ''}"  placeholder="Search" class="form-control table-search-input">
                </div>
                <div class="table-select-box space-between">
                    ${makeSelect()}
                </div>
            </div>
          `;
          if ($.getUrlParam('search')){
            that.data('search',$.getUrlParam('search'));
          }
          return html;
        }
      }

      function makeSelect() {
        var html = '';
        options.select.forEach(function (item,index) {
          html += `<div class="table-select-${i}-${item['key']} inline-btn"></div>`
        });
        return html;
      }

      function makeAction() {
        var html = '';
        options.action.forEach(function (item,index) {
          item['out'].forEach(function (inn,outindex) {
            html += `
              <div class="inline-btn">
                  <button data-index="${index}" data-outindex="${outindex}" class="btn btn-action-out btn-outline-ymq ${inn['class'] ? inn['class'] : ''}">${inn['text']}</button>
              </div>
            `;
          });
          html += `<div class="table-action-${i}-${index} inline-btn"></div>`;

        });
        return html;
      }


      function makeCardHeader() {
        return `
          <div class="card-header pl-0 pr-0">
              
              ${makeTab()}
              ${makeSearch()}
              <div class="scroll-thead-box"><div class="scroll-thead"></div></div>
          </div>
        `;
      };

      function makeCardBody() {
        return `
            <div class="card-body p-0">
                <div class="table-responsive">
                    ${makeTbale()}
                </div>
            </div>
          `;
      }


      function makeTbale() {
        return `
               ${makeHideThead()}
            <table class="table table-striped">
                ${makeThead()}
                ${initTbodyLoader()}
            </table>
        `;
      }


      function initTbodyLoader() {
        return `
          <tbody>
            
          </tbody>
        `;
      };

      function makeThead() {
        var header = `
            <thead>
                <tr class="thead-show">        
        `;
        if (options.input){
          header += `
            <th class="p-0 table-input text-center">
                <div class="custom-checkbox custom-control">
                    <input type="checkbox" data-checkboxes="mygroup-${i}" data-checkbox-role="dad" class="custom-control-input" id="checkbox-all-${i}">
                    <label for="checkbox-all-${i}" class="custom-control-label">&nbsp;</label>
                </div>
            </th>
          `;
        }
        options.thead.forEach(function (item) {
          header += `
            <th>${item}</th>
          `;
        });
        header += `
            </tr>
                </thead>        
        `;
        return header;
      };

      function makeHideThead() {
        var html = '';
        html += `
           <div class="table-select-box-out">
             <div class="table-select-box table-checked-line">
                   <div class="inline-btn">
                    <div class="custom-checkbox custom-control space-between table-show-checkbox btn btn-outline-ymq">
                      <input type="checkbox" data-checkboxes="mygroup-${i}" data-checkbox-role="dad" class="custom-control-input" id="checkbox-all-hide-1">
                      <label for="checkbox-all-hide-${i}" class="custom-control-label space-between"><span class="selected-count"></span> selected</label>
                    </div>
                  </div>
                  ${makeAction()}
              </div>
            </div>
        `;
        return html;
      }
      function getColspan() {
        var input = options.input ? 1 : 0;
        return Number(options.thead.length) + Number(input);
      };




    });
  };



})(jQuery, this, 0);


(function($, window, i) {
  $.fn.ajaxModal = function(options) {
    var options = $.extend({
      size: 'modal-md',
      center: false,
      animation: true,
      title: 'Modal Title',
      closeButton: true,
      header: true,
      initShow: false,
      headerhtml: '',
      bodyClass: '',
      footerClass: '',
      body: '',
      buttons: [],
      autoFocus: true,
      removeOnDismiss: false,
      url: '',
      ajaxSuccess:function(res,modal){},
      created: function() {},
      appended: function() {},
      onFormSubmit: function() {},
      modal: {}
    }, options);

    this.each(function() {
      i++;
      var id = 'ajax-modal-' + i,
          trigger_class = 'trigger--' + id,
          trigger_button = $('.' + trigger_class);

      $(this).addClass(trigger_class);

      // Get modal body
      let body = options.body;

      if(typeof body == 'object') {
        if(body.length) {
          let part = body;
          body = body.removeAttr('id').clone().removeClass('modal-part');
          part.remove();
        }else{
          body = '<div class="text-danger">Modal part element not found!</div>';
        }
      }

      // Modal base template
      var modal_template = '   <div class="modal'+ (options.animation == true ? ' fade' : '') +'" tabindex="-1" role="dialog" id="'+ id +'">  '  +
          '     <div class="modal-dialog '+options.size+(options.center ? ' modal-dialog-centered' : '')+'" role="document">  '  +
          '       <div class="modal-content">  '  +
          ((options.header == true) ?
              '         <div class="modal-header">  '  +
              '           <h5 class="modal-title">'+ options.title +'</h5>  '  +
              ((options.closeButton == true) ?
                  '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">  '  +
                  '             <span aria-hidden="true">&times;</span>  '  +
                  '           </button>  '
                  : '') +
              '         </div>  '
              : '') +
          options.headerhtml +
          '         <div class="modal-body">  '  +
          '         </div>  '  +
          (options.buttons.length > 0 ?
              '         <div class="modal-footer">  '  +
              '         </div>  '
              : '')+
          '       </div>  '  +
          '     </div>  '  +
          '  </div>  ' ;

      // Convert modal to object
      var modal_template = $(modal_template);

      // Start creating buttons from 'buttons' option
      var this_button;
      options.buttons.forEach(function(item) {
        // get option 'id'
        let id = "id" in item ? item.id : '';

        // Button template
        this_button = '<button type="'+ ("submit" in item && item.submit == true ? 'submit' : 'button') +'" class="'+ item.class +'" id="'+ id +'">'+ item.text +'</button>';

        // add click event to the button
        this_button = $(this_button).off('click').on("click", function() {
          // execute function from 'handler' option
          item.handler.call(this, modal_template);
        });
        // append generated buttons to the modal footer
        $(modal_template).find('.modal-footer').append(this_button);
      });

      // append a given body to the modal
      $(modal_template).find('.modal-body').append(body);

      // add additional body class
      if(options.bodyClass) $(modal_template).find('.modal-body').addClass(options.bodyClass);

      // add footer body class
      if(options.footerClass) $(modal_template).find('.modal-footer').addClass(options.footerClass);

      // execute 'created' callback
      options.created.call(this, modal_template, options);

      // modal form and submit form button
      let modal_form = $(modal_template).find('.modal-body form'),
          form_submit_btn = modal_template.find('button[type=submit]');

      // append generated modal to the body
      $("body").append(modal_template);

      // execute 'appended' callback
      options.appended.call(this, $('#' + id), modal_form, options);

      // if modal contains form elements
      if(modal_form.length) {
        // if `autoFocus` option is true
        if(options.autoFocus) {
          // when modal is shown
          $(modal_template).on('shown.bs.modal', function() {
            // if type of `autoFocus` option is `boolean`
            if(typeof options.autoFocus == 'boolean')
              modal_form.find('input:eq(0)').focus(); // the first input element will be focused
            // if type of `autoFocus` option is `string` and `autoFocus` option is an HTML element
            else if(typeof options.autoFocus == 'string' && modal_form.find(options.autoFocus).length)
              modal_form.find(options.autoFocus).focus(); // find elements and focus on that
          });
        }

        // form object
        let form_object = {
          startProgress: function() {
            modal_template.addClass('modal-progress');
          },
          stopProgress: function() {
            modal_template.removeClass('modal-progress');
          }
        };

        // if form is not contains button element
        if(!modal_form.find('button').length) $(modal_form).append('<button class="d-none" id="'+ id +'-submit"></button>');

        // add click event
        form_submit_btn.click(function() {
          modal_form.submit();
        });

        // add submit event
        modal_form.submit(function(e) {
          // start form progress
          form_object.startProgress();

          // execute `onFormSubmit` callback
          options.onFormSubmit.call(this, modal_template, e, form_object);
        });
      }
      if(options.initShow){
        let modal = $('#' + id).modal(options.modal);
        $.ymqajax({
          url: options.url,
          success: function (res) {
            options.ajaxSuccess(res,modal);
          },
          ymqtype: 'modal',
          dom: modal.find('.modal-body'),
        });
        // $.ajax({
        //   url: options.url,
        //   type: 'post',
        //   dataType: 'json',
        //   success: function (res) {
        //     options.ajaxSuccess(res,modal);
        //   },
        //   error: function () {
        //     modal.find('.modal-body').html('<img class="status-img" src="/svg/index/status.html?status=net-error">');
        //   }
        // });
        if(options.removeOnDismiss) {
          modal.on('hidden.bs.modal', function() {
            modal.remove();
          });
        }
        modal.on('hidden.bs.modal', function() {
          modal.find('.modal-body').html(options.body);
        });
        return false;
      }


      $(document).on("click", '.' + trigger_class, function() {
        let modal = $('#' + id).modal(options.modal);
        $.ymqajax({
          url: options.url,
          success: function (res) {
            options.ajaxSuccess(res,modal);
          },
          ymqtype: 'modal',
          dom: modal.find('.modal-body'),
        });
        // $.ajax({
        //     url: options.url,
        //     type: 'post',
        //     dataType: 'json',
        //     success: function (res) {
        //       console.log(res);
        //         options.ajaxSuccess(res,modal);
        //     },
        //     error: function () {
        //       modal.find('.modal-body').html('<img class="status-img" src="/svg/index/status.html?status=net-error">');
        //     }
        // });
        if(options.removeOnDismiss) {
          modal.on('hidden.bs.modal', function() {
            modal.remove();
          });
        }
        modal.on('hidden.bs.modal', function() {
          modal.find('.modal-body').html(options.body);
        });

        // setTimeout(function () {
        //   modal.find('.modal-body').html('我是ajax的数据')
        // }, 2000);

        return false;
      });
    });
  }
})(jQuery, this, 0);

(function($, window, i) {

})(jQuery, this, 0);

(function($, window, i) {

  // Bootstrap 4 Modal
  $.fn.fireModal = function(options) {
    var options = $.extend({
      size: 'modal-md',
      center: false,
      animation: true,
      title: 'Modal Title',
      closeButton: true,
      header: true,
      bodyClass: '',
      footerClass: '',
      body: '',
      buttons: [],
      initShow: false,
      upgrade:false,
      autoFocus: true,
      removeOnDismiss: false,
      created: function() {},
      appended: function() {},
      onFormSubmit: function() {},
      modal: {}
    }, options);

    this.each(function() {
      i++;
      var id = 'fire-modal-' + i,
        trigger_class = 'trigger--' + id,
        trigger_button = $('.' + trigger_class);

      $(this).addClass(trigger_class);

      // Get modal body
      let body = options.body;

      if(typeof body == 'object') {
        if(body.length) {
          let part = body;
          body = body.removeAttr('id').clone().removeClass('modal-part');
          part.remove();
        }else{
          body = '<div class="text-danger">Modal part element not found!</div>';
        }
      }

      // Modal base template
      var modal_template = '   <div class="modal'+ (options.animation == true ? ' fade' : '') + (options.upgrade == true ? ' upgrade-modal' : '') +'" tabindex="-1" role="dialog" id="'+ id +'">  '  +
                 '     <div class="modal-dialog '+options.size+(options.center ? ' modal-dialog-centered' : '')+'" role="document">  '  +
                 '       <div class="modal-content">  '  +
                 ((options.header == true) ?
                 '         <div class="modal-header">  '  +
                 '           <h5 class="modal-title">'+ options.title +'</h5>  '  +
                 ((options.closeButton == true) ?
                 '           <button type="button" class="close" data-dismiss="modal" aria-label="Close">  '  +
                 '             <span aria-hidden="true">&times;</span>  '  +
                 '           </button>  '
                 : '') +
                 '         </div>  '
                 : '') +
                 '         <div class="modal-body">  '  +
                 '         </div>  '  +
                 (options.buttons.length > 0 ?
                 '         <div class="modal-footer">  '  +
                 '         </div>  '
                 : '')+
                 '       </div>  '  +
                 '     </div>  '  +
                 '  </div>  ' ;

      // Convert modal to object
      var modal_template = $(modal_template);

      // Start creating buttons from 'buttons' option
      var this_button;
      options.buttons.forEach(function(item) {
        // get option 'id'
        let id = "id" in item ? item.id : '';

        // Button template
        this_button = '<button type="'+ ("submit" in item && item.submit == true ? 'submit' : 'button') +'" class="'+ item.class +'" id="'+ id +'">'+ item.text +'</button>';

        // add click event to the button
        this_button = $(this_button).off('click').on("click", function() {
          // execute function from 'handler' option
          item.handler.call(this, modal_template);
        });
        // append generated buttons to the modal footer
        $(modal_template).find('.modal-footer').append(this_button);
      });

      // append a given body to the modal
      $(modal_template).find('.modal-body').append(body);

      // add additional body class
      if(options.bodyClass) $(modal_template).find('.modal-body').addClass(options.bodyClass);

      // add footer body class
      if(options.footerClass) $(modal_template).find('.modal-footer').addClass(options.footerClass);

      // execute 'created' callback
      options.created.call(this, modal_template, options);

      // modal form and submit form button
      let modal_form = $(modal_template).find('.modal-body form'),
        form_submit_btn = modal_template.find('button[type=submit]');

      // append generated modal to the body
      $("body").append(modal_template);

      // execute 'appended' callback
      options.appended.call(this, $('#' + id), modal_form, options);

      // if modal contains form elements
      if(modal_form.length) {
        // if `autoFocus` option is true
        if(options.autoFocus) {
          // when modal is shown
          $(modal_template).on('shown.bs.modal', function() {
            // if type of `autoFocus` option is `boolean`
            if(typeof options.autoFocus == 'boolean')
              modal_form.find('input:eq(0)').focus(); // the first input element will be focused
            // if type of `autoFocus` option is `string` and `autoFocus` option is an HTML element
            else if(typeof options.autoFocus == 'string' && modal_form.find(options.autoFocus).length)
              modal_form.find(options.autoFocus).focus(); // find elements and focus on that
          });
        }

        // form object
        let form_object = {
          startProgress: function() {
            modal_template.addClass('modal-progress');
          },
          stopProgress: function() {
            modal_template.removeClass('modal-progress');
          }
        };

        // if form is not contains button element
        if(!modal_form.find('button').length) $(modal_form).append('<button class="d-none" id="'+ id +'-submit"></button>');

        // add click event
        form_submit_btn.click(function() {
          modal_form.submit();
        });

        // add submit event
        modal_form.submit(function(e) {
          // start form progress
          form_object.startProgress();

          // execute `onFormSubmit` callback
          options.onFormSubmit.call(this, modal_template, e, form_object);
        });
      }


      if(options.initShow){
        let modal = $('#' + id).modal(options.modal);
        if(options.removeOnDismiss) {
          modal.on('hidden.bs.modal', function() {
            modal.remove();
          });
        }
        return false;
      }
      $(document).on("click", '.' + trigger_class, function() {
        let modal = $('#' + id).modal(options.modal);
        if(options.removeOnDismiss) {
          modal.on('hidden.bs.modal', function() {
            modal.remove();
          });
        }
        return false;
      });
    });
  }


  // Bootstrap Modal Destroyer
  $.destroyModal = function(modal) {
    modal.modal('hide');
    modal.on('hidden.bs.modal', function() {
    });
  }

  // Card Progress Controller
  $.cardProgress = function(card, options) {
    var options = $.extend({
      dismiss: false,
      dismissText: 'Cancel',
      spinner: true,
      onDismiss: function() {}
    }, options);

    var me = $(card);

    me.addClass('card-progress');
    if(options.spinner == false) {
      me.addClass('remove-spinner');
    }

    if(options.dismiss == true) {
      var btn_dismiss = '<a class="btn btn-danger card-progress-dismiss">'+options.dismissText+'</a>';
      btn_dismiss = $(btn_dismiss).off('click').on('click', function() {
        me.removeClass('card-progress');
        me.find('.card-progress-dismiss').remove();
        options.onDismiss.call(this, me);
      });
      me.append(btn_dismiss);
    }

    return {
      dismiss: function(dismissed) {
        $.cardProgressDismiss(me, dismissed);
      }
    };
  }

  $.cardProgressDismiss = function(card, dismissed) {
    var me = $(card);
    me.removeClass('card-progress');
    me.find('.card-progress-dismiss').remove();
    if(dismissed)
      dismissed.call(this, me);
  }

  $.chatCtrl = function(element, chat) {
    var chat = $.extend({
      position: 'chat-right',
      text: '',
      time: moment(new Date().toISOString()).format('hh:mm'),
      picture: '',
      type: 'text', // or typing
      timeout: 0,
      onShow: function() {}
    }, chat);

    var target = $(element),
        element = '<div class="chat-item '+chat.position+'" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text">'+chat.text+'</div>' +
                  '<div class="chat-time">'+chat.time+'</div>' +
                  '</div>' +
                  '</div>',
        typing_element = '<div class="chat-item chat-left chat-typing" style="display:none">' +
                  '<img src="'+chat.picture+'">' +
                  '<div class="chat-details">' +
                  '<div class="chat-text"></div>' +
                  '</div>' +
                  '</div>';

      var append_element = element;
      if(chat.type == 'typing') {
        append_element = typing_element;
      }

      if(chat.timeout > 0) {
        setTimeout(function() {
          target.find('.chat-content').append($(append_element).fadeIn());
        }, chat.timeout);
      }else{
        target.find('.chat-content').append($(append_element).fadeIn());
      }

      var target_height = 0;
      target.find('.chat-content .chat-item').each(function() {
        target_height += $(this).outerHeight();
      });
      setTimeout(function() {
        target.find('.chat-content').scrollTop(target_height, -1);
      }, 100);
      chat.onShow.call(this, append_element);
  }
})(jQuery, this, 0);

