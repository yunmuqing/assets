"use strict";
$.extend({
  ymqajax : function(options){
    var url = options.hasOwnProperty("url") ? options.url : '';
    var type = options.hasOwnProperty("type") ? options.type : 'post';
    var async = options.hasOwnProperty("async") ? options.async : true;
    var data = options.hasOwnProperty("data") ? options.data : null;
    var dataType = options.hasOwnProperty("dataType") ? options.dataType : 'json';
    var isiziToast = options.hasOwnProperty("iziToast") ? options.iziToast : true;
    var iziToastType = options.hasOwnProperty("iziToastType") ? options.iziToastType : "show";
    var success = function(res){

      if (options.hasOwnProperty("ymqtype") && options.ymqtype == 'modal' &&
        options.hasOwnProperty("dom")){
        if (res.code == 0){
          options.dom.html('<img class="status-img" src="/svg/index/status.html?status=net-error">');
        }else if (res.code == 201){
          options.dom.html('<img class="status-img" src="/svg/index/status.html?status=no-data">');

        }else if (res.code == 1) {
          
        }
        if (options.hasOwnProperty("success")) {
          options.success(res);
        }
      }else{

        if (options.isiziToast) {
          if (options.iziToastType == 'show') {
            iziToast.show({
              message: res.msg,
              position: 'bottomCenter'
            });
          }else if(options.iziToastType == 'success'){
            iziToast.success({
              message: res.msg,
              position: 'topCenter'
            });
          }
          
        }
        
        if (options.hasOwnProperty("success")) {
          options.success(res);
        }
      }
    }
    var error = function(xhr, textStatus, errorThrown){
      if (options.hasOwnProperty("ymqtype") && options.ymqtype == 'modal' &&
        options.hasOwnProperty("dom")){
        options.dom.html('<img class="status-img" src="/svg/index/status.html?status=500">');
      }else{

      }
    }
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: dataType,
      async: async,
      success: function (res) {
        success(res)
      },
      error: function(xhr, textStatus, errorThrown){
        error(xhr, textStatus, errorThrown);
      }
    });
  }
});