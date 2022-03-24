var mongoose = require('mongoose');
// const { check_obj } = require('../halpers/halper');

var feedbackSchema = mongoose.Schema(
  {
    party_id: { type: mongoose.Schema.Types.ObjectId, ref: 'party' },
    select1: { type: String },
    select2: { type: String },
    description: { type: String },
    email: { type: String },
    createdAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Feedback = (module.exports = mongoose.model('feedbacks', feedbackSchema));

//get all Contact
module.exports.getFeedback = function (callback, limit) {
  Feedback.find(callback).limit(limit);
};

module.exports.addFeedback = async (data) => {
  return await Feedback.create(data);
};