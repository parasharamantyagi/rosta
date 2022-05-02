const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const User = require('./../../Model/userTable');
const Party = require('./../../Model/partyTable');
const Deals = require('./../../Model/dealsTable');
const GenerateToken = require('./../../Model/generateTokenTable');
const { check_obj } = require('../../halpers/halper');
const { competitionCalculation } = require('../../trait/competition_algorithm');


class apiCompetitionController {
  async getCompetition(req, res, next) {
    try {
      let partyData = await Party.getAllParty('1');
      const competitionDatas = await User.getUsersWithCompetition(100);
      const myCompetitionDatas = competitionCalculation(
        competitionDatas,
        partyData,
      );
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

  async getGenerateTokens(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body, ['user_id']);
      let response = await GenerateToken.getGenerateTokenFromId(inputData);
      return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('getGenerateTokens'), response),
          );
      
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addGenerateTokens(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      for (let input_del of inputData.deal_id) {
        GenerateToken.addGenerateToken({ user_id: inputData.user_id, deal_id: input_del });
      }
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('addGenerateTokens'), inputData),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiCompetitionController();

