var mongoose = require('mongoose');

var questionSchema = mongoose.Schema(
  {
    date: { type: String, required: true },
    question: { type: String, required: true },
    answer_estimated: { type: Number, default: 0 },
    option_1: { type: String, required: true },
    option_2: { type: String, required: true },
    option_3: { type: String },
    option_4: { type: String },
    option_5: { type: String },
    select_1: { type: Number, default: 0 },
    select_2: { type: Number, default: 0 },
    select_3: { type: Number, default: 0 },
    select_4: { type: Number, default: 0 },
    select_5: { type: Number, default: 0 },
    createdAt: { type: String },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);
const Question = (module.exports = mongoose.model('questions', questionSchema));

//get all users
module.exports.getQuestion = async () => {
  return await Question.find().sort({ date : -1}).exec();
};

module.exports.getQuestionFromID = async (id) => {
  return await Question.findOne({ _id: id}).exec();
};

module.exports.questionEstimatedPlus = async (question_id,data) => {
  return await Question.findOneAndUpdate(
    { _id: question_id },
    { $inc: data },
    { new: true },
  );
};

module.exports.questionEstimatedMinus = async (question_id, data) => {
  return await Question.findOneAndUpdate(
    { _id: question_id },
    { $inc: data },
    { new: true },
  );
};

module.exports.deleteQuestion = function (data, callback) {
  var query = { createdAt: data };
  Question.remove(query, callback);
};

module.exports.saveQuestion = function (data, callback) {
    Question.create(data, callback);
};
