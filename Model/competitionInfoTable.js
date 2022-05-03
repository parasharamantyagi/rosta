var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);

var CompetitionSchema = mongoose.Schema(
  {
    name: { type: String },
    from_date: { type: Date, required: true, trim: true },
    to_date: { type: Date, required: true, trim: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const CompetitionInfo = (module.exports = mongoose.model('competitionInfo', CompetitionSchema));

//get all users
module.exports.getCompetitionInfo = function (limit, callback) {
  CompetitionInfo.find().limit(limit).exec(callback);
};

module.exports.removeCompetitionInfo = (id, callback) => {
  var query = { _id: id };
  CompetitionInfo.remove(query, callback);
};

// module.exports.checkCompetitionInfo = async (data, callback) => {
//   try {
//     return await Competition.findOne({ user_id: data }).exec(callback);
//   } catch (err) {
//     return err;
//   }
// };

module.exports.addCompetitionInfo = async function (data, callback) {
  return await CompetitionInfo.create(data, callback);
};