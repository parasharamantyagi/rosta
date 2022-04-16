var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var CompetitionSchema = mongoose.Schema(
  {
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: 'party' },
    percentage_value: { type: SchemaTypes.Double },
    device_id: { type: String },
    date: { type: String },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
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

module.exports.addCompetition = function (data, callback) {
  Competition.create(data, callback);
};