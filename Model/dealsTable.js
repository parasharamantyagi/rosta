var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var dealsSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    image: { type: String },
    url: { type: String },
    price: { type: String },
    best_seller: { type: String },
    stock: { type: String },
    description: { type: String },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Deals = (module.exports = mongoose.model('deals', dealsSchema));

//get all users
module.exports.getDeals = function (limit, callback) {
  Deals.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.getDealFromId = function (id, callback) {
  var query = { _id: id };
  return Deals.findOne(query, callback);
};

module.exports.addDeals = function (data, callback) {
  Deals.create(data, callback);
};

module.exports.updateDeals = function (data, callback) {
  // Deals.create(data, callback);
  Deals.findOneAndUpdate({ _id: data.id }, data.data, { upsert: true, new: true }, callback);
};

module.exports.removeDeals = (id, callback) => {
  var query = { _id: id };
  Deals.remove(query, callback);
};