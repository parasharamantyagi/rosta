const { check , str_to_array, find_one, array_to_str, check_obj, convertTZ, change_time_format, current_date, check_array_length } = require('./halper');

class FilterData {
  
  filterCsv(input) {
    if (check_array_length(input)) {
      input = input[0].split(';');
    }
    if (check(input[0]) && check(input[1]) && check(input[2]) && check(input[3])) {
      return {
        date: input[0],
        question: input[1],
        option_1: input[2],
        option_2: input[3],
        option_3: input[4],
        option_4: input[5],
        option_5: input[6],
        createdAt: current_date(),
      };
    }else{
      return {};
    }
  }

  filterApiQuestion(input) {
    // return input;
    return input.map(function (key) {
      return {
        _id: key._id,
        date: key.date,
        question: key.question,
        answer_estimated: key.answer_estimated,
        created_at: key.createdAt,
        is_user_answer: key.is_user_answer,
        options: [
          { option: key.option_1, select: key.select_1, value: 1 },
          { option: key.option_2, select: key.select_2, value: 2 },
          { option: key.option_3, select: key.select_3, value: 3 },
          { option: key.option_4, select: key.select_4, value: 4 },
          { option: key.option_5, select: key.select_5, value: 5 },
        ],
      };
    });
  }

  getVehicleData(input) {
    return input.map(function (key) {
      return {
        vehicle_id: key.vehicle_id,
        vehicle_code: key.vehicle_code,
        capability_id: key.capability_id.split(','),
        description: key.description,
        enabled: key.enabled,
        created_on: key.created_on,
      };
    });
  }

  filterBasePatient(input) {
    input.demo_phone_no = check(input.demo_phone_no)
      ? str_to_array(input.demo_phone_no)
      : [];
    return input;
  }

  corporateContactTrip(input, key) {
    let return_object = [0];
    if (input.length > 0) {
      return_object = input.map(function (keys) {
        return check_obj(keys, key) ? array_to_str(keys[key]) : '';
      });
    }
    return return_object;
  }

  trip_id_array_type(input) {
    let trip_id_array_type = str_to_array(input);
    return trip_id_array_type.map(function (keys) {
      return parseInt(keys);
    });
  }

  corporate_contact(input) {
    return input.map(function (key) {
      return {
        corporate_contact_id: key.corporate_contact_id,
        first_name: key.first_name,
        last_name: key.last_name,
        email_id: key.email_id,
        phone_number: check(key.phone_number)
          ? str_to_array(key.phone_number)
          : [''],
        contact_id: key.contact_id,
        enabled: key.enabled,
        created_on: key.created_on,
      };
    });
  }

  unit_filter(input, timezone = null) {
    if (check(timezone)) {
      return input.map(function (key) {
        key.start_time = convertTZ(key.start_time, timezone);
        key.end_time = convertTZ(key.end_time, timezone);
        return key;
      });
    } else {
      return input;
    }
  }

  format_capability_array(key) {
    return key;
  }

  notification_tost_message(name) {
    switch (name) {
      case 'dispatch_requested':
        return 'Dispatch Requested';
      case 'noshow':
        return 'Completed - No Show';
      case 'en_route':
        return 'En Route';
      case 'arrived_at_pick_up':
        return 'Arrived at pick-up';
      case 'patient_loaded':
        return 'Patient loaded';
      case 'arrived_at_drop_off':
        return 'Arrived at drop-off';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      case 'planned':
        return 'Planned';
      case 'accepted':
        return 'Accepted';
      case 'cancelled':
        return 'Cancelled';
      case 'aborted':
        return 'Aborted';
      default:
        return name;
    }
  }

  create_unit_capability_id(driver, attendant, vehicle) {
    const driver_cap = driver.concat(attendant);
    var innerJoin = driver_cap.filter((el) => vehicle.includes(el));
    let uniqueChars = [...new Set(innerJoin)];
    return uniqueChars;
  }

  available_unit_filter(input, base_trip, timezone = null) {
    console.log(str_to_array(base_trip.capability_id));
    if (check(timezone)) {
      return input.map(function (key) {
        key.start_time = check(timezone)
          ? convertTZ(key.start_time, timezone)
          : key.start_time;
        key.end_time = check(timezone)
          ? convertTZ(key.end_time, timezone)
          : key.end_time;
        key.capability_id = str_to_array(key.capability_id);
        return this.format_capability_array(key);
      });
    } else {
      return input;
    }
  }

  driver_unit_filter(input, timezone = null) {
    return input.map(function (key) {
      if (check(key.updated_start_time)) {
        key.isUnitUpdated = {
          start_time: key.updated_start_time,
          end_time: key.updated_end_time,
          updated_time: key.updated_time,
        };
        key.updated_start_time = convertTZ(key.updated_start_time, timezone);
        key.updated_end_time = convertTZ(key.updated_end_time, timezone);
      } else {
        key.isUnitUpdated = {};
      }
      key.start_time = convertTZ(key.start_time, timezone);
      key.end_time = convertTZ(key.end_time, timezone);
      return key;
    });
  }
  driver_transports(input) {
    let my_corporate_contact = check_obj(input.corporate_contact)
      ? input.corporate_contact
      : {};
    my_corporate_contact.phone_number = check(my_corporate_contact.phone_number)
      ? str_to_array(my_corporate_contact.phone_number)
      : [''];
    return {
      id: input.id,
      unit_id: input.unit_id,
      trip_id: input.trip_id,
      status: input.status,
      created_on: input.created_on,
      base_unit: {
        unit_id: input.unit_id,
        driver_id: input.driver_id,
        vehicle_id: input.vehicle_id,
        start_time: input.start_time,
        end_time: input.end_time,
        attendant_id: input.attendant_id,
        attendant_name: input.attendant_name,
        status: input.base_unit_status,
        updated_start_time: input.updated_start_time,
        updated_end_time: input.updated_end_time,
        updated_time: input.updated_time,
        unit_status_id: input.unit_status_id,
        reason: input.reason,
        enabled: input.enabled,
        created_on: input.base_created_on,
      },
      base_trip: check_obj(input.base_trip) ? input.base_trip : {},
      base_patient: check_obj(input.base_patient) ? input.base_patient : {},
      corporate_contact: my_corporate_contact,
      corporate_account: input.corporate_account,
      question: input.question,
    };
  }

  testing_array(input) {
    return {
      ...input,
      phone: '123445',
      dob: '',
    };
  }
}

module.exports = new FilterData();
