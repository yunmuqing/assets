"use strict";


(function($, window, i) {
  $.fn.ymqDropdown = function(options) {

    var options = $.extend({
      text: '',
      noData: 'no data',
      item:[],
      noAutoWidth: false,
      checkbox: false,
      selectedValue: [],
      date: false,
      radio: false,
      noActiveClass: false,
      change: function (res) {}
    }, options);
    this.each(function() {
      var that = $(this);

      i++;
      if ($(this).hasClass('inited')){
        return true;
      }
      $(this).addClass('inited');
      var input = null;
      var dateInput = null;
      if($(this).children('input').length) {
        input = $(this).children('input');
      }
      if(options.date){
        $(this).append('<input class="date-input" type="hidden" value="">');
        dateInput = $(this).children('.date-input');
      }
      if (options.date){
        options.startDate = null;
        options.endDate = null;
      }
      if (options.date && options.selectedValue.length > 0 && ['1','2','3','4'].indexOf(options.selectedValue.join(',')) == -1){
        var date = options.selectedValue.join(',');
        date = date.split('_');
        if (date.length == 2){
          options.startDate = date[0];
          options.endDate = date[1];
        }else{
          options.startDate = options.endDate = date[0];
        }
      }else{
        options.selected = [];
        options.selectedText = [];
        if (!options.selectedValue.length == 0){
          var unique = [];
          options.item.forEach(function (value,index) {
            var i = options.selectedValue.indexOf(value['value'].toString());
            if (i > -1){
              options.selected.push(index.toString());
              unique.push(value['value'].toString());
            }
          });
          console.log(options.selectedValue);
          options.selectedValue = unique;
        }
      }




      if (input){
        input.val(options.selectedValue.join(','));
      }

      options.itemKey = options.item.length == 0 ? null : options.item[0]['key'];

      var html = `
         <div class="ymq-dropdown ${options.noAutoWidth ? '' : 'dropdown'}">
            <button class="btn btn-outline-ymq dropdown-toggle ${options.itemKey == 'sort' ? 'dropdown-toggle-no-icon' : ''}" id="dropdown-toggle-${i}" type="button" data-toggle="dropdown">
                    ${options.itemKey == 'sort' ? '<svg style="width: 20px;height: 20px;" viewBox="0 0 20 20" class="icon" focusable="false" aria-hidden="true"><path d="M5.293 2.293a.997.997 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L7 5.414V13a1 1 0 1 1-2 0V5.414L3.707 6.707a1 1 0 0 1-1.414-1.414l3-3zM13 7a1 1 0 0 1 2 0v7.585l1.293-1.292a.999.999 0 1 1 1.414 1.414l-3 3a.997.997 0 0 1-1.414 0l-3-3a.997.997 0 0 1 0-1.414.999.999 0 0 1 1.414 0L13 14.585V7z"></path></svg>' : ''}
                   ${options.text == '' ? options.selectedText.join(',') : options.text}
            </button>
            <div ${options.noAutoWidth ? 'style="width: '+options.noAutoWidth+';min-width: unset;"' : ''} data-stopPropagation="true" class="dropdown-menu ${options.date ? 'dropdown-date-menu' : ''}">
         `;
      if (options.item.length == 0){
        html += `<span class="ymq-dropdown-item ${options.noActiveClass ? 'ymq-dropdown-item-no-active' : ''} active nodata">${options.noData}</span>`;
      }else{
        options.item.forEach(function (value,key) {
          html += `<span data-index="${key}" data-value="${value['value']}" class="ymq-dropdown-item ${options.noActiveClass ? 'ymq-dropdown-item-no-active' : ''} ${value['class'] ? value['class'] : ''} ${options.selectedValue.indexOf(value['value'].toString()) == -1 ? '' : 'active'}">${value['text']}${options.itemKey == 'sort' ? (value['sort'] == 'desc' ? '<span class="sort desc"><svg style="width: 20px;height: 20px;" viewBox="0 0 20 20" class="icon" focusable="false" aria-hidden="true"><path d="M5.293 2.293a.997.997 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L7 5.414V13a1 1 0 1 1-2 0V5.414L3.707 6.707a1 1 0 0 1-1.414-1.414l3-3zM13 7a1 1 0 0 1 2 0v7.585l1.293-1.292a.999.999 0 1 1 1.414 1.414l-3 3a.997.997 0 0 1-1.414 0l-3-3a.997.997 0 0 1 0-1.414.999.999 0 0 1 1.414 0L13 14.585V7z"></path></svg></span>' : '<span class="sort asc"><svg style="width: 20px;height: 20px;" viewBox="0 0 20 20" class="icon" focusable="false" aria-hidden="true"><path d="M5.293 2.293a.997.997 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L7 5.414V13a1 1 0 1 1-2 0V5.414L3.707 6.707a1 1 0 0 1-1.414-1.414l3-3zM13 7a1 1 0 0 1 2 0v7.585l1.293-1.292a.999.999 0 1 1 1.414 1.414l-3 3a.997.997 0 0 1-1.414 0l-3-3a.997.997 0 0 1 0-1.414.999.999 0 0 1 1.414 0L13 14.585V7z"></path></svg></span>') : ''}</span>`;
        });
      }
      if (options.date){
        html += `
             <div class="daterangepicker-box" id="daterangepicker-box-${i}"></div>
        `;
      }
      html += `
            </div>
        </div>
      `;
      $(this).append(html);

      if (options.date){


        var picker = dateInput.datepicker({
          range: true,
          maxDate: new Date(),
          dateFormat: 'yyyy-mm-dd',
          multipleDatesSeparator: ',',
          parentEl: $(`#daterangepicker-box-${i}`),
          inline: false,
          onApply: function (date) {
            that.find('.ymq-dropdown-item.active').removeClass('active');
            var text = [],
                value   = [];
            date.forEach(function (val) {
              text.push(dateInput.data('datepicker').formatDate('M dd',val));
              value.push(dateInput.data('datepicker').formatDate('yyyy-mm-dd',val));
            });
            // console.log(text.join("-"),value.join(','));
            options.selected = [];
            options.selectedValue = [value.join('_')];
            options.selectedText = [text.join("-")];
            change();
          }
        });
        if (options.startDate){
          picker.data('datepicker').selectDates(new Date(options.startDate),new Date(options.endDate))
        }
        $(`#daterangepicker-box-${i}`).on("click",function (e) {
          e.stopPropagation();
        });
      }
      

      $(this).find('.ymq-dropdown-item').on('click',function (e) {
        if ($(this).hasClass('disabled')){
          return false;
        }
        if (options.checkbox){
          $(this).toggleClass('active');
          changeSelect(options.item[$(this).data('index')],$(this).data('index'));
          if (input){
            input.val(options.selectedValue.join(','));
          }
          e.stopPropagation();
        }else{
          if (!$(this).hasClass('active')){
            that.find('.ymq-dropdown-item.active').removeClass('active');
            $(this).addClass('active');
            options.selected = [$(this).data('index').toString()];
            options.selectedValue = [options.item[$(this).data('index')]['value'].toString()];
            options.selectedText = [options.item[$(this).data('index')]['text'].toString()];
            if (input){
              input.val(options.selectedValue.join(','));
            }
            if (options.text == ''){
              that.find('.dropdown-toggle').html(options.selectedText.join(','));
            }
            if (options.date){
              $.proxy(dateInput.data('datepicker').clear(), dateInput.data('datepicker'));
            }
          }else{
            if (options.radio){
              $(this).removeClass('active');
              options.selected = [];
              options.selectedValue = [];
              options.selectedText = [];
              if (input){
                input.val('');
              }
              if (options.text == ''){
                that.find('.dropdown-toggle').html(options.selectedText.join(','));
              }
              if (options.date){
                $.proxy(dateInput.data('datepicker').clear(), dateInput.data('datepicker'));
              }
            }
          }
        }


        change();
      });
      
      function change() {
        options.change({
          key: options.item[0]['key'],
          index: options.selected,
          value: options.selectedValue,
          text: options.selectedText,
        });
      }
      
      function changeSelect(item,index) {
        var indexselect = options.selected.indexOf(index.toString());
        if (indexselect == -1){
          options.selected.push(index.toString());
        }else{
          options.selected.splice(indexselect, 1);
        }
        var indexvalue = options.selectedValue.indexOf(item['value'].toString());
        if (indexvalue == -1){
          options.selectedValue.push(item['value'].toString());
        }else{
          options.selectedValue.splice(indexvalue, 1);
        }
        var indextext = options.selectedText.indexOf(item['text'].toString());
        if (indextext == -1){
          options.selectedText.push(item['text'].toString());
        }else{
          options.selectedText.splice(indextext, 1);
        }
      }


    });
  }





})(jQuery, this, 0);

$(document).ready(function () {
  $('.header-dropdown .dropdown-menu').click(function(e) {
    e.stopPropagation();
    return false;
  });
  //修改模块统一js
    $(".setting_status_change").click(function(){
        var that = $(this)
        that.addClass('btn-progress');
        if (that.data('status')) {
          var now_status = 0;
          var now_status_text = 'disabled'
        }else{
          var now_status = 1;
           var now_status_text = 'enabled'
        }
        
        $.ymqajax({
            url: " /api/branding/setting",
            data: {status:now_status,branding_father:that.data('father')},
            success: function (res) {
                iziToast.show({
                    message: "Status updated",
                    position: 'bottomCenter' 
                });
                that.data('status',now_status)
                if (that.hasClass('btn-secondary')) {
                  that.text('Enabled')
                  that.removeClass('btn-secondary')
                  that.addClass('btn-primary')
                }else{
                  that.text('Disabled')
                  that.addClass('btn-secondary')
                  that.removeClass('btn-primary')
                }
                if (that.prev('span').children('span').hasClass('badge-secondary')) {
                  that.prev('span').children('span').removeClass('badge-secondary')
                  that.prev('span').children('span').addClass('badge-success')
                }else{
                  that.prev('span').children('span').addClass('badge-secondary')
                  that.prev('span').children('span').removeClass('badge-success')
                }
                that.prev('span').children('span').text(now_status_text)
                that.removeClass('btn-progress');
            }
        });
    })
})