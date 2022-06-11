const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const Advertiser = require('./../../Model/advertiserTable');
const SocialInfo = require('./../../Model/socialInfoTable');
const Configration = require('./../../Model/configrationTable');
const { filterApiQuestion } = require('../../halpers/FilterData');
const { body, validationResult } = require('express-validator');
const { check_obj } = require('../../halpers/halper');

class apiConfigrationController {
  async configrationInfo(req, res, next) {
    try {
      let response = await Configration.getConfigration();
      return res
        .status(200)
        .json(halper.api_response(1, 'All Configration', response));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async configrationInfoAdd(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      let response = await Configration.saveConfigration(inputData);
      return res
        .status(200)
        .json(halper.api_response(1, 'Add Configration', response));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async configrationInfoRemove(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      Configration.removeConfigration(inputData.id, async (err, resdata) => {
        if (check_obj(resdata)) {
          return res
            .status(200)
            .json(halper.api_response(1, 'Remove Configration', {}));
        }
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiConfigrationController();

