const { notification_tost_message } = require('../halpers/FilterData');
const { find_one, socket_obj_multi_select } = require('../halpers/halper');
const halper = require('../halpers/halper');
const { select, update, runQuery } = require('../Model/model');
const {
  BaseUser,
  BaseUnit,
  BaseVehicle,
  BaseCapability,
  BaseTransport,
  BaseDriver,
  BaseTrip,
} = require('../Model/table');

module.exports = {
  unit_driver: unit_driver,
  transport_status: transport_status,
};

async function unit_driver(unit_id) {
  try {
    let response_base_trips = await select(BaseUnit, '*', { unit_id: unit_id });
    response_base_trips = find_one(response_base_trips);
    return response_base_trips;
  } catch (err) {
    return err;
  }
}

async function transport_status(input) {
  try {
    let obj_get = halper.socket_obj_multi_select(input, ['id', 'status', 'reason'],false);
    // console.log('ooo', obj_get);
    update(BaseTransport,{ id: obj_get.id },{ status: obj_get.status,reason: obj_get.reason });
    let base_transport_query = "SELECT `driver_id`,`base_transports`.`unit_id`,`trip_id` FROM `base_transports` INNER JOIN `base_unit` ON `base_unit`.`unit_id` = `base_transports`.`unit_id` WHERE `base_transports`.`id` = "+obj_get.id;
    let response_base_trips = await runQuery(base_transport_query);
    response_base_trips = find_one(response_base_trips);
	  response_base_trips.status = input.status;
  // if (input.status === 'completed') {
  //   update(BaseTrip, { trip_id: response_base_trips.trip_id }, { status: input.status });
  // }
    if (
      input.status === 'noshow' ||
      input.status === 'aborted' ||
      input.status === 'completed' ||
      input.status === 'rejected' ||
      input.status === 'unassigned' ||
      input.status === 'cancelled'
    ) {
      update(BaseUnit, { unit_id: response_base_trips.unit_id }, { transport_status: 1 });
      update(BaseTrip, { trip_id: response_base_trips.trip_id }, { status: input.status });
    }
    response_base_trips.message = `Transport ${notification_tost_message(obj_get.status)} successfully`;
    return response_base_trips;
  } catch (err) {
    return err;
  }
}
