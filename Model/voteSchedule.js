var mongoose = require('mongoose');
var voteScheduleSchema = mongoose.Schema(
  {
    voter_type: { type: String },
    device_id: { type: String },
    createdAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const VoteSchedule = (module.exports = mongoose.model('vote_schedules', voteScheduleSchema));

module.exports.getVoteSchedule = async (device_id) => {
  try {
    return await VoteSchedule.findOne({ device_id: device_id }).exec();
  } catch (err) {
    return err;
  }
};

module.exports.addVoteSchedule = function (data, callback) {
  VoteSchedule.create(data, callback);
};