const { crypto } = require('./../Model/module');
const { encrypted, dencrypted } = require('./crypto');
const my_date_format = 'YYYY-MM-DD HH:mm:00';
const moment = require('moment-timezone');
var algorithm = 'aes256';
var key = 'password';
const base_url = process.env.BASE_URL;

class halper {
  VAT_PERCENTAGE = 20;

  web_link(url) {
    return base_url + '/' + url;
  }

  base_url(url) {
    return url;
  }

  current_date() {
    let now = new Date();
    return moment(now).format('YYYY-MM-DD');
  }

  custom_date(now = null) {
    if (now) {
      return moment(now).format(my_date_format);
    } else {
      let now = new Date();
      return moment(now).format(my_date_format);
    }
  }

  convertGMT(date_format, time_zone = null) {
    // 👈 convert local time_zone to GMT time
    // let new_date = dateFormat(date_format, my_date_format);
    // return moment.tz(date_format, time_zone).utc().format(my_date_format);
    return moment(date_format).format(my_date_format);
  }

  convertTZ(date, timezone) {
    return moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:00');
  }

  date_format_without_second(now) {
    return moment(now).format(my_date_format);
  }

  change_time_zone(now) {
    return new Date(now).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  }

  change_time_format(now, format = null) {
    if (format) {
      return moment(now).format(format);
    } else {
      return moment(now).format(my_date_format);
    }
  }

  active_menu(link, menu) {
    if (menu.includes(link)) {
      return 'active';
    }
    return '';
    // console.log('link11111111', link);
    // console.log('menu444444', menu);
    // if (link === menu) {

    // }
  }

  find_one(inputArray, my_key = null) {
    // 👈 return single value from array default return first
    let response = Object();
    if (inputArray.length) {
      response = inputArray.find(Boolean);
      if (my_key) {
        return inputArray[my_key];
      }
    }
    return response;
  }

  filter_by_id(target, input) {
    // 👈 return single value in array format from multidimensional array
    let return_object = [0];
    if (target.length > 0) {
      return_object = target.map(function (key) {
        return key[input];
      });
    }
    return return_object;
  }

  filter_by_id_party_image(target, input) {
    // 👈 return single value in array format from multidimensional array
    let return_object = [0];
    if (target.length > 0) {
      return_object = target.map(function (key) {
        return 'party_image/' + key[input];
      });
    }
    return return_object;
  }

  encrypt(text, type = null) {
    // 👈 conver string to base64 fromat and it's reverse
    if (type && type == 'dec') {
      let buff = new Buffer(text, 'base64');
      return buff.toString('ascii');
    } else {
      let buff = new Buffer(text);
      let base64data = buff.toString('base64');
      return base64data;
    }
    // if (type && type == 'dec') {
    //   var decipher = crypto.createDecipher(algorithm, key);
    //   return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    // } else {
    //   var cipher = crypto.createCipher(algorithm, key);
    //   return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    // }
  }

  api_response(status, message, data) {
    return {
      status: status,
      message: message,
      data: data,
    };
  }

  merge_two_object(object1, object2) {
    //  const object3 = { ...object1, ...object2 };
    return Object.assign(object1, object2);
  }

  web_response(success, error, message, url = null) {
    let return_url = {
      success: success,
      error: error,
      message: message,
      delayTime: 4000,
    };
    if (url) {
      return_url.url = url;
    }
    return return_url;
  }

  roll_from_id(data) {
    switch (data) {
      case 1:
        return 'Driver manager';
      case 2:
        return 'Dispatcher';
      case 3:
        return 'Drivers';
      case 4:
        return 'Reservationist';
      case 5:
        return 'Admin';
      case 6:
        return 'Manager';
      default:
        return 'N/A';
    }
  }

  remove_empty(target) {
    Object.keys(target).map(function (key) {
      if (target[key] instanceof Object) {
        if (
          !Object.keys(target[key]).length &&
          typeof target[key].getMonth !== 'function'
        ) {
          target[key] = '';
        } else {
          target[key] = '';
        }
      } else if (target[key] === null) {
        target[key] = '';
      }
    });
    return target;
  }

  empty_array(obj) {
    let result = Object.entries(obj).reduce(
      (a, [k, v]) => (v == '' ? a : ((a[k] = v), a)),
      {},
    );
    return result;
  }

  time_diff_in_minuts(start_date_time, end_date_time) {
    let today = new Date(end_date_time);
    let endDate = new Date(start_date_time);
    const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24);
    const minutes = parseInt(
      (Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60,
    );
    const seconds = parseInt(
      (Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60,
    );
    return hours * 60 + minutes;
  }

  addMinutesToDate(date, hours) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + hours);
    return moment(newDate).format(my_date_format);
  }

  convertstrtime(date) {
    let convert_date = date / 1000;
    // console.log(convert_date);
    // let change_date = convert_date.getTime();
    // console.log(change_date );
    return convert_date;
  }

  request_message(parms, lng, input = null) {
    let return_message = '';
    // let selected_lng = lng && (lng == 'en' || lng == 'fr') ? lng : 'en';
    let selected_lng = 'en';
    let language = require(`./../language/${selected_lng}/message.json`);
    return_message = language[parms];
    if (input) {
      return return_message.replace('${input}', input);
    }
    return return_message;
  }

  request_message_label(parms, lng) {
    let selected_lng = lng && (lng == 'en' || lng == 'fr') ? lng : 'en';
    let language = require(`./../language/${selected_lng}/label.json`);
    return language[parms];
  }

  flip_array(input) {
    return input;
  }

  clean(obj) {
    for (var propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ''
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }

  obj_multi_select(obj, keys = null, status = true) {
    // 👈 return selected field of object in case of status false function return all given filed
    // obj = dencrypted(obj.encrypt);
    let return_obj = {};
    if (this.check_array_length(keys)) {
      for (let k = 0; k < keys.length; k++) {
        if (status) {
          if (this.check(obj[keys[k]])) {
            return_obj[keys[k]] = obj[keys[k]];
          }
        } else {
          if (this.check(obj[keys[k]])) {
            return_obj[keys[k]] = obj[keys[k]];
          } else {
            return_obj[keys[k]] = '';
          }
        }
      }
    } else {
      return_obj = obj;
    }
    return return_obj;
  }

  socket_obj_multi_select(obj, keys = null, status = true) {
    let return_obj = {};
    if (this.check_array_length(keys)) {
      for (let k = 0; k < keys.length; k++) {
        if (status) {
          if (this.check(obj[keys[k]])) {
            return_obj[keys[k]] = obj[keys[k]];
          }
        } else {
          if (this.check(obj[keys[k]])) {
            return_obj[keys[k]] = obj[keys[k]];
          } else {
            return_obj[keys[k]] = '';
          }
        }
      }
    } else {
      return_obj = obj;
    }
    return return_obj;
  }

  check(obj) {
    // 👈 check string is valid or not
    if (obj === null || obj === undefined || obj === '' || obj === false) {
      return false;
    } else {
      return true;
    }
  }

  check_array_length(array, num = false) {
    // 👈 check array lenth and min length of array
    if (Array.isArray(array)) {
      if (!num) {
        return array.length ? true : false;
      } else {
        return array.length && array.length >= num ? true : false;
      }
    } else {
      return false;
    }
  }

  check_obj(myObj, key = null) {
    // console.log(typeof myObj);
    // 👈 check object is valid and check key is exit in object
    if (key) {
      // console.log('iiii == ', Object.hasOwn(myObj, key));
      // return Object.hasOwn(myObj, key) ? true : false;
      // return Object.hasOwn(myObj, key);
      return myObj[key] && myObj[key] !== undefined ? true : false;
    } else {
      if (myObj != null && typeof myObj == 'object' && !Array.isArray(myObj)) {
        return myObj &&
          Object.keys(myObj).length === 0 &&
          Object.getPrototypeOf(myObj) === Object.prototype
          ? false
          : true;
      } else {
        return false;
      }
    }
  }

  formData(object, val) {
    if (this.check_obj(object)) {
      object = object.toObject();
    }
    let return_val = '';
    if (val === 'description') {
      return_val =
        'Detta parti har ännu inte uppgett alla uppgifter för att denna sida och dess knappar ska fungera. Vi ber om överinseende över det inträffade';
    } else if (val === 'bar_in_diagram') {
      return_val = '#D4D4D4';
    }
    if (this.check_obj(object, val) === true) {
      return_val = object[val];
    }
    return return_val;
  }

  formDataArray(object, val) {
    console.log(this.find_one(object.image_link));
    return this.find_one(object.image_link).slice(-30);
  }

  toggleSwitch(input) {
    return input ? 'checked' : '';
  }

  array_duplicates(chars) {
    // 👈 reverse array value
    return [...new Set(chars)];
  }

  array_to_str(obj) {
    return obj.toString();
  }

  str_to_array(obj) {
    return obj.split(',');
  }
}

module.exports = new halper();
