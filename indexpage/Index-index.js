$(document).ready(function () {
    var reviews_product_id = null;
    $(".ajax-modal").each(function () {
        var that = $(this);
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
                        reviews_product_id = null;
                        modal.modal('hide');
                    }
                },
                {
                    text: 'Choose',
                    class: 'btn btn-primary btn-shadow disabled',
                    handler: function(modal) {
                        if (!$(this).hasClass('disabled')){
                            $(this).addClass('btn-progress')
                            var url = `https://${window.location.host}/index/option/edit/id/${reviews_product_id['id']}.html`
                            window.location.href = url;
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
    function showHtml(res,modal,that) {
        var pushHtml = '<ul class="list-group list-group-flush content-ul y-scroll">';
        var data = Object.values(res.data);
        var id = -1;
        console.log(res,data);
        if (reviews_product_id){
            id = reviews_product_id['id'];
        }
        data.forEach(function (item) {

            pushHtml += `
                        <li class="list-group-item">
                            <div class="custom-control custom-checkbox">
                              <input type="checkbox" ${id == item['id'] ? 'checked' : '' } name="product" value="${item['id']}" class="custom-control-input shopify-checkbox" id="product-${item['id']}" data-image="${item['image']}" data-title="${item['title']}" data-sid="${item['sid']}" >
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
        // modal.find('.content-ul').niceScroll();


    }
    $(document).on('click', ".shopify-checkbox",function(){
        var name = $(this).attr('name');
        $.each($(`input[name='${name}']`),function(){
            $(this).prop("checked",false);
        });
        $(this).prop("checked",true);
        reviews_product_id = {};
        reviews_product_id['id'] = $(this).val();
        reviews_product_id['image'] = $(this).attr('data-image');
        reviews_product_id['title'] = $(this).attr('data-title');
        if (reviews_product_id != null){
            $(this).parents('.modal-content').find('.modal-footer .btn-primary').removeClass('disabled');
        }else{
            $(this).parents('.modal-content').find('.modal-footer .btn-primary').addClass('disabled');
        }
    });


});