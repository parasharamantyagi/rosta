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
    option_6: { type: String },
    option_7: { type: String },
    option_8: { type: String },
    option_9: { type: String },
    option_10: { type: String },
    option_11: { type: String },
    option_12: { type: String },
    option_13: { type: String },
    option_14: { type: String },
    option_15: { type: String },
    option_16: { type: String },
    option_17: { type: String },
    option_18: { type: String },
    option_19: { type: String },
    option_20: { type: String },
    select_1: { type: Number, default: 0 },
    select_2: { type: Number, default: 0 },
    select_3: { type: Number, default: 0 },
    select_4: { type: Number, default: 0 },
    select_5: { type: Number, default: 0 },
    select_6: { type: Number, default: 0 },
    select_7: { type: Number, default: 0 },
    select_8: { type: Number, default: 0 },
    select_9: { type: Number, default: 0 },
    select_10: { type: Number, default: 0 },
    select_11: { type: Number, default: 0 },
    select_12: { type: Number, default: 0 },
    select_13: { type: Number, default: 0 },
    select_14: { type: Number, default: 0 },
    select_15: { type: Number, default: 0 },
    select_16: { type: Number, default: 0 },
    select_17: { type: Number, default: 0 },
    select_18: { type: Number, default: 0 },
    select_19: { type: Number, default: 0 },
    select_20: { type: Number, default: 0 },
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


module.exports.checkQuestionFromDate = async (getDate) => {
  return await Question.findOne({date: new RegExp(getDate,'i')}).exec();
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
