$(document).ready(function () {
  	$(document).on('click', '.delete_tem', function () {
        
        $(this).addClass('btn-progress');
        that = $(this);
        available_option = [];
        $(this).fireModal({
            title: 'Delete Option templete',
            body: `After the template is deleted, the template information in all products that reference the template(Only quote type) will be deleted, please operate with caution.`,
            center: true,
            initShow: true,
            removeOnDismiss:true,
            buttons: [
                {
                    text: 'Delete',
                    class: 'btn btn-danger btn-primary delete_templete',
                    handler: function(modal) {
                    	$('.delete_templete').addClass('btn-progress');
                        $.ajax({
					        type: 'POST',
					        url: '/api/tem/delete',
					        dataType: 'json',
					        data: {id:that.data('id')},
					        success: function (res) {
					        	that.parent().parent().parent().parent().remove();
					        	$('.delete_templete').removeClass('btn-progress');
					          	that.removeClass('btn-progress');
					        },
					        error: function (jqXHR) {
					            that.removeClass('btn-progress');
					            $('.delete_templete').removeClass('btn-progress');
					        }
					    });
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
    })
})