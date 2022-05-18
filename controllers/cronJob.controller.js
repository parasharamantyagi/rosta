const Question = require('./../Model/questionTable');
const CronJob = require('./../Model/CronJobTable');
const User = require('./../Model/userTable');
const halper = require('../halpers/halper');
const { push_notification_cus } = require('../trait/notification');
const { check_obj, check_array_length, filter_by_id } = require('../halpers/halper');

class cronJobController {
  async myCronJob(req, res, next) {
    try {
      let today = halper.rosta_current_date();
      CronJob.setCronJob(today);
      let checkDate = await Question.checkQuestionFromDate(today);
      if (check_obj(checkDate)) {
        let getAllToken = await User.getUsersDeviceToken(10000);
        if(check_array_length(getAllToken)){
        push_notification_cus('New poll for the day','ROSTA RATT',filter_by_id(getAllToken, 'device_token'));
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
}

module.exports = new cronJobController();
