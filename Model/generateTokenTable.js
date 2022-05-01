var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
const User = require('./userTable');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var generateTokenSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'deals' },
    createdAt: { type: Date, default: Date.now() },
    UpdatedAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const GenerateToken = (module.exports = mongoose.model('generate_tokens', generateTokenSchema));

//get all users
module.exports.getGenerateToken = function (limit, callback) {
  GenerateToken.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.getGenerateTokenFromId = async (id) => {
  return await GenerateToken.find(id).populate({ path: 'deal_id' }).exec();
};

module.exports.addGenerateToken = async function (data, callback) {
  let insert = await GenerateToken.create(data, callback);
  if (check_obj(insert, '_id')) {
    User.addPremiumUser(data.user_id);
  }
};

// module.exports.updateDeals = function (data, callback) {
//   // Deals.create(data, callback);
//   Deals.findOneAndUpdate({ _id: data.id }, data.data, { upsert: true, new: true }, callback);
// };

// module.exports.removeDeals = (id, callback) => {
//   var query = { _id: id };
//   Deals.remove(query, callback);
// };