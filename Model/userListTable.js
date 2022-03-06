var mongoose = require('mongoose');

var userListSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: { type: [Number], default: [0, 0], index: '2dsphere', required: true },
  }
);

const UserList = (module.exports = mongoose.model('user_list', userListSchema));

//get all UserList
module.exports.getUserList = function (data, callback) {
  // UserList.find().exec(callback);
  Model.find({
    location: {
      $near: {
        $maxDistance: 100 / 111.12, // 100km
        $geometry: {
          type: 'user_list',
          coordinates: data, // [lon, lat]
        },
      },
    },
  }).exec(callback);
};

//get all UserList
module.exports.getAllUserList = async () => {
  return await UserList.find().exec();
};

//add UserList
module.exports.addUserList = function (data, callback) {
  UserList.create(data, callback);
};