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
					// if(response.success){
						
						// $('.'+current_class+' input[name="amount[]"]').val(response.amount);
						// let sum_amount = $("input[id='amount']").map(function(){return parseFloat($(this).val());}).get();
						// $("#process_to_paid").html(sum_amount.reduce((a, b) => a + b));
					// }
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


$('.product-category').change(function() {
	
	window.location.href= "?cat_id="+$(this).val();
	// console.log();
	
});