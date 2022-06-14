var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var votingSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: 'party' },
    device_id: { type: String },
    eighteen_above: { type: Number, default: 1 },
    voting_date: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Voting = (module.exports = mongoose.model('votings', votingSchema));

//get all votings
module.exports.getVoting = function (callback, limit) {
  Voting.find(callback).limit(limit);
};

module.exports.getVotingCount = async function (callback) {
  try {
    return await Voting.count().exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.checkVoting = async (data) => {
  let checkVote = {};
  let where_Vote = {};
  if (check_obj(data, 'user_id')) {
    where_Vote = { user_id: data.user_id };
  }
  if (check_obj(data, 'device_id')) {
    where_Vote = { device_id: data.device_id };
  }
  checkVote = await Voting.findOne(where_Vote).exec();
  return checkVote;
};

module.exports.getVotingByDevice = async (device_id) => {
  return await Voting.find({ device_id: device_id })
    .populate({ path: 'party_id' })
    .exec();
};

module.exports.getVotingByParty = async (party_id) => {
  return await Voting.find({ party_id: party_id }).exec();
};

module.exports.addVoting = function (data, callback) {
  Voting.create(data, callback);
};

module.exports.removeUserVoting = async (id) => {
  Voting.remove({ _id: id }).exec();
};

module.exports.removeVoting = async (party_id) => {
  let query = { party_id: party_id };
  Voting.remove(query).exec();
};

module.exports.updateVoting = async function (data, callback) {
  // console.log(data);
  let query = { _id: data.id };
  let update = { party_id: data.party_id, voting_date: data.voting_date };
  Voting.findOneAndUpdate(query, update, {upsert: true}, callback);
};






//add votings
// module.exports.addVoting = async function (data, callback) {
    // let checkData = await Voting.findOne({ user_id: data.user_id }).exec(callback);
    // return checkData;
    // console.log(checkData);
    // Voting.create(data, callback);
    // var query = { user_id: data.user_id };
    // var datad = {
    //   user_id: data.user_id,
    //   party_id: data.party_id,
    // };
    // Voting.findOneAndUpdate(query, datad, { new: true }, callback);
// };