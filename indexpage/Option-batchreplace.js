$(document).ready(function () {
    $(document).on('click', '.replace_btn', function () {
      var that = $(this);
      var type = that.data('type');
      var replace_data = {};

      replace_data['original'] = $('.replace'+type+' .original').val();
      replace_data['replace'] = $('.replace'+type+' .replace').val();
      replace_data['product'] = $('.product').val();
      replace_data['type'] = type;
      type
      if (Number(type) == 3) {
        replace_data['option_value_title'] = $('.replace'+type+' .option_value_title').val();
      }else if(Number(type) == 4){
        replace_data['option_value_title'] = $('.replace'+type+' .option_value_title').val();
        console.log($('.replace'+type+' .original:checked').length)
        if (!$('.replace'+type+' .original').is(":checked")) {
                replace_data['original'] = 0;
            }else{
              replace_data['original'] = 1;
            }
        if (!$('.replace'+type+' .replace').is(":checked")) {
                replace_data['replace'] = 0;
            }else{
              replace_data['replace'] = 1;
            }
      }
      
      console.log(replace_data);
        that.addClass('btn-progress');
      $.ajax({
          type: 'POST',
          url: '/api/option/batchreplace',
          dataType: 'json',
          data: replace_data,
          success: function (res) {
            console.log(res); 
            that.removeClass('btn-progress');
            iziToast.show({
                message: "Success",
                position: 'bottomCenter' 
            });
          },
          error: function (jqXHR) {
            iziToast.show({
                message: "Unknown error please try again",
                position: 'bottomCenter' 
            });
              that.removeClass('btn-progress');
          }
      });
    });
})
