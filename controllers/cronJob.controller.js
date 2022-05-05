const Question = require('./../Model/questionTable');
const User = require('./../Model/userTable');
const halper = require('../halpers/halper');

class cronJobController {
  async myCronJob(req, res, next) {
    try {
      // let today = halper.current_date();
      let today = '2022-03-18';
      let checkDate = await Question.checkQuestionFromDate(today);
      console.log(today);
      console.log(checkDate);
      return res.status(200).json('true');
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new cronJobController();
