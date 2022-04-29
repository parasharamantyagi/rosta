var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
const User = require('./userTable');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var CompetitionSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    date: { type: String },
    competetionData: [{party_id: { type: mongoose.Schema.Types.ObjectId, ref: 'party' },percentage_value:{ type: String }}],
    createdAt: { type: Date, default: Date.now() },
    UpdatedAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Competition = (module.exports = mongoose.model('competitions', CompetitionSchema));

//get all users
module.exports.getCompetition = function (limit, callback) {
  Competition.find().limit(limit).exec(callback);
};

module.exports.checkCompetition = async (data, callback) => {
  try {
    return await Competition.findOne({ user_id: data }).exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.addCompetition = async function (data, callback) {
  let insert = await Competition.create(data, callback);
  if (check_obj(insert, '_id')) {
    User.addCompetetion(data.user_id, insert._id.toString(),(err, resdata) => {
      return resdata;
      });
  }
  return true;
};