var mongoose = require('mongoose');

var questionSchema = mongoose.Schema(
  {
    date: { type: String, required: true },
    question: { type: String, required: true },
    option_1: { type: String, required: true },
    option_2: { type: String, required: true },
    option_3: { type: String, required: true },
    option_4: { type: String },
    option_5: { type: String },
    createdAt: { type: String },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);
const Question = (module.exports = mongoose.model('questions', questionSchema));

//get all users
module.exports.getQuestion = async () => {
  return await Question.find().exec();
};


module.exports.saveQuestion = function (data, callback) {
  Question.create(data, callback);
};
