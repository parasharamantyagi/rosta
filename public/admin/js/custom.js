var toastr = {
  success : function(success_message,delayTime = 3000) {
    $.toast({
          heading             : 'Success',
          text                : success_message,
          loader              : true,
          loaderBg            : '#fff',
          showHideTransition  : 'fade',
          icon                : 'success',
          hideAfter           : delayTime,
          position            : 'top-right'
      });
  },
  error : function(error_message,delayTime = 3000) {
    $.toast({
          heading             : 'Error',
          text                : error_message,
          loader              : true,
          loaderBg            : '#fff',
          showHideTransition  : 'fade',
          icon                : 'error',
          hideAfter           : delayTime,
          position            : 'top-right'
      });
  }
}

function deleteData(id,action){
	if(confirm('Are you sure to delete this ..??')){
		
		$.ajax({
				type: 'POST',
				url: '/admin/delete-data',
				dataType: 'json',
				data: {
						_token: $('meta[name="csrf-token"]').attr('content'),
						id:id,
						action:action
				},
				success: function (response) {
					
					toastr.success(response.message,response.delayTime);
					if(response.url)
					{
						if(response.delayTime)
							setTimeout(function() { window.location.href=response.url;}, response.delayTime);
						else
							window.location.href=response.url;
					}
				}
			});
	}
}

function deleteButton(id,action){
	if(confirm('Are you sure to delete this ..??')){
		$.ajax({
				type: 'delete',
				url: action+'/'+id,
				success: function (response) {
					
					toastr.success(response.message,response.delayTime);
					if(response.url)
					{
						if(response.delayTime)
							setTimeout(function() { window.location.href=response.url;}, response.delayTime);
						else
							window.location.href=response.url;
					}
				}
			});
	}
}

function editData(id,action){
	
	window.location.href=action+'/'+id;
}

$('select[name="changeStatus"]').change(function() {
	let id = $(this).data("id");
	let type = $(this).data("type");
	let value = $(this).val();
	$.ajax({
			type: 'POST',
			url: '/admin/change-configration',
			dataType: 'json',
			data: {
					id:id,
					type:type,
					value:value
			},
			success: function (response) {
				
			}
		});
});

$('.toggle-switch').click(function() {
	let cat_id = $(this).data("id");
	let type = $(this).data("type");
	let is_check = 0;
	if ($(this).is(':checked')) {
		is_check = 1;
    }
	$.ajax({
			type: 'POST',
			url: '/admin/change-status',
			dataType: 'json',
			data: {
					_token: $('meta[name="csrf-token"]').attr('content'),
					id:cat_id,
					type:type,
					is_check:is_check
			},
			success: function (response) {
				
			}
		});
});


$('button[class="btn btn-ctl-bt waves-effect waves-light m-r-10 social-text-save"]').click(function () {
	let conf_id = $(this).data('id');
	let value = $('.socialInfo_name_'+conf_id).val();
	$.ajax({
      type: 'POST',
      url: '/admin/social-info',
      dataType: 'json',
      data: {
        id: conf_id,
        value: value,
      },
      success: function (response) {
        toastr.success(response.message, response.delayTime);
        if (response.url) {
          if (response.delayTime)
            setTimeout(function () {
              window.location.href = response.url;
            }, response.delayTime);
          else window.location.href = response.url;
        }
      },
    });
});
	
$('button[class="btn btn-ctl-bt waves-effect waves-light m-r-10 text-save"]').click(function () {
    let conf_id = $(this).data('id');
    let conf_val = $('.custom_text_' + conf_id).val();
    $.ajax({
      type: 'POST',
      url: '/admin/change-configration',
      dataType: 'json',
      data: {
        id: conf_id,
        type: 'configuration',
        value: conf_val,
      },
      success: function (response) {
        toastr.success(response.message, response.delayTime);
        if (response.url) {
          if (response.delayTime)
            setTimeout(function () {
              window.location.href = response.url;
            }, response.delayTime);
          else window.location.href = response.url;
        }
      },
    });
  },
);

 $('.image_link_plus').click(function () {
	 let index_val = 2;
   let my_html = '<div class="row image_link_multi_minus">';
   my_html += '<div class="col-md-6 form-group">';
	 my_html += '<div class="form-border">';
	 my_html += '<input type="button" class="btn btn-light" data-id="image_link_'+index_val+'" value="Choose File">';
	 my_html += '<span class="image_link_' + index_val + '"></span>';
   my_html +=
     '<input class="form-control image_link_'+index_val+'"  name="image_link[]" type="file" aria-invalid="false" style="display: none" />';
   my_html += '</div></div><div class="col-md-6 form-group">';
   my_html +=
     '<button type="button" class="btn btn-ctl-bt waves-effect waves-light image_link_minus"><i class="fa fa-minus"></i></button>';
   my_html += '</div></div>';
   $('.image_link_multi_plus').after(my_html);
	 index_val++;
 });

function readNAME(input, id) {
  if (input.files && input.files[0]) {
    $("span[class='" + id + "']").text(input.files[0].name);
  }
}

$(document).on('click', 'input[class="btn btn-light"]', function () {
	let current_btn_id = $(this).data('id');
	console.log(current_btn_id);
   $('input[class="form-control '+current_btn_id+'"]').click();
});

$(document).on('change', 'input[type="file"]', function () {
	let cus_class = $(this).attr('class');
  readNAME(this, cus_class.slice(13));
});

 $(document).on('click', '.image_link_minus', function () {
   $(this).parent('div').parent('div').remove();
 });

$('.product-category').change(function() {
	
	window.location.href= "?cat_id="+$(this).val();
	// console.log();
	
});