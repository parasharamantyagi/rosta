const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const User = require('./../../Model/userTable');
const { filterApiQuestion } = require('../../halpers/FilterData');
const { body, validationResult } = require('express-validator');
const { check_obj } = require('../../halpers/halper');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/party_image/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
// var upload = multer({ storage: storage }).single('image_link');


class apiCompetitionController {

  async getCompetition(req, res, next) {
    try {
      const competitionDatas = await User.getUsersWithCompetition(100);
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('getCompetition'),
            competitionDatas,
          ),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addCompetition(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      let checkCompetition = await Competition.checkCompetition(
        inputData.user_id,
      );
      if (check_obj(checkCompetition)) {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('checkCompetition'),
              checkCompetition,
            ),
          );
      } else {
        Competition.addCompetition(inputData);
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('addCompetition'),
              inputData,
            ),
          );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiCompetitionController();

