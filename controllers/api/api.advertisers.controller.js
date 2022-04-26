const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const Advertiser = require('./../../Model/advertiserTable');
const { filterApiQuestion } = require('../../halpers/FilterData');
const { body, validationResult } = require('express-validator');


class apiAdvertisersController {

  async advertisersGet(req, res, next) {
    try {
      Advertiser.getAdvertiser(100, (err, resdata) => {
        return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('advertisersGet'), resdata),
          );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async advertisersPost(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      inputData.createdAt = new Date();
      inputData.updatedAt = new Date();
      Advertiser.addAdvertiser(inputData);
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('advertisersPost'),
            inputData,
          ),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiAdvertisersController();

