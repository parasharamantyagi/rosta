const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const { filterApiQuestion } = require('../../halpers/FilterData');
const { body, validationResult } = require('express-validator');
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
  async addCompetition(req, res, next) {
    try {
      // 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .json(halper.api_response(0, 'Missing failed', errors.array()));
      }
      let inputData = halper.obj_multi_select(
        req.body,
        ['party_id', 'date', 'percentage_value', 'device_id'],
        false,
      );
      Competition.addCompetition(inputData);
      return res
        .status(200)
        .json(halper.api_response(1, halper.request_message('addCompetition'), inputData));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiCompetitionController();

