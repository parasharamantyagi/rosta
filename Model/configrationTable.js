var mongoose = require('mongoose');

var configrationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Configration = (module.exports = mongoose.model('configrations', configrationSchema));

//get all users
module.exports.getConfigration = function (limit, callback) {
  return Configration.find().limit(limit).exec(callback);
};

module.exports.getInfoConfigration = function (data, callback) {
  return Configration.find({
    name: { $in: data },
  }).exec(callback);
};

module.exports.saveConfigration = function (data, callback) {
  Configration.create(data, callback);
};

//get all users
module.exports.getConfigrationByID = (nameData, callback) => {
  return Configration.findOne({ name: nameData }, callback);
  // return await Configration.find().sort({ name: 1 }).exec();
};


//get all party count
module.exports.updateConfigrationByID = function (data, callback) {
  var query = { _id: data.id };
  Configration.findOneAndUpdate(query, { value:data.value }, { upsert: true, new: true }, callback);
  // try {
  //   return await Configration.count().exec(callback);
  // } catch (err) {
  //   return err;
  // }
};
