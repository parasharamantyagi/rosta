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
$(document).ready(function ()
{
    var minPhoneLen = 10;
    var maxPhoneLen = 15;
    $.validator.addMethod("noSpace", function(value, element,param)
    {
      return $.trim(value).length >= param;
    }, "No space please and don't leave it empty");
    $.validator.addMethod("valueNotEquals", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "This field is required"),
    $.validator.addMethod('minStrict', function (value, el, param) {
      return value > param;
    },"Rate should be greater then 0.00"),
    $.validator.addMethod('notStartZero', function (value, el, param) {
      return value.search(/^0/) == -1;
    },"Number should not starts with 0.");
    $.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "This field is required"),
    $.validator.addMethod("lettersonly", function(value, element)
    {
      return this.optional(element) || /^[a-z," "]+$/i.test(value);
    }, "Numbers are not allowed in this field.");

    /**
     *  Form Validations
     */
    $("#general_form").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
    // When have 2 form on same page
    $("#general_form_2").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
    
    // Agent Availabilty Status
    $("#agent_availabity_form").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
	
	$("#upload_invoice_mission").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
	

    // Customer notification form
    $("#customer_notification_form").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
	
	$("#general_form_bank").validate({
      errorClass   : "has-error",
      highlight    : function(element, errorClass) {
        $(element).parents('.form-group').addClass(errorClass);
      },
      unhighlight  : function(element, errorClass, validClass) {
        $(element).parents('.form-group').removeClass(errorClass);
      },
      rules:{
      },
      messages:{
      },
      submitHandler: function (form)
      {
        formSubmit(form);
      }
    });
    
});






function formSubmit(form)
{
    $.ajax({
        url         : form.action,
        type        : form.method,
        //data        : $(form).serialize(),
        data        : new FormData(form),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        contentType : false,
        cache       : false,
        processData : false,
        dataType    : "json",
        beforeSend  : function () {
            $("input[type=submit]").attr("disabled", "disabled");
            $("#preloader").show();
        },
        complete: function () {
            $("#preloader").hide();
            $("input[type=submit]").removeAttr("disabled");
            $("button[type=submit]").removeAttr("disabled");
        },
        success: function (response) {
            $("#preloader").hide();
            $("input[type=submit]").removeAttr("disabled");
            var delayTime=0;
            $.toast().reset('all');
            if(response.delayTime){
                delayTime = response.delayTime;
            }
            if (response.success)
            {
                toastr.success(response.message,delayTime)
                if( response.updateRecord)
                {
                    $.each(response.data, function( index, value )
                    {
                        $(document).find('#tableRow_'+response.data.id).find("td[data-name='"+index+"']").html(value);
                    });
                }
                if( response.addRecord)
                {
                    $.each(response.data, function( index, value )
                    {
                        $("input[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("input[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');

                        $("select[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("select[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');
                    });
                }
				
				if(response.modelShow){
					$('#myModal').addClass("fade");
					// $('input[name="report_id"]').val(response.report_id.id);
					setTimeout(function(){
						$('#myModal').modal("show");
					  }, 1);
				}
				
                if (response.modelhide) {
                    
                    if (response.delay)
                        setTimeout(function (){ $(response.modelhide).modal('hide') },response.delay);
                    else
                        $(response.modelhide).modal('hide');
                }
                if(response.showElement)
                {
                    var showIDs = response.showElement.split(",");
                    $.each(showIDs, function(i, val){ $(val).removeClass('d-none'); });
                }
                if(response.hideElement)
                {
                    var hideIDs = response.hideElement.split(",");
                    $.each(hideIDs, function(i, val){ $(val).addClass('d-none'); });
                }
                if(response.delete_id)
                {
                    var option = '';
                    $(document).find('.delete_record_btn').each(function(i,obj){
                        if($(obj).attr('id') == response.delete_id){
                            let tr = $(obj).closest('tr');
                            let optText = tr.find('select.main_option').children("option:selected").text();
                            let optVal  = tr.find('select.main_option').children("option:selected").val();
                            if(optVal!=0){
                                option = {
                                    id:optVal,
                                    text:optText
                                };
                            }
                            $(obj).closest('tr').remove();
                        } 
                    });
                    setMainOptionList(option);
                }

                // if(response.acl_settings) {
                //     $(document).find('.aclTable').append(response.new_option_row);
                //     $(document).find("select.js-example-basic-single").select2();
                    // var j = $(document);
                    // if($('.tr_clone:last').find('.main_option option').length == response.alerady_options.length) {
                    //     return;
                    // }
                    // var $tr =   $('.tr_clone:last');
                    // $tr.find(".js-example-basic-single").select2("destroy");
                    // var $clone = $tr.clone();
                    // $clone.find(':text').val('');
                    // $clone.find('select').val('');
                    // $clone.find('.conflict').attr('id','conflict'+parseInt(j.find('.tr_clone').length)+1);
                    // $clone.find('.togetherness').attr('id','togetherness'+parseInt(j.find('.tr_clone').length)+1);
                    // $clone.find('.dependency').attr('id','dependency'+parseInt(j.find('.tr_clone').length)+1);
                    // $clone.find('.main_option option').each(function() {
                    //     let value = parseInt($(this).val());
                    //     let valueExit = response.alerady_options.includes(value);
                    //     console.log(value , valueExit);
                    //     if(valueExit){
                    //         $(this).prop('disabled',true);
                    //     }
                    // })
                    // $tr.after($clone);
                    // $("select.js-example-basic-single").select2();
                    // j.find('.tr_clone').each(function(index) {
                    //     $(this).find('.main_option').attr('name','main_option['+index+']');
                    //     $(this).find('.conflict').attr('name','conflict['+index+'][]');
                    //     $(this).find('.togetherness').attr('name','togetherness['+index+'][]');
                    //     $(this).find('.dependency').attr('name','dependency['+index+'][]');
                    // });
                // }
            }
            else
            {
                if( response.formErrors)
                {
                    $.each(response.errors, function( index, value )
                    {
                        $("input[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("input[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');

                        $("select[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("select[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');
                    });
                    if( response.tabForm )
                    {
                        $(".setup-content").each(function()
                        {
                            if( $(this).find('.form-group').hasClass('has-error') )
                            {
                                var id = $(this).attr('id');
                                $('.setup-content').hide();
                                $('div[id$="'+id+'"]').show();
                                //$(this).find('.form-group').find('.has-error').siblings('input').focus();
                            }
                        });
                    }
                }else if(response.validation===false){
                    jQuery.each(response.message,function(index,value){
                        // $("input[name='"+index+"']").addClass('is-invalid');
                        // $("input[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');

                        // $("select[name='"+index+"']").addClass('is-invalid');
                        // $("select[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');

                        toastr.error(value,delayTime)
                    });
                }
                else
                {
                    toastr.error(response.message,delayTime);
                }
            }

            if(response.ajaxPageCallBack)
            {
                response.formid = form.id;
                ajaxPageCallBack(response);
            }

            if(response.resetform)
            {
                $('#'+form.id).trigger('reset');
            }
            if(response.submitDisabled)
            {
                $("input[type=submit]").attr("disabled", "disabled");
                $("button[type=submit]").attr("disabled", "disabled");

            }
            if(response.url)
            {
                if(response.delayTime)
                    setTimeout(function() { window.location.href=response.url;}, response.delayTime);
                else
                    window.location.href=response.url;
            }
            if (response.reload) {
                if(response.delayTime)
                    setTimeout(function(){  location.reload(); }, response.delayTime)
                else
                    location.reload();
            }

            if (response.elementShow) {
                jQuery(response.elementShow).fadeIn();
            }
        },
        error:function(response){
            console.log('Connection Error');
            // var delayTime = 2000;
            // $.toast({
            //     heading             : 'Error',
            //     text                : 'Connection error.',
            //     loader              : true,
            //     loaderBg            : '#fff',
            //     showHideTransition  : 'fade',
            //     icon                : 'error',
            //     hideAfter           : delayTime,
            //     position            : 'top-right'
            // });
        }
    });
}
