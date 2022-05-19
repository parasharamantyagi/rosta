const Question = require('./../Model/questionTable');
const CronJob = require('./../Model/CronJobTable');
const User = require('./../Model/userTable');
const halper = require('../halpers/halper');
const { push_notification_cus } = require('../trait/notification');
const { check_obj, check_array_length, filter_by_id, change_time_format } = require('../halpers/halper');

class cronJobController {
  async myCronJob(req, res, next) {
    try {
      let today = halper.rosta_current_date();
      CronJob.setCronJob(today);
      let checkDate = await Question.checkQuestionFromDate(today);
      if (check_obj(checkDate)) {
        let getAllToken = await User.getUsersDeviceToken(10000);
        if (check_array_length(getAllToken)) {
          push_notification_cus(
            'New poll for the day',
            'ROSTA RATT',
            filter_by_id(getAllToken, 'device_token'),
          );
        }
      }
      return res.status(200).json(true);
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async myCronJobGet(req, res, next) {
    try {
      // CronJob.getMyCronJob((err, resdata) => {
      //   resdata = resdata.toObject();
      //   resdata.createdAt = halper.rosta_change_current_date(resdata.createdAt);
      //   return res.status(200).json(resdata);
      // });
      let checkDate = await CronJob.getCronJob();
      if (check_obj(checkDate, 'createdAt')) {
        checkDate = checkDate.toObject();
        checkDate.createdAt = change_time_format(checkDate.createdAt,'YYYY-MM-DD HH:mm:ss');
      }
      return res.status(200).json(checkDate);
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new cronJobController();
