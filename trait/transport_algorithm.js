const {
  find_one,
  obj_multi_select,
  addMinutesToDate,
  date_format_without_second,
  convertTZ,
  check,
  array_to_str,
  str_to_array,
  convertstrtime,
} = require('../halpers/halper');
const halper = require('../halpers/halper');
const { select, update, runQuery } = require('../Model/model');
const { distance } = require('../Model/module');
const { SystemConfigration } = require('../Model/table');

class TransportAlgorithm {
  my_average_speed = 40;
  my_drop_up_time = 20;
  my_preparation_time = 20;
  my_garage_location = '48.745193,2.401373';
  my_end_of_sift_time = 15;

  async trip_time(input) {
    try {
      let response = await select(SystemConfigration, '*');
      response = find_one(response);
      var distanceInMeters = distance.getDistanceBetweenPoints(
        input.pickup_lat,
        input.pickup_lng, // Lat, Long of point A
        input.dropoff_lat,
        input.dropoff_lng, // Lat, Long of point B
      );
      let getTime = (distanceInMeters * 0.001) / response.average_speed;
      let all_minutes =
        getTime * 60 +
        response.drop_up_time +
        response.preparation_time +
        response.end_of_sift_time;
      let end_time = addMinutesToDate(input.pick_up_date_time, all_minutes);
      return end_time;
    } catch (err) {
      return err;
    }
  }

  question1(unit, trip) {
    if (check(unit.drop_location) && check(unit.estimated_end_time)) {
      let unit_drop_location = str_to_array(unit.drop_location);
      let distanceInMeters = distance.getDistanceBetweenPoints(
        find_one(unit_drop_location, 0),
        find_one(unit_drop_location, 1), // Lat, Long of point A
        trip.pickup_lat,
        trip.pickup_lng, // Lat, Long of point B
      );
      let getTime = (distanceInMeters * 0.001) / this.my_average_speed;
      let all_minutes =
        getTime * 60 +
        this.my_drop_up_time +
        this.my_preparation_time +
        this.my_end_of_sift_time;
      let end_time = addMinutesToDate(unit.estimated_end_time, all_minutes);
      if (convertstrtime(end_time) < convertstrtime(trip.pick_up_date_time)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  question2(unit, trip) {
    if (check(unit.drop_location) && check(unit.estimated_end_time)) {
      if(convertstrtime(unit.estimated_start_time) > convertstrtime(trip.pick_up_date_time) || convertstrtime(unit.estimated_end_time) > convertstrtime(trip.pick_up_date_time)){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }

  unit_filter_from_trip(units, trip, timezone = null) {
    let return_array = [];
    for (let unit of units) {
      if (this.question1(unit, trip) && this.question2(unit, trip)) {
        unit.start_time = check(timezone)
          ? convertTZ(unit.start_time, timezone)
          : unit.start_time;
        unit.end_time = check(timezone)
          ? convertTZ(unit.end_time, timezone)
          : unit.start_time;
        return_array.push(unit);
      }
    }
    return return_array;
  }
}

module.exports = new TransportAlgorithm();
