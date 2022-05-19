var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var CronJobSchema = mongoose.Schema(
  {
    date: { type: String, required: true },
    createdAt: { type: Date ,default: new Date()},
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);
const CronJob = (module.exports = mongoose.model('cron_jobs', CronJobSchema));



module.exports.getMyCronJob = function (callback) {
  CronJob.findOne().sort({ createdAt: -1 }).exec(callback);
};


module.exports.getCronJob = async () => {
  let getCron = await CronJob.findOne().sort({ createdAt: -1 }).exec();
  return getCron;
};

module.exports.setCronJob = async (today,callback) => {
  // today = '2022/05/270';
  // let getCron = await CronJob.find().exec();
  // console.log(getCron);
  // if (check_obj(getCron)) {
  //   CronJob.findOneAndUpdate({_id: getCron._id.toString()}, { date: today }, { upsert: true }, callback);
  // }else{
  CronJob.create({ date: today }, callback);
  // }
  return true;
};
