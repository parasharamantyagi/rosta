$(document).ready(function () {
    // Set Global Variables
    var locale = 'en-US';
    var timezone = 'Europe/Paris';
    function get_current_date_time() {
        return new Date().toLocaleString(locale, {timeZone: timezone});
    }


    // Multi select
    $(document).find('.multi_select').select2({
        placeholder: ($('meta[name="csrf-token"]').data('lang') == 'fr') ? "Sélectionnez les options" : "Select Options",
    });
    // Display note of 8 hours
	
	$('select[name="selectmission"]').on('change', function () {
        let selected = $(this).val();
		console.log(selected);
		$('.selectmission-link').attr('id', selected);
		$('.selectmission-link').addClass('book_agent_later');
    });
	
	
    $('.mission_hours').on('change', function () {
        let selected = $(this).children(':selected').val();
        if (selected == 0) {
            $('.mission_hours_note').removeClass('d-none');
        } else {
            $('.mission_hours_note').addClass('d-none');
        }
    });

    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
        }
        var $subMenu = $(this).next('.dropdown-menu');
        $subMenu.toggleClass('show');
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass('show');
        });
        return false;
    });
    // Availability toggle 
    $(document).on('click', '#availability_check_btn', function () {
        let checkStatus = 0;
        let checked = $(this).is(':checked');
        if (checked) {
            checkStatus = 1;
        }
        $(document).find('#availability_status').val(checkStatus);
        $('#agent_availabity_form').trigger('submit');
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $(function () {
        // Datepicker
        $(".datepicker").datepicker();
        // Datetimepicker
        jQuery('.datetimepicker').datetimepicker({
            format: 'd/m/Y H:i:s',
			minDate: 0
        });
        jQuery('.timepicker').datetimepicker({
            datepicker: false,
            format: 'H:i',
            // minTime:''11:00''
        });
		
		$(".reportdatepicker").datepicker({
			dayNamesMin: ($('meta[name="csrf-token"]').data('lang') == 'fr') ? ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ($('meta[name="csrf-token"]').data('lang') === 'fr') ? [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ] : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
			dateFormat: 'dd-mm-yy'
		});

		$(".mindatepicker").datepicker({
			// changeMonth: true,
			changeYear: true,
			dayNamesMin: ($('meta[name="csrf-token"]').data('lang') == 'fr') ? ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ($('meta[name="csrf-token"]').data('lang') === 'fr') ? [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ] : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
			dateFormat: 'dd-mm-yy',
			minDate: 0
		});
		
    });

    $(document).on('click', '.mission_start_radio', function () {
        if ($(this).val() == 0) {
            $(document).find('#misionStartEndDiv').removeClass('d-none');
        } else {
            $('.datetimepicker').val('');
            $(document).find('#misionStartEndDiv').addClass('d-none');
        }
    });
    // Show message
    $(document).on('click', '.alert-msg', function () {
        let message = $(this).attr('data-msg');
        let msgType = $(this).attr('data-msg-type');
        if (msgType == 'success') {
            toastr.success(message);
        }
        if (msgType == 'error') {
            toastr.error(message);
        }
    });

    $(document).on('click', '.notification-item', function () {
        let id = $(this).attr('data-notification-id');
        let notificationUrl = $(this).attr('data-notification-url');
        $('#notification_id').val(id);
        $('#notification_url').val(notificationUrl);
        $('#customer_notification_form').submit();
    });

    // Agent Schedule
    $(document).on('click', '.day_off', function () {
        $(this).addClass('d-none');
        $(this).closest('tr').find('input.timepicker').prop("disabled", true);
        $(this).closest('tr').find('.day_on').removeClass('d-none');
        $(this).closest('tr').find('.day_off_field').val(1);
    });
    $(document).on('click', '.day_on', function () {
        $(this).addClass('d-none');
        $(this).closest('tr').find('input.timepicker').prop("disabled", false);
        $(this).closest('tr').find('.day_off').removeClass('d-none');
        $(this).closest('tr').find('.day_off_field').val(0);
    });

    // Book Agent Later Missions
    $(document).on('click', '.book_agent_later', function () {
        let agent_id = $(this).attr('id');
        $(document).find('#agent_book_later_mission').val(agent_id);
        $(document).find('#general_form').submit();
    });

    //Payment Approval Action
    $(document).on('click', '.pa_act_btn', function () {
        let record_id = $(this).attr('data-record-id');
        let type = $(this).attr('data-type');
        $(document).find('#p_a_r_id').val(record_id);
        $(document).find('#p_a_type').val(type);
        $(document).find('#general_form').submit();
    });

    // function to create a countdown timer
    function showCountDownTimer(elementId, expire_time, mission_id) {
        // Set the date we're counting down to
        var countDownDate = new Date(expire_time).getTime();
        // Update the count down every 1 second
        var x = setInterval(function () {
            // Get today's date and time
            var cdt = get_current_date_time();
            var now = new Date(cdt).getTime();
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Output the result in an element with id="demo"
            document.getElementById(elementId).innerHTML = minutes + " Min " + seconds + " Sec ";
            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(x);
                document.getElementById(elementId).innerHTML = "EXPIRED";
                $(document).find('#expired_mission_id').val(mission_id);
                $(document).find('#general_form').submit();
            }
        }, 1000);
    }

    // fetch all rows and show timeout
    $(document).find('.timeout_p').each(function (key, value) {
        let timerId = $(this).attr('id');
        let timeout = $(this).attr('data-timeout');
        let mission_id = $(this).attr('data-record-id');
        showCountDownTimer(timerId, timeout, mission_id);
    });

    // cancel mission
    $(document).on('click', '.cancel_mission_cls', function (e) {
        e.preventDefault();
        let url = $(this).attr('href');
        ajaxGetRequest(url);
    });

    // delete mission
    $(document).on('click', '.delete_mission_cls', function (e) {
        e.preventDefault();
        let url = $(this).attr('href');
        ajaxGetRequest(url);
    });
	
	$(document).on('click', '.delete_ajaxfun_cls', function (e) {
		e.preventDefault();
		var tabe_tr = $(this).parents('tr');
		$.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            dataType: 'json',
            success: function (response) {
					if(response.status){
						tabe_tr.remove();
						toastr.success(response.message, response.delayTime);
					}
            }
        });
    });

    // function to hit get request
    function ajaxGetRequest(url) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            beforeSend: function () {
                $("#preloader").show();
            },
            complete: function () {
                $("#preloader").hide();
            },
            success: function (response) {
                $.toast().reset('all');
                var delayTime = 0;
                if (response.delayTime) {
                    delayTime = response.delayTime;
                }
                if (response.success) {
                    toastr.success(response.message, delayTime);
                } else {
                    toastr.error(response.message, delayTime);
                }
                if (response.url) {
                    if (response.delayTime) {
                        setTimeout(function () {
                            window.location.href = response.url;
                        }, response.delayTime);
                    } else {
                        window.location.href = response.url;
                    }
                }
            }
        });
    }

    //refund request
    $(document).on('click', '.refund_cls', function () {
        let record_id = $(this).attr('id');
        let status = $(this).attr('data-status');
        $(document).find('#record_id').val(record_id);
        $(document).find('#refund_status').val(status);
        $(document).find('#general_form').submit();
    });

    //refund request
    $(document).on('click', '.refund_now_btn', function () {
        let charge_id = $(this).attr('id');
        $(document).find('#charge_id').val(charge_id);
        $(document).find('#general_form').submit();
    });

    $(".agent_schedule").datepicker({
        minDate: 0,
		dateFormat: 'dd/mm/yy',
		dayNamesMin: ($('meta[name="csrf-token"]').data('lang') == 'fr') ? ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthNames: ($('meta[name="csrf-token"]').data('lang') == 'fr') ? [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ] : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        onSelect: function (dateText, inst) {
            var show_date = [];
            let new_date = dateText.split("/");
            $(document).find('.modal-title span').html(dateText);
            $(document).find('#schedule_date').val(dateText);
            let current_date = new_date[2] + '-' + new_date[0] + '-' + new_date[1];
            show_date = schedule.filter(function (schedule) {
                return schedule.schedule_date == current_date
            });
            if (show_date.length != 0) {
                $(document).find('#available_from').val(show_date[0].available_from);
                $(document).find('#available_to').val(show_date[0].available_to);
            } else {
                $(document).find('#available_from').val('');
                $(document).find('#available_to').val('');
            }
            $('#schedule_model').modal('show');
        },
        beforeShowDay: function (date) {
            var set_date = [];
            var timing = '';
            var m = date.getMonth() + 1, d = date.getDate(), y = date.getFullYear();
            if (m < 10) {
                m = '0' + m;
            }
            if (d < 10) {
                d = '0' + d;
            }
            let current_date = y + '-' + m + '-' + d;
            set_date = schedule.filter(function (schedule) {
                return schedule.schedule_date == current_date
            });
            if (set_date.length != 0) {
                let from = set_date[0].available_from;
                from = from.split(":");
                let to = set_date[0].available_to
                to = to.split(":");
                timing = from[0] + ':' + from[1] + ' - ' + to[0] + ':' + to[1];
                addCustomInformation();
                return[true, 'schedule_set_on', timing]
            }
            return [true];
        }
    });
    function addCustomInformation() {
        setTimeout(function () {
            $(".ui-datepicker-calendar td").attr("data-toggle", "tooltip");
            $('[data-toggle="tooltip"]').tooltip({
                placement: 'top'
            });
        }, 0);
    }

    // remove mission request
    $(document).on('click', '.remove_mission_request', function (e) {
        e.preventDefault();
        let url = $(this).attr('href');
        ajaxGetRequest(url);
    });

    $(document).on('click', '.block_un_agent', function (e) {
        e.preventDefault();
        let agent_id = $(this).attr('id');
        let type = $(this).attr('data-type');
        $(document).find('#agent_id').val(agent_id);
        $(document).find('#type').val(type);
        $(document).find('#general_form').submit();
    });

    // Refresh Captcha
    $(document).on('click', '.captcha_refresh', function () {
        let url = $(this).attr('data-url');
        $.ajax({
            type: 'GET',
            url: url,
            success: function (response) {
                $('.captcha span').html(response);
            }
        });
    });

    //GET URL PARAMS
    function getParameterByName(name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    //MISSION PAGE FILER
        // $('#filterMissionStatus').on('change', function(){
            // var selectedStatus = $(this).val(); // SELECTED STATUS
            // var pageNo = 1; //PAGE NO
            // var url = '';
            // url = (selectedStatus != 'all') ? window.location.origin+window.location.pathname+'?missionStatus='+selectedStatus+'&all='+pageNo : window.location.origin+window.location.pathname+'?all='+pageNo;
            // window.location.href = url;
        // });
        
        $('.archiveMission').on('click', function(e){
            var doConfirm = confirm('Are you sure, you want to archive this mission?');
            if(doConfirm){
                return true;
            }
            return false;
        });
		
		$('input[name="customer_type"]').click(function(){
			let company_name = $(this).val();
			if(company_name == '2'){
				$('div[class="form-group company_name"]').show();
			}else{
				$('div[class="form-group company_name"]').hide();
			}
		});
		
		$('select[class="form-control intervention"]').change(function(){
			if($(this).val() == 'Intervention'){
				$('input[name="vehicle_required"]:eq(0)').click();
				$('select[name="total_hours"]').val('1');
				$('select[name="agent_type"]').val('4');
				$('select[name="total_hours"]').addClass("disable");
				$('select[name="agent_type"]').addClass("disable");
				$('input[name="vehicle_required"]').prop("disabled", true);
				$('select[name="agent_type"] option[value="7"]').prop("disabled", false);
				$('div[class="col-md-6 form-group security_patrol_field"]').remove();
				$('.mission_hours_note').hide();
			}else if($(this).val() == 'Security_patrol'){
				$('input[name="vehicle_required"]:eq(0)').click();
				$('select[name="total_hours"]').val('1');
				$('select[name="agent_type"]').val('4');
				$('select[name="total_hours"]').val('1');
				$('select[name="total_hours"]').removeClass('disable');
				$('select[name="agent_type"]').removeClass("disable");
				$('select[name="agent_type"] option[value="7"]').prop("disabled", true);
				$('input[name="vehicle_required"]').prop("disabled", true);
				$('.mission_hours_note').hide();
				var hrs = $(this).find(':selected').data('hrs');
				var hr = $(this).find(':selected').data('hr');
				var extra_field = '<div class="col-md-6 form-group security_patrol_field"><label>'+$(this).find(':selected').data('repetitive_mission')+'</label><select class="form-control" name="repetitive_mission" aria-invalid="false"><option value="same day">'+$(this).find(':selected').data('same_day')+'</option><option value="week">'+$(this).find(':selected').data('week')+'</option></select></div>';
					extra_field += '<div class="col-md-6 form-group security_patrol_field"><label>'+$(this).find(':selected').data('finish_time')+'</label><input class="form-control timepicker" placeholder="'+$(this).find(':selected').data('available_to_place')+'" id="mission_finish_time" name="mission_finish_time" type="text" aria-invalid="false"></div>';
					extra_field += '<div class="col-md-6 form-group security_patrol_field"><label>'+$(this).find(':selected').data('time_intervel')+'</label>';
					extra_field += '<select class="form-control" name="time_intervel">';
					extra_field += '<option value="0">'+$(this).find(':selected').data('select')+'</option>';
					extra_field +=  $.map([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], function(i) {
										if(i == 1)
											return '<option value="'+i+'">'+i+' '+hr+'</option>';
										else
											return '<option value="'+i+'">'+i+' '+hrs+'</option>';
									});
					extra_field += '</select>';
					extra_field += '</div>';
				$(function () { jQuery('.timepicker').datetimepicker({ datepicker: false, format: 'H:i' }); });
				$('div[class="col-md-6 form-group create-new-mission"]').after(extra_field);
			}else{
				$('select[class="vehicle_required"]').removeClass("disable");
				$('select[name="total_hours"]').removeClass("disable");
				$('select[name="agent_type"]').removeClass("disable");
				$('.mission_hours_note').show();
				$('input[name="vehicle_required"]').prop("disabled", false);
				$('select[name="agent_type"] option[value="7"]').prop("disabled", false);
				$('div[class="col-md-6 form-group security_patrol_field"]').remove();
			}
		});
		let io = 1;
		$(document).on('click', 'i[class="fas fa-plus-circle custom-mission-request"]', function () {
			let agent_type_all = $('select[name="agent_type[]"]:first').find('option');
			let agent_type = '<div class="row custom-mission-'+io+'"><div class="col-md-3 form-group">';
				agent_type += '<select name="agent_type[]" class="form-control">';
				console.log(agent_type_all);
				agent_type_all.map(function(key) {
											agent_type +=  agent_type_all[key].outerHTML;
									});
				agent_type += '</select>';
				agent_type += '</div>';
				
				agent_type += '<div class="col-md-3 form-group">';
				agent_type += '<input class="form-control datetimepicker" placeholder="Date Time" name="start_date_time[]" type="text" autocomplete="off">';
				agent_type += '</div>';
				
				agent_type += '<div class="col-md-3 form-group">';
				agent_type += '<input class="form-control datetimepicker" id="end_date_time_'+io+'" placeholder="Date Time" name="end_date_time[]" type="text" autocomplete="off">';
				agent_type += '</div>';
				
				agent_type += '<div class="col-md-2 form-group">';
				agent_type += '<input class="form-control" placeholder="Amount" id="amount" name="amount[]" type="text">';
				agent_type += '</div>';
				
				agent_type += '<div class="col-md-1">';
				agent_type += '<p class="action_icons"><i class="fa fa-minus-circle custom-mission-request" aria-hidden="true"></i></p>';
				agent_type += '</div></div>';
			$('.row.custom-mission-request').after(agent_type);
			jQuery('.datetimepicker').datetimepicker({
				format: 'd/m/Y H:i:s',
				minDate: 0
			});
			io++;
		});
	
		$(document).on('click', 'i[class="fa fa-minus-circle custom-mission-request"]', function () {
			$(this).parent().parent().parent().remove();
		});
		
		$(document).on('blur', 'input[name="end_date_time[]"]', function () {
			let current_id = $(this).attr('id');
			current_id = current_id.substring(14);
			let current_class = `custom-mission-${current_id}`;
			let agent_id = $('.'+current_class+' select[name="agent_type[]"]').val();
			let agent_type = $('option:selected','.'+current_class+' select[name="agent_type[]"]').data('agent_type');
			let start_date_time = $('.'+current_class+' input[name="start_date_time[]"]').val();
			let end_date_time = $('.'+current_class+' input[name="end_date_time[]"]').val();
			$.ajax({
				type: 'POST',
				url: '/operator/custom-request-amount-cal',
				dataType: 'json',
				data: {
						_token: $('meta[name="csrf-token"]').attr('content'),
						agent_id:agent_id,
						agent_type:agent_type,
						start_date_time:start_date_time,
						end_date_time:end_date_time
				},
				success: function (response) {
					if(response.success){
						$('.'+current_class+' input[name="amount[]"]').val(response.amount);
						let sum_amount = $("input[id='amount']").map(function(){return parseFloat($(this).val());}).get();
						$("#process_to_paid").html(sum_amount.reduce((a, b) => a + b));
					}
				}
			});
		});
		
		
		$(document).on('click', 'input[name="mission_finish_time"]', function () {
				let datepicker_active = false;
				let format_val = 'H:i';
				if($('input[name="quick_book"]:checked').val() == '0'){
					datepicker_active = true;
					format_val = 'd/m/Y H:i:s';
				}
			$(function () { jQuery('.timepicker').datetimepicker({ datepicker: datepicker_active, format: format_val }); });
		});
		
		$('button[class="btn_submit"]').click(function(){
				if($('select[class="form-control intervention"]').val() == 'Intervention'){
				$('input[name="vehicle_required"]:eq(0)').click();
				$('select[name="total_hours"]').val('1');
				$('select[name="agent_type"]').val('4');
				$('select[name="total_hours"]').addClass("disable");
				$('select[name="agent_type"]').addClass("disable");
				$('input[name="vehicle_required"]').prop("disabled", true);
				$('select[name="agent_type"] option[value="7"]').prop("disabled", false);
				$('div[class="col-md-6 form-group security_patrol_field"]').remove();
			}else if($('select[class="form-control intervention"]').val() == 'Security_patrol'){
				$.ajax({
					   url: 'available-agents-security-patrol',
					   success:function(response)
					   {
						   if(response.status == 1){
							   $('select[name="agent_type"]').val(response.data.agent_type);
							   $('select[name="total_hours"]').val(response.data.total_hours);
							   $('select[name="time_intervel"]').val(response.data.time_intervel);
						   }
					   }
				});
				$('input[name="vehicle_required"]:eq(0)').click();
				// $('select[name="agent_type"]').val('4');
				// $('select[name="total_hours"]').val('1');
				// $('select[name="time_intervel"]').val('4');
				$('select[name="total_hours"]').removeClass('disable');
				$('select[name="agent_type"]').removeClass("disable");
				$('select[name="agent_type"] option[value="7"]').prop("disabled", true);
				$('input[name="vehicle_required"]').prop("disabled", true);
			}else{
				$('select[class="vehicle_required"]').removeClass("disable");
				$('select[name="total_hours"]').removeClass("disable");
				$('select[name="agent_type"]').removeClass("disable");
				$('input[name="vehicle_required"]').prop("disabled", false);
				$('select[name="agent_type"] option[value="7"]').prop("disabled", false);
				$('div[class="col-md-6 form-group security_patrol_field"]').remove();
			}
		});
		
		$('button[class="button success_btn credit_Card_payment"]').click(function(){
			$('div[class="view_agent_details mt-4  d-none "]').removeClass("d-none");
			$('div[class="row payment_option_button"]').addClass("d-none");
		});
		
		$('button[class="button success_btn bank_Transfer_payment"]').click(function(){
			$('div[class="view_agent_details_bank mt-4  d-none "]').removeClass("d-none");
			$('div[class="row payment_option_button"]').addClass("d-none");
		});
		
		
		
		
		if (!localStorage.getItem("pageloadcount")) {
			$("#landContainer").show();
		} 
		$('#tarteaucitronPersonalize').click(function(){
			localStorage.setItem("pageloadcount", "1");
			$("#landContainer").hide();
		});
		$('#tarteaucitronCloseAlert').click(function(){
			localStorage.setItem("pageloadcount", "1");
			$("#landContainer").hide();
		});
		
		$('input[name="terms_conditions_find_mission"]').click(function(){
			if ($('input[class="checkbox1"]').prop('checked')==true && $('input[class="checkbox2"]').prop('checked')==true ){
				$('.proceed_success_btn').removeClass('disabled');
			}else{
				$('.proceed_success_btn').addClass('disabled');
			}
		});
		
		$('input[name="bank_transfer"]').click(function(){
			let statu_s = $(this).data('status');
			var bank_transfer = 0;
			if ($('input[name="bank_transfer"]').prop('checked')==true){
				bank_transfer = 1;
			}else{
				bank_transfer = 0;
			}
			var id = $(this).val();
			ajaxGetRequest('../../customer_status?id='+id+'&bank_transfer='+bank_transfer+'&status='+statu_s);
			// alert(id);
		});
		
		$( ".numeric-val" ).on('keypress blur', function (evt) {
		let message = 'Please add a numeric value.';
		if($('meta[name="csrf-token"]').data('lang') && $('meta[name="csrf-token"]').data('lang') == 'fr'){
			message = 'Veuillez ajouter une valeur numérique.';
		}
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
			if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			{
					$( "em" ).remove();
					$(this).after('<em class="text-danger">'+message+'</em>');
				return false;
			}else{
					$( "em" ).remove();
				return true;
			}
		});
		
		$(document).on('click', 'a[class="back back_btn"]', function () {
			window.history.back();
		});
		
		
});

	function printmissionDiv()
	{
		window.print();
		  // var divToPrint=document.getElementById('DivIdToPrint');
		  // var newWin=window.open('','Print-Window');
		  // newWin.document.open();
		  // newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
		  // newWin.document.close();
		  // setTimeout(function(){newWin.close();},10);
	}
	
	function savemissionDiv()
	{
		var doc = new jsPDF();
		var divToPrint=document.getElementById('DivIdToPrint');
		
		// doc.fromHTML('<html><head><title>name</title></head><body>hello world</body></html>');
		doc.fromHTML(divToPrint);
		doc.save('div.pdf');
 
		// doc.fromHTML($('#DivIdToPrint').html(), 15, 15, {
			// 'width': 170,
				// 'elementHandlers': specialElementHandlers
		// });
		// doc.save('sample-file.pdf');
		
	}