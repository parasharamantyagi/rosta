var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var favouriteAdvertiserSchema = mongoose.Schema(
  {
    device_id: { type: String },
    advertiser_id: { type: mongoose.Schema.Types.ObjectId, ref: 'advertisers' },
    current_date: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const MyFavouriteAdvertiser = (module.exports = mongoose.model('my_favourite_advertiser', favouriteAdvertiserSchema));

//get all votings
module.exports.getaddMyFavouriteAdvertiser = function (callback, limit) {
  MyFavouriteAdvertiser.find(callback).limit(limit);
};


module.exports.addMyFavouriteAdvertiser = function (data, callback) {
  MyFavouriteAdvertiser.create(data, callback);
};