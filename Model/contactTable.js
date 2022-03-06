var mongoose = require('mongoose');
// const { check_obj } = require('../halpers/halper');

var contactSchema = mongoose.Schema(
  {
    checkbox1: { type: String },
    checkbox2: { type: String },
    notes: { type: String },
    createdAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Contact = (module.exports = mongoose.model('contacts', contactSchema));

//get all Contact
module.exports.getContact = function (callback, limit) {
  Contact.find(callback).limit(limit);
};

module.exports.addContact = async (data) => {
  // let checkVote = {};
  // if (check_obj(data, 'user_id')) {
  //   checkVote = await Voting.findOne({ user_id: data.user_id }).exec();
  // }
  // if (check_obj(data, 'device_id')) {
  //   checkVote = await Voting.findOne({ device_id: data.device_id }).exec();
  // }
  // if (check_obj(checkVote)) {
  //   return false;
  // } else {
    return await Contact.create(data);
  // }
};