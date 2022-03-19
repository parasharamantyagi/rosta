var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var QuestionAnswerSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'questions' },
    device_id: { type: String },
    answer_date: { type: String },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const QuestionAnswer = (module.exports = mongoose.model('question_answers', QuestionAnswerSchema));

//get all votings
module.exports.getQuestionAnswer = function (callback, limit) {
  QuestionAnswer.find(callback).limit(limit);
};

module.exports.getQuestionAnswerCount = async function (callback) {
  try {
    return await QuestionAnswer.count().exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.checkQuestionAnswerFromDate = async (data) => {
  let checkVote = {};
  checkVote.answer_date = data.answer_date;
  if (check_obj(data, 'user_id')) {
    checkVote.user_id = data.user_id;
  }
  if (check_obj(data, 'device_id')) {
    checkVote.device_id = data.device_id;
    // checkVote = await QuestionAnswer.findOne({ device_id: data.device_id }).exec();
  }
  return await QuestionAnswer.findOne(checkVote).exec();
}

module.exports.checkQuestionAnswer = async (data) => {
  let checkVote = {};
  checkVote.question_id = data.question_id;
  if (check_obj(data, 'user_id')) {
    checkVote.user_id = data.user_id;
  }
  if (check_obj(data, 'device_id')) {
    checkVote.device_id = data.device_id;
    // checkVote = await QuestionAnswer.findOne({ device_id: data.device_id }).exec();
  }
  return await QuestionAnswer.findOne(checkVote).exec();
};

module.exports.addQuestionAnswer = function (data, callback) {
  QuestionAnswer.create(data, callback);
};

module.exports.removeQuestionAnswer = async (question_id) => {
  let query = { question_id: question_id };
  QuestionAnswer.remove(query).exec();
};

module.exports.updateQuestionAnswer = async function (data, callback) {
  let query = { _id: data.id };
  let update = { question_id: data.question_id, answer_date: data.answer_date };
  QuestionAnswer.findOneAndUpdate(query, update, { upsert: true }, callback);
};