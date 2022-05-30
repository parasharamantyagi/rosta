var mongoose = require('mongoose');

var socialInfoSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);
const SocialInfo = (module.exports = mongoose.model('social_infos', socialInfoSchema));

//get all users
module.exports.getSocialInfo = function (limit, callback) {
  return SocialInfo.find().limit(limit).exec(callback);
};

module.exports.saveSocialInfo = function (data, callback) {
  SocialInfo.create(data, callback);
};

//get all users
module.exports.getSocialInfoByID = (nameData, callback) => {
  return SocialInfo.findOne({ name: nameData }, callback);
  // return await Configration.find().sort({ name: 1 }).exec();
};

module.exports.removeSocialInfo = (id, callback) => {
  var query = { _id: id };
  SocialInfo.remove(query, callback);
};

//get all party count
module.exports.updateSocialInfoByID = function (id,data, callback) {
  var query = { _id: id };
  SocialInfo.findOneAndUpdate(query, { value:data.value }, { upsert: true, new: true }, callback);
};
