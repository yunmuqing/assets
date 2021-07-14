
'use strict';

$(function() {



	$("input[type='password'][data-eye]").each(function(i) {
		var $this = $(this),
			id = 'eye-password-' + i,
			el = $('#' + id);

		$this.wrap($("<div/>", {
			style: 'position:relative',
			id: id
		}));

		$this.css({
			paddingRight: 60
		});
		$this.after($("<div/>", {
			html: 'Show',
			class: 'btn btn-primary btn-sm',
			id: 'passeye-toggle-'+i,
		}).css({
			position: 'absolute',
			right: 10,
			top: ($this.outerHeight() / 2) - 12,
			padding: '2px 7px',
			fontSize: 12,
			cursor: 'pointer',
		}));

		$this.after($("<input/>", {
			type: 'hidden',
			id: 'passeye-' + i
		}));

		var invalid_feedback = $this.parent().parent().find('.invalid-feedback');

		// if(invalid_feedback.length) {
		// 	$this.after(invalid_feedback.clone());
		// }

		$this.on("keyup paste", function() {
			$("#passeye-"+i).val($(this).val());
		});
		$("#passeye-toggle-"+i).on("click", function() {
			if($this.hasClass("show")) {
				$this.attr('type', 'password');
				$this.removeClass("show");
				$(this).removeClass("btn-outline-primary");
			}else{
				$this.attr('type', 'text');
				$this.val($("#passeye-"+i).val());
				$this.addClass("show");
				$(this).addClass("btn-outline-primary");
			}
		});
	});

	$(".my-login-validation").submit(function() {
		var form = $(this);
		var submit = form.find('.do-submit');

		var email = $('#email').val();
		var password = $('#password').val();
		var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(!reg.test(email)){
			$('#email').addClass('error').parents('.form-group').find('.invalid-feedback').show();
			return false;
		}else{
			$('#email').removeClass('error').parents('.form-group').find('.invalid-feedback').hide();
		}

		if (password == ''){
			$('#password').addClass('error').parents('.form-group').find('.invalid-feedback').show();
			return false;
		}else{
			$('#password').removeClass('error').parents('.form-group').find('.invalid-feedback').hide();
		}

		if (submit.hasClass('disabled')){
			return false;
		}
		submit.addClass('disabled').addClass('btn-progress');

		$.ajax({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: form.serialize(),
			success: function (res) {
				if (res.code == 0){
					iziToast.error({
						message: res.msg,
						position: 'bottomCenter'
					});
					submit.removeClass('disabled').removeClass('btn-progress');
				}
				if (res.code == 1){
					window.location.href = "/auth/login.html";
				}
			},
			error: function (jqXHR) {
				submit.removeClass('disabled').removeClass('btn-progress');
			}
		});
		return false;
	});

});
