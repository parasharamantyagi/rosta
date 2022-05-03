const halper = require('../../halpers/halper');
const Deals = require('./../../Model/dealsTable');
const CompetitionInfo = require('./../../Model/competitionInfoTable');
const multer = require('multer');
const { check_obj, current_date } = require('../../halpers/halper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/deals/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage }).single('deals');


class adminCompetitionController {
  async viewCompetition(req, res, next) {
    try {
      CompetitionInfo.getCompetitionInfo(1000, (err, resdata) => {
        return res.render('admin/competition/viewCompetition', {
          rosta: halper,
          page_url: req.url,
          competitions: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async deleteCompetitionId(req, res, next) {
    try {
      let storeid = req.params.competition_id;
      CompetitionInfo.removeCompetitionInfo(storeid, async (err, resdata) => {
        return res
          .status(200)
          .json(
            halper.web_response(
              true,
              false,
              halper.request_message('deleteCompetitionId'),
              'view-competition',
            ),
          );
        });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async addCompetition(req, res, next) {
    try {
      return res.render('admin/competition/addCompetition', {
        formAction: 'add-competition',
        dealData: {},
        rosta: halper,
        current_date: current_date(),
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addCompetitionPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = halper.obj_multi_select(req.body, [
          'name',
          'point',
          'from_date',
          'to_date',
          'description',
        ]);
        CompetitionInfo.addCompetitionInfo(inputData);
        return res
          .status(200)
          .json(
            halper.web_response(
              true,
              false,
              halper.request_message('addDealPost'),
              'view-competition',
            ),
          );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new adminCompetitionController();

