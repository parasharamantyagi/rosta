var FCM = require('fcm-node');
var serverKey = process.env.SERVER_KEY;

class notification {
  async push_notification_cus(messages, title, device_token) {
    try {
      if (device_token) {
        var fcm = new FCM(serverKey);
        var message = {
          registration_ids: device_token,
          notification: {
            title: title,
            body: messages,
          },
          data: {
            my_key: 'my value',
            my_another_key: 'my another value',
          },
        };
        fcm.send(message, function (err, response) {
          if (err) {
            console.log(err);
            return false;
          } else {
            console.log(response);
            return true;
          }
        });
      } else {
        return true;
      }
    } catch (err) {
      // console.log(err);
    }
  }

  async push_notification_single(messages, title, device_token) {
    try {
      if (device_token) {
        var fcm = new FCM(serverKey);
        var message = {
          to: device_token,
          notification: {
            title: title,
            body: messages,
          },
          data: {
            my_key: 'my value',
            my_another_key: 'my another value',
          },
        };
        fcm.send(message, function (err, response) {
          if (err) {
            console.log(err);
            return false;
          } else {
            console.log(response);
            return true;
          }
        });
      } else {
        return true;
      }
    } catch (err) {
      // console.log(err);
    }
  }
}

module.exports = new notification();
