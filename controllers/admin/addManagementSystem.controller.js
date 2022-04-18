const halper = require('../../halpers/halper');
const Deals = require('./../../Model/dealsTable');
const User = require('./../../Model/userTable');
const multer = require('multer');
const { check_obj } = require('../../halpers/halper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/deals/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage }).single('deals');
// const multiUpload = multer({ storage: storage }).any('image_link');


class addManagementSystemController {
  async viewDeals(req, res, next) {
    try {
      Deals.getDeals(100, (err, resdata) => {
        // return res.json(resdata);
        return res.render('admin/deals/viewDeals', {
          rosta: halper,
          page_url: req.url,
          deals: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async addDeals(req, res, next) {
    try {
      return res.render('admin/deals/addDeals', {
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addDealPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
            inputData.image = 'public/deals/' + req.file.filename;
          }
        Deals.addDeals(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addDealPost'),
                  'view-deals',
                ),
              );
          }
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new addManagementSystemController();

