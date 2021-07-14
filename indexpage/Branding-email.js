$(document).ready(function () {
   
    //获取
    function get_suffix(filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }
    function random_string(len) {
    　　len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }    

    
    var HelloButton = function (context) {
      var ui = $.summernote.ui;
     
      // create button
      var button = ui.button({
        contents: 'Button',
        tooltip: 'hello',
        click: function () {
            console.log($(":focus").attr('class'))
            $(this).fireModal({
                title: 'Add button',
                body: `
                  <div class="button_form">
                   <div class="form-group note-form-group">
                    <label class="note-form-label">Text to display</label>
                    <input class="button_text form-control" type="text" />
                   </div>
                   <div class="form-group note-form-group">
                    <label class="note-form-label">To what URL should this link go?</label>
                    <input class="button_url form-control" type="text" value="" />
                   </div>
                   <div class="space-between pt-0">
                        <div class="pr-2">
                            <div class="form-group">
                                <label class="f-14">Button width</label>
                                <div class="">
                                    <input class="button_width" type="number" class="form-control" name="width" value="190" data-bv-field="width">
                                </div>
                            </div>
                        </div>
                        <div class="pl-2">
                            <div class="form-group">
                                <label class="f-14">Button height</label>
                                <div class="">
                                    <input class="button_height" type="number" class="form-control" name="height" value="50" data-bv-field="height">
                                </div>

                            </div>
                        </div>
                        <div class="pl-2">
                            <div class="form-group">
                                <label class="f-14">Font size</label>
                                <div class="">
                                    <input class="button_font_size" type="number" class="form-control" name="font_size" value="16" data-bv-field="font_size">
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="space-between pt-0">
                        <div class="w-50 pr-2">
                            <div class="form-group">
                                <label class="f-14">Color</label>
                                <div class="color-box pointer">
                                    <div class="color-btn"></div>
                                    <input data-hsl="true" data-dmo=".wizard-steps .wizard-step.wizard-step-active" data-css="background" name="banner-color" value="#6568FE" type="text" class="button_b_color form-control colorpickerinput colorpicker-element" data-colorpicker-id="1" data-original-title="" title="">
                                </div>
                            </div>
                        </div>
                        <div class="w-50 pl-2">
                            <div class="form-group">
                                <label class="f-14">Font</label>
                                <div class="color-box pointer">
                                    <div class="color-btn"></div>
                                    <input data-dmo=".wizard-steps .wizard-step.wizard-step-active" data-css="color" name="banner-font" value="#FFFFFF" type="text" class="button_text_color form-control colorpickerinput colorpicker-element" data-colorpicker-id="1" data-original-title="" title="">
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="form-check sn-checkbox-open-in-new-window">
                        <label class="form-check-label"> <input role="checkbox" type="checkbox" class="btn_checked form-check-input" checked="" aria-label="Open in new window" aria-checked="true" /> Open in new window</label>
                    </div>
                  </div>
                `,
                removeOnDismiss:true,
                center: true,
                initShow: true,
                buttons: [
                    {
                        text: 'Insert button',
                        class: 'btn btn-primary insert_button',
                        handler: function(modal) {
                            if ($('.button_url').val() == '') {
                               var a_html = ``;
                            }else{
                                if ($('.btn_checked').is(':checked')) {
                                  var a_html = `href="${$('.button_url').val()}" target="_blank"`;
                                }else{
                                  var a_html = `href="${$('.button_url').val()}"`;
                                }
                                
                            }
                            var pushHtml = `aaaa`
                            modal.modal('hide');

                            //$('.email').summernote('focus');
                            var range = $('#summernote').summernote('createRange');
                            console.log(range)
                            //$('.email').summernote('editor.pasteHTML', pushHtml);
                            
                        }
                    },
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');

                        }
                    }
                ]
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
                $(document).on('focus','.colorpickerinput',function(){
                    var that = $(this);
                    var pickDom = $("#"+$(this).attr("aria-describedby"));
                    pickDom.find('.form-control').val($(this).val()).bind('input propertychange',function () {
                        that.val($(this).val());
                        that.trigger('change');
                    });
                });
                $(document).on('change','.colorpickerinput',function(){
                    $(this).prev('.color-btn').css('background-color',$(this).val());
                });
          //$('.email').summernote('editor.insertText', 'hello');
        }
      });
     
      return button.render();   // return button as jquery object 
    }
//     $('.email').summernote({
//         fontSizes: ['12', '14','16', '18','20','20', '24','26','28','30','32', '36', '40','48' , '64'],
//         lineHeights: ['0.5', '0.8','1.0', '1.2','1.4','1.5', '1.6','1.8','2.0','2.5','3.0'],
//         toolbar: [
//             ['style', ['style']],
//             ['fontface', ['fontname','color','fontsize']],//字体
//             ['font', ['bold', 'italic', 'superscript', 'subscript', 'strikethrough','underline', 'clear']],
//             ['fontname', ['fontname']],
//             ['para', ['ul', 'ol', 'paragraph']],
//             ['height', ['height']],
//             ['table', ['table']],
//             ['insert', ['link', 'picture', 'hr']],
//             ['view', ['fullscreen', 'codeview']],
//             ['help', ['help']],
//             ['mybutton', ['hello']]
//         ],
//         popover: {
//           image: [
//             ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
//             ['float', ['floatLeft', 'floatRight', 'floatNone']],
//             ['remove', ['removeMedia']],
//             ['link', ['linkDialogShow', 'unlink']]
//           ],
//           link: [
//             ['link', ['linkDialogShow', 'unlink']]
//           ],
//           table: [
//             ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
//             ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
//           ],
//           air: [
//             ['color', ['color']],
//             ['font', ['bold', 'underline', 'clear']],
//             ['para', ['ul', 'paragraph']],
//             ['table', ['table']],
//             ['insert', ['link', 'picture']]
//           ]
//         },
//         buttons: {
//             hello: HelloButton
//         },
//         focus: true,
//         minHeight: 500,
//         callbacks: {
//             // onImageUpload callback
//             onImageUpload: function(files) {
//                 var size = files[0].size;
//                 if (size > 5*1024*1024) {
//                     iziToast.error({
//                         message: '不得超过5M',
//                         position: 'bottomCenter'
//                     });
//                 }else{
//                     $.ajax({
//                         type : "POST",
//                         dataType: "json",
//                         url : "/api/ossapi/gettoken",
//                         data : '',
//                         success : function(result) {
//                             var ossData = result.data;
//                             console.log(ossData)
//                             var formData = new FormData();
//                             var img_name = ossData.dir+random_string(10)+get_suffix(files[0].name)
                            
//                             formData.append('name', img_name);
//                             formData.append('key', img_name);
//                             formData.append('policy', ossData.policy);
//                             formData.append('OSSAccessKeyId', ossData.accessid);
//                             formData.append('success_action_status', '200');
//                             formData.append('callback', ossData.callback);
//                             formData.append('signature', ossData.signature);
//                             formData.append('file', files[0]);
                            
//                             console.log(ossData.host)
//                             console.log(img_name)
//                             $.ajax({
//                                 url:ossData.host,
//                                 type:"post",
//                                 data: formData,
//                                 contentType: false,
//                                 processData: false,
//                                 success: function(data) {
//                                     $('.email').summernote('insertImage', ossData.host+'/'+img_name);
//                                 },
//                                 error:function(data) {
//                                     alert("上传失败")
//                                 }
//                             });
//                         },
//                         //请求失败，包含具体的错误信息
//                         error : function(e){
                            
//                         }
//                     });
//                 }
                
                
//             }     
//         }
//     });


    var form_data = $('#defaultForm').serialize();


    
    $('#defaultForm').bootstrapValidator({
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Must not be empty'
                    }
                }
            }
        }
    }).on("success.form.bv",function(e){
        $('.save,.creat').addClass('btn-progress');
        console.log($('#defaultForm').serialize())
        $.ajax({
            //请求方式
            type : "POST",
            dataType: "json",
            //请求地址
            url : "/api/branding/saveemail",
            //数据，json字符串
            data : $('#defaultForm').serialize(),
            //请求成功
            success : function(result) {

                if (result.code == 1) {
                    iziToast.show({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }else if(result.code == 0){
                    iziToast.error({
                        message: result.msg,
                        position: 'bottomCenter'
                    });
                }
                $('.save').removeClass('btn-progress');
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                $('.save').removeClass('btn-progress');
            }
        });
        return false;
    });

    
    // if ($(".save").length > 0) {
    //     $('form').bootstrapValidator('disableSubmitButtons', true);
    // }
});