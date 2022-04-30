const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const User = require('./../../Model/userTable');
const Party = require('./../../Model/partyTable');
const { check_obj } = require('../../halpers/halper');
const { competitionCalculation } = require('../../trait/competition_algorithm');


class apiCompetitionController {

  async getCompetition(req, res, next) {
    try {
      let partyData = await Party.getAllParty("1");
      const competitionDatas = await User.getUsersWithCompetition(100);
      const myCompetitionDatas = competitionCalculation(competitionDatas,partyData);
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('getCompetition'),
            myCompetitionDatas,
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

