var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var dealsSchema = mongoose.Schema(
  {
    name: { type: String },
    deal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'deals' }],
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Category = (module.exports = mongoose.model('categories', dealsSchema));

//get all users
module.exports.getCategory = function (limit, callback) {
  Category.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.getCategoryWithDeals = function (limit, callback) {
  Category.find()
    .populate({ path: 'deal' })
    .sort({ _id: -1 })
    .limit(limit)
    .exec(callback);
};

module.exports.addDealCategory = async (id,value) => {
  return await Category.findOneAndUpdate({ _id: id }, { $push: { deal: value } });
};

module.exports.removeDealCategory = async (id,value) => {
  return await Category.findOneAndUpdate({ _id: id }, { $pullAll: {deal: [value] } });
};

module.exports.addCategory = function (data, callback) {
  Category.create(data, callback);
};

module.exports.removCategory = (id, callback) => {
  var query = { _id: id };
  Category.remove(query, callback);
};