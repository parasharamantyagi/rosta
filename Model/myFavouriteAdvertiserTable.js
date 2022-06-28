var mongoose = require('mongoose');

var favouriteAdvertiserSchema = mongoose.Schema(
  {
    device_id: { type: String },
    advertiser_id: { type: mongoose.Schema.Types.ObjectId, ref: 'advertisers' },
    my_favourite: { type: Number, enum: [1, 0], default: 0 },
    current_date: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const MyFavouriteAdvertiser = (module.exports = mongoose.model('my_favourite_advertiser', favouriteAdvertiserSchema));

var viewAdvertiserSchema = mongoose.Schema(
  {
    device_id: { type: String },
    advertiser_id: { type: mongoose.Schema.Types.ObjectId, ref: 'advertisers' },
    current_date: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const ViewAdvertiser = (module.exports = mongoose.model('view_advertisers', viewAdvertiserSchema));


module.exports.getViewAdvertiser = async (device_id,advertiser_id) => {
  return await ViewAdvertiser.findOne({ device_id: device_id,advertiser_id:advertiser_id }).exec();
};

module.exports.saveViewAdvertiser = function (data, callback) {
  ViewAdvertiser.create(data, callback);
};


//get all votings
module.exports.getaddMyFavouriteAdvertiser = function (callback, limit) {
  MyFavouriteAdvertiser.find(callback).limit(limit);
};

module.exports.updateMyFavouriteAdvertiser = function (id, data,callback) {
  let query = { _id: id };
  MyFavouriteAdvertiser.findOneAndUpdate(query, data, { upsert: true, new: true }, callback);
};

module.exports.getMyFavouriteAdvertiser = async (device_id,advertiser_id) => {
  return await MyFavouriteAdvertiser.findOne({ device_id: device_id,advertiser_id:advertiser_id }).exec();
};

module.exports.addMyFavouriteAdvertiser = function (data, callback) {
  MyFavouriteAdvertiser.create(data, callback);
};