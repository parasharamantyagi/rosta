var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var prizeSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    image: { type: String },
    url: { type: String },
    price: { type: String },
    description: { type: String },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Prize = (module.exports = mongoose.model('prizes', prizeSchema));

//get all users
module.exports.getPrize = function (limit, callback) {
  Prize.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.getPrizeFromId = function (id, callback) {
  var query = { _id: id };
  return Prize.findOne(query, callback);
};

module.exports.addPrize = function (data, callback) {
  Prize.create(data, callback);
};

module.exports.updatePrize = function (data, callback) {
  Prize.findOneAndUpdate({ _id: data.id }, data.data, { upsert: true, new: true }, callback);
};

module.exports.removePrize = (id, callback) => {
  var query = { _id: id };
  Prize.remove(query, callback);
};